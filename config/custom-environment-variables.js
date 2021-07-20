// Custom Environment Variables, for more information see:
// https://github.com/lorenwest/node-config/wiki/Environment-Variables#custom-environment-variables
const config = {};

// The local JSON file
config.source = 'SOURCE';

// The transform filename path.
config.transform = 'TRANSFORM';

config.reportrequest = {};
config.reportrequest.bearer = 'BEARER';
// Base URI to Percipio API
config.reportrequest.baseURL = 'BASEURL';
// Request Path Parameters
config.reportrequest.path = {};
/**
 * Name: orgId
 * Description: Organization UUID
 * Required: true
 * Type: string
 * Format: uuid
 */
config.reportrequest.path.orgId = 'ORGID';

// Request Body
config.reportrequest.body = {};

/**
 * Name: start
 * Description : Start date for events retrieval
 * Type: string
 * Format: date-time
 * Example: 2018-01-01T10:10:24Z
 */
config.reportrequest.body.start = 'START';
/**
 * Name: end
 * Description : End date for events retrieval
 * Type: string
 * Format: date-time
 * Example: 2018-01-10T10:20:24Z
 */
config.reportrequest.body.end = 'END';
/**
 * Name: timeFrame
 * Description : To calculate the start/end date dynamically based on timeframe and when the
 * report is submitted date. [User can submit an absolute date range (start/end date) or a
 * relative date range (timeframe) but never both]
 * Type: string
 * Enum: DAY, WEEK, THIRTY_DAYS, CALENDAR_MONTH
 */
config.reportrequest.body.timeFrame = 'TIMEFRAME';

/**
 * Name: formatType
 * Description : Format Type, defaults to JSON, the value is extracted from Accept attribute
 * in header
 * Type: string
 * Enum: JSON, CSV, TXT
 */
config.reportrequest.body.formatType = 'FORMAT';

// Request
config.pollrequest = {};
// Bearer Token
config.pollrequest.bearer = 'BEARER';
// Base URI to Percipio API
config.pollrequest.baseURL = 'BASEURL';
// Request Path Parameters
config.pollrequest.path = {};
/**
 * Name: orgId
 * Description: Organization UUID
 * Required: true
 * Type: string
 * Format: uuid
 */
config.pollrequest.path.orgId = 'ORGID';

module.exports = config;
