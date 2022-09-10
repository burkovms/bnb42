<template>
  <section class="faq">
    <div class="container">
      <h2>FAQ</h2>
      <div class="faq__wrapper">
        <div v-for="(item, index) in faq" :key="index" class="faq__item">
          <div class="faq__item-header">
            <div
              class="faq__item-question"
              :class="{ active: item.visible }"
              @click="toggleItem(item)"
            >
              <h6>{{ item.question }}</h6>
              <div class="faq__item-icons">
                <div v-if="item.visible" class="btn-close">
                  <SvgIcon name="close" class="icon--close" />
                </div>
                <div v-else class="faq__item-icon-arrow">
                  <SvgIcon name="arrow-up" class="icon--arrow-up" />
                </div>
              </div>
            </div>
          </div>
          <transition
            name="expand"
            mode="out-in"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
          >
            <div v-if="item.visible" class="faq__item-content">
              <div>{{ item.content }}</div>
            </div>
          </transition>
        </div>
      </div>
      <!-- <div class="more-questions">
        <a class="btn-link" href="#" target="_blank">
          More questions
          <SvgIcon name="info" class="icon--info" />
        </a>
      </div> -->
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      faq: [
        {
          visible: true,
          question: 'What is BNB42?',
          content:
            'BNB42 is a 100% decentralized investment platform that operates on the Binance Smart Chain. It is a totally autonomous service built on a Smart Contract, devoid of any outside interference, management, or impact.',
        },
        {
          visible: false,
          question: 'How to start earning with BNB42?',
          content:
            "To start earning with BNB42 you need to install MetaMask/Binance Wallet browser extension. Similar apps are also available for mobile and tablet use. You can find detailed information on installation on the wallet provider's website.",
        },
        {
          visible: false,
          question: 'How much can I earn by investing with BNB42?',
          content:
            'BNB42 allows you to earn 200% and double your investment in just 10 days. Just start an investment plan and see how your dividends grow. You can calculate your profit using the profitability calculator available on the website.',
        },
        {
          visible: false,
          question: 'How to start an investment plan?',
          content:
            'To start an investment plan, follow the «My investments» tab and enter the desired amount click «Invest». The dividend counter will immediately display your profit.',
        },
        {
          visible: false,
          question:
            "Is my deposit included in the dividend payments? Or I'm able to request to return it after 10 days?",
          content:
            'Your deposit is included in the daily return. During 10 days you will receive 100% of your investment amount + 100% of pure profit. Thus, you double the amount of your starting investment.',
        },
        {
          visible: false,
          question: 'How often can I withdraw my dividends?',
          content:
            'You can withdraw your dividends any time you like. Please, take into consideration the BSC network fee.',
        },
        {
          visible: false,
          question: 'Can I start several investment plans same time?',
          content:
            'There is no limit to starting as many investment plans as you wish. It will only increase your daily profit.',
        },
        {
          visible: false,
          question: 'Do you have a referral program?',
          content:
            'BNB42 provides an opportunity for each participant to earn extra income with our referral program. Share your referral link with your friends and get an additional 7%, 3%, and 1% referral rewards from the investments of invited users. You can find your referral link and additional information about each level in the «Referrals» section.',
        },
      ],
    };
  },
  methods: {
    toggleItem(item) {
      this.faq.forEach((i) => {
        if (i !== item) {
          i.visible = false;
        } else {
          item.visible = !item.visible;
        }
      });
    },
    enter(element) {
      const width = getComputedStyle(element).width;
      element.style.width = width;
      element.style.position = 'absolute';
      element.style.visibility = 'hidden';
      element.style.height = 'auto';
      const height = getComputedStyle(element).height;
      element.style.width = null;
      element.style.position = null;
      element.style.visibility = null;
      element.style.height = 0;
      // getComputedStyle(element).height;
      requestAnimationFrame(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = 'auto';
    },
    leave(element) {
      const height = getComputedStyle(element).height;
      element.style.height = height;
      // getComputedStyle(element).height;
      requestAnimationFrame(() => {
        element.style.height = 0;
      });
    },
  },
};
</script>

<style scoped lang="scss" src="./index.scss"></style>
