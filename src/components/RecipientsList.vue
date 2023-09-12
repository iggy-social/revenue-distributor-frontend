<template>
  <div class="d-flex justify-content-center" v-if="isActivated">
    <div class="card text-white bg-secondary balances-card">
      <div class="card-body">
        <div class="text-center">
          <button class="btn btn-secondary text-uppercase mb-3">
            Recipients
          </button>
        </div>

        <table class="table table-hover table-secondary table-borderless">
          <tbody>
            <tr v-for="recipient in recipients" :key="recipient[0]">
              <td>{{ recipient[1] }}</td>
              <td>{{ getPercentage(recipient[2]) }}</td>
              <!--<td>Swap</td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';

export default {
  name: "RecipientsList",
  props: ["recipients"],

  mounted() {
    console.log(this.recipients);
    console.log(this.recipients[0][0]);
    console.log(this.recipients[1]);
  },

  methods: {
    getPercentage(percentage) {
      return String(ethers.utils.formatEther(percentage.mul(100))) + "%";
    },
  },

  setup() {
    const { chainId, isActivated } = useEthers();

    return {
      chainId,
      isActivated
    }
  },
}
</script>

<style scoped>
.table {
  --bs-table-accent-bg: none;
}
</style>