 trust-nodejs-sdk
Trust library to use smart contract function via Starton  

# Description  
This SDK is a simple solution that allows you to use the trust protocole with your web2 website. You just need to follow step by step this README =)  

# How to setup the project  
Pull both **trust-nodejs-sdk** and **trust-nodejs-sdk** in the same folder  

go to the folder trust-nodejs-sdk/lib  
modify with your API key the string  
```js
constructor(API_KEY: string)
```
it will allow you to create starton Object  

## Create owner  
```js
createOwner (name: string)
```
Function called by the user to create a owner_id  
With the parameter :  
* **name** Name of the Owner as a string  

## Create lease  
```js
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
```js
cancelLease (leaseId: number)
```
Function called by the owner to propose to the tenant to cancel the remaining payments of a lease and make it as ended  
With the parameter  
   * **leaseId** The id of the lease as a number  

## Mark Rent As Not Paid  
```js
markRentAsNotPaid (leaseId: number, rentId: number)
```
Function called by the owner to mark a rent as not paid after the rent payment limit time is reached  
With parameters  
* **leaseId** The id of the lease as a number  
* **rentId** The id of the rent as a number  

## Mark Rent As Pending  
```js
 markRentAsPending (leaseId: number, rentId: number)
 ```
Function called by the owner to set a NOT_PAID rent back to PENDING, to give the tenant a possibility to dealay his rent payment
With parameters  
* **leaseId** The id of the lease as a number  
* **rentId** The id of the rent as a number  

## get Rent Payments  
```js
getRentPayments (leaseId: number)
```
Function called to get all the payment of a lease  
With the parameter  
* **leaseId** The id of the lease as a number  

## get Score  
```js
getScore (address?: string)
```
Function to get your owner score. You can specify a specific address or let default  
With the parameter  
* **address** the adress of the contract as a string   

## get Tenant Score
```js
 getTenantScore (address: string)
 ```
 Function to get your tenant score  
 With the parameter   
 * **address**  as a string  
