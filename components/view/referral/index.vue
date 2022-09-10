<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  reactive,
  ref,
  useStore,
  watch,
} from '@nuxtjs/composition-api';
import Web3 from 'web3';
import { getFormatDate } from '~/utils/dateTime.helper';
import { publicKeyShortenerHelper } from '~/utils/publicKeyShortener.helper';

interface Props {
  publicKey: String;
}

export default defineComponent({
  props: {
    publicKey: {
      type: String,
      required: true,
    },
  },
  setup(props: Props, context) {
    const store = useStore();
    const currentWallet = ref(props.publicKey);
    const isDialogOpen = ref(false);
    const availableReward = ref('0');
    const totalData = reactive({
      referals: 0,
      amount: '0',
    });
    const levelListData = ref();
    const referralRewards = ref();

    let intervalId = NaN;

    watch(
      () => props.publicKey,
      async (state, _prevState) => {
        currentWallet.value = state;
        await store.dispatch('cards/referralsRewardsByLevels');
        await totalRefRewards();
      }
    );

    const totalRefRewards = async () => {
      const totalRefRewards = await store.dispatch('cards/getTotalRefRewards');
      availableReward.value = parseFloat(
        Web3.utils.fromWei(totalRefRewards, 'ether')
      ).toFixed(4);
    };

    const showDialog = () => {
      isDialogOpen.value = true;
      document.body.classList.add('no-scroll');
    };

    const copyHandler = (): void => {
      if (process.browser && window) {
        const value = `${location.protocol}//${location.host}/?ref=${currentWallet.value}`;
        const textarea = context.refs.copyData;
        // @ts-ignore
        textarea?.value = value;
        // @ts-ignore
        textarea?.select();
        try {
          const successful = document.execCommand('copy');
          const msg = successful ? 'successful' : 'unsuccessful';
          // eslint-disable-next-line no-console
          console.info(`Link ${value} copied ${msg} to clipboard`);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Unable to copy link into clipboard!');
        }
        window.getSelection()?.removeAllRanges();
      }
    };

    const collectedHandler = async (): Promise<void> => {
      await store.dispatch('cards/collectedHandler');
    };

    const levelToRender = (level: number) => {
      let levelStr;
      switch (level) {
        case 1:
          levelStr = '1st';
          break;
        case 2:
          levelStr = '2nd';
          break;
        case 3:
          levelStr = '3d';
          break;
      }
      return levelStr;
    };

    const isVisibleBlock = computed(() => {
      return currentWallet.value.length !== 0;
    });

    const getData = computed(() => {
      levelListData.value = store.getters['cards/referals'];
      const data: Array<any> = [];

      [...levelListData.value].forEach((item: any) => {
        data.push({
          ...item,
          amount: parseFloat(Web3.utils.fromWei(item.amount, 'ether')).toFixed(
            4
          ),
        });
      });

      const totals = [...data].reduce((acc: any, cur: any) => ({
        amount: (parseFloat(acc.amount) + parseFloat(cur.amount)).toFixed(4),
        referalCount:
          parseFloat(acc.referalCount) + parseFloat(cur.referalCount),
      }));

      totalData.amount = totals.amount;
      totalData.referals = totals.referalCount;

      return data;
    });

    // modal dialog
    const modalData = computed(() => {
      if (isDialogOpen.value === true) {
        const setReferralRewards = async () => {
          const data = await setDataReferralRewards.value;
          referralRewards.value = data.map((item: any) => {
            item.value = parseFloat(item.value).toFixed(4);
            return item;
          });
        };
        setReferralRewards();
      }
      return isDialogOpen.value;
    });

    const setDataReferralRewards = computed(() => {
      if (modalData) {
        const getModalData = async () => {
          return await store.dispatch('cards/getReferrals');
        };
        return getModalData();
      }
    });

    const shortWallet = (wallet: string): string => {
      return publicKeyShortenerHelper(wallet);
    };

    const formatDate = (date: number): string | number =>
      date ? getFormatDate(new Date(date), 'dd.LL.yyyy') : date;

    const getUrl = (wallet: string): string => {
      if (wallet !== '') {
        return `${window.location.protocol}//${
          window.location.host
        }/?ref=${shortWallet(wallet)}`;
      } else return '';
    };

    onBeforeMount(() => {
      if (process.browser) {
        intervalId = window.setInterval(async () => {
          await totalRefRewards();
        }, 10000);
      }
    });
    onBeforeUnmount(() => {
      window.clearInterval(intervalId);
    });
    return {
      isDialogOpen,
      getData,
      totalData,
      currentWallet,
      isVisibleBlock,
      availableReward,
      levelToRender,
      referralRewards,
      modalData,
      formatDate,
      shortWallet,

      collectedHandler,
      showDialog,
      copyHandler,

      getUrl,
    };
  },
});
</script>

<template>
  <section class="referal-rewards">
    <div class="container">
      <h2>Referral Rewards</h2>
    </div>
    <div class="container">
      <img
        class="referal-rewards__bg"
        src="@/static/referral.svg"
        alt="referral"
      />
      <!-- referal-link -->
      <div class="referal-rewards__wrapper">
        <div class="referal-link referal-rewards__referal-link">
          <div class="referal-link__info">
            <div class="referal-link__title">Your referral link:</div>
            <div class="referal-link__address">
              <textarea
                ref="copyData"
                v-model="currentWallet"
                style="position: absolute; width: 0; height: 0; opacity: 0"
              ></textarea>
              <span class="referal-link__address-long">{{
                getUrl(currentWallet)
              }}</span>
              <span class="referal-link__address-short">
                {{ getUrl(currentWallet) }}
              </span>
            </div>
          </div>
          <button
            class="btn referal-link__button"
            :disabled="!isVisibleBlock"
            @click.stop.prevent="copyHandler"
          >
            Copy
            <SvgIcon name="copy" class="icon--copy" />
          </button>
        </div>
        <!-- referal-list -->
        <div class="referal-list referal-rewards__referal-list">
          <ul>
            <li
              v-for="item in getData"
              :key="item.level"
              class="referal-list__item"
            >
              <div class="referal-list__text">
                <span>{{ levelToRender(item.level) }} level</span>
                &nbsp;
                <span class="text-gradient">({{ item.persent }}%)</span>
              </div>
              <div class="referal-list__text">
                <span>{{ item.referalCount }} Referrals</span>
                &nbsp;/&nbsp;
                <span class="text-gradient">{{ item.amount }} BNB</span>
                <div class="card-list__logo">
                  <svg-icon name="bnb-logo" class="icon--bnb-logo" />
                </div>
              </div>
            </li>
          </ul>
          <div class="referal-list__total">
            <div class="name text-gradient">Total:</div>
            <div class="referal-list__text">
              <span>{{ totalData.referals }} Referrals</span>
              &nbsp;/&nbsp;
              <span class="text-gradient">{{ totalData.amount }} BNB</span>
              <div class="card-list__logo">
                <svg-icon name="bnb-logo" class="icon--bnb-logo" />
              </div>
            </div>
          </div>
        </div>

        <div class="referal-rewards__bottom">
          <div class="referal-rewards__bottom-item">
            <div class="referal-rewards__bottom-item-left">
              <div class="name">Available reward:</div>
              <div class="referal-rewards__bottom-item-text">
                <span class="text-gradient">{{ availableReward }} BNB</span>
                <div class="card-list__logo">
                  <svg-icon name="bnb-logo" class="icon--bnb-logo" />
                </div>
              </div>
            </div>
            <div class="referal-rewards__bottom-item-right">
              <SharedButton
                class="referal-link__button"
                :is-disabled="!isVisibleBlock"
                @buttonHandler="collectedHandler"
              >
                Collect
                <SvgIcon name="collect" class="icon--collect" />
              </SharedButton>
            </div>
          </div>
          <div class="referal-rewards__bottom-item">
            <div class="referal-rewards__bottom-item-left">
              <div class="name">Referral rewards statistics</div>
            </div>
            <div class="referal-rewards__bottom-item-right">
              <button
                class="btn referal-link__button"
                :disabled="!isVisibleBlock"
                @click="showDialog"
              >
                Click to see
                <SvgIcon name="arrow-up" class="icon--arrow-up" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- DIALOG -->
    <ViewDialog v-if="modalData" v-model="isDialogOpen" class="popup-referral">
      <template #title>Referral rewards statistics</template>
      <div class="popup-list__cover">
        <div class="popup-list">
          <div
            v-for="item in referralRewards"
            :key="item.id"
            class="popup-list__item"
          >
            <div class="popup-list__item-name-cover">
              <div class="popup-list__item-name">{{ item.name }}</div>
              <div class="popup-list__item-wallet">
                {{ shortWallet(item.wallet) }}
              </div>
            </div>
            <div class="popup-list__item-total">
              <div class="name">Reward:</div>
              <div class="popup-list__item-total-cover">
                <span class="text-gradient"
                  >{{ item.value }} {{ item.coin }}</span
                >
                <div class="card-list__logo">
                  <svg-icon name="bnb-logo" class="icon--bnb-logo" />
                </div>
                <!-- <div v-if="item.checked" class="popup-list__item-checked">
                  <SvgIcon name="check" class="icon--check" />
                </div> -->
              </div>
            </div>
            <div class="popup-list__item-date">
              <div>Date:</div>
              <div class="popup-list__item-date-cover">
                <span>{{ formatDate(item.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ViewDialog>
  </section>
</template>

<style scoped lang="scss" src="./index.scss"></style>
