# Revenue Distributor frontend

[RevenueDistributor.sol](https://github.com/iggy-social/iggy-contracts/blob/main/contracts/distributor/RevenueDistributor.sol) is a smart contract that can automate distributing revenue to select addresses.

Website: https://distributor.iggy.social/ 

> To see the UI, you can check this smart contract on the Base network: [0xF1aB28FEfFB7E5BF34b03354267895516a0Cf9E9](https://distributor.iggy.social/?addr=0xF1aB28FEfFB7E5BF34b03354267895516a0Cf9E9).

If you don't have a `RevenueDistributor.sol` yet, create it via the website (find the Create button in the navigation bar).

Once your distributor smart contract is created, enter its address in the input field and click Load data. Then you can add recipients and managers.

## Features
- [Vue 3](https://v3.vuejs.org/guide/introduction.html#what-is-vue-js) as the foundation
- [Bootstrap](https://getbootstrap.com/) for styling
- [Vite](https://vitejs.dev/guide/) for faster builds
- [ethers.js](https://docs.ethers.io/v5/) for interacting with Ethereum
- [vue-dapp](https://github.com/chnejohnson/vue-dapp) for the wallet connect

## Revenue Distributor Factory contract addresses

See [/src/data/factories.json](https://github.com/iggy-social/revenue-distributor-frontend/blob/main/src/data/factories.json) for the most up-to-date contract addresses on various chains.

## Distributor contracts for Iggy Social projects

- Basebook (Base): [0xF1aB28FEfFB7E5BF34b03354267895516a0Cf9E9](https://revenue-distributor-frontend.vercel.app/?addr=0xF1aB28FEfFB7E5BF34b03354267895516a0Cf9E9) (aka distributor.basebook).
- FLR Chat (Flare): [0xFbaf1D1fBC5a2Fe2e48858a8A4585d5e7C12fc4A](https://revenue-distributor-frontend.vercel.app/?addr=0xFbaf1D1fBC5a2Fe2e48858a8A4585d5e7C12fc4A) (aka distributor.flr).
- SGB Chat (Songbird): [0x97203DE4aB5f1064618C727D80f16840DB8F4d59](https://revenue-distributor-frontend.vercel.app/?addr=0x97203DE4aB5f1064618C727D80f16840DB8F4d59) (aka distributor.sgb).
