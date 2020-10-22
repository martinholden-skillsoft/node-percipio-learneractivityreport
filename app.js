const axios = require('axios');
const fs = require('fs');
const Path = require('path');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const promiseRetry = require('promise-retry');
const stringifySafe = require('json-stringify-safe');

const { transports } = require('winston');
const logger = require('./lib/logger');
const configuration = require('./config');

const pjson = require('./package.json');

const NODE_ENV = process.env.NODE_ENV || 'production';

/**
 * Call Percipio API
 *
 * @param {*} options
 * @returns
 */
const callPercipio = async (options) => {
  return promiseRetry(async (retry, numberOfRetries) => {
    const loggingOptions = {
      label: 'callPercipio',
    };

    const requestUri = options.request.uri;
    logger.debug(`Request URI: ${requestUri}`, loggingOptions);

    let requestParams = options.request.query || {};
    requestParams = _.omitBy(requestParams, _.isNil);
    logger.debug(`Request Querystring Parameters: ${stringifySafe(requestParams)}`, loggingOptions);

    let requestBody = options.request.body || {};
    requestBody = _.omitBy(requestBody, _.isNil);
    logger.debug(`Request Body: ${stringifySafe(requestBody)}`, loggingOptions);

    const axiosConfig = {
      url: requestUri,
      headers: {
        Authorization: `Bearer ${options.request.bearer}`,
      },
      method: options.request.method,
      timeout: options.request.timeout || 2000,
    };

    if (!_.isEmpty(requestBody)) {
      axiosConfig.data = requestBody;
    }

    if (!_.isEmpty(requestParams)) {
      axiosConfig.params = requestParams;
    }

    logger.debug(`Axios Config: ${stringifySafe(axiosConfig)}`, loggingOptions);

    try {
      const response = await axios.request(axiosConfig);
      logger.debug(`Response Headers: ${stringifySafe(response.headers)}`, loggingOptions);
      // logger.debug(`Response Body: ${stringifySafe(response.data)}`, loggingOptions);

      return response;
    } catch (err) {
      logger.warn(
        `Trying to get report. Got Error after Attempt# ${numberOfRetries} : ${err}`,
        loggingOptions
      );
      if (err.response) {
        logger.debug(`Response Headers: ${stringifySafe(err.response.headers)}`, loggingOptions);
        logger.debug(`Response Body: ${stringifySafe(err.response.data)}`, loggingOptions);
      } else {
        logger.debug('No Response Object available', loggingOptions);
      }
      if (numberOfRetries < options.retry_options.retries + 1) {
        retry(err);
      } else {
        logger.error('Failed to call Percipio', loggingOptions);
      }
      throw err;
    }
  }, options.retry_options);
};

/**
 * Submit the report request
 *
 * @param {*} options
 * @returns
 */
const submitReport = async (options) => {
  const loggingOptions = {
    label: 'submitReport',
  };
  const opts = options;
  opts.request = opts.reportrequest;
  logger.info('Submitting Report Request', loggingOptions);
  return callPercipio(opts);
};

/**
 * Poll for the specified reportRequestId, the polling uses the promiseRetry
 * confguration defined in options.polling_options to determine number of
 * attempts and delays
 *
 * @param {*} options
 * @param {*} reportRequestId
 * @returns
 */
const pollForReport = async (options, reportRequestId) => {
  return promiseRetry(async (retry, numberOfRetries) => {
    const loggingOptions = {
      label: 'pollForReport',
    };

    const opts = options;
    opts.request = opts.pollrequest;
    opts.request.path.reportRequestId = reportRequestId;
    opts.request.uri = `${opts.request.baseuri}/reporting/v1/organizations/${opts.request.path.orgId}/report-requests/${opts.request.path.reportRequestId}`;

    logger.info('Submitting Report Poll Requests', loggingOptions);
    try {
      const response = await callPercipio(opts);
      if (_.isUndefined(response.data.status)) {
        return response;
      }
      const error = new Error(`Report ${response.data.reportId} status is ${response.data.status}`);
      error.response = response;
      throw error;
    } catch (err) {
      logger.warn(
        `Trying to get report. Got Error after Attempt# ${numberOfRetries} of ${options.polling_options.retries} : ${err}`,
        loggingOptions
      );
      if (err.response) {
        logger.debug(`Response Headers: ${stringifySafe(err.response.headers)}`, loggingOptions);
        logger.debug(`Response Body: ${stringifySafe(err.response.data)}`, loggingOptions);
      } else {
        logger.debug('No Response Object available', loggingOptions);
      }
      if (numberOfRetries < options.polling_options.retries + 1) {
        retry(err);
      } else {
        logger.error('Failed to retrieve report', loggingOptions);
      }
      throw err;
    }
  }, options.polling_options);
};

/**
 * Call the API to generate the report, and the poll for it
 * pass thru a stream and return the path to the file
 *
 * @param {*} options
 * @returns {string} file path
 */
const getAllReportDataAndSave = async (options) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const loggingOptions = {
      label: 'getAllReportDataAndSave',
    };

    const opts = options;

    const filename = opts.output.filename || 'result';

    const outputFile = Path.join(opts.output.path, filename);

    try {
      submitReport(options)
        .then((submitResponse) => {
          logger.info(`Report Id: ${submitResponse.data.id}`, loggingOptions);
          pollForReport(options, submitResponse.data.id)
            .then((reportResponse) => {
              logger.info(
                `Records Downloaded ${reportResponse.data.length.toLocaleString()}`,
                loggingOptions
              );
              if (reportResponse.data.length > 0) {
                const outputStream = fs.createWriteStream(outputFile);

                outputStream.on('finish', () => {
                  logger.info(`Records Saved. Path: ${outputFile}`, loggingOptions);
                  resolve(outputFile);
                });

                outputStream.write(stringifySafe(reportResponse.data, null, 2));
                outputStream.end();
              } else {
                logger.info('No results file created', loggingOptions);
                resolve(null);
              }
            })
            .catch((err) => {
              logger.error(`Error:  ${err}`, loggingOptions);
            });
        })
        .catch((err) => {
          logger.error(`Error:  ${err}`, loggingOptions);
        });
    } catch (err) {
      logger.error('ERROR: trying to generate report results', loggingOptions);
      reject(err);
    }
  });
};

/**
 * Process the Percipio call
 *
 * @param {*} options
 * @returns
 */
const main = async (configOptions) => {
  const loggingOptions = {
    label: 'main',
  };

  const options = configOptions || null;

  if (_.isNull(options)) {
    logger.error('Invalid configuration', loggingOptions);
    return false;
  }

  // Set logging to silly level for dev
  if (NODE_ENV.toUpperCase() === 'DEVELOPMENT') {
    logger.level = 'debug';
  } else {
    logger.level = options.debug.loggingLevel;
  }

  // Create logging folder if one does not exist
  if (!_.isNull(options.debug.path)) {
    if (!fs.existsSync(options.debug.path)) {
      mkdirp(options.debug.path);
    }
  }

  // Create outpur folder if one does not exist
  if (!_.isNull(options.output.path)) {
    if (!fs.existsSync(options.output.path)) {
      mkdirp(options.output.path);
    }
  }

  // Add logging to a file
  logger.add(
    new transports.File({
      filename: Path.join(options.debug.path, options.debug.filename),
      options: {
        flags: 'w',
      },
    })
  );

  options.logger = logger;

  logger.info(`Start ${pjson.name} - v${pjson.version}`, loggingOptions);

  logger.debug(`Options: ${stringifySafe(options)}`, loggingOptions);

  if (_.isNull(options.reportrequest.path.orgId) || _.isNull(options.pollrequest.path.orgId)) {
    logger.error(
      'Invalid configuration - no orgid in config file or set env ORGID',
      loggingOptions
    );
    return false;
  }

  if (_.isNull(options.reportrequest.bearer) || _.isNull(options.pollrequest.bearer)) {
    logger.error('Invalid configuration - no bearer or set env BEARER', loggingOptions);
    return false;
  }

  logger.info('Calling Percipio', loggingOptions);
  await getAllReportDataAndSave(options).catch((err) => {
    logger.error(`Error:  ${err}`, loggingOptions);
  });
  logger.info(`End ${pjson.name} - v${pjson.version}`, loggingOptions);
  return true;
};

main(configuration);
