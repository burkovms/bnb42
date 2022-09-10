<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useStore,
  watch,
} from '@nuxtjs/composition-api';
import { CardStatusEnum } from '~/types/enum/cardStatus.enum';
import { CardResponseDto } from '~/dto/card.response.dto';

interface Props {
  publicKey: String;
  card: CardResponseDto;
}

export default defineComponent({
  props: {
    publicKey: {
      type: String,
      required: true,
    },
    card: {
      type: Object,
      required: true,
    },
  },
  setup(props: Props, context) {
    const store = useStore();
    const publicKeyProps = ref(props.publicKey);
    const cardProps = ref(props.card);
    const investValue = ref();

    watch(
      () => props.publicKey,
      (state, _prevState) => {
        publicKeyProps.value = state;
      }
    );

    watch(
      () => props.card,
      (state, _prevState) => {
        cardProps.value = state;
      }
    );

    const investHandler = async (): Promise<void> => {
      const txHash = await store.dispatch(
        'cards/investHandler',
        investValue.value
      );
      context.emit('txHash', {
        txHash,
      });
    };

    const withdrawHandler = async (packetId: string): Promise<void> => {
      const txHash = await store.dispatch('cards/withdrawHandler', packetId);
      context.emit('txHash', {
        txHash,
      });
    };

    const cardStatus = computed(
      () =>
        `${cardProps.value.status
          .charAt(0)
          .toUpperCase()}${cardProps.value.status.slice(1)}`
    );

    const ifShowButton = computed(() => {
      const isShowBtnWhenComplete = ref(false);
      if (cardProps.value.status === CardStatusEnum.complete) {
        // @ts-ignore
        const BNValueOne = cardProps.value.data[2].value;
        // @ts-ignore
        const stringValueTwo = cardProps.value.data[3].value.toString();
        const BNValueTwo = parseInt(stringValueTwo, 10);
        if (BNValueTwo < BNValueOne) {
          isShowBtnWhenComplete.value = true;
        }
      }

      return (
        publicKeyProps.value.length !== 0 &&
        (cardProps.value.status !== CardStatusEnum.complete ||
          isShowBtnWhenComplete.value)
      );
    });

    return {
      cardStatus,
      cardProps,
      CardStatusEnum,
      ifShowButton,
      investValue,
      investHandler,
      withdrawHandler,
    };
  },
});
</script>

<template>
  <div class="card" :class="`card--${cardProps.status}`">
    <template
      v-if="
        cardProps.status === CardStatusEnum.active ||
        cardProps.status === CardStatusEnum.complete
      "
    >
      <div class="card__header">{{ cardStatus }}</div>

      <div class="card__content">
        <ul class="card-list card__list">
          <li
            v-for="(item, index) in cardProps.data"
            :key="index"
            class="card-list__item"
          >
            <ViewCardList :data="item" />
          </li>
        </ul>
      </div>

      <div class="card__footer">
        <ul v-if="cardProps.result" class="card-list card__list">
          <li
            v-for="(item, index) in cardProps.result"
            :key="index"
            class="card-list__item"
          >
            <ViewCardList :data="item" />
          </li>
        </ul>
        <SharedButton
          v-if="ifShowButton"
          class="card__button btn-dark"
          @buttonHandler="withdrawHandler(cardProps.id)"
        >
          Withdraw
          <svg-icon name="download" class="icon--download" />
        </SharedButton>
      </div>
    </template>

    <template v-else-if="cardProps.status === CardStatusEnum.empty">
      <div class="card__empty">
        <span>your <span class="card__empty-color">future</span></span>
        investment
      </div>
    </template>

    <template v-else>
      <div class="card__open">
        <div class="card__content">
          <div class="card__title">Get 20% daily</div>
          <div class="card__sub-title">200% AFTER 10 DAYS</div>

          <div class="card__calculate invest-action invest-action--mod1">
            <div class="invest-action__element">
              <input
                v-model="investValue"
                type="number"
                class="invest-action__input"
                placeholder="0.01"
                autocomplete="off"
              />
              <span class="invest-action__input-сoin">BNB</span>
            </div>
            <div class="invest-action__element">
              <SharedButton
                class="invest-action__button"
                @buttonHandler="investHandler"
              >
                Invest
                <svg-icon name="activity" class="icon--activity" />
              </SharedButton>
            </div>
          </div>
        </div>

        <div class="card__footer">
          <ul v-if="cardProps.result" class="card-list card__list">
            <li
              v-for="(item, index) in cardProps.result"
              :key="index"
              class="card-list__item"
            >
              <ViewCardList :data="item" />
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" src="./index.scss"></style>
