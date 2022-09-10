<template>
  <footer>
    <p>Copyright © 2022 BNB42</p>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '~/assets/styles/variables.scss';

footer {
  border-top: 1px solid map-get($colors, 'black-200');
  padding: 32px 64px;
  text-align: center;
  margin-top: 62px;
  @media (max-width: $media_xl) {
    padding-left: 40px;
    padding-right: 40px;
  }
  @media (max-width: $media_lg) {
    padding-left: 32px;
    padding-right: 32px;
    margin-top: 0;
  }
  @media (max-width: $media_sm) {
    text-align: left;
    padding-left: 20px;
    padding-right: 20px;
  }
  p {
    color: map-get($colors, 'white-400');
    font-size: 12px;
    opacity: 0.85;
  }
}
</style>
