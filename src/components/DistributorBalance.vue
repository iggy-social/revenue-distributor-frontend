<template>
<div>
  <div class="d-flex justify-content-center" v-if="isActivated">
    <div class="card text-white bg-secondary balances-card">
      <div class="card-body">
        <div class="text-center">
          <button class="btn btn-secondary text-uppercase mb-3">
            Balance
          </button>
        </div>

        <p class="text-center">
          {{ balance }} {{ currencies[chainId] }}
        </p>

        <!-- Add recipient button -->
        <div class="text-center" v-if="isCurrentUserOwner">
          <hr />

          <button 
            class="btn btn-primary text-uppercase mb-3"
            @click="withdrawBalance"
          >
            <span v-if="waiting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Withdraw Balance
          </button>
        </div>

      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';
import { useToast, TYPE } from "vue-toastification";

import currencies from '../data/currencies.json';
import WaitingToast from "./WaitingToast.vue";
import useChainHelpers from "../composables/useChainHelpers";
import DistributorAbi from "../data/abi/DistributorAbi.json";

export default {
  name: "DistributorBalance",
  props: ["distributorAddress", "distributorBalanceWei", "isCurrentUserOwner"],

  data() {
    return {
      balanceWei: null,
      waiting: false
    }
  },

  created() {
    this.balanceWei = this.distributorBalanceWei;
  },

  computed: {
    balance() {
      if (this.balanceWei) {
        return ethers.utils.formatEther(this.balanceWei);
      }
      
      return 0;
    },
  },

  methods: {

    async withdrawBalance() { 
      this.waiting = true;
      
      const intfc = new ethers.utils.Interface(DistributorAbi);
      const contract = new ethers.Contract(this.distributorAddress, intfc, this.signer);

      try {
        const tx = await contract.withdrawEth();
        
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
          this.toast("You have successfully withdrawn balance from the Distributor contract!", {
            type: TYPE.SUCCESS,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          });

          this.balanceWei = 0;

          this.waiting = false;

        } else {
          this.toast.dismiss(toastWait);

          this.toast("Transaction has failed.", {
            type: TYPE.ERROR,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          });

          console.log(receipt);
          this.waiting = false;
        }
      } catch (e) {
        this.waiting = false;
        console.log(e);
        this.toast(e.message, {type: TYPE.ERROR});
      }
    },

  },

  setup() {
    const { chainId, isActivated, signer } = useEthers();
    const { getBlockExplorerBaseUrl } = useChainHelpers();
    const toast = useToast();

    return {
      chainId,
      currencies,
      getBlockExplorerBaseUrl,
      isActivated,
      signer,
      toast
    }
  },
}
</script>
