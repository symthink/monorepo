# Tests with CURL

##

```sh
curl -X POST http://localhost:5001/symthink-io/us-central1/api/extractMetadata \
   -H 'Content-Type: application/json' \
   -d '{"url":"https://www.washingtonpost.com/politics/2022/08/15/election-deniers-march-toward-power-key-2024-battlegrounds/"}'

curl http://localhost:5001/symthink-io/us-central1/ping
```


## Get env var

```js
export const envVars = functions.https.onRequest(async (request, response) => {
    functions.logger.info("request body", process.env.GOOGLE_APPLICATION_CREDENTIALS);
    response.send(process.env.GOOGLE_APPLICATION_CREDENTIALS)
});
```



## Default credentials

```json
{
  "client_id": "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
  "client_secret": "j9iVZfS8kkCEFUPaAeJV0sAi",
  "refresh_token": "1//0dVb7N3DuRvHmCgYIARAAGA0SNwF-L9Ir3W8wyOhI4WY2j25YbHHoREscv0OWH6zot_b8r08l7PVEdSPVYGs5iI4Z2pq5GleGuPo",
  "type": "authorized_user"
}

```

## original firebase.json

```json
{
  "functions": {
    "ignore": [
      "node_modules",
      ".git",
      "firebase-debug.log",
      "firebase-debug.*.log"
    ],
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint",
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ]
  }
}
```