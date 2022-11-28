# Trust Library

Trust library to use smart contract function via Starton

# Description

This SDK is a simple solution that allows you to use the trust protocole with your web2 server.
You just need to follow step by step this README =)

# Installation

Create a ```.npmrc``` file with the following text
```
@theoutsiderslab:registry=https://npm.pkg.github.com
```

You can now install like any other dependencies using npm

```
npm install @theoutsiderslab/trust-nodejs-sdk --save
# or with yarn
yarn add @theoutsiderslab/trust-nodejs-sdk
```

This library support both UMD and ESModule

# How to set up the project

```ts
import Trust from '@theoutsiderslab/trust-nodejs-sdk'

const $trust = new Trust(/* my Starton API_KEY*/)

await $trust.init()
await $trust.createOwner('Landlord')
await $trust.createLease (
  tenantId, // 42
  rentAmount, // 600
  totalNumberOfRents, // 36
  paymentToken, // ETH
  rentPaymentInterval, //  263000 (1month)
  rentPaymentLimitTime, //  263000 (1month)
  currencyPair, // CRYPTO
  startDate // new Date()
)

```

## Create owner
```ts
createOwner (name: string)
```
Function called by the user to create a owner_id
With the parameter :
* **name** Name of the Owner as a string

## Create lease
```ts
createLease (
    tenantId: number,
    rentAmount: number,
    totalNumberOfRents: number,
    paymentToken: string,
    rentPaymentInterval: number,
    rentPaymentLimitTime: number,
    currencyPair: 'CRYPTO' | string, // USD-SHIB
    startDate: Date
  )
 ```
Function called by the owner to create a new lease
With parameters :
* **tenantId** The id of the tenant as a number
* **rentAmount** The amount of the rent in fiat as a number
* **totalNumberOfRents** The amount of rent payments for the lease as a number
* **paymentToken** The address of the token used for payment as a string
* **rentPaymentInterval** The minimum interval between each rent payment in second as a number
* **rentPaymentLimitTime** The minimum interval to mark a rent payment as not paid in second as a number
* **currencyPair** The currency pair used for rent price & payment | "CRYPTO" if rent in token or ETH as a string
* **startDate** The start date of the lease as a date

## Cancel lease
```ts
cancelLease (leaseId: number)
```
Function called by the owner to propose to the tenant to cancel the remaining payments of a lease and make it as ended
With the parameter
   * **leaseId** The id of the lease as a number

## Mark Rent As Not Paid
```ts
markRentAsNotPaid (leaseId: number, rentId: number)
```
Function called by the owner to mark a rent as not paid after the rent payment limit time is reached
With parameters
* **leaseId** The id of the lease as a number
* **rentId** The id of the rent as a number

## Mark Rent As Pending
```ts
 markRentAsPending (leaseId: number, rentId: number)
 ```
Function called by the owner to set a NOT_PAID rent back to PENDING, to give the tenant a possibility to dealay his rent payment
With parameters
* **leaseId** The id of the lease as a number
* **rentId** The id of the rent as a number

## get Rent Payments
```ts
getRentPayments (leaseId: number)
```
Function called to get all the payment of a lease
With the parameter
* **leaseId** The id of the lease as a number

## get Score
```ts
getScore (address?: string)
```
Function to get your owner score. You can specify a specific address or let default
With the parameter
* **address** the adress of the contract as a string

## get Tenant Score
```ts
 getTenantScore (address: string)
 ```
 Function to get your tenant score
 With the parameter
 * **address**  as a string
