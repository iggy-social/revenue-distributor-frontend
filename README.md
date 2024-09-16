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

## Distributor contracts directory

- AlwaysLiquid (Arbitrum): [0xcd1B58a51F7BA50FE5516eA71d3eb518e4aC98CF](https://distributor.iggy.social/?addr=0xcd1B58a51F7BA50FE5516eA71d3eb518e4aC98CF&chain=42161) (aka distributor.arbi).
- AlwaysLiquid (Fantom): [0x90BbcF08d82e276262267a9dB9014C979b70Db3c](https://distributor.iggy.social/?addr=0x90BbcF08d82e276262267a9dB9014C979b70Db3c&chain=250) (aka distributor.fantom).
- Basebook (Base): [0xF1aB28FEfFB7E5BF34b03354267895516a0Cf9E9](https://distributor.iggy.social/?addr=0xF1aB28FEfFB7E5BF34b03354267895516a0Cf9E9&chain=8453) (aka distributor.basebook).
- Blast Sniperz (Blast): [0xAf8f43705B2642E8f15393485F7308C2b37C503F](https://distributor.iggy.social/?addr=0xAf8f43705B2642E8f15393485F7308C2b37C503F&chain=81457)
- FLR Chat (Flare): [0xFbaf1D1fBC5a2Fe2e48858a8A4585d5e7C12fc4A](https://distributor.iggy.social/?addr=0xFbaf1D1fBC5a2Fe2e48858a8A4585d5e7C12fc4A&chain=14) (aka distributor.flr).
- Ionic ID (Mode): [0xaA2eF936d657Be591A0866f0C7b6249e6A2A1bb5](https://distributor.iggy.social/?addr=0xaA2eF936d657Be591A0866f0C7b6249e6A2A1bb5&chain=34443) (aka distributor.ion).
- Meow Domains (Superposition): [0x98a37848dc2D0F07dE151Da3b3b92541563E1791](https://distributor.iggy.social/?addr=0x98a37848dc2D0F07dE151Da3b3b92541563E1791&chain=55244).
- ModeChat (Mode): [0x20aeB41bCfaFb05b580dB2f687123eDa605315Ed](https://distributor.iggy.social/?addr=0x20aeB41bCfaFb05b580dB2f687123eDa605315Ed&chain=34443) (aka distributor.modechat).
- Pool Chat (Optimism): [0x1eB2641eA0021567208C29f3200b7f1e68d92f85](https://distributor.iggy.social/?addr=0x1eB2641eA0021567208C29f3200b7f1e68d92f85&chain=10).
- Scrolly Hub (Scroll): [0x0E66249733DDFe422F7A127B0b9E906601F23E06](https://distributor.iggy.social/?addr=0x0E66249733DDFe422F7A127B0b9E906601F23E06&chain=534352).
- SGB Chat (Songbird): [0x97203DE4aB5f1064618C727D80f16840DB8F4d59](https://distributor.iggy.social/?addr=0x97203DE4aB5f1064618C727D80f16840DB8F4d59&chain=19) (aka distributor.sgb).
