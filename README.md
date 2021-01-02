# mscz-api
This is a HTTP API to manage MSCZ files. The API is not public yet. Source code is
under the GPLv3.
## Usage
### Rate limits
The rate limit is `100` API calls for ten minutes. An API call is one HTTP request.
### Metadata
The `/meta` path takes a MSCZ file through a post request (`application/x-musescore`).
and sends back a JSON file with metadata.
### Conversion Formats
For conversion, you `POST /<format>/<instrument>`. The available formats are `midi`,
`mxml`, and `mmxl`. It will return the appropriate mime-type for `<format>`.
`<instument>` is the ID of the excerpt from the metadata, so a `/meta` request should
be made before conversion. Simply `POST /<format>` for the full score.
### Error codes
Reason | Code 
----- | -----
400 | Invalid format, invalid instrument, or malformed `mscz` file. 
## Examples
Examples are available in `docs/examples`, with an mscz file, its metadata, and the
various conversions for that file. All files there were converted with the API. Providing
mscz files to convert would help. `GeneralUser Orchestral Example` provided by Generaluser GS.
