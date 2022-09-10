module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'function-calc-no-unspaced-operator': null,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', '::v-deep'],
      },
    ],
    'no-descending-specificity': null,
    'length-zero-no-unit': null,
    'selector-pseudo-element-colon-notation': null,
  },
};
