# node-percipio-learneractivityreport

Retrieve [Learner Activity Report](https://documentation.skillsoft.com/en_us/percipio/Content/A_Administrator/admn_rpt_learner_activity.htm) data from Percipio and save locally.

## Requirements

1. A Skillsoft [Percipio](https://www.skillsoft.com/platform-solution/percipio/) Site
1. A [Percipio Service Account](https://documentation.skillsoft.com/en_us/pes/3_services/service_accounts/pes_service_accounts.htm) with permission for accessing [REPORTING API](https://documentation.skillsoft.com/en_us/pes/2_understanding_percipio/rest_api/pes_rest_api.htm)

## Environment Configuration

Once you have copied this repository set the following NODE ENV variables, or config the [.env](.env) file

| ENV       | Required | Description                                                                                                                                                                                                                                                                                      |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ORGID     | Required | This is the Percipio Organiation UUID for your Percipio Site                                                                                                                                                                                                                                     |
| BEARER    | Required | This is the Percipio Bearer token for a Service Account with permissions for services.                                                                                                                                                                                         |
| BASEURL | Required | This is set to the base URL for the Percipio data center. For US hosted use: https://api.percipio.com For EU hosted use: https://dew1-api.percipio.com |
| TIMEFRAME | Optional | This is a filter criteria that specifies the timeframe for the results.<br/><br/>The report start/end dates are calculated dynamically based on when the report is submitted date.<br/><br/>Options are: DAY, WEEK, THIRTY_DAYS, CALENDAR_MONTH<br/><br/>If left empty/null THIRTY_DAYS is used. |
| START     | Optional | This is a filter criteria that specifies the START date for the report in ISO8601 format.<br/><br/>The END option must be specified if using this.<br/><br/>The TIMEFRAME option must be null if using this.                                                                                     |
| END     | Optional | This is a filter criteria that specifies the END date for the report in ISO8601 format.<br/><br/>The START option must be specified if using this.<br/><br/>The TIMEFRAME option must be null if using this                                                                                       |

## Configuring the API call
Make the config changes in [config/default.js](config/default.js) file, to specify the request criteria for the report.

## How to use it

Run the app

```bash
npm start
```

The Percipio [https://api.percipio.com/reporting/api-docs/#/%2Fv1/requestLearningActivityReport](https://api.percipio.com/reporting/api-docs/#/%2Fv1/requestLearningActivityReport) API wil be called to generate the report.

The Percipio[https://api.percipio.com/reporting/api-docs/#/%2Fv1/getReportRequest](https://api.percipio.com/reporting/api-docs/#/%2Fv1/getReportRequest) API will then be called to download the generated data.

The default configuration returns JSON and it will be stored in:

```
results/YYYYMMDD_hhmmss_results.json
```

The timestamp component is based on UTC time when the script runs:

| DATEPART | COMMENTS                            |
| -------- | ----------------------------------- |
| YYYY     | Year (i.e. 1970 1971 ... 2029 2030) |
| MM       | Month Number (i.e. 01 02 ... 11 12) |
| DD       | Day (i.e. 01 02 ... 30 31)          |
| HH       | Hour (i.e. 00 01 ... 22 23)         |
| mm       | Minutes (i.e. 00 01 ... 58 59)      |
| ss       | Seconds (i.e. 00 01 ... 58 59)      |

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## License

MIT © martinholden-skillsoft
