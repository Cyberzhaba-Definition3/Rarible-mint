import { Wallet } from "ethereumjs-wallet"
import { randomWord } from "@rarible/types"
import RpcSubprovider from "web3-provider-engine/subproviders/rpc.js"
import Web3ProviderEngine from "web3-provider-engine"
import Web3 from "web3"
import { Web3Ethereum } from "@rarible/web3-ethereum"
import { EthereumWallet } from "@rarible/sdk-wallet"
import { TestSubprovider } from "@rarible/test-provider"

export function createTestWallet(pk = randomWord().substring(2)) {
        return new Wallet(Buffer.from(pk, "hex"))
}

export function createTestProvider(pk) {
        const wallet = createTestWallet(pk)
        const provider = new Web3ProviderEngine({
                pollingInterval: 100,
        })

        provider.addProvider(new TestSubprovider(wallet, {
                networkId: 4,
                chainId: 4,
        }))
        provider.addProvider(
                new RpcSubprovider({
                        rpcUrl: "https://node-rinkeby.rarible.com",
                })
        )
        return {
                provider,
                wallet,
        }
}

const { provider } = createTestProvider("PRIVATE KEY")
const web3 = new Web3(provider)
const web3Ethereum = new Web3Ethereum({ web3 })
const ethWallet = new EthereumWallet(web3Ethereum)

// Second parameter — is environment: "prod" | "staging" | "e2e" | "dev"
const sdk = createRaribleSdk(ethWallet, "staging")

const collection = await sdk.apis.collection.getCollectionById({
        collection: "ETHEREUM:0x467059579cc72391B03993C3c20d7bE541f7Da25",
})
const action = await sdk.nft.mint({ collection })

const result = await action.submit({
        uri: "https://avatars.githubusercontent.com/u/100020175?s=200&v=4",
        creators: [{
                account: "0x5DB367D59162021fcc6103825ff36F669626e613",
                value: 10000, // 100%
        }],
        royalties: [],
        lazyMint: false,
        supply: 1,
})
