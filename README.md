 trust-nodejs-sdk
Trust library to use smart contract function via Starton  

# Description  
This SDK is a simple solution that allows you to use the trust protocole with your web2 website. You just need to follow step by step this README =)  

# How to setup the project  
Pull both **trust-nodejs-sdk** and **trust-nodejs-sdk** in the same folder  

go to the folder trust-nodejs-sdk/lib  
modify with your API key the sring in ```javascript constructor(API_KEY: **string**) ```
it will allow you to create starton Object  

## Create owner  
Function called by the user to create a owner_id  
With the parameter :  
* **name** Name of the Owner  

## Create lease  
Function called by the owner to create a new lease  
With parameters :  
* notice Function called by the owner to create a new lease  
* **tenantId** The id of the tenant  
* **rentAmount** The amount of the rent in fiat  
* **totalNumberOfRents** The amount of rent payments for the lease  
* **paymentToken** The address of the token used for payment  
* **rentPaymentInterval** The minimum interval between each rent payment in second  
* **rentPaymentLimitTime** The minimum interval to mark a rent payment as not paid in second  
* **currencyPair** The currency pair used for rent price & payment | "CRYPTO" if rent in token or ETH  
* **startDate** The start date of the lease  

## Cancel lease  
Function called by the owner to propose to the tenant to cancel the remaining payments of a lease and make it as ended  
With the parameter  
   * **leaseId** The id of the lease  

## Mark Rent As Not Paid
Function called by the owner to mark a rent as not paid after the rent payment limit time is reached  
With parameters  
* **leaseId** The id of the lease  
* **rentId** The id of the rent  

## Mark Rent As Pending  
Function called by the owner to set a NOT_PAID rent back to PENDING, to give the tenant a possibility to dealay his rent payment
With parameters  
* **leaseId** The id of the lease  
* **rentId** The id of the rent  

## get Rent Payments
Function called to get all the payment of a lease  
With the parameter  
* **leaseId** The id of the lease  

## get Score
