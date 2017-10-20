import axios from '../node_modules/axios/dist/axios.min';
import config from '../config/base';
import clone from '../node_modules/lodash/cloneDeep';

// The 'classic' way
/*
import Vuex from '../node_modules/vuex/dist/vuex.min';

const createStore = () => new Vuex.Store({
    state: {
        counter: 0,
        currentUser : 'acid',
    },

    mutations: {
        increment(state) {
            state.counter++;
        },
    },
});

export default createStore;
*/

// The module way (cf. https://nuxtjs.org/guide/vuex-store/)
export const state = () => ({});

export const getters = {};

export const mutations = {};

/**
 * Actions are needed when manipulating asynchronous data
 */
export const actions = {};
