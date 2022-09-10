<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api';

interface Props {
  isDisabled: boolean;
}

export default defineComponent({
  props: {
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props: Props, context) {
    const disabledProps = ref(props.isDisabled);

    watch(
      () => props.isDisabled,
      (state, _prevState) => {
        disabledProps.value = state;
      }
    );

    const buttonHandler = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      context.emit('buttonHandler', e);
    };
    return {
      buttonHandler,
      disabledProps,
    };
  },
});
</script>

<template>
  <button
    class="btn"
    :disabled="disabledProps"
    @click="(event) => buttonHandler(event)"
  >
    <slot></slot>
  </button>
</template>

<style lang="scss" src="./button.scss"></style>
