import Starton from "starton-nodejs-sdk";
import OwnerID from "./contracts/OwnerID";
import Lease from "./contracts/Lease";
import { ofetch } from "ofetch";

export default class Trust {
  public readonly $starton: Starton
  private readonly theGraphInstance = ofetch.create({
    baseURL: ''
  })

  constructor(API_KEY: string) {
    this.$starton = new Starton(API_KEY)
  }

  /** Must be called to initialize starton project */
  async init () {
    return Promise.all([
      this.$starton.smartContract.importSmartContract(OwnerID.network, OwnerID.address, {
        name: 'Trust OwnerID',
        description: 'Owner identity contract',
        abi: OwnerID.abi
      }),
      this.$starton.smartContract.importSmartContract(Lease.network, Lease.address, {
        name: 'Trust Lease',
        description: 'Lease contract set by owners',
        abi: Lease.abi
      }),
    ])
  }

  /**
   * @param name Name of the Owner
   */
  createOwner (name: string) {
    const { network, address } = OwnerID
    return this.$starton.smartContract.callSmartContractFunction(
      network,
      address,
      {
        functionName: 'mint',
        params: [name]
      }
    )
  }

  /**
   * @notice Function called by the owner to create a new lease
   * @param tenantId The id of the tenant
   * @param rentAmount The amount of the rent in fiat
   * @param totalNumberOfRents The amount of rent payments for the lease
   * @param paymentToken The address of the token used for payment
   * @param rentPaymentInterval The minimum interval between each rent payment in second
   * @param rentPaymentLimitTime The minimum interval to mark a rent payment as not paid in second
   * @param currencyPair The currency pair used for rent price & payment | "CRYPTO" if rent in token or ETH
   * @param startDate The start date of the lease
   */
  createLease (
    tenantId: number,
    rentAmount: number,
    totalNumberOfRents: number,
    paymentToken: string,
    rentPaymentInterval: number,
    rentPaymentLimitTime: number,
    currencyPair: 'CRYPTO' | string, // USD-SHIB
    startDate: Date
  ) {
    const { network, address } = Lease
    return this.$starton.smartContract.callSmartContractFunction(
      network,
      address,
      {
        functionName: 'createLease',
        params: [
          tenantId,
          rentAmount,
          totalNumberOfRents,
          paymentToken,
          rentPaymentInterval,
          rentPaymentLimitTime,
          currencyPair,
          Math.floor(startDate.getTime() / 1000)
        ]
      }
    )
  }

  /**
   * Can be called by the owner or the tenant to cancel the remaining payments of a lease and make it as ended
   * @dev Both tenant and owner must call this function for the lease to be cancelled
   * @param leaseId The id of the lease
   */
  cancelLease (leaseId: number) {
    const { network, address } = Lease
    return this.$starton.smartContract.callSmartContractFunction(
      network,
      address,
      {
        functionName: 'cancelLease',
        params: [leaseId]
      }
    )
  }

  /**
   * Can be called by the owner to mark a rent as not paid after the rent payment limit time is reached
   * @param leaseId The id of the lease
   * @param rentId The id of the rent
   * @dev Only the owner of the lease can call this function
   */
  markRentAsNotPaid (leaseId: number, rentId: number) {
    const { network, address } = Lease
    return this.$starton.smartContract.callSmartContractFunction(
      network,
      address,
      {
        functionName: 'markRentAsNotPaid',
        params: [leaseId, rentId]
      }
    )
  }

  /**
   * Can be called by the owner to set a NOT_PAID rent back to PENDING, to give the tenant a possibility to pay his rent
   * @param leaseId The id of the lease
   * @param rentId The id of the rent
   * @dev Only the owner of the lease can call this function for a RentPayment set to NOT_PAID
   */
  markRentAsPending (leaseId: number, rentId: number) {
    const { network, address } = Lease
    return this.$starton.smartContract.callSmartContractFunction(
      network,
      address,
      {
        functionName: 'markRentAsPending',
        params: [leaseId, rentId]
      }
    )
  }

  /**
   * Getter for all payments of a lease
   * @param leaseId The id of the lease
   * @return rentPayments The array of all rent payments of the lease
   */
  async getRentPayments (leaseId: number) {
    const body = `{
      lease(id: ${leaseId}) {
        rentPayments(where: {status: PAID}) {
          id
          paymentToken
          rentPaymentDate
          exchangeRate
          exchangeRateTimestamp
          withoutIssues
          status
      }}}`
    const { lease } = await this.theGraphInstance<{ lease?: { id: string, status: number } }>(
      '/', { method: 'POST', body })
    if (!lease) { throw new Error('LEASE_NOT_FOUND')}
  }

  /** Get your owner score. You can specify a specific address or let default */
  async getScore (address?: string) {
    const wallet = address || await this.$starton.kms.getWallets().then(r => r.items[0]?.address)
    if (!wallet) { throw new Error('WALLET_NOT_FOUND') }

    const body = `{
      owners(where: {address: "${wallet}"}) {
        leases(where: {status_not: PENDING}) {
          rentPayments(where: {status: PAID}) {
            withoutIssues
      }}}}`
    const { owners } = await this.theGraphInstance<{ owners: Array<{ leases: Array<{ rentPayments: Array<{ withoutIssues: boolean }> }> }> }>(
      '/', { method: 'POST', body })
    if (owners.length === 0) { throw new Error('OWNER_NOT_FOUND')}

    const payments = owners[0]!.leases.flatMap(lease => lease.rentPayments)
    const withoutIssues = payments.filter(payment => payment.withoutIssues)
    return withoutIssues.length / payments.length
  }

  async getTenantScore (address: string) {
    const body = `{
      tenants(where: {address: "${address}"}) {
        leases(where: {status_not: PENDING}) {
          rentPayments(where: {status_in: [PAID, NOT_PAID]}) {
            status
      }}}}`
    const { tenants } = await this.theGraphInstance<{ tenants: Array<{ leases: Array<{ rentPayments: Array<{ status: 'PAID' | 'NOT_PAID' }> }> }> }>(
      '/', { method: 'POST', body })
    if (tenants.length === 0) { throw new Error('TENANT_NOT_FOUND')}

    const payments = tenants[0]!.leases.flatMap(lease => lease.rentPayments)
    const paid = payments.filter(payment => payment.status === 'PAID')
    return paid.length / payments.length
  }
}
