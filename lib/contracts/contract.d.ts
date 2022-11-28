import { Network } from '@theoutsiderslab/starton-nodejs-sdk'

interface Contract {
  network: Network
  address: string
  abi: Array<any>
}
