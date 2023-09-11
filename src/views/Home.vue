<template>
  <div class="d-flex justify-content-center">
    <div class="card text-white bg-primary send-tokens-card">
      <div class="card-body text-center">

        <button
          v-if="!isActivated" 
          class="btn btn-primary" 
          type="button"
          data-bs-toggle="modal" 
          data-bs-target="#connectModal"
        >
          Connect wallet
        </button>

        <!-- Select network -->
        <button 
          v-if="isActivated" 
          class="btn btn-primary dropdown-toggle" 
          type="button" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"
        >
          {{ getChainName(chainId) }}
        </button>
        
        <div class="dropdown-menu p-2 dropdown-menu-end">
          <div class="mb-3">
            <input 
              class="form-control mb-2" 
              placeholder="Find network"
              v-model="filterNetwork" 
            />

            <li>
              <button 
                class="dropdown-item" 
                type="button"
                v-for="networkName in getNetworks"
                :key="networkName"
                @click="changeNetwork(networkName)"
              >SWITCH TO {{ networkName }}</button>
            </li>
          </div>
        </div>
        <!-- END Select network -->

        <!-- Recipient -->
        <div class="mt-4">
          <input 
            v-model="distributorAddress"
            class="form-control form-control-lg text-center"
            placeholder="Revenue Distributor address"
          >
        </div>
        <!-- END Recipient -->

        <!-- Load button -->
        <button
          v-if="isActivated"
          class="btn btn-lg btn-dark mt-4 mb-2"
          :disabled="waitingData"
          @click="loadData"
        >
          <span v-if="waitingData" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Load Data
        </button>
        <!-- END load button -->

        <!-- Connect wallet button -->
        <button
          v-if="!isActivated"
          class="btn btn-lg btn-dark mt-4 mb-2"
          data-bs-toggle="modal" 
          data-bs-target="#connectModal"
        >
          Connect wallet
        </button>
        <!-- END Connect wallet button -->

      </div>
    </div>
  </div>
</template>

<script>
import WaitingToast from "../components/WaitingToast.vue";
import useChainHelpers from "../composables/useChainHelpers";
import useDomainHelpers from "../composables/useDomainHelpers";
import { ethers } from 'ethers';
import { useBoard, useEthers } from 'vue-dapp';
import { useToast, TYPE } from "vue-toastification";

export default {
  name: "Home",

  data() {
    return {
      filterNetwork: null,
      filterTokens: null,
      distributorAddress: null,
      waitingData: false
    }
  },

  created() {
    this.distributorAddress = this.$route.query.addr; // pass contract address through URL query (e.g. ?addr=0x123...abc)
  },

  computed: {

    getNetworks() {
      const networkNames = this.getSupportedChains();

      if (this.filterNetwork) {
        return networkNames.filter(item => item.includes(this.filterNetwork.toUpperCase())); //filtered
      }

      return networkNames;
    }
  },

  methods: {
    changeNetwork(networkName) {
      const networkData = this.switchNetwork(networkName); 

      window.ethereum.request({ 
        method: networkData.method, 
        params: networkData.params
      });
    }
  },

  setup() {
    const { open } = useBoard();
    const { address, balance, chainId, isActivated, signer } = useEthers();
    const { getBlockExplorerBaseUrl, getChainName, getSupportedChains, switchNetwork } = useChainHelpers();
    const { getDomainHolder } = useDomainHelpers();
    const toast = useToast();

    return { 
      address, balance, chainId, getBlockExplorerBaseUrl, getChainName, getDomainHolder, getSupportedChains, 
      isActivated, open, signer, switchNetwork, toast 
    }
  }

}
</script>
