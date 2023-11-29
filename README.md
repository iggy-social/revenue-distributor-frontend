# Revenue Distributor frontend

[RevenueDistributor.sol](https://github.com/iggy-social/iggy-contracts/blob/main/contracts/distributor/RevenueDistributor.sol) is a smart contract that can automate distributing revenue to select addresses.

Website: https://distributor.iggy.social/ 

> To see the UI, you can check this smart contract on the Base network: [0xF1aB28FEfFB7E5BF34b03354267895516a0Cf9E9](https://distributor.iggy.social/?addr=0xF1aB28FEfFB7E5BF34b03354267895516a0Cf9E9&chain=8453).

If you don't have a `RevenueDistributor.sol` yet, create it via the website (find the Create button in the navigation bar).

Once your distributor smart contract is created, enter its address in the input field and click Load data. Then you can add recipients and managers.

## Sharing links

You can easily share links to distributor contracts like this:

```bash
https://distributor.iggy.social/?addr=0xF1aB28FEfFB7E5BF34b03354267895516a0Cf9E9&chain=8453
```

Note that the link includes address of the distributor contract (in the `addr=` parameter), and also the network ID (`chain`).

## Features
- [Vue 3](https://v3.vuejs.org/guide/introduction.html#what-is-vue-js) as the foundation
- [Bootstrap](https://getbootstrap.com/) for styling
- [Vite](https://vitejs.dev/guide/) for faster builds
- [ethers.js](https://docs.ethers.io/v5/) for interacting with Ethereum
- [vue-dapp](https://github.com/chnejohnson/vue-dapp) for the wallet connect

## Revenue Distributor Factory contract addresses

See [/src/data/factories.json](https://github.com/iggy-social/revenue-distributor-frontend/blob/main/src/data/factories.json) for the most up-to-date contract addresses on various chains.

## Distributor contracts for Iggy Social projects

- Basebook (Base): [0xF1aB28FEfFB7E5BF34b03354267895516a0Cf9E9](https://distributor.iggy.social/?addr=0xF1aB28FEfFB7E5BF34b03354267895516a0Cf9E9&chain=8453) (aka distributor.basebook).
- FLR Chat (Flare): [0xFbaf1D1fBC5a2Fe2e48858a8A4585d5e7C12fc4A](https://distributor.iggy.social/?addr=0xFbaf1D1fBC5a2Fe2e48858a8A4585d5e7C12fc4A&chain=14) (aka distributor.flr).
- SGB Chat (Songbird): [0x97203DE4aB5f1064618C727D80f16840DB8F4d59](https://distributor.iggy.social/?addr=0x97203DE4aB5f1064618C727D80f16840DB8F4d59&chain=19) (aka distributor.sgb).
- AlwaysLiquid (Arbitrum): [0xcd1B58a51F7BA50FE5516eA71d3eb518e4aC98CF](https://distributor.iggy.social/?addr=0xcd1B58a51F7BA50FE5516eA71d3eb518e4aC98CF&chain=42161) (aka distributor.arbi).
