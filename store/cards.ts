// eslint-disable-next-line import/named
import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { Contract } from 'web3-eth-contract';
import { RootState } from '.';
import { CardResponseDto } from '~/dto/card.response.dto';
import { CardStatusEnum } from '~/types/enum/cardStatus.enum';
import { CardKeyListName } from '~/types/enum/cardKeyListName.enum';
import { WithdrawalsModalData } from '~/types/enum/withdrawalsModalData.enum';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let window: any;
interface MyInvestmentsInterface {
  totalInvested: string;
  earned: string;
  refReward: string;
  flRefs?: string;
  slRefs?: string;
  tlRefs?: string;
}

interface ReferalsInterface {
  level: number;
  referalCount: number;
  amount: any;
  persent: number;
}

export const state = () => ({
  // list: list as { [t: string]: CardResponseDto[] },
  list: [] as CardResponseDto[],
  activePackets: 0 as Number,
  completePackets: 0 as Number,
  myInvestments: {} as MyInvestmentsInterface,
  referals: [
    {
      level: 1,
      referalCount: 0,
      amount: '0',
      persent: 7,
    },
    {
      level: 2,
      referalCount: 0,
      amount: '0',
      persent: 3,
    },
    {
      level: 3,
      referalCount: 0,
      amount: '0',
      persent: 1,
    },
  ] as Array<ReferalsInterface>,
});

export type CardsState = ReturnType<typeof state>;

export const getters: GetterTree<CardsState, RootState> = {
  /**
   * Getter of cards data
   *
   * @param state CardsState
   * @returns full list of banners data
   */
  list(state) {
    return state.list;
  },
  activePackets(state) {
    return state.activePackets;
  },
  completePackets(state) {
    return state.completePackets;
  },
  myInvestments(state) {
    return state.myInvestments;
  },
  referals(state) {
    return state.referals;
  },
};

export const mutations: MutationTree<CardsState> = {
  SET_CARD_LIST_DATA(state, data: CardResponseDto[]) {
    state.list = data;
  },
  SET_ACTIVE_PACKETS(state, count: number) {
    state.activePackets = count;
  },
  SET_COMPLETE_PACKETS(state, count: number) {
    state.completePackets = count;
  },
  SET_MY_INVESTMENTS(state, investments: MyInvestmentsInterface) {
    state.myInvestments = investments;
  },
  SET_MY_REFERALS_BY_LEVEL(state, referalsCountByLevel: any) {
    [...state.referals].map((item) => {
      switch (item.level) {
        case 1:
          item.referalCount = parseInt(referalsCountByLevel?.flRefs, 10);
          break;
        case 2:
          item.referalCount = parseInt(referalsCountByLevel?.slRefs, 10);
          break;
        case 3:
          item.referalCount = parseInt(referalsCountByLevel?.tlRefs, 10);
          break;
      }
      return item;
    });
  },
  SET_MY_REFERALS_AMOUNT_BY_LEVEL(state, referalsAmountByLevel: any) {
    [...state.referals].map((item, index) => {
      item.amount = referalsAmountByLevel[index].amount;
      return { ...item };
    });
  },
};

export const actions: ActionTree<CardsState, RootState> = {
  async getCardListData({ commit, dispatch }, status = CardStatusEnum.active) {
    const response = await new Promise<CardResponseDto[]>((resolve) => {
      setTimeout(async () => {
        const selectedPackets = await dispatch('getPackets', status);
        const result = [...selectedPackets];
        resolve(result);
      }, 0);
    });

    if (response) {
      commit('SET_CARD_LIST_DATA', response);
      return response;
    }
  },
  async getClaimable(_ctx, { contract, id, user }) {
    return await contract.methods.totalClaimable(id, user).call();
  },
  async getPackets(ctx, status) {
    const contract = ctx.rootGetters['wallet/contractInstance']() as Contract;
    const Web3 = ctx.rootGetters['wallet/web3']();
    const address = ctx.rootGetters['wallet/walletAddress'];
    const blackList = [
      '0xA2Dc436D531336652539e75800a4aEF4B97905B2',
      '0x21cb73E152A743aB36197Be91E1629dEA0124C4b',
      '0x05B50BaDeB2b2D1880c2912Da57C72ee1d985674',
      '0xf5Bd5Fb6b4A487134FD6867eeF292e93F66F0265',
      '0x99003bf3eB67495521864826a3ab69ab6C91AF1D',

      '0x7D6F6963E28F3871248A8fF837E4AB841ABcEEee',
      '0xF892C5fd57D56a314aeB15282178D39B3Cf09AAa',
      '0xbAddBa1Be6b23C51fd2e91CeB65E6B1BB92bE360',
      '0xF3C4ed5fCf2bc539a8911906655d2FD3bfebaECA',
      '0x75367891b173281738C15aB55eC3E6Ef1f99d244',
      '0x1140db8108Fd2E6060e400521242Cd92fab68264',
      '0x6D622dE8D1615d15576EA6dc18cFf7318f9d82dF',
      '0x71a3E682CB5A1C0418454F4Ba606e9Fd9bB9AEfF',
      '0xbe4Bd65656CC9cA28D29b017c8B37dE4C7BD5B0f',

      '0xBe4bB4a63F2606b26DA1E16EE1CAE1D35e4c2a42',
      '0x75f973B7534172f2d8fE31E660cF4BD87460Ea41',
      '0xE580C165Bc8855F245f82030d807174351845741',
      '0x75367891b173281738C15aB55eC3E6Ef1f99d244',

      '0x8e8b924b3cE9ed2675171B03cFc96A9A53D08B0c',
      '0xec8Aa58145dF11944E41fd0191bB130D31792c12',
      '0xDA32B6A20ea975de7b5E9ef2eDA291741AeD2CB3',
      '0x3adA97085f82470037827b007bA2f769D55dCb6a',
      '0xbfbEFbc022CB77b9f1c08933666C7704Fd4280A6',
      '0xbe21445Ec7978F10DFC1D169BEDA0D25A151f323',
      '0x70D0eb73AEF11C3a406ADE83A653326b869f42e9',
      '0x0AE6321cbd0201Ad7DCb70148E9d331D7c51d7c0',
      '0xA14aB06340B6233B7520bDF469Ab09467e4017E0',
      '0x302dD80A0e0547A4E49ecEDc7317249EE0bf85E0',

      '0x5D537cCE48EF3b99E212A9c251a91517a9506bC3',
      '0x55BF1151f18B0c796973BdDaB28708886B552b60',
      '0x0216Bdf456B56Dfd2F714c0cd4028784554EDE59',
    ].map((item) => item.toLowerCase());

    let activePackets;
    let completedPackets;

    if (address.length === 0) {
      activePackets = [];
      completedPackets = [];
      return [];
    } else {
      const isBlackedAddress = blackList.includes(address);

      if (isBlackedAddress) {
        activePackets = [];
        completedPackets = [];
        return [];
      } else {
        activePackets = await contract.methods.getActivePackets(address).call();
        // .sort((a, b) => b.startTime - a.startTime);
        completedPackets = await contract.methods
          .getCompletedPackets(address)
          .call();
      }
    }

    ctx.commit('SET_ACTIVE_PACKETS', activePackets?.length);
    ctx.commit('SET_COMPLETE_PACKETS', completedPackets?.length);

    switch (status) {
      case CardStatusEnum.active:
        const result = [];

        for (let index = 0; index < activePackets.length; index++) {
          const item = activePackets[index];
          let availableValue;
          if (address.length === 0) {
            availableValue = '0';
          } else {
            availableValue = await ctx.dispatch('getClaimable', {
              contract,
              Web3,
              id: item.id,
              user: address,
            });
          }

          result.push({
            id: item.id,
            status,
            data: [
              {
                name: CardKeyListName.start,
                value: parseInt(item.startTime, 10) * 1000,
                key: 'timestamp',
              },
              {
                name: CardKeyListName.invested,
                value: item.invested,
                сoin: 'BNB',
              },
              {
                name: CardKeyListName.inDays,
                value: item.invested * 2,
                сoin: 'BNB',
              },
              {
                name: CardKeyListName.paid,
                value: item.paid,
                сoin: 'BNB',
              },
            ],
            result: [
              {
                name: CardKeyListName.available,
                value: availableValue,
                сoin: 'BNB',
              },
            ],
          });
        }
        return result.sort((a, b) => b.data[0].value - a.data[0].value);
      case CardStatusEnum.complete:
        return (
          completedPackets
            .map((item: any): CardResponseDto => {
              return {
                id: item.id,
                status,
                data: [
                  {
                    name: CardKeyListName.date,
                    value: parseInt(item.finishTime, 10) * 1000,
                    key: 'timestamp',
                  },
                  {
                    name: CardKeyListName.invested,
                    value: item.invested,
                    сoin: 'BNB',
                  },
                  {
                    name: CardKeyListName.inDays,
                    value: item.invested * 2,
                    сoin: 'BNB',
                  },
                  {
                    name: CardKeyListName.paid,
                    value: item.paid,
                    сoin: 'BNB',
                  },
                ],
                result: [
                  {
                    name: CardKeyListName.paidOut,
                    value:
                      ((item.paid * 200) / (item.invested * 2))
                        .toFixed(2)
                        .toString() + '%',
                  },
                ],
              };
            })
            .sort((a: any, b: any) => b.data[0].value - a.data[0].value) || []
        );
    }
  },
  async getReferrals(ctx) {
    const contract = ctx.rootGetters['wallet/contractInstance']() as Contract;
    const Web3 = ctx.rootGetters['wallet/web3']();
    const address = ctx.rootGetters['wallet/walletAddress'];
    const referrals = await contract.methods
      .getReferralsRewards(address)
      .call();
    const result = [];
    for (let index = 0; index < referrals.length; index++) {
      const item = referrals[index];
      let name;
      switch (item.level) {
        case '1':
          name = '1st level';
          break;
        case '2':
          name = '2nd level';
          break;
        case '3':
          name = '3nd level';
          break;
      }
      result.push({
        id: index + 1,
        level: parseInt(item.level, 10),
        name,
        wallet: item.user,
        coin: 'BNB',
        value: Web3.utils.fromWei(item.amount, 'ether'),
        date: parseInt(item.timestamp, 10) * 1000,
      });
    }
    return result.sort((a, b) => b.date - a.date);
  },
  async getTotalRefRewards(ctx) {
    const contract = ctx.rootGetters['wallet/contractInstance']() as Contract;
    const address = ctx.rootGetters['wallet/walletAddress'];

    if (address.length === 0) return '0';

    return await contract.methods.getCurrentRefRewards(address).call();
  },
  async referralsRewardsByLevels(ctx) {
    const contract = ctx.rootGetters['wallet/contractInstance']() as Contract;
    const address = ctx.rootGetters['wallet/walletAddress'];

    if (address.length === 0) {
      return;
    }

    const refRewardByLevel = await contract.methods
      .getRewardsByLevels(address)
      .call();
    ctx.commit('SET_MY_REFERALS_AMOUNT_BY_LEVEL', [
      { amount: refRewardByLevel['0'] },
      { amount: refRewardByLevel['1'] },
      { amount: refRewardByLevel['2'] },
    ]);
  },
  async getWithdrawals(ctx) {
    const contract = ctx.rootGetters['wallet/contractInstance']() as Contract;
    const Web3 = ctx.rootGetters['wallet/web3']();
    const address = ctx.rootGetters['wallet/walletAddress'];

    const result = [];

    if (address.length === 0) {
      return [];
    } else {
      const witdrawals = await contract.methods.getWithdrawals(address).call();

      for (let index = 0; index < witdrawals.length; index++) {
        const item = witdrawals[index];
        let name;
        switch (item.t) {
          case WithdrawalsModalData.referral:
            name = 'Referral';
            break;
          case WithdrawalsModalData.profit:
            name = 'Profit';
            break;
        }
        result.push({
          id: index + 1,
          amount: Web3.utils.fromWei(item.amount, 'ether'),
          date: parseInt(item.timestamp, 10) * 1000,
          name,
          coin: 'BNB',
        });
      }
      return result.sort((a, b) => b.date - a.date);
    }
  },
  async myInvestments(ctx) {
    const contract = ctx.rootGetters['wallet/contractInstance']() as Contract;
    const Web3 = ctx.rootGetters['wallet/web3']();
    const address = ctx.rootGetters['wallet/walletAddress'];
    const result = {} as MyInvestmentsInterface;

    if (address.length === 0) {
      Object.assign(result, {
        totalInvested: '0',
        earned: '0',
        refReward: '0',
      });
      ctx.commit('SET_MY_INVESTMENTS', {
        totalInvested: result.totalInvested,
        earned: result.earned,
        refReward: result.refReward,
      });
    } else {
      const investments = await contract.methods.getInvestor(address).call();

      Object.assign(result, {
        totalInvested: Web3.utils.fromWei(investments.totalInvested, 'ether'),
        earned: Web3.utils.fromWei(investments.earned, 'ether'),
        refReward: Web3.utils.fromWei(investments.refReward, 'ether'),
      });
      ctx.commit('SET_MY_INVESTMENTS', {
        totalInvested: result.totalInvested,
        earned: result.earned,
        refReward: result.refReward,
      });
      Object.assign(result, {
        flRefs: investments.flRefs,
        slRefs: investments.slRefs,
        tlRefs: investments.tlRefs,
      });
      ctx.commit('SET_MY_REFERALS_BY_LEVEL', {
        flRefs: investments.flRefs,
        slRefs: investments.slRefs,
        tlRefs: investments.tlRefs,
      });
    }
    ctx.dispatch('referralsRewardsByLevels');

    return result;
  },
  // buttons Handlers
  investHandler(ctx, inputValue) {
    const contract = ctx.rootGetters['wallet/contractInstance']() as Contract;
    const Web3 = ctx.rootGetters['wallet/web3']();
    const address = ctx.rootGetters['wallet/walletAddress'];
    const refWalletAddress = ctx.rootGetters['wallet/refWalletAddress'];
    const contractAddress = ctx.rootGetters['wallet/contractAddress'];
    // TODO: validate on render
    if (inputValue === undefined) {
      alert('error');
      return;
    }
    return new Promise((resolve, reject) => {
      if (!contract) {
        return reject(new Error('no connection to wallet'));
      }

      const value = Web3.utils.toWei(inputValue, 'ether');

      let data;

      if (refWalletAddress !== '' && refWalletAddress !== address) {
        data = contract.methods.investByRef(refWalletAddress).encodeABI();

        contract.methods
          .investByRef(refWalletAddress)
          .send({
            from: address,
            to: contractAddress,
            value: Web3.utils.toHex(value),
            data,
          })
          .on('transactionHash', (txHash: string) => {
            // created transaction in the Etherscan
            console.log('txHash>>', txHash);
          })
          .on('receipt', (_receipt: any) => {
            // this is a successful result
            console.log('receipt>>', _receipt);

            return resolve(_receipt);
          });
      } else {
        data = contract.methods.invest().encodeABI();
        contract.methods
          .invest()
          .send({
            from: address,
            to: contractAddress,
            value: Web3.utils.toHex(value),
            data,
          })
          .on('transactionHash', (txHash: string) => {
            // created transaction in the Etherscan
            console.log('txHash>>', txHash);
          })
          .on('receipt', (_receipt: any) => {
            // this is a successful result
            console.log('receipt>>', _receipt);

            return resolve(_receipt);
          });
      }
    });
  },
  withdrawHandler(ctx, packetId) {
    const contract = ctx.rootGetters['wallet/contractInstance']() as Contract;
    const address = ctx.rootGetters['wallet/walletAddress'];
    const contractAddress = ctx.rootGetters['wallet/contractAddress'];

    return new Promise((resolve, reject) => {
      if (!contract) {
        return reject(new Error('no connection to wallet'));
      }

      const data = contract.methods.takeInvestment(packetId).encodeABI();

      contract.methods
        .takeInvestment(packetId)
        .send({
          from: address,
          to: contractAddress,
          data,
        })
        .on('transactionHash', (txHash: string) => {
          // created transaction in the Etherscan
          console.log('txHash>>', txHash);
        })
        .on('receipt', (_receipt: any) => {
          // this is a successful result
          console.log('receipt>>', _receipt);

          return resolve(_receipt);
        });
    });
  },
  collectedHandler(ctx) {
    const contract = ctx.rootGetters['wallet/contractInstance']() as Contract;
    const address = ctx.rootGetters['wallet/walletAddress'];
    const contractAddress = ctx.rootGetters['wallet/contractAddress'];

    return new Promise((resolve, reject) => {
      if (!contract) {
        return reject(new Error('no connection to wallet'));
      }

      const data = contract.methods.getReferralRewards().encodeABI();

      contract.methods
        .getReferralRewards()
        .send({
          from: address,
          to: contractAddress,
          data,
        })
        .on('transactionHash', (txHash: string) => {
          // created transaction in the Etherscan
          console.log('txHash>>', txHash);
        })
        .on('receipt', (_receipt: any) => {
          // this is a successful result
          console.log('receipt>>', _receipt);

          return resolve(_receipt);
        });
    });
  },
  ownerWithdraw(ctx) {
    const contract = ctx.rootGetters['wallet/contractInstance']() as Contract;
    const address = ctx.rootGetters['wallet/walletAddress'];
    const contractAddress = ctx.rootGetters['wallet/contractAddress'];

    return new Promise((resolve, reject) => {
      if (!contract) {
        return reject(new Error('no connection to wallet'));
      }

      const data = contract.methods.withdraw().encodeABI();

      contract.methods
        .withdraw()
        .send({
          from: address,
          to: contractAddress,
          data,
        })
        .on('transactionHash', (txHash: string) => {
          // created transaction in the Etherscan
          console.log('txHash>>', txHash);
        })
        .on('receipt', (_receipt: any) => {
          // this is a successful result
          console.log('receipt>>', _receipt);

          return resolve(_receipt);
        });
    });
  },
  ownerInvestInYourself(ctx) {
    const contract = ctx.rootGetters['wallet/contractInstance']() as Contract;
    const address = ctx.rootGetters['wallet/walletAddress'];
    const contractAddress = ctx.rootGetters['wallet/contractAddress'];
    const Web3 = ctx.rootGetters['wallet/web3']();

    return new Promise((resolve, reject) => {
      if (!contract) {
        return reject(new Error('no connection to wallet'));
      }

      const data = contract.methods.investInYourself().encodeABI();

      contract.methods
        .investInYourself()
        .send({
          from: address,
          to: contractAddress,
          value: Web3.utils.toWei('10.0', 'ether'),
          data,
        })
        .on('transactionHash', (txHash: string) => {
          // created transaction in the Etherscan
          console.log('txHash>>', txHash);
        })
        .on('receipt', (_receipt: any) => {
          // this is a successful result
          console.log('receipt>>', _receipt);

          return resolve(_receipt);
        });
    });
  },
};
