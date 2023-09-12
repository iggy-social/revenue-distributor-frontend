import { defineStore } from 'pinia';
import { useEthers } from 'vue-dapp';
import { ethers } from 'ethers';
import useDomainHelpers from "../composables/useDomainHelpers";
import tokens from "../data/tokens.json";
import Erc20Abi from "../data/abi/Erc20Abi.json";

const { address, balance, chainId, signer } = useEthers();
const { getEnsDomain, getPunkDomain } = useDomainHelpers();

export const useUserStore = defineStore({
  id: 'user',

  state: () => {
    return {
      address: null,
      chainId: null,
      defaultDomain: null,
      domainSearchStatus: false, // is a domain search for the connected user still in progress?
      tokenBalances: null,
      tokenLoadingStatus: false // is loading token balances for the connected user still in progress?
    }
  },

  getters: {
    getDefaultDomain(state) {
      return state.defaultDomain;
    },

    getDomainSearchStatus(state) {
      return state.domainSearchStatus;
    },

    getTokenBalances(state) {
      return state.tokenBalances;
    },

    getTokenLoadingStatus(state) {
      return state.tokenLoadingStatus;
    }
  }
  
})