<script lang="ts">
import {
  defineComponent,
  useStore,
  ref,
  reactive,
  computed,
  onMounted,
} from '@nuxtjs/composition-api';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

interface CalculateDataInterface {
  amount: number | string;
  pHour: number | string;
  inHour: number | string;
  pDay: number | string;
  inDay: number | string;
}

export default defineComponent({
  setup() {
    const store = useStore();
    const marketAddress = computed(
      () =>
        // @ts-ignore
        `https://bscscan.com/address/${store.$config.marketContract}`
      // `https://testnet.bscscan.com/address/${store.$config.marketContract}`
    );
    const isDialogOpen = ref(false);
    const data = reactive({
      totalInvested: '0',
      investors: '0',
      myInvestments: {},
    });
    const calculateData = reactive<CalculateDataInterface>({
      amount: '',
      pHour: 0.0,
      inHour: 0.0,
      pDay: 0.0,
      inDay: 0.0,
    });

    const contractInstance = computed(
      () => store.getters['wallet/contractInstance']() as Contract
    );

    const showDialog = (): void => {
      isDialogOpen.value = true;
      document.body.classList.add('no-scroll');
    };

    const scrollAnchor = (): void => {
      const element = document.getElementById('investments');
      const y = element!.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    };

    const totalInvested = async (): Promise<void> => {
      const _totalInvested = await contractInstance.value.methods
        .totalInvest()
        .call();
      data.totalInvested = parseFloat(
        Web3.utils.fromWei(_totalInvested, 'ether')
      ).toFixed(2);
    };

    const investors = async (): Promise<void> => {
      data.investors = await contractInstance.value.methods
        .totalInvestors()
        .call();
    };

    const calculate = (_event: InputEvent, value: any) => {
      const _value = parseFloat(value);
      calculateData.amount = _value;
      calculateData.pHour = ((_value * 0.2) / 24).toFixed(4);
      calculateData.inHour = (((_value * 0.2) / 24) * 12).toFixed(4);
      calculateData.pDay = (_value * 0.2).toFixed(4);
      calculateData.inDay = (_value * 2).toFixed(4);
    };

    onMounted(async () => {
      await totalInvested();
      await investors();
    });

    return {
      data,
      marketAddress,
      calculateData,
      isDialogOpen,

      calculate,
      showDialog,
      scrollAnchor,
    };
  },
});
</script>

<template>
  <section class="main">
    <img class="main__effect-top" src="@/static/main-round-top.png" alt="" />

    <img
      class="main__effect-right"
      src="@/static/main-round-right.png"
      alt=""
    />

    <img
      class="main__effect-center"
      src="@/assets/svg/main-element-center.svg"
      alt=""
    />

    <div class="container main__container-img">
      <div class="main__video-cover">
        <img src="@/assets/svg/intro.svg" alt="intro" />
        <!-- <video
          class="main__video"
          autoplay
          preload="auto"
          src="@/static/video-main.mp4"
          muted="true"
          loop="true"
        >
          <source
            src="@/static/video-main.mp4"
            type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
          />
        </video> -->
      </div>
    </div>

    <div class="container">
      <div class="main__wrapper">
        <div class="main__left">
          <div class="main-content">
            <div class="main-content__item">
              <div class="main-content__item-link">
                <a
                  target="_blank"
                  :href="marketAddress"
                  class="btn-link btn-link__lg"
                >
                  Contract
                  <SvgIcon name="arrow-up" class="icon--arrow-up" />
                </a>
              </div>
              <div class="main-content__item-wrapper">
                <ul>
                  <li>
                    <div class="main-content__item-numb">
                      <span>{{ data.totalInvested }} BNB</span>
                      <div class="card-list__logo">
                        <svg-icon name="bnb-logo" class="icon--bnb-logo" />
                      </div>
                    </div>
                    <div class="text-gradient">Total invested</div>
                  </li>
                  <li>
                    <div class="main-content__item-numb">
                      <span>{{ data.investors }}</span>
                    </div>
                    <div class="text-gradient">Investors</div>
                  </li>
                </ul>
                <a
                  href="#investments"
                  class="btn-link"
                  @click.prevent="scrollAnchor"
                >
                  Invest Now
                  <SvgIcon name="arrow-up" class="icon--arrow-up" />
                </a>
              </div>
            </div>
            <div class="main-content__item">
              <div class="main-content__item-link">
                <span class="btn-link btn-link__lg">Profit</span>
              </div>
              <div class="main-content__item-wrapper">
                <ul>
                  <li>
                    <div class="main-content__item-numb">
                      <span class="text-gradient">20%</span
                      ><span>&nbsp;Daily</span>
                    </div>
                  </li>
                  <li>
                    <div class="main-content__item-numb">
                      <span class="percent">7% + 3% + 1%</span>
                    </div>
                    <div class="text-gradient">Referral Reward</div>
                  </li>
                </ul>
                <a href="#" class="btn-link" @click.prevent="showDialog">
                  Calculate
                  <SvgIcon name="arrow-up" class="icon--arrow-up" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="main__right">
          <ul class="socials">
            <li>
              <a href="https://twitter.com/bnb42i" target="_blank">
                <SvgIcon name="twitter" class="icon--twitter" />
              </a>
            </li>
            <li>
              <a href="https://t.me/bnb42invest" target="_blank">
                <SvgIcon name="telegram" class="icon--telegram" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- DIALOG -->
    <ViewDialog v-model="isDialogOpen" class="popup-calculate">
      <div class="popup-calculate__wrapper">
        <div class="popup-calculate__left">
          <div class="popup-calculate__left-header">
            <h3 class="title">Calculate</h3>
          </div>
          <div class="popup-calculate__left-content">
            <h5 class="title">Enter the investment amount</h5>
            <div class="invest-action__element">
              <input
                v-model="calculateData.amount"
                type="number"
                class="invest-action__input"
                placeholder="0"
                lang="en"
                autocomplete="off"
                @change="(e) => calculate(e, calculateData.amount)"
              />
              <span class="invest-action__input-сoin">BNB</span>
            </div>
          </div>
          <div class="popup-calculate__left-footer">
            <ul class="card-list card__list">
              <li class="card-list__item">
                <div class="card-list__wrapper">
                  <div class="card-list__name">Min Investment:</div>
                  <div class="card-list__data">
                    <div class="card-list__value">0.01 BNB</div>
                  </div>
                </div>
              </li>
              <li class="card-list__item">
                <div class="card-list__wrapper">
                  <div class="card-list__name">Max Investment:</div>
                  <div class="card-list__data">
                    <div class="card-list__value">1000 BNB</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup-calculate__right">
          <div class="popup-calculate__right-header">
            <ul class="card-list card__list">
              <li class="card-list__item">
                <div class="card-list__wrapper">
                  <div class="card-list__name">Amount:</div>
                  <div class="card-list__data">
                    <div class="card-list__value">
                      <span class="text-gradient"
                        >{{ calculateData.amount }} BNB</span
                      >
                      <div class="card-list__logo">
                        <svg-icon name="bnb-logo" class="icon--bnb-logo" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="card-list__item">
                <div class="card-list__wrapper">
                  <div class="card-list__name">Total return:</div>
                  <div class="card-list__data">
                    <div class="card-list__value">200%</div>
                  </div>
                </div>
              </li>
              <li class="card-list__item">
                <div class="card-list__wrapper">
                  <div class="card-list__name">Investment term:</div>
                  <div class="card-list__data">
                    <div class="card-list__value">10 DAYS</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="popup-calculate__right-bottom">
            <h4 class="title">Calculated Return</h4>
            <ul class="card-list card__list">
              <li class="card-list__item">
                <div class="card-list__wrapper">
                  <div class="card-list__name">Per hour:</div>
                  <div class="card-list__data">
                    <div class="card-list__value">
                      <span class="text-gradient"
                        >{{ calculateData.pHour }} BNB</span
                      >
                      <div class="card-list__logo">
                        <svg-icon name="bnb-logo" class="icon--bnb-logo" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="card-list__item">
                <div class="card-list__wrapper">
                  <div class="card-list__name">In 12 hours:</div>
                  <div class="card-list__data">
                    <div class="card-list__value">
                      <span class="text-gradient"
                        >{{ calculateData.inHour }} BNB</span
                      >
                      <div class="card-list__logo">
                        <svg-icon name="bnb-logo" class="icon--bnb-logo" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="card-list__item">
                <div class="card-list__wrapper">
                  <div class="card-list__name">Per day:</div>
                  <div class="card-list__data">
                    <div class="card-list__value">
                      <span class="text-gradient"
                        >{{ calculateData.pDay }} BNB</span
                      >
                      <div class="card-list__logo">
                        <svg-icon name="bnb-logo" class="icon--bnb-logo" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="card-list__item">
                <div class="card-list__wrapper">
                  <div class="card-list__name">In 10 days:</div>
                  <div class="card-list__data">
                    <div class="card-list__value">
                      <span class="text-gradient"
                        >{{ calculateData.inDay }} BNB</span
                      >
                      <div class="card-list__logo">
                        <svg-icon name="bnb-logo" class="icon--bnb-logo" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ViewDialog>
  </section>
</template>

<style scoped lang="scss" src="./index.scss"></style>
