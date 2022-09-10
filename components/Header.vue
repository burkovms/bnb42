<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  reactive,
  useStore,
  useContext,
} from '@nuxtjs/composition-api';
import { Device } from '@nuxtjs/device';
import { publicKeyShortenerHelper } from '~/utils/publicKeyShortener.helper';

export default defineComponent({
  setup() {
    const { $device } = useContext();
    const store = useStore();
    const menu = ref(false);
    const dropdownWallet = ref(false);
    const view = reactive({
      topOfPage: true,
    });
    const menuList = [
      {
        name: 'My Investments',
        anchor: 'investments',
      },
      {
        name: 'Referral',
        anchor: 'referral',
      },
      {
        name: 'FAQ',
        anchor: 'faq',
      },
    ];

    const walletAddress = computed(() => {
      const address = store.getters['wallet/walletAddress'];
      return publicKeyShortenerHelper(address);
    });
    const isMetamaskAvailable = computed(() => {
      if (process.browser && window && window.ethereum) {
        return store.getters['wallet/isMetamaskAvailable'];
      } else {
        return false;
      }
    });
    const isWalletConnectAvailable = computed(
      () => store.getters['wallet/isWalletConnectAvailable']
    );

    const isContractOwnerAddress = computed(() => {
      const address = store.getters['wallet/walletAddress'].toLowerCase();
      const contractOwnerAddress: Array<string> = store.getters[
        'wallet/contractOwnerAddress'
      ].map((item: string) => item.toLowerCase());

      return contractOwnerAddress.some(
        (item, _index, _array) => item === address
      );
    });

    const isBinanceSmartChainWalletAvailable = computed(() => {
      // @ts-ignore
      if (process.browser && window && window.BinanceChain) {
        return store.getters['wallet/isBinanceSmartChainWalletAvailable'];
      } else {
        return false;
      }
    });

    const metamaskConnectHandler = async (): Promise<void> => {
      hideDropdownWallet();
      await store.dispatch('wallet/metamaskConnect');
    };

    const binanceChainConnectHandler = async (): Promise<void> => {
      hideDropdownWallet();
      await store.dispatch('wallet/bscConnect');
    };
    const walletConnectHandler = async (): Promise<void> => {
      hideDropdownWallet();
      await store.dispatch('wallet/walletConnect');
    };

    const ownerWithdrawalHandler = async (): Promise<void> => {
      hideMenu();
      await store.dispatch('cards/ownerWithdraw');
    };
    const ownerTurnoverHandler = async (): Promise<void> => {
      hideMenu();
      await store.dispatch('cards/ownerInvestInYourself');
    };

    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        if (view.topOfPage) view.topOfPage = false;
      } else if (!view.topOfPage) view.topOfPage = true;
    };
    const toggleMenu = () => {
      menu.value = !menu.value;
    };
    const toggleDropdownWallet = () => {
      dropdownWallet.value = !dropdownWallet.value;
    };
    const hideMenu = () => {
      if (menu.value) {
        menu.value = false;
      }
    };
    const hideDropdownWallet = () => {
      if (dropdownWallet.value) {
        dropdownWallet.value = false;
      }
    };
    const scrollAnchor = (item: any) => {
      const element = document.getElementById(item.anchor);
      const y = element!.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      toggleMenu();
    };

    onBeforeMount(async () => {
      await store.dispatch('wallet/checkWallets', $device as Device);
      window.addEventListener('load', handleScroll, true);
      window.addEventListener('scroll', handleScroll, true);
    });

    onBeforeUnmount(() => {
      if (process.browser && window) {
        window.removeEventListener('load', handleScroll, true);
        window.removeEventListener('scroll', handleScroll, true);
      }
    });
    return {
      menu,
      dropdownWallet,
      view,
      menuList,
      walletAddress,
      isMetamaskAvailable,
      isWalletConnectAvailable,
      isBinanceSmartChainWalletAvailable,
      isContractOwnerAddress,

      toggleMenu,
      toggleDropdownWallet,
      hideMenu,
      hideDropdownWallet,
      scrollAnchor,
      metamaskConnectHandler,
      binanceChainConnectHandler,
      walletConnectHandler,

      ownerWithdrawalHandler,
      ownerTurnoverHandler,
    };
  },
});
</script>

<template>
  <header :class="{ onScroll: !view.topOfPage }">
    <div class="header__wrapper">
      <div class="header__left">
        <div v-click-outside="hideMenu" class="menu">
          <div class="menu__burger" @click="toggleMenu">
            <SvgIcon name="menu" class="icon--menu" />
          </div>
          <transition name="dropdown">
            <div v-if="menu" class="dropdown">
              <div class="dropdown__top">
                <img class="dropdown__logo" src="@/static/logo.svg" alt="" />
                <div class="btn-close" @click="toggleMenu">
                  <SvgIcon name="close" class="icon--close" />
                </div>
              </div>
              <div class="dropdown__content">
                <ul class="dropdown__list">
                  <li v-for="(item, index) in menuList" :key="index">
                    <a
                      :href="'#' + item.anchor"
                      @click.prevent="scrollAnchor(item)"
                      >{{ item.name }}</a
                    >
                  </li>
                </ul>
                <template v-if="isContractOwnerAddress">
                  <div class="dropdown__btn-group">
                    <button
                      class="btn btn-purple"
                      @click="ownerWithdrawalHandler"
                    >
                      Withdraw
                    </button>
                    <button
                      class="btn btn-purple"
                      @click="ownerTurnoverHandler"
                    >
                      Invest
                    </button>
                  </div>
                </template>
                <ul class="socials">
                  <li>
                    <a href="https://twitter.com/bnb42i" target="_blank">
                      <SvgIcon name="twitter" class="icon--twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="https://t.me/bnb42invest" target="_blank">
                      <SvgIcon name="telegram" class="icon--telegram" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div class="header__center">
        <img class="logo" src="@/static/logo.svg" alt="Logo" />
      </div>
      <div class="header__right">
        <div v-click-outside="hideDropdownWallet">
          <template v-if="walletAddress">
            <button class="btn btn--connected" disabled>
              {{ walletAddress }}
            </button>
          </template>
          <template v-else>
            <button class="btn" @click="toggleDropdownWallet">
              Connect
              <SvgIcon name="wallet" class="icon--wallet" />
            </button>
          </template>
          <transition name="dropdown-wallet">
            <div v-if="dropdownWallet" class="dropdown">
              <div class="dropdown__top">
                <img class="dropdown__logo" src="@/static/logo.svg" alt="" />
                <div class="btn-close" @click="toggleDropdownWallet">
                  <SvgIcon name="close" class="icon--close" />
                </div>
              </div>
              <div class="dropdown__content">
                <h6>Connect Wallet</h6>
                <button
                  v-if="isMetamaskAvailable"
                  class="btn btn-purple"
                  @click="metamaskConnectHandler"
                >
                  MetaMask
                  <img src="@/static/metamask.svg" alt="" />
                </button>
                <button
                  v-if="isBinanceSmartChainWalletAvailable"
                  class="btn btn-purple"
                  @click="binanceChainConnectHandler"
                >
                  Binance Chain
                  <img src="@/static/binance.svg" alt="" />
                </button>
                <button
                  v-if="isWalletConnectAvailable"
                  class="btn btn-purple"
                  @click="walletConnectHandler"
                >
                  WalletConnect
                  <img src="@/static/walletconnect.svg" alt="" />
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import '~/assets/styles/variables.scss';

header {
  color: #fff;
  padding: 0 64px;
  border-bottom: 1px solid map-get($colors, 'black-200');
  position: fixed;
  z-index: 5;
  width: 100%;
  top: 0;
  left: 0;
  transition: 0.35s ease;
  @media (max-width: $media_xl) {
    padding: 0 40px;
  }
  @media (max-width: $media_lg) {
    padding: 0 32px;
  }
  @media (max-width: $media_sm) {
    padding: 0 20px;
  }
  &.onScroll {
    background-color: map-get($colors, 'black-200');
    border-color: rgba(229, 192, 149, 0.2);
  }
}

.header {
  &__wrapper {
    display: flex;
    min-height: 120px;
    transition: 0.35s ease;
    @media (max-width: $media_lg) {
      min-height: 82px;
    }
    @media (max-width: $media_sm) {
      justify-content: flex-end;
    }
    .onScroll & {
      min-height: 80px;
      @media (max-width: $media_lg) {
        min-height: 70px;
      }
    }
  }

  &__left {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    @media (max-width: $media_sm) {
      flex: 0 0 auto;
      justify-content: flex-end;
      max-width: none;
      order: 1;
      margin-left: 16px;
    }
  }

  &__center {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: $media_sm) {
      flex: 0 0 auto;
      max-width: none;
      flex-grow: 1;
      justify-content: flex-start;
    }
  }

  &__right {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    @media (max-width: $media_sm) {
      flex: 0 0 auto;
      justify-content: flex-end;
      max-width: none;
    }
    .dropdown {
      left: auto;
      right: 0;
      &__content {
        text-align: center;
        h6 {
          font-weight: 500;
          font-size: 24px;
          line-height: 30px;
          + .btn {
            margin-top: 32px;
          }
        }
        .btn {
          margin-left: auto;
          margin-right: auto;
          width: 246px;
          justify-content: space-between;
          padding-left: 32px;
          padding-right: 32px;
          img {
            width: 32px;
            height: 32px;
            flex: 0 0 auto;
            margin-left: 8px;
          }
          + .btn {
            margin-top: 8px;
          }
        }
      }
    }
    > div > {
      .btn {
        width: 192px;
        @media (max-width: $media_lg) {
          width: 144px;
          height: 48px;
        }
      }
    }
  }
}

.menu {
  &__burger {
    cursor: pointer;
    transition: 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    svg {
      display: block;
      @media (max-width: $media_sm) {
        position: relative;
        transform: scale(-1, 1);
      }
    }
    &:hover {
      .icon--menu {
        fill: #000;
        fill: map-get($colors, 'purple-100');
      }
    }
    .icon--menu {
      transition: 0.25s ease;
      width: 22px;
      height: 22px;
      fill: #fff;
    }
  }
}

.dropdown {
  background: map-get($bg-gradient, 'black');
  padding: 45px 32px 32px 32px;
  border-radius: 0 0 32px 32px;
  position: absolute;
  top: 0;
  left: 0;
  width: 438px;
  z-index: 1;
  transition: 0.25s ease;
  @media (max-width: $media_lg) {
    width: 400px;
    padding: 32px;
  }
  @media (max-width: $media_sm) {
    position: fixed;
    width: 100vw;
    padding: 15px 20px 30px;
  }
  @media (max-width: 370px) {
    padding-left: 20px;
    padding-right: 20px;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__content {
    margin-top: 30px;
  }
  &__btn-group {
    margin-top: 16px;
    .btn {
      width: 192px;
      @media (max-width: $media_lg) {
        width: 144px;
        height: 48px;
      }
    }
    * + .btn {
      margin-top: 8px;
    }
  }

  &__logo {
    width: 24px;
    height: 23px;
    @media (max-width: $media_sm) {
      width: 49px;
      height: 53px;
    }
  }

  &__list {
    li {
      a {
        font-weight: 500;
        font-size: 24px;
        line-height: 30px;
      }
      + li {
        margin-top: 24px;
      }
    }
  }

  .socials {
    display: none;
    @media (max-width: $media_md) {
      display: flex;
      margin-top: 24px;
      li {
        a {
          background: linear-gradient(
            180deg,
            #33363e 0%,
            #454a55 25%,
            #b895e5 75%,
            #a27ad5 100%
          );
          background-position: 0 0;
          background-size: 400% 400%;
          @media (min-width: 1024px) {
            &:hover {
              background-position: 0 100%;
            }
          }
          &:active {
            background-position: 0 100%;
          }
        }
      }
    }
  }
}

.dropdown-wallet-enter-active,
.dropdown-wallet-leave-active,
.dropdown-enter-active,
.dropdown-leave-active {
  transform: translateY(0);
}
.dropdown-wallet-enter,
.dropdown-wallet-leave-to,
.dropdown-enter,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.logo {
  display: block;
  margin: 0 auto;
  @media (max-width: $media_lg) {
    max-height: 53px;
  }
  @media (max-width: $media_sm) {
    margin: 0;
  }
}
</style>
