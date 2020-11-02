const config = {};
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
