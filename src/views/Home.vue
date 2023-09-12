<template>

  <!-- Search contract -->
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

        <!-- Revenue Distributor Address Input -->
        <div class="mt-4">
          <input 
            v-model="distributorAddress"
            class="form-control form-control-lg text-center"
            placeholder="Revenue Distributor address"
          >
        </div>
        <!-- END Revenue Distributor Address Input -->

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
        <!-- END Load button -->

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

        <div v-if="isCurrentUserManager || isCurrentUserOwner">
          <hr />

          <p v-if="isCurrentUserManager && !isCurrentUserOwner">You are a manager of this RevenueDistributor contract.</p>
          <p v-if="isCurrentUserOwner">You are the owner of this RevenueDistributor contract.</p>
        </div>

      </div>
    </div>
  </div>

  <!-- Recipients list -->
  <RecipientsList v-if="recipients.length > 0" :recipients="recipients" />

  <!-- Info -->
  <Info v-if="recipients.length > 0" />
</template>

<script>
import WaitingToast from "../components/WaitingToast.vue";
import RecipientsList from "../components/RecipientsList.vue";
import Info from "../components/Info.vue";
import useChainHelpers from "../composables/useChainHelpers";
import DistributorAbi from "../data/abi/DistributorAbi.json";
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';
import { useToast, TYPE } from "vue-toastification";

export default {
  name: "Home",

  data() {
    return {
      isCurrentUserManager: false,
      isCurrentUserOwner: false,
      filterNetwork: null,
      filterTokens: null,
      distributorAddress: null,
      recipients: [],
      waitingData: false
    }
  },

  components: {
    Info,
    RecipientsList,
    WaitingToast
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
    },

    async loadData() {
      this.waitingData = true;

      // reset data
      this.recipients = [];
      this.isCurrentUserManager = false;
      this.isCurrentUserOwner = false;

      // interface of the contract
      const distributorInterface = new ethers.utils.Interface(DistributorAbi);

      // contract instance
      const distributorContract = new ethers.Contract(this.distributorAddress, distributorInterface, this.signer);

      // get recipients
      this.recipients = await distributorContract.getRecipients();

      console.log(this.recipients);

      // get recipients length
      const recipientsLength = await distributorContract.getRecipientsLength();
      console.log("Length", Number(recipientsLength));

      // check if current user is owner
      const owner = await distributorContract.owner();
      this.isCurrentUserOwner = String(owner).toLowerCase() === String(this.address).toLowerCase();

      // if current user is not owner, check if current user is manager
      if (!this.isCurrentUserOwner) {
        this.isCurrentUserManager = await distributorContract.isManager(this.address);
      } else {
        // if current user is owner, also mark it as manager
        this.isCurrentUserManager = true;
      }

      this.waitingData = false;
    }

  },

  setup() {
    const { address, balance, chainId, isActivated, signer } = useEthers();
    const { getBlockExplorerBaseUrl, getChainName, getSupportedChains, switchNetwork } = useChainHelpers();
    const toast = useToast();

    return { 
      address, balance, chainId, getBlockExplorerBaseUrl, getChainName, getSupportedChains, 
      isActivated, signer, switchNetwork, toast 
    }
  }

}
</script>
