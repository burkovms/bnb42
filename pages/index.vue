<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  useStore,
} from '@nuxtjs/composition-api';

export default defineComponent({
  setup() {
    const store = useStore();

    const modalData = computed(() => store.getters['modal/activeModal']);
    const currentWallet = computed(() => store.getters['wallet/walletAddress']);

    onBeforeMount(async () => {
      const refWalletAddress = location.search.replace('?ref=', '');
      if (refWalletAddress !== '' && refWalletAddress !== '?ref') {
        store.dispatch('wallet/setRefWalletAddress', refWalletAddress);
      }

      await store.dispatch('wallet/initConnect');
    });

    return {
      currentWallet,
      modalData,
    };
  },
});
</script>

<template>
  <div class="page">
    <ViewMain id="main" />

    <section id="investments" class="investments">
      <ViewTotal :public-key="currentWallet" />
    </section>

    <ViewReferral id="referral" :public-key="currentWallet" />

    <ViewFaq id="faq" />
  </div>
</template>

<style lang="scss" src="./index.scss"></style>
