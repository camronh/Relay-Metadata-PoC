# Airnode Authorizers PoC

> A Proof-of-Concept that demonstrates how an API Provider can manage access to their Airnode in their backend using the [metadata relayed](https://docs.api3.org/airnode/v0.5/concepts/relay-meta-auth.html) in each Airnode request.

## Under the Hood

Secrets used on a public blockchain become public. It is important that we avoid sending API secrets over the blockchain while still allowing API providers granular control over user access. This can be achieved through whitelisting an address, similar to IP Address whitelisting, but for wallet/contract addresses.

API providers have the options of off-chain or on-chain whitelisting. Off-chain whitelisting is achieved through Airnode's [Relayed Metadata](https://docs.api3.org/airnode/v0.5/concepts/relay-meta-auth.html). Each request made to your Airnode will also include some metadata that describes the context of the request being made. This includes the contract, wallet, and chain information that can be checked against your back end for validity. This makes it easy to only respond to requests that are made from addresses provided by paying customers during the subscription process. 

![Off-Chain Authorization Flow](https://user-images.githubusercontent.com/26840412/161104448-7edf4d82-384f-4281-b8da-9e5905e20b1b.png)

> More detailed [Diagram Here](https://docs.api3.org/airnode/v0.5/concepts/relay-meta-auth.html#simple-example)

In this PoC, we take the role of a random number generation API provider that requires (sandbox) credit card payment through our [Webstore](http://13.233.252.69/). Our API subscription order form includes an `Eth_Address` field. Our [Fulfillment Script](/whitelister) picks up new orders and creates a user in our Users database in a very typical fashion, but also includes the `Eth_Address` provided in the Webform.

## Repo Structure

- [Airnode](/Airnode) - Everything you need to run a First-Party Oracle.
- [Webstore](http://13.233.252.69/) - An example Wordpress Woocommerce PoS for API Subscriptions
- [Fulfillment Script](/whitelister) - Picks up new orders from Webstore and executes the Authorizer transaction
- [Testing Suite](https://master.d3unh1kz3ytpci.amplifyapp.com/) - A dApp for making Airnode requests

  ***

# Try it out!

These steps should be followed to demonstrate the flow of being denied access, then granting access and having your request responded to.

First clone this repo. Then, start from the root directory of the repo:

## 1. Start your [Order Fulfillment Script](/whitelister)

> Using our Gitpod will automate this step by spinning up a cloud environment for the whitelisting script. 

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/camronh/Subscription-PoC)

 ###  **\- OR -**

If you are doing this step locally, please use:
```sh
cd whitelister

npm i && node app.js
```

## 2. Prepare [Testing Suite](https://master.d3unh1kz3ytpci.amplifyapp.com/)
We will be using the [Testing Suite](https://master.d3unh1kz3ytpci.amplifyapp.com/) attempt to make a request for a random number. From the [/Airnode](/Airnode) folder, drag and drop the `config/config.json` and `output/receipt.json` files into the respective boxes. 

We will be using the **GET /randomNumber** endpoint.

![Prepare Testing Suite](https://user-images.githubusercontent.com/26840412/161105082-abbcc3dd-3b6a-47d1-869d-d9d4f82cad6d.png)


## 3. Set parameters

The `/randomNumber` endpoint of our API doesn't take any parameters, so the only parameters we need to fill in are the [Reserved Params](https://docs.api3.org/ois/v1.0.0/reserved-parameters.html) required by Airnode.

- For the "_type" field input `string`
- For the "_path" field input `randomNumber`

## 4. Make an Unauthorized Blockchain Request

Click the "Blockchain Request" button and Connect your Metamask wallet. **Be sure you are connected to the Ropsten Network!!** Press "Make Request" when you're ready.

![Unauthorized Request](https://user-images.githubusercontent.com/26840412/161106472-ab550682-f350-4c25-b647-ae78491af4ab.png)

After some time (could be minutes depending on the chain), the logs should pick up that the Airnode request failed. This is expected, as we haven't subscribed to the API yet and our request has been denied as unauthorized.

## 5. Subscribe to the API

Visit the sandbox [API Provider Webstore](http://13.233.252.69/product/api-subscription/) and add the API Subscription product to your cart and attempt to check out. 

You should notice a field for "Eth_add" at the bottom of the checkout form. Here we will add the Sponsor Address for our Testing Suite Contract. 

- For the "eth_add" field input `0xe2dB4f54F8FAB66e44386e49aFcB3EF4a87a8787`

After checkout you should notice a new user was successfully created in the Fulfillment Script terminal from step 1. 
![Screen Shot 2022-03-31 at 12 42 24 PM](https://user-images.githubusercontent.com/26840412/161106991-0393399c-8293-426b-b479-5be18138b78c.png)


## 6. Attempt an Authorized API request

Back in the [Testing Suite](https://master.d3unh1kz3ytpci.amplifyapp.com/) repeat steps 3 and 4 if necessary and press "Make Request".

This time our Airnode will recognize this request is coming from the address we provided in step 5 and will authorize it and provide us with our random number.

---
## Conclusion

Our goal was to show how easily adjustments could be made to start accepting addresses for whitelisting alongside the authorization methods you are currently using. By deploying your Airnode with a private API key, you can be sure about which requests are coming from your Airnode and that the metadata attached hasn't been tampered with. 

This gives API providers the ability to manage authentication of each request to return user-specific data if the use case requires it. An API developer could just as easily add more granularity by providing access based on chain, dApp contract address, or Sponsor Wallet. 

