const moment = require('moment');

const config = {};

// Indicates a name for the configuration
config.customer = 'none';
config.startTimestamp = moment().utc().format('YYYYMMDD_HHmmss');

// DEBUG Options - Enables the check for Fiddler, if running the traffic is routed thru Fiddler
config.debug = {};
// Debug logging
// One of the supported default logging levels for winston - see https://github.com/winstonjs/winston#logging-levels
config.debug.loggingLevel = 'info';
config.debug.path = 'logs';
config.debug.filename = `app_${config.startTimestamp}.log`;

config.output = {};
// Output path
config.output.path = 'results/output';
// Filename
config.output.filename = `${config.startTimestamp}_results.json`;

// Report Generation Request
config.reportrequest = {};
// Request Timeout
config.reportrequest.timeout = 2000;
// Bearer Token
config.reportrequest.bearer = null;
// Base URI to Percipio API
config.reportrequest.baseuri = process.env.EUDC
  ? 'https://dew1-api.percipio.com'
  : 'https://api.percipio.com';
// Request Path Parameters
config.reportrequest.path = {};
/**
 * Name: orgId
 * Description: Organization UUID
 * Required: true
 * Type: string
 * Format: uuid
 */
config.reportrequest.path.orgId = null;
// Request Query string Parameters
config.reportrequest.query = {};
// Request Body
config.reportrequest.body = null;
// Method
config.reportrequest.method = 'post';
// The Service Path
config.reportrequest.uri = `${config.reportrequest.baseuri}/reporting/v1/organizations/${config.reportrequest.path.orgId}/report-requests/learning-activity`;

// Request
config.pollrequest = {};
// Request Timeout
config.pollrequest.timeout = 2000;
// Bearer Token
config.pollrequest.bearer = null;
// Base URI to Percipio API
config.pollrequest.baseuri = process.env.EUDC
  ? 'https://dew1-api.percipio.com'
  : 'https://api.percipio.com';
// Request Path Parameters
config.pollrequest.path = {};
/**
 * Name: orgId
 * Description: Organization UUID
 * Required: true
 * Type: string
 * Format: uuid
 */
config.pollrequest.path.orgId = null;
// Request Query string Parameters
config.pollrequest.query = {};
// Request Body
config.pollrequest.body = null;
// Method
config.pollrequest.method = 'get';
// The Service Path
config.pollrequest.uri = `${config.pollrequest.baseuri}/reporting/v1/organizations/${config.pollrequest.path.orgId}/report-requests/${config.pollrequest.path.reportRequestId}`;

// Global Web Retry Options for promise retry
// see https://github.com/IndigoUnited/node-promise-retry#readme
config.retry_options = {};
config.retry_options.retries = 3;
config.retry_options.minTimeout = 1000;
config.retry_options.maxTimeout = 2000;

/*
Polling options for retrying report availability
see https://github.com/IndigoUnited/node-promise-retry#readme
options is a JS object that can contain any of the following keys:
retries: The maximum amount of times to retry the operation.Default is 10.
Seting this to 1 means do it once, then retry it once.
factor: The exponential factor to use.Default is 2.
minTimeout: The number of milliseconds before starting the first retry.Default is 1000.
maxTimeout: The maximum number of milliseconds between two retries.Default is Infinity.
randomize: Randomizes the timeouts by multiplying with a factor between 1 to 2. Default is false.
*/

config.polling_options = {};
config.polling_options.retries = 20;
config.polling_options.minTimeout = 60 * 1000;
config.polling_options.maxTimeout = Infinity;
// Using Factor=1 means polling at fixed interval of minTimeout
config.polling_options.factor = 1;

module.exports = config;
