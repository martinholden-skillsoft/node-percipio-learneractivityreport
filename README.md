# node-percipio-learneractivityreport

Retrieve [Learner Activity Report](https://documentation.skillsoft.com/en_us/percipio/Content/A_Administrator/admn_rpt_learner_activity.htm) data from Percipio and save locally.

When JSON format data is returned, it can be optionally transformed using JSONata and will be saved as Comma Delimited Text File (CSV).

To use this code you will need:

1. A Skillsoft [Percipio](https://www.skillsoft.com/platform-solution/percipio/) Site
1. A [Percipio Service Account](https://documentation.skillsoft.com/en_us/pes/3_services/service_accounts/pes_service_accounts.htm) with permission for accessing [REPORTING API](https://documentation.skillsoft.com/en_us/pes/2_understanding_percipio/rest_api/pes_rest_api.htm)

The code can also be used to process a JSON file (as retrieved from the API) without the need to download the data, this is useful if you want to use different TRANSFORMS on the same data.

# Configuration

## Creating a JSONata transform (Optional)

The code uses the [JSONata-Extended](https://www.npmjs.com/package/jsonata-extended) package to optionally transform the JSON returned by Percipio.

The transform needs to create a flattened object with no nested data, the key values are used as column names in the generated CSV. So for example:

```
{
  "Column 1": "foo",
  "Column 2": "bar",
  "Column 3": "Lorem ipsum dolor sit amet."
}
```

would generate CSV:

```
"Column 1","Column 2","Column 3"
"foo","bar","Lorem ipsum dolor sit amet."
```

The [transform/default.jsonata](transform/default.jsonata) shows some ideas for basic processing of the returned JSON from Percipio.

## Environment Configuration

Once you have copied this repository set the following NODE ENV variables, or config the [.env](.env) file

| ENV       | Required | Description                                                                                                                                                                                                                                                                                      |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ORGID     | Required | This is the Percipio Organiation UUID for your Percipio Site                                                                                                                                                                                                                                     |
| BEARER    | Required | This is the Percipio Bearer token for a Service Account with permissions for services.                                                                                                                                                                                                           |
| BASEURL   | Required | This is set to the base URL for the Percipio data center. For US hosted use: https://api.percipio.com For EU hosted use: https://dew1-api.percipio.com                                                                                                                                           |
| SOURCE    | Required for local file | This is the path to the previously downloaded JSON |
| TRANSFORM | Optional | This is the path to the JSONata transform to use on JSON response, and then to save as CSV. The default is not to transform the resaponse. An example is [transform/default.jsonata](transform/default.jsonata)                                                                                  |
| FORMAT    | Optional | This is the format for the report request. Valid options (case sensitive) are: JSON, CSV, TXT. The default if none specified or null is JSON                                                                                                                                                     |
| TIMEFRAME | Optional | This is a filter criteria that specifies the timeframe for the results.<br/><br/>The report start/end dates are calculated dynamically based on when the report is submitted date.<br/><br/>Options are: DAY, WEEK, THIRTY_DAYS, CALENDAR_MONTH<br/><br/>If left empty/null THIRTY_DAYS is used. |
| START     | Optional | This is a filter criteria that specifies the START date for the report in ISO8601 format.<br/><br/>The END option must be specified if using this.<br/><br/>The TIMEFRAME option must be null if using this.                                                                                     |
| END       | Optional | This is a filter criteria that specifies the END date for the report in ISO8601 format.<br/><br/>The START option must be specified if using this.<br/><br/>The TIMEFRAME option must be null if using this                                                                                      |

## Configuring the API call

Make any additional config changes in [config/default.js](config/default.js) file, to specify the request criteria for the report other then date range.

# Running the application

Run the app

```bash
npm start
```

## Downloading and transforming
The Percipio [https://api.percipio.com/reporting/api-docs/#/%2Fv1/requestLearningActivityReport](https://api.percipio.com/reporting/api-docs/#/%2Fv1/requestLearningActivityReport) API wil be called to generate the report.

The Percipio[https://api.percipio.com/reporting/api-docs/#/%2Fv1/getReportRequest](https://api.percipio.com/reporting/api-docs/#/%2Fv1/getReportRequest) API will then be called to download the generated data.

The returned report data will be stored in a file whose extension matches the FORMAT option - i.e. JSON|CSV|TXT:

```
results/YYYYMMDD_hhmmss_results.JSON
```

If the response is JSON and the TRANSFORM option has been specified the transformed results will be save in:

```
results/YYYYMMDD_hhmmss_results_transformed.csv
```

## Local file loading and transforming
The Percipio JSON data returned will be loaded from the specified local file and transformed using the transform specified, the [default.jsonata](transform/default.jsonata) shows some ideas for basic processing of the returned JSON from Percipio.

The transformed JSON will then be saved in CSV format, with UTF-8 encoding to:

```
results/YYYYMMDD_hhmmss_results_transformed.csv
```

## Timestamp Format
The timestamp component is based on the UTC time when the script runs:

| DATEPART | COMMENTS                            |
| -------- | ----------------------------------- |
| YYYY     | Year (i.e. 1970 1971 ... 2029 2030) |
| MM       | Month Number (i.e. 01 02 ... 11 12) |
| DD       | Day (i.e. 01 02 ... 30 31)          |
| HH       | Hour (i.e. 00 01 ... 22 23)         |
| mm       | Minutes (i.e. 00 01 ... 58 59)      |
| ss       | Seconds (i.e. 00 01 ... 58 59)      |

# Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

# License

MIT © martinholden-skillsoft
