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
          CHAIN: {{ getChainName(chainId) }}
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
            v-model="distributorAddrOrDomain"
            class="form-control form-control-lg text-center"
            placeholder="Revenue Distributor address or domain" 
            v-on:keyup.enter="loadData"
          >
        </div>
        <!-- END Revenue Distributor Address Input -->

        <!-- Load button -->
        <button
          v-if="isActivated && !showSwitchChain"
          class="btn btn-lg btn-dark mt-4 mb-2"
          :disabled="waitingData"
          @click="loadData"
        >
          <span v-if="waitingData" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Load Data
        </button>
        <!-- END Load button -->

        <!-- Copy URL button -->
        <button
          v-if="isActivated && !showSwitchChain && getContractUrl && distributorAddress && (recipients.length > 0 || isCurrentUserManager)"
          class="btn btn-lg btn-outline-dark mt-4 mb-2 ms-2"
          @click="copyUrl"
        >
          Copy URL
        </button>
        <!-- END Copy URL button -->

        <!-- Switch network button -->
        <button
          v-if="isActivated && showSwitchChain"
          class="btn btn-lg btn-dark mt-4 mb-2"
          @click="changeNetwork(urlChainName)"
        >
          Switch to {{ urlChainName }}
        </button>
        <!-- END Switch network button -->

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
  <RecipientsList 
    v-if="distributorAddress && (recipients.length > 0 || isCurrentUserManager)" 
    :key="recipients.length" 
    :recipients="recipients" 
    :isCurrentUserManager="isCurrentUserManager" 
    :distributorAddress="distributorAddress" 
    @removeFromRecipients="removeFromRecipients"
    @updateRecipient="updateRecipient"
  />

  <!-- Managers list -->
  <ManagersList 
    v-if="distributorAddress && (managers.length > 0 || isCurrentUserOwner)" 
    :key="managers.length" 
    :managers="managers" 
    :isCurrentUserOwner="isCurrentUserOwner" 
    :distributorAddress="distributorAddress" 
    @removeFromManagers="removeFromManagers"
  />

  <!-- Distributor Balance (check if balance is larger than 0) -->
  <DistributorBalance 
    v-if="!isDistributorBalanceZero" 
    :isCurrentUserOwner="isCurrentUserOwner" 
    :distributorAddress="distributorAddress" 
    :distributorBalanceWei="distributorBalanceWei"
  />

  <!-- Info -->
  <Info v-if="distributorAddress && (recipients.length > 0 || isCurrentUserManager)" />
</template>

<script>
import DistributorBalance from "../components/DistributorBalance.vue";
import Info from "../components/Info.vue";
import ManagersList from "../components/ManagersList.vue";
import RecipientsList from "../components/RecipientsList.vue";
import WaitingToast from "../components/WaitingToast.vue";
import useChainHelpers from "../composables/useChainHelpers";
import DistributorAbi from "../data/abi/DistributorAbi.json";
import useDomainHelpers from "../composables/useDomainHelpers";
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';
import { useToast, TYPE } from "vue-toastification";

export default {
  name: "Home",

  data() {
    return {
      distributorAddrOrDomain: null,
      isCurrentUserManager: false,
      isCurrentUserOwner: false,
      filterNetwork: null,
      filterTokens: null,
      distributorAddress: null,
      distributorBalanceWei: null,
      managers: [],
      recipients: [],
      urlChain: null,
      waitingData: false
    }
  },

  components: {
    DistributorBalance,
    Info,
    ManagersList,
    RecipientsList,
    WaitingToast
  },

  created() {
    // pass contract address through URL query (e.g. ?addr=0x123...abc, or ?id=0x123...abc)
    if (this.$route.query.addr) {
      this.distributorAddrOrDomain = this.$route.query.addr;
    } else if (this.$route.query.id) {
      this.distributorAddrOrDomain = this.$route.query.id;
    }

    if (this.$route.query.chain) {
      this.urlChain = this.$route.query.chain;
      this.urlChainName = this.getChainName(Number(this.urlChain));
    }
  },

  computed: {

    getContractUrl() {
      if (this.distributorAddress && this.chainId) {
        return "https://distributor.iggy.social/?addr=" + this.distributorAddress + "&chain=" + this.chainId;
      }

      return null;
    },

    isDistributorBalanceZero() {
      if (!this.distributorBalanceWei) {
        return true;
      }
      
      if (this.distributorBalanceWei) {
        if (Number(this.distributorBalanceWei) === 0) {
          return true;
        } else if (!this.distributorBalanceWei.lt(0)) {
          return true;
        }
      } 

      return false;
    },

    getNetworks() {
      const networkNames = this.getSupportedChains();

      if (this.filterNetwork) {
        return networkNames.filter(item => item.includes(this.filterNetwork.toUpperCase())); //filtered
      }

      return networkNames;
    },

    showSwitchChain() {
      if (this.urlChain && this.chainId) {
        if (Number(this.urlChain) !== Number(this.chainId)) {
          return true;
        }
      }

      return false;
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

    copyUrl() {
      navigator.clipboard.writeText(this.getContractUrl);
      this.toast("Copied to clipboard.", {type: TYPE.SUCCESS});
    },

    async loadData() {
      // reset data
      this.recipients = [];
      this.managers = [];
      this.isCurrentUserManager = false;
      this.isCurrentUserOwner = false;
      this.distributorBalanceWei = null;
      this.distributorAddress = null;

      try {
        this.waitingData = true;

        //if (!String(this.distributorAddrOrDomain).includes(".") && String(this.distributorAddrOrDomain.startsWith("0x"))) {
          // if it starts with 0x and does not contain a dot, it is very likely an address

        if (ethers.utils.isAddress(this.distributorAddrOrDomain)) {
          this.distributorAddress = this.distributorAddrOrDomain;
        } else {
          this.distributorAddress = await this.getDomainHolder(this.distributorAddrOrDomain);
          
          if (!this.distributorAddress || this.distributorAddress === ethers.constants.AddressZero) {
            this.toast("This name does not have an owner.", {type: TYPE.ERROR});
            this.waitingData = false;
            return;
          }
        }

        // interface of the contract
        const distributorInterface = new ethers.utils.Interface(DistributorAbi);

        // contract instance
        const distributorContract = new ethers.Contract(this.distributorAddress, distributorInterface, this.signer);

        // get recipients length
        const recipientsLength = await distributorContract.getRecipientsLength();

        // get recipients
        const recipientsObject = await distributorContract.getRecipients();

        // parse recipients
        for (let i = 0; i < Number(recipientsLength); i++) {
          const recipient = recipientsObject[i];
          const recipientAddress = recipient[0];
          const recipientLabel = recipient[1];
          const recipientPercentage = recipient[2];

          this.recipients.push({
            address: recipientAddress,
            label: recipientLabel,
            percentage: recipientPercentage
          });
        }

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

        // get managers
        const managers = await distributorContract.getManagers();

        // parse managers
        for (let i = 0; i < managers.length; i++) {
          this.managers.push({
            address: managers[i]
          });
        }

        // fetch distributor contract balance
        this.distributorBalanceWei = await this.signer.provider.getBalance(this.distributorAddress);

        this.waitingData = false;
      } catch (error) {
        console.log(error);
        this.toast(error.message, {type: TYPE.ERROR});
        this.waitingData = false;
        return;
      }
    },

    removeFromManagers(index) {
      this.managers.splice(index, 1);
    },

    removeFromRecipients(index) {
      this.recipients.splice(index, 1);
    },

    updateRecipient(index, recipient) {
      this.recipients[index] = recipient;
    }

  },

  setup() {
    const { address, balance, chainId, isActivated, signer } = useEthers();
    const { getBlockExplorerBaseUrl, getChainName, getSupportedChains, switchNetwork } = useChainHelpers();
    const toast = useToast();
    const { getDomainHolder } = useDomainHelpers();

    return { 
      address, balance, chainId, getDomainHolder, getBlockExplorerBaseUrl, getChainName, getSupportedChains, 
      isActivated, signer, switchNetwork, toast 
    }
  }

}
</script>
