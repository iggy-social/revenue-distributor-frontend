<template>
	<Navbar />

	<router-view></router-view>

	<!-- Connect Wallet modal -->
	<div class="modal modal-sm fade" id="connectModal" tabindex="-1" aria-labelledby="connectModalLabel" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Connect your wallet</h5>
					<button id="closeConnectModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
						<span aria-hidden="true"></span>
					</button>
				</div>
				<div class="modal-body row">

					<div class="card col-6 set-cursor-pointer" @click="connectMetaMask">
						<img src="./assets/img/wallets/rabby.png" class="card-img-top card-img-wallet" alt="Rabby">
					</div> 

					<div class="card col-6 set-cursor-pointer" @click="connectMetaMask">
						<img src="./assets/img/wallets/metamask.png" class="card-img-top card-img-wallet" alt="MetaMask">
					</div>

					<div class="card col-6 set-cursor-pointer" @click="connectMetaMask">
						<img src="./assets/img/wallets/bifrost.png" class="card-img-top card-img-wallet" alt="Bifrost">
					</div> 

					<div class="card col-6 set-cursor-pointer" @click="connectCoinbase">
						<img src="./assets/img/wallets/coinbase.png" class="card-img-top card-img-wallet" alt="Coinbase">
					</div>

					<div class="card col-6 set-cursor-pointer" @click="connectMetaMask">
						<img src="./assets/img/wallets/brave.png" class="card-img-top card-img-wallet" alt="Brave">
					</div>

					<div class="card col-6 set-cursor-pointer" @click="connectMetaMask">
						<img src="./assets/img/wallets/trust.png" class="card-img-top card-img-wallet" alt="Trust Wallet">
					</div>

					<div class="card col-6 set-cursor-pointer" @click="connectMetaMask">
						<img src="./assets/img/wallets/imtoken.png" class="card-img-top card-img-wallet" alt="imToken">
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- END Connect Wallet modal -->
</template>

<script>
import Navbar from './components/Navbar.vue';
import { MetaMaskConnector, CoinbaseWalletConnector } from 'vue-dapp';
import { useEthers, useWallet } from 'vue-dapp';

export default {
  name: "App",

	components: {
		Navbar
	},

	created() {
		// if user already connected before, connect them automatically on the next visit
		if (!this.isActivated) {
			if (localStorage.getItem("connected") == "metamask") {
				this.connectMetaMask();
			} else if (localStorage.getItem("connected") == "coinbase") {
				this.connectCoinbase();
			}
		}
	},

	methods: {
		async connectCoinbase() {
			await this.connectWith(this.coinbaseConnector);
			localStorage.setItem("connected", "coinbase"); // store in local storage to autoconnect next time
			document.getElementById('closeConnectModal').click();
		},

		async connectMetaMask() {
			await this.connectWith(this.mmConnector);
			localStorage.setItem("connected", "metamask"); // store in local storage to autoconnect next time
			document.getElementById('closeConnectModal').click();
		}
	},

  setup() {
		const { address, chainId, isActivated } = useEthers();
		const { connectWith } = useWallet();

		const coinbaseConnector = new CoinbaseWalletConnector({
			appName: 'Revenue Distributor',
			jsonRpcUrl: "https://rpc.ankr.com/optimism",
		});

		const mmConnector = new MetaMaskConnector({
			appUrl: 'https://distributor.iggy.social',
		});

		return {
			address,
			chainId,
			coinbaseConnector,
			connectWith,
			isActivated,
			mmConnector
		}
  }
}
</script>
