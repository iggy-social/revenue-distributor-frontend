<template>
<div>
  <div class="d-flex justify-content-center" v-if="isActivated">
    <div class="card text-white bg-secondary balances-card">
      <div class="card-body">
        <div class="text-center">
          <button class="btn btn-secondary text-uppercase mb-3">
            Recipients
          </button>
        </div>

        <p v-if="recipients.length == 0" class="text-center">
          There are no recipients yet.
        </p>

        <!-- Recipients table -->
        <table class="table table-hover table-secondary table-borderless">
          <tbody>
            <tr>
              <th>Recipient</th>
              <th>Percentage</th>
              <th v-if="isCurrentUserManager">Actions</th>
            </tr>
            <tr v-for="(recipient, index) in recipients" :key="recipient.address">
              <td>
                <a :href="getBlockExplorerBaseUrl(chainId)+'/address/'+recipient.address" target="_blank" class="text-white text-break text-decoration-none">
                  {{ recipient.label }}
                </a>
              </td>
              <td>{{ getPercentage(recipient.percentage) }}</td>
              <td v-if="isCurrentUserManager">
                <a 
                  @click="editPopulate(recipient)" class="text-white text-decoration-none" href="#" 
                  data-bs-toggle="modal" :data-bs-target="'#editRecipientModal'+index"
                >Edit</a> | 

                <a 
                  class="text-white text-decoration-none" href="#" data-bs-toggle="modal" 
                  :data-bs-target="'#removeRecipientModal'+index"
                >Remove</a>
              </td>

              <!-- Remove recipient modal -->
              <div class="modal fade" :id="'removeRecipientModal'+index" tabindex="-1" :aria-labelledby="'removeRecipientModalLabel'+index" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">

                    <div class="modal-header">
                      <h5 class="modal-title">Remove recipient</h5>
                      <button :id="'closeRemoveRecipientModal'+index" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"></span>
                      </button>
                    </div>

                    <div class="modal-body text-break">
                      <p>Remove {{ recipient.label }} ({{ shortenAddress(recipient.address) }}) from the recipients list?</p>
                    </div>

                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button @click="removeRecipientByIndex(index)" type="button" class="btn btn-primary" :disabled="waitingRemove">
                        <span v-if="waitingRemove" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Remove recipient
                      </button>
                    </div>

                  </div>
                </div>
              </div>
              <!-- END Remove recipient modal -->

              <!-- Edit recipient modal -->
              <div class="modal fade" :id="'editRecipientModal'+index" tabindex="-1" :aria-labelledby="'editRecipientModalLabel'+index" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Edit recipient</h5>
                      <button :id="'closeEditRecipientModal'+index" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"></span>
                      </button>
                    </div>

                    <div class="modal-body">
                      <div class="mt-2">
                        <input 
                          v-model="editRecipientAddress"
                          class="form-control form-control-lg text-center"
                          placeholder="Enter new recipient address"
                        />
                      </div>

                      <div class="mt-3">
                        <input 
                          v-model="editRecipientLabel"
                          class="form-control form-control-lg text-center"
                          placeholder="Enter new recipient label or name"
                        />
                      </div>

                      <div class="input-group mt-3">
                        <input 
                          v-model="editRecipientPercentage"
                          type="text" class="form-control form-control-lg text-center" 
                          placeholder="Enter new recipient percentage" 
                          aria-label="Recipient's username" aria-describedby="basic-addon2"
                        />
                        <span class="input-group-text" id="basic-addon2">%</span>
                      </div>
                      
                    </div>

                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button 
                        @click="editRecipientByIndex(index)" type="button" class="btn btn-primary" 
                        :disabled="waitingEdit || !editRecipientAddress || !editRecipientLabel || !editRecipientPercentage"
                      >
                        <span v-if="waitingEdit" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- END Edit recipient modal -->
            </tr>
          </tbody>
        </table>

        <!-- Add recipient button -->
        <div class="text-center" v-if="isCurrentUserManager">
          <hr />

          <button 
            class="btn btn-primary text-uppercase mb-3"
            data-bs-toggle="modal" 
            data-bs-target="#addRecipientModal"
          >
            Add recipient
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add recipient modal -->
  <AddRecipient @recipientAdded="addToRecipients" :distributorAddress="distributorAddress" />
</div>
</template>

<script>
import { ethers } from 'ethers';
import { useEthers, shortenAddress } from 'vue-dapp';
import { useToast, TYPE } from "vue-toastification";

import WaitingToast from "./WaitingToast.vue";
import AddRecipient from './manager/AddRecipient.vue';
import useChainHelpers from "../composables/useChainHelpers";
import DistributorAbi from "../data/abi/DistributorAbi.json";

export default {
  name: "RecipientsList",
  props: ["distributorAddress", "isCurrentUserManager", "recipients"],
  emits: ["removeFromRecipients", "updateRecipient"],

  data() {
    return {
      editRecipientAddress: null,
      editRecipientLabel: null,
      editRecipientPercentage: null,
      waitingEdit: false,
      waitingRemove: false
    }
  },

  components: {
    AddRecipient
  },

  methods: {
    addToRecipients(recipient) {
      this.recipients.push(recipient);
    },

    editPopulate(recipient) {
      this.editRecipientAddress = recipient.address;
      this.editRecipientLabel = recipient.label;
      this.editRecipientPercentage = this.getPercentageNumber(recipient.percentage);
    },

    async editRecipientByIndex(index) { 
      this.waitingEdit = true;
      
      const intfc = new ethers.utils.Interface(DistributorAbi);
      const contract = new ethers.Contract(this.distributorAddress, intfc, this.signer);

      const percentageWei = ethers.utils.parseEther(String(Number(this.editRecipientPercentage)/100));

      try {
        const tx = await contract.updateRecipientByIndex(
          index,
          this.editRecipientAddress,
          this.editRecipientLabel,
          percentageWei
        );
        
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
          this.toast("You have successfully updated a recipient!", {
            type: TYPE.SUCCESS,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          });

          // update recipients list (emit removeFromRecipients event from RecipientsList.vue to Home.vue)
          this.$emit("updateRecipient", index, {
            address: this.editRecipientAddress,
            label: this.editRecipientLabel,
            percentage: percentageWei
          });

          document.getElementById('closeEditRecipientModal'+index).click();

          this.waitingEdit = false;

        } else {
          this.toast.dismiss(toastWait);

          this.toast("Transaction has failed.", {
            type: TYPE.ERROR,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          });

          console.log(receipt);
          this.waitingEdit = false;
        }
      } catch (e) {
        this.waitingEdit = false;
        console.log(e);
        this.toast(e.message, {type: TYPE.ERROR});
      }
    },

    getPercentage(percentage) {
      return String(ethers.utils.formatEther(percentage.mul(100))) + "%";
    },

    getPercentageNumber(percentage) {
      return Number(ethers.utils.formatEther(percentage.mul(100)));
    },

    async removeRecipientByIndex(index) { 
      this.waitingRemove = true;
      
      const intfc = new ethers.utils.Interface(DistributorAbi);
      const contract = new ethers.Contract(this.distributorAddress, intfc, this.signer);

      try {
        const tx = await contract.removeRecipientByIndex(index);
        
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
          this.toast("You have successfully removed " + this.recipients[0].label + " as recipient!", {
            type: TYPE.SUCCESS,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          });

          // update recipients list (emit removeFromRecipients event from AddRecipient.vue to Home.vue)
          this.$emit("removeFromRecipients", index);

          document.getElementById('closeRemoveRecipientModal'+index).click();

          this.waitingRemove = false;

        } else {
          this.toast.dismiss(toastWait);

          this.toast("Transaction has failed.", {
            type: TYPE.ERROR,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          });

          console.log(receipt);
          this.waitingRemove = false;
        }
      } catch (e) {
        this.waitingRemove = false;
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
      getBlockExplorerBaseUrl,
      isActivated,
      shortenAddress,
      signer,
      toast
    }
  },
}
</script>

<style scoped>
.table {
  --bs-table-accent-bg: none;
}
</style>