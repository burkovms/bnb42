<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  useStore,
  watch,
} from '@nuxtjs/composition-api';
import { getFormatDate } from '~/utils/dateTime.helper';

interface Props {
  publicKey: string;
}

export default defineComponent({
  props: {
    publicKey: {
      type: String,
      required: true,
    },
  },
  setup(props: Props) {
    const store = useStore();
    const currentWallet = ref(props.publicKey);
    const isDialogOpen = ref(false);
    const isSwitchChecked = ref(false);
    const withdrawalsList = ref();

    const investmentsList = [
      {
        desc: 'Total Invested',
        key: 'totalInvested',
      },
      {
        desc: 'Total Dividends Paid',
        key: 'earned',
      },
      {
        desc: 'Total Ref. Reward',
        key: 'refReward',
      },
    ];

    let intervalId = NaN;

    watch(
      () => props.publicKey,
      async (state, _prevState) => {
        currentWallet.value = state;
        await getMyInvestments();
      }
    );

    const showDialog = () => {
      isDialogOpen.value = true;
      document.body.classList.add('no-scroll');
    };

    const toggleSwitch = (e: InputEvent): void => {
      const target = e.target as HTMLInputElement;
      isSwitchChecked.value = target?.checked;
    };

    const getMyInvestments = async () => {
      await store.dispatch('cards/myInvestments');
    };

    const formatDate = (date: number): string | number =>
      date ? getFormatDate(new Date(date), 'dd.LL.yyyy HH:mm:ss') : date;

    const activePacketsCount = computed(
      () => store.getters['cards/activePackets']
    );

    const completePacketsCount = computed(
      () => store.getters['cards/completePackets']
    );

    const dataInvestment = computed(() => {
      const data = store.getters['cards/myInvestments'];
      const modifiedData = {} as any;
      for (const prop in data) {
        modifiedData[prop] = parseFloat(data[prop]).toFixed(4);
      }

      return modifiedData;
    });

    const modalData = computed(() => {
      if (isDialogOpen.value === true) {
        const setWithdrawals = async () => {
          withdrawalsList.value = await setDataWithdrawals.value;

          withdrawalsList.value.map((item: any) => {
            item.amount = parseFloat(item.amount).toFixed(6);
            return item;
          });
        };
        setWithdrawals();
      }
      return isDialogOpen.value;
    });

    const setDataWithdrawals = computed(() => {
      if (isDialogOpen.value === true) {
        const getModalData = async () => {
          return await store.dispatch('cards/getWithdrawals');
        };
        return getModalData();
      }
    });

    onMounted(async () => {
      await getMyInvestments();
    });

    onBeforeMount(() => {
      if (process.browser) {
        intervalId = window.setInterval(async () => {
          await getMyInvestments();
        }, 10000);
      }
    });
    onBeforeUnmount(() => {
      window.clearInterval(intervalId);
    });

    return {
      isDialogOpen,
      isSwitchChecked,
      investmentsList,
      dataInvestment,
      currentWallet,
      withdrawalsList,
      activePacketsCount,
      completePacketsCount,
      modalData,
      formatDate,
      showDialog,
      toggleSwitch,
    };
  },
});
</script>

<template>
  <div class="container">
    <div class="investments-total">
      <h2>My Investments</h2>
      <div class="investments-total__wrapper">
        <div class="investments-total__row">
          <div
            v-for="(item, index) in investmentsList"
            :key="index"
            class="investments-total__col"
          >
            <div class="investments-total__item">
              <h6>{{ item.desc }}</h6>
              <div class="investments-total__item-value">
                <span>{{ dataInvestment[item.key] }} BNB</span>
                <div class="card-list__logo">
                  <svg-icon name="bnb-logo" class="icon--bnb-logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="investments-total__switch-item">
          <ul>
            <li :class="{ active: !isSwitchChecked }">Active</li>
            <li :class="{ active: isSwitchChecked }">Complete</li>
          </ul>
          <div class="switch">
            <input type="checkbox" @change="toggleSwitch" />
            <span></span>
          </div>
        </div>
        <div class="investments-total__bottom">
          <ul class="investments-total__bottom-info">
            <li>
              <span class="investments-total__bottom-name">Active:&nbsp;</span>
              <span class="investments-total__bottom-value text-gradient">{{
                activePacketsCount
              }}</span>
            </li>
            <li>
              <span class="investments-total__bottom-name"
                >Complete:&nbsp;</span
              >
              <span class="investments-total__bottom-value text-gradient">{{
                completePacketsCount
              }}</span>
            </li>
          </ul>
          <div class="investments-total__bottom-link">
            <a
              href="#"
              class="btn-link btn-link__lg"
              @click.prevent="showDialog"
            >
              My Withdrawals
              <SvgIcon name="arrow-up" class="icon--arrow-up" />
            </a>
          </div>
        </div>
      </div>

      <!-- DIALOG -->
      <ViewDialog v-if="modalData" v-model="isDialogOpen">
        <template #title>My Withdrawals</template>
        <div class="popup-list__cover">
          <div class="popup-list">
            <div
              v-for="item in withdrawalsList"
              :key="item.id"
              class="popup-list__item"
            >
              <div class="popup-list__item-name-cover">
                <div class="popup-list__item-name">BNB {{ item.name }}:</div>
                <div class="popup-list__item-total">
                  <span class="text-gradient">{{ item.amount }} BNB</span>
                  <div class="card-list__logo">
                    <svg-icon name="bnb-logo" class="icon--bnb-logo" />
                  </div>
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
    </div>
    <ViewCardWrapper :public-key="currentWallet" :status="isSwitchChecked" />
  </div>
</template>

<style scoped lang="scss" src="./index.scss"></style>
