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
export const state = () => ({
    currentUser : 'alex', //FIXME Get this data from the API
    snaps : [], //TODO Add all the snaps data here
    showDrawer : false,

    // Default values for the Snackbar state
    snackbar       : false,
    snackbarY      : 'top',
    snackbarX      : 'right',
    snackbarMode   : '',
    snackbarTimeout: 6000,
    snackbarText   : '',
    snackbarColor  : '',
});

export const getters = {
    /**
     * Return an array of the most 'hot' snaps.
     * By default it returns 6 of them, but that can be modified by passing the `snapCount` variable.
     *
     * @param {object} state
     * @param {number} snapCount
     * @returns {Array.<T>}
     */
    hotSnaps(state, snapCount = 6) {
        // Return the 6 snaps that were last edited
        const sortedByHotness = state.snaps.slice(0).sort((a, b) => { // Create a copy of the array to not mutate the state in a getter
            // return a.timesEdited - b.timesEdited;
            const dateA = new Date(a.updated_at);
            const dateB = new Date(b.updated_at);
            return dateA - dateB; //FIXME Test this
        });

        // Keep only the first N snaps
        return sortedByHotness.slice(0, snapCount);
    },

    favSnaps(state) { //FIXME Test this
        return state.snaps.filter(snap => snap.favorite);
    },

    totalNumberOfSnaps(state) {
        return state.snaps.length;
    },
};

export const mutations = {
    // ---------------- Auth management
    /**
     * What happens when a user just logged in
     * @param state
     */
    login(state) {
        //FIXME Finish this
        console.log(`login() vuex called`); //DEBUG
    },

    /**
     * What happens when a user just logged out
     * @param state
     */
    logout(state) { //FIXME Finish this
        console.log(`logout() vuex called`); //DEBUG
        //FIXME Ping the server about the disconnection
        state.currentUser = null;
    },

    // ---------------- Navigation drawer management
    toggleDrawer(state) {
        // This is called by `v-navigation-drawer`
        state.showDrawer = !state.showDrawer;
    },

    // ---------------- Snackbar management
    modifySnackbarColor(state, colorType) {
        switch (colorType) {
            case 'warning':
                state.snackbarColor = 'warning';
                break;
            case 'error':
                state.snackbarColor = 'error';
                break;
            case 'success':
                state.snackbarColor = 'success';
                break;
            case 'info':
            default:
                state.snackbarColor = 'info';
        }
    },

    modifySnackbarText(state, text) {
        state.snackbarText = text;
    },

    showSnackbar(state) {
        state.snackbar = true;
    },

    hideSnackbar(state) {
        state.snackbar = false;
    },

    setSnackbar(state, value) {
        state.snackbar = value;
    },
};
