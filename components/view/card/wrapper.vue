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
import { CardStatusEnum } from '~/types/enum/cardStatus.enum';
import { cardList } from '~/api/card';

interface Props {
  publicKey: String;
  status: boolean;
}

export default defineComponent({
  props: {
    publicKey: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  setup(props: Props) {
    const store = useStore();
    const txHash = reactive({
      txHash: '',
    });
    const currentWallet = ref(props.publicKey);
    const statusProps = ref(props.status);
    const investCard = cardList()[0];
    const emptyCard = cardList()[1];
    let intervalId = NaN;

    watch(
      () => props.publicKey,
      async (state, _prevState) => {
        currentWallet.value = state;
        await getCardListData();
      }
    );
    watch(
      () => props.status,
      async (state, _prevState) => {
        statusProps.value = state;
        await getCardListData();
      }
    );
    watch(
      () => txHash.txHash,
      (_state, _prevState) => {
        setTimeout(async () => {
          await getCardListData();
        }, 5000);
      }
    );

    const getStatus = computed(() => {
      return statusProps.value
        ? CardStatusEnum.complete
        : CardStatusEnum.active;
    });

    const checkTxHash = async (hash: string): Promise<void> => {
      txHash.txHash = await hash;
    };

    const getCardListData = async () => {
      await store.dispatch('cards/getCardListData', getStatus.value);
    };

    onBeforeMount(async () => {
      await getCardListData();

      if (process.browser) {
        intervalId = window.setInterval(async () => {
          await getCardListData();
        }, 10000);
      }
    });

    onBeforeUnmount(() => {
      window.clearInterval(intervalId);
    });

    const cardListData = computed(() => store.getters['cards/list']);

    return {
      investCard,
      emptyCard,
      cardListData,
      currentWallet,
      checkTxHash,
    };
  },
});
</script>

<template>
  <div class="card-list-wrapper row">
    <div class="card-list-wrapper__col">
      <div class="card-list-wrapper__item">
        <ViewCard :card="investCard" :public-key="currentWallet" />
      </div>
    </div>
    <div
      v-for="(card, index) in cardListData"
      :key="index"
      class="card-list-wrapper__col"
    >
      <div class="card-list-wrapper__item">
        <ViewCard
          :card="card"
          :public-key="currentWallet"
          @txHash="checkTxHash"
        />
      </div>
    </div>
    <template v-if="cardListData.length === 0">
      <div class="card-list-wrapper__col">
        <div class="card-list-wrapper__item">
          <ViewCard :card="emptyCard" :public-key="currentWallet" />
        </div>
      </div>
      <div class="card-list-wrapper__col">
        <div class="card-list-wrapper__item">
          <ViewCard :card="emptyCard" :public-key="currentWallet" />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" src="./index.scss"></style>
