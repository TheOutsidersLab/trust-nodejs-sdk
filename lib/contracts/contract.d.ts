import { Network } from "starton-nodejs-sdk/dist/types/Parameters";

interface Contract {
  network: Network
  address: string
  abi: Array<any>
}
