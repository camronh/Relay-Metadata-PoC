# Webstore API

> The API used for creating users in the DB, and to generate random numbers

The [Whitelister](/whitelister) sends orders from the Webstore to this API to create new users. 

Our [Airnode](/airnode) uses the `GET /randomNumber` endpoint to get a random number on-chain. The API queries the `sponsorAddress` [relayed by Airnode](https://docs.api3.org/airnode/v0.5/concepts/relay-meta-auth.html) for authentication. It will by default reject API requests that haven't been provided via the Webstore.

For the purposes of this PoC, we have already deployed this API to our AWS account. 

**URL:** https://8p6v9cl5yc.execute-api.us-east-1.amazonaws.com/latest

To run your own locally, uncomment [lines 53 & 54](https://github.com/camronh/relay-poc/blob/7229f9d35253f4e7a8a64ff7a561e2b74cb16020/api/app.js#L53-L54) in `app.js` and run:

```sh
npm install && nodemon app
```