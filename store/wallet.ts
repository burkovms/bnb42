// eslint-disable-next-line import/named
import { GetterTree, MutationTree, ActionTree } from 'vuex';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { Device } from '@nuxtjs/device';
import { Contract } from 'web3-eth-contract';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { IProviderOptions } from 'web3modal/dist/helpers/types';
import { RootState } from '.';
import { abi } from '~/constants/abi';

// @ts-ignore
import MetamaskLogoData from '~/assets/svg/metamask.svg';

declare let window: any;

interface WalletData {
  BNB: number;
  address: string;
}
export type WalletProvider = () => any;
export interface ConnectWalletOptions {
  toggleModal: boolean;
  idConnect: string;
}

export type MarketContractInstance = () => Contract | undefined;

export interface WalletContractsInterface {
  marketInstance: MarketContractInstance;
}

interface InitialWalletStateInterface {
  defaultProvider: string;
  contractOwnerAddress: string[];
  provider: WalletProvider;
  contractAddress: string;
  providerName: string;
  web3: () => Web3 | undefined;
  web3Modal?: Web3Modal;
  contracts: WalletContractsInterface;
  privateKey: string;
  privateKeyBuffer: string;
  walletData: WalletData;
  refWalletAddress: string;
  networkId: number | null;
  isMetamaskAvailable: boolean;
  isWalletConnectAvailable: boolean;
  isBinanceSmartChainWalletAvailable: boolean;
  metamaskInstallationLink: string;
}
export const state = (): InitialWalletStateInterface => ({
  // defaultProvider: 'https://data-seed-prebsc-2-s2.binance.org:8545',
  contractOwnerAddress: [
    '0x9b74FDe50F3FcD3A02FaFEA6A187092630D6EB8f',
    '0xe1c50D6B319D1AAE13FF8261FaEe8aA591AE23aD',
  ],
  defaultProvider: 'https://bsc-dataseed.binance.org',
  provider: () => null,
  contractAddress: '',
  providerName: '',
  web3: () => undefined,
  contracts: {
    marketInstance: () => undefined,
  },
  privateKey: '',
  privateKeyBuffer: '',
  refWalletAddress: '',
  walletData: {
    BNB: 0,
    address: '',
  },
  networkId: null,
  isMetamaskAvailable: false,
  isWalletConnectAvailable: false,
  isBinanceSmartChainWalletAvailable: false,
  metamaskInstallationLink: '',
});

const providerOptions = (
  infuraId: string,
  networkId: number
): IProviderOptions => ({
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId,
      chainId: networkId,
      bridge: 'https://bridge.walletconnect.org',
      rpc: {
        // [networkId]: 'https://data-seed-prebsc-2-s2.binance.org:8545',
        [networkId]: 'https://bsc-dataseed.binance.org',
      },
    },
  },
  'custom-metamaskwallet': {
    display: {
      logo: MetamaskLogoData,
      name: 'MetaMask',
      description: 'Connect to your Metamask wallet',
    },
    package: null, // for metamask
    connector: async (_, _options) => {
      let provider = null;
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.enable();
        provider = window.ethereum;
      } else if (window.web3) {
        provider = window.web3.currentProvider;
      } else {
        throw new Error('No Web3 Provider found');
      }
      return Promise.resolve(provider);
    },
  },
  'custom-binancechainwallet': {
    display: {
      logo: MetamaskLogoData,
      name: 'Binance Chain Wallet',
      description: 'Connect to your Binance Chain Wallet',
    },
    package: true,
    connector: async () => {
      let provider = null;
      if (typeof window.BinanceChain !== 'undefined') {
        provider = window.BinanceChain;
        try {
          await provider.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          throw new Error('User Rejected');
        }
      } else {
        throw new TypeError('No Binance Chain Wallet found');
      }
      return provider;
    },
  },
});

export type WalletState = ReturnType<typeof state>;

export const getters: GetterTree<WalletState, RootState> = {
  web3(state): () => Web3 | undefined {
    return state.web3;
  },
  defaultProvider(state): string {
    return state.defaultProvider;
  },
  provider(state): () => any {
    return state.provider;
  },
  contracts(state) {
    return state.contracts;
  },
  contractInstance(state): () => any | null {
    return state.contracts?.marketInstance;
  },
  contractAddress(state): string {
    return state.contractAddress;
  },
  contractOwnerAddress(state): string[] {
    return state.contractOwnerAddress;
  },
  walletAddress(state): string {
    return (state.walletData.address || '').toLowerCase();
  },

  walletAddressSlice(state): string {
    return state.walletData.address?.slice(2) || '';
  },

  isMetamaskInstalled(_state): boolean {
    return Boolean(
      process.browser &&
        (window as any)?.ethereum &&
        (window as any).ethereum.isMetaMask
    );
  },
  isMetamaskAvailable(state): boolean {
    return state.isMetamaskAvailable;
  },
  isBinanceSmartChainWalletAvailable(state): boolean {
    return state.isBinanceSmartChainWalletAvailable;
  },
  isWalletConnectAvailable(state): boolean {
    return state.isWalletConnectAvailable;
  },
  refWalletAddress(state): string {
    return state.refWalletAddress;
  },
};
export const mutations: MutationTree<WalletState> = {
  SET_WALLET_STATE(state, data: Partial<InitialWalletStateInterface>) {
    Object.assign(state, data);
  },
  SET_CONTRACT_ADDRES(state, addressContract: string) {
    state.contractAddress = addressContract;
  },
  SET_METAMASK_INSTALLATION_LINK(state, device: Device) {
    state.metamaskInstallationLink = '';
    if (device.isAndroid) {
      state.metamaskInstallationLink =
        'https://play.google.com/store/apps/details?id=io.metamask';
    }
    if (device.isIos) {
      state.metamaskInstallationLink =
        'https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202';
    }
    if (device.isDesktop) {
      state.metamaskInstallationLink = 'https://metamask.io/download.html';
    }
  },
  SET_WEB3(state, web3: () => Web3 | undefined) {
    Object.assign(state, { web3 });

    const Contract = web3()?.eth.Contract;

    if (Contract) {
      const marketContract = new Contract(
        abi,
        (this.$config as any).marketContract
      );
      Object.assign(state.contracts, {
        marketInstance: () => marketContract,
      });
    }
  },
  SET_NETWORK_ID(state, networkId: number) {
    state.networkId = networkId;
  },
  SET_WALLET_DATA(state, data: Partial<WalletData>) {
    Object.assign(state.walletData, { ...data });
  },
  SET_REF_WALLET_DATA(state, refWalletAddress: string) {
    state.refWalletAddress = refWalletAddress;
  },
  INIT_WEB3_MODAL(state) {
    // https://github.com/Web3Modal/web3modal#web3modal
    state.web3Modal = new Web3Modal({
      cacheProvider: true,
      disableInjectedProvider: false,
      providerOptions: providerOptions(
        (this.$config as any).infuraId,
        (this.$config as any).networkId
      ),
      // cacheProvider: false,
      // disableInjectedProvider: true,
    });
  },
  SET_PROVIDER_NAME(state, providerName: string) {
    state.providerName = providerName;
  },
};
export const actions: ActionTree<WalletState, RootState> = {
  init({ commit }) {
    commit('INIT_WEB3_MODAL');
  },
  async initConnect({ commit, getters }) {
    commit('SET_WALLET_STATE');
    // @ts-ignore
    commit('SET_CONTRACT_ADDRES', (this.$config as any).marketContract);
    const defaultProvider = getters.defaultProvider;
    const web3 = new Web3(defaultProvider);
    commit('SET_WEB3', () => web3);
    const networkId = await web3.eth.getChainId();
    commit('SET_NETWORK_ID', networkId);
  },

  async connectWallet({ state, commit, dispatch }, data: ConnectWalletOptions) {
    const { toggleModal, idConnect } = data;
    if (!state.web3Modal) {
      await dispatch('init');
    }
    if (!state.web3Modal) {
      commit('SET_ERROR', 'web3Modal undefined');
      return;
    }
    let provider: any;
    try {
      // connect to the specific provider
      provider = await state.web3Modal.connectTo(idConnect);

      if (toggleModal) {
        // close the modal for choosing the wallet
        await state.web3Modal.toggleModal();
      }
      if (provider.enable) {
        await provider.enable();
      }
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('Could not get a wallet connection', e);
      if (e && e?.message) {
        commit('SET_ERROR', e.message);
      }
      return;
    }

    if (provider.wc) {
      const connector = provider.wc;
      if (!connector.connected) {
        // create new session
        try {
          await connector.createSession();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log('create new session', err);
        }
      }
    }

    commit('SET_PROVIDER_NAME', idConnect); // state.web3Modal.cachedProvider);
    commit('SET_WALLET_STATE', {
      provider: () => provider,
    });

    await dispatch('subscribeProvider');

    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();

    const address = accounts[0].toLowerCase();
    const networkId = await web3.eth.getChainId();
    const value = await web3.eth.getBalance(address);
    const ballance = web3.utils.fromWei(value, 'ether');

    commit('SET_WEB3', () => web3);
    commit('SET_WALLET_DATA', { BNB: ballance, address });

    dispatch('setNetworkId', networkId);
  },

  async metamaskConnect({ dispatch }) {
    if (
      process.browser &&
      !getters.isMetamaskInstalled &&
      getters.metamaskInstallationLink
    ) {
      window.open(getters.metamaskInstallationLink, '_blank');
    } else {
      await dispatch('connectWallet', {
        idConnect: 'custom-metamaskwallet',
      });
    }
  },
  async bscConnect({ dispatch }) {
    if (
      process.browser &&
      !getters.isMetamaskInstalled &&
      getters.metamaskInstallationLink
    ) {
      window.open(getters.metamaskInstallationLink, '_blank');
    } else {
      await dispatch('connectWallet', {
        idConnect: 'custom-binancechainwallet',
      });
    }
  },

  async walletConnect({ dispatch }) {
    await dispatch('connectWallet', {
      idConnect: 'walletconnect',
    });
  },

  async updateAccountAssets({ state, commit }): Promise<void> {
    if (!state.web3 || typeof state.web3 !== 'function') {
      return;
    }
    // take the signed user address
    const address = state.walletData.address;
    if (address) {
      const value = await state.web3()?.eth.getBalance(address);
      const ballance = value ? state.web3()?.utils.fromWei(value, 'ether') : 0;
      commit('SET_WALLET_DATA', { BNB: ballance, address });
    }
  },
  subscribeProvider({ state, commit, dispatch }) {
    const provider = state.provider;
    if (!provider()?.on) {
      // console.log('provider is not defined');
      return;
    }

    // Subscribe to provider connection, metamask doesn't supports
    provider().on('connect', async (_payload: any) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>> connect event', _payload);
      await dispatch('updateAccountAssets');
    });

    // Subscribe to provider disconnection
    provider().on('disconnect', (_error: Error) => {
      // console.log('disconnect', _error);
      dispatch('disconnectWallet', true);
    });

    provider().on('close', () => {
      // console.log('close');
      dispatch('disconnectWallet', true);
    });

    provider().on('accountsChanged', async (accounts: any) => {
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>  accountsChanged', accounts);
      if (accounts && accounts[0]) {
        const userAddress = accounts[0].toLowerCase();
        // clear current signature
        await commit('SET_WALLET_DATA', {
          address: userAddress,
        });
        await dispatch('updateAccountAssets');
      } else {
        // disconnect
        await dispatch('disconnectWallet');
      }
    });

    provider().on('changeNetwork', (networkId: number) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>  changeNetwork', networkId);
      dispatch('setNetworkId', networkId);
    });

    provider().on('chainChanged', (chainId: number) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>  chainChanged', chainId);
      dispatch('setNetworkId', Web3.utils.hexToNumber(chainId));
    });
  },

  setRefWalletAddress({ commit }, refWalletAddress) {
    commit('SET_REF_WALLET_DATA', refWalletAddress);
  },

  setNetworkId({ commit }, networkId) {
    commit('SET_NETWORK_ID', networkId);
  },

  checkWallets({ commit }, device: Device) {
    commit('SET_METAMASK_INSTALLATION_LINK', device);
    if (device.isDesktop) {
      commit('SET_WALLET_STATE', {
        isMetamaskAvailable: true,
        isWalletConnectAvailable: true,
        isBinanceSmartChainWalletAvailable: true,
      });
    } else {
      commit('SET_WALLET_STATE', {
        isWalletConnectAvailable: true,
      });
    }
  },
};
