// eslint-disable-next-line import/named
import { GetterTree, ActionTree, MutationTree } from 'vuex';

export const state = () => ({
  host: '',
  eventHost: '',
  assetsHost: '',
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  host(state): string {
    return state.host || '';
  },
  assetsHost(state): string {
    return state.assetsHost || '';
  },
  eventHost(state): string {
    return state.eventHost || '';
  },
};

export const mutations: MutationTree<RootState> = {
  SET_HOST(state, host?: string) {
    // if(process.browser) {}
    if (host) {
      state.host = host;
    } else if ((this.$config as any).apiHost) {
      state.host = (this.$config as any).apiHost;
    }
  },

  SET_ASSETS_HOST(state, host?: string) {
    // if(process.browser) {}
    if (host) {
      state.assetsHost = host;
    } else if ((this.$config as any).assetsHost) {
      state.assetsHost = (this.$config as any).assetsHost;
    }
  },

  SET_EVENT_HOST(state, host?: string) {
    // if(process.browser) {}
    if (host) {
      state.eventHost = host;
    } else if ((this.$config as any).eventApiHost) {
      state.eventHost = (this.$config as any).eventApiHost;
    }
  },
};

export const actions: ActionTree<RootState, RootState> = {
  setHost({ commit }, host?: string) {
    commit('SET_HOST', host);
  },

  setEventHost({ commit }, host?: string) {
    commit('SET_EVENT_HOST', host);
  },

  setAssetHost({ commit }, host?: string) {
    commit('SET_ASSETS_HOST', host);
  },
  nuxtServerInit({ commit }) {
    commit('SET_HOST');
    commit('SET_ASSETS_HOST');
    commit('SET_EVENT_HOST');
  },
};
