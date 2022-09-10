<template>
  <transition name="fade">
    <div v-if="value" class="popup" @click="closePopup">
      <div class="popup__wrap" @click.stop>
        <div class="btn-close popup__close" @click="closePopup">
          <SvgIcon name="close" class="icon--close" />
        </div>
        <div class="popup__wrap-header">
          <slot name="title"></slot>
        </div>
        <div class="popup__wrap-main">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    confirm() {
      this.$emit('confirm');
      this.$emit('input', false);
    },
    closePopup() {
      this.$emit('close');
      this.$emit('input', false);
      document.body.classList.remove('no-scroll');
    },
    escKeyUp(event) {
      if (event.code === 'Escape') {
        this.closePopup();
      }
    },
  },
};
</script>

<style scoped lang="scss" src="./index.scss"></style>
