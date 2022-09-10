<script lang="ts">
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api';
import Web3 from 'web3';
import { CardData } from '~/dto/card.response.dto';
import { CardKeyListName } from '~/types/enum/cardKeyListName.enum';
import { getFormatDate } from '~/utils/dateTime.helper';

interface Props {
  data: CardData;
}

export default defineComponent({
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props: Props) {
    const dataProps = ref(props.data);

    watch(
      () => props.data,
      (state, _prevState) => {
        dataProps.value = state;
      }
    );

    const formatValue = computed(() =>
      dataProps.value?.key
        ? getFormatDate(new Date(dataProps.value.value), 'dd.LL.yyyy HH:mm:ss')
        : dataProps.value.value
    );

    const valueFromWei = computed(() => {
      const stringValue = dataProps.value.value.toString();
      return dataProps.value.name === CardKeyListName.available
        ? parseFloat(Web3.utils.fromWei(stringValue, 'ether')).toFixed(6)
        : parseFloat(Web3.utils.fromWei(stringValue, 'ether')).toFixed(6);
    });

    return {
      formatValue,
      dataProps,
      valueFromWei,
    };
  },
});
</script>

<template>
  <div class="card-list__wrapper" :data-key="dataProps.key">
    <div class="card-list__name">{{ dataProps.name }}</div>
    <div class="card-list__data">
      <template v-if="dataProps.сoin">
        <div class="card-list__value">
          {{ valueFromWei }}
          <span>{{ dataProps.сoin }}</span>
        </div>
        <div class="card-list__logo">
          <svg-icon name="bnb-logo" class="icon--bnb-logo" />
        </div>
      </template>
      <template v-else>
        <div class="card-list__value">
          {{ formatValue }}
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" src="./index.scss"></style>
