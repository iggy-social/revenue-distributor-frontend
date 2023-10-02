<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <div class="container-fluid">

    <router-link to="/" class="navbar-brand">
      <a class="navbar-brand" href="#">Revenue Distributor Manager</a>
    </router-link>


    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarColor01">

      <ul class="navbar-nav ms-auto">

        <li class="nav-item">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#aboutModal">About</button>
        </li>

        <li class="nav-item" v-if="isActivated">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Create</button>
        </li>

        <li v-if="isActivated" class="nav-item dropdown">
          <button 
						class="btn btn-primary dropdown-toggle network-dropdown" 
						data-bs-toggle="dropdown" type="button" 
						aria-haspopup="true" aria-expanded="false"
					>{{ getChainName(chainId) }}</button>

          <div class="dropdown-menu p-2 dropdown-menu-end set-cursor-pointer">
            <input 
              class="form-control mb-2" 
              placeholder="Find network"
              v-model="filterNetwork" 
            />

            <span 
              class="dropdown-item"
              v-for="networkName in getNetworks"
              :key="networkName"
              @click="changeNetwork(networkName)"
            >{{networkName}}</span>
          </div>
        </li>

        <li v-if="isActivated" class="nav-item dropdown">
          <button 
						class="btn btn-primary dropdown-toggle" 
						data-bs-toggle="dropdown" type="button" 
						aria-haspopup="true" aria-expanded="false"
					>
            {{ getDomainOrAddress }}
            <span v-if="userStore.getDomainSearchStatus" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          </button>

          <div class="dropdown-menu dropdown-menu-end set-cursor-pointer">
            
            <a :href="getBlockExplorerBaseUrl(chainId)+'/address/'+address" class="short-address" target="_blank">
              <span class="dropdown-item">
                {{ shortenAddress(address) }}
              </span>
            </a>
            
            <span class="dropdown-item" @click="disconnect">Disconnect</span>
          </div>
        </li>

				<li class="nav-item">
					<button v-if="!isActivated" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#connectModal">Connect wallet</button>
				</li>

      </ul>

    </div>
  </div>
</nav>

<!-- About modal -->
<div class="modal fade" id="aboutModal" tabindex="-1" aria-labelledby="aboutModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">About Revenue Distributor Frontend</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div class="modal-body">
        <p>Revenue Distributor Frontend is a web3 app that allows you to manage any RevenueDistributor.sol smart contract.</p>

        <p>All the code is open source and you can find it on GitHub:</p>

        <ul>
          <li>
            <a href="https://github.com/iggy-social/revenue-distributor-frontend" target="_blank">Frontend code</a>
          </li>

          <li>
            <a href="https://github.com/iggy-social/iggy-contracts/tree/main/contracts/distributor" target="_blank">Smart contract code</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
<!-- END About modal -->

<!-- Create modal -->
<div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Create a RevenueDistributor Contract</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div class="modal-body">
        <p v-if="!newDistributorAddress">Create a new RevenueDistributor smart contract.</p>

        <!-- Unique ID -->
        <div class="mb-4" v-if="!newDistributorAddress">
          <label for="uniqueId" class="form-label">Unique ID (store it - just in case)</label>
          <input 
            type="text" class="form-control" id="uniqueId" aria-describedby="uniqueIdHelp" 
            disabled readonly 
            v-model="uniqueId"
          />
          <div id="uniqueIdHelp" class="form-text">This is just in case the frontend will not show you the new distributor address and you'll need to find it manually.</div>
        </div>

        <p v-if="newDistributorAddress">Success! Contract created!</p>

        <p v-if="newDistributorAddress">
          Click here to manage your new RevenueDistributor contract: 
          <a :href="'https://distributor.iggy.social/?addr='+newDistributorAddress+'&chain='+this.chainId">
            {{ newDistributorAddress }}
          </a>.
        </p>

        <hr />

        <p v-if="newDistributorAddress">
          <a :href="this.getBlockExplorerBaseUrl(this.chainId)+'/address/'+newDistributorAddress" target="_blank">
            See the contract on block explorer.
          </a>
        </p>

      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button v-if="!newDistributorAddress" @click="create" type="button" class="btn btn-primary" :disabled="waitingCreate || !uniqueId">
          <span v-if="waitingCreate" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Submit
        </button>
      </div>
    </div>
  </div>
</div>
<!-- END Create modal -->
</template>

<script>
import { ethers } from 'ethers';
import { useToast, TYPE } from "vue-toastification";
import { useBoard, useEthers, useWallet, shortenAddress } from 'vue-dapp';

import useChainHelpers from "../composables/useChainHelpers";
import DistributorFactoryAbi from "../data/abi/DistributorFactoryAbi.json";
import { useUserStore } from '../store/user';
import factories from '../data/factories.json';
import WaitingToast from "./WaitingToast.vue";

export default {
  name: "Navbar",

  data() {
    return {
      filterNetwork: null,
      newDistributorAddress: null,
      uniqueId: null,
      waitingCreate: false,
    }
  },

  mounted() {
    this.uniqueId = Math.random().toString(36).slice(2);
  },

  computed: {
    getDomainOrAddress() {
      if (this.userStore.getDefaultDomain) {
        return this.userStore.getDefaultDomain;
      } else {
        return shortenAddress(this.address);
      }
    },

    getNetworks() {
      const networkNames = this.getSupportedChains();

      if (this.filterNetwork) {
        return networkNames.filter(item => item.includes(this.filterNetwork.toUpperCase())); //filtered
      }

      return networkNames;
    },
  },

  methods: {
    changeNetwork(networkName) {
      const networkData = this.switchNetwork(networkName); 

      window.ethereum.request({ 
        method: networkData.method, 
        params: networkData.params
      });
    },

    async create() {
      this.waitingCreate = true;

      // interface of the contract
      const factoryInterface = new ethers.utils.Interface(DistributorFactoryAbi);

      // contract address
      const factoryAddress = factories[this.chainId];

      // contract instance
      const factoryContract = new ethers.Contract(factoryAddress, factoryInterface, this.signer);

      try {
        const tx = await factoryContract.create(this.uniqueId);
        
        const toastWait = this.toast(
          {
            component: WaitingToast, // @todo
            props: {
              text: "Please wait for your transaction to confirm. Click on this notification to see transaction in the block explorer."
            }
          },
          {
            type: TYPE.INFO,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          }
        );

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          this.toast.dismiss(toastWait);
          this.toast("You have successfully created a new RevenueDistributor contract!", {
            type: TYPE.SUCCESS,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          });
          
          // fetch the new distributor address
          this.newDistributorAddress = await factoryContract.getDistributorAddressById(this.uniqueId);

          this.waitingCreate = false;

        } else {
          this.toast.dismiss(toastWait);

          this.toast("Transaction has failed.", {
            type: TYPE.ERROR,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          });

          console.log(receipt);
          this.waitingCreate = false;
        }
      } catch (e) {
        this.waitingCreate = false;
        console.log(e);
        this.toast(e.message, {type: TYPE.ERROR});
      }
    }
  },

  setup() {
    const { open } = useBoard();
		const { address, chainId, isActivated, signer } = useEthers();
		const { disconnect } = useWallet();
		const { getBlockExplorerBaseUrl, getChainName, getSupportedChains, switchNetwork } = useChainHelpers();
    const userStore = useUserStore();
    const toast = useToast();

		return {
			address,
			chainId,
			disconnect,
      getBlockExplorerBaseUrl,
			getChainName,
			getSupportedChains,
			isActivated,
			open,
			shortenAddress,
      signer,
			switchNetwork,
      toast,
      userStore
		}
  },
}
</script>

<style scoped>
.network-dropdown {
  text-transform: lowercase;
}

.network-dropdown::first-letter {
  text-transform: uppercase;
}

.short-address {
  text-decoration: none;
}
</style>