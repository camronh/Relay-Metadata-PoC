# Whitelister

> Order fulfillment script for our Webstore

This script polls our Webstore for new requests and processes them. When it finds a valid order, it sends the order details to our [API](/api) to be stored in our Database as a new user. It then marks the order as complete if the user was created successfully.

This module is not deployed to our cloud and isn't running unless you run it. To run:

```sh
npm install && node app.js
```