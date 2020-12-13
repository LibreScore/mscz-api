# mscz-api
This is a HTTP API to manage MSCZ files. The API is not public yet. Source code is
under the GPLv3.
## Usage
### Rate limits
The rate limit is `100` API calls for ten minutes. An API call is one HTTP request.
### Metadata
The `/meta` path takes a MSCZ file through a post request (`application/x-musescore`).
and sends back a JSON file with metadata. Here would be an example of the metadata:
```
{
    "title": "River Flows in You",
    "author": "emmy langevin",
    "instruments": [
        "piano"
    ]
}
```
### Conversion Formats
For conversion, you `POST /<format>/<instrument,full>`. The available formats are `midi`,
`pdf`,`musicxml`, and `mp3`. It will return the appropriate mime-type for `<format>`.
### Error codes
Reason | Code 
----- | -----
400 | Invalid format, invalid instrument, or malformed `mscz` file. 
## Usage
**_(TBD)_**
