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
export const state = () => ({
    currentUser : 'alex', //FIXME Get this data from the API
    showDrawer : false,

    // Default values for the Snackbar state
    snackbar       : false,
    snackbarY      : 'top',
    snackbarX      : 'right',
    snackbarMode   : '',
    snackbarTimeout: 6000,
    snackbarText   : '',
    snackbarColor  : '',

    // Keep track of the accessible snaps for the current user
    snaps : [],
    initialFetchFailed : false, // Keep track if the snaps have correctly been fetched from the server

    // Search terms
    titlesAndContent : [''], // By default, the search terms are emptied. It also allows the user to select the empty string (no search string)
});

export const getters = {
    /**
     * Return an array of the most 'hot' snaps.
     * The 'hot' snaps are the snaps that have been the most edited.
     * By default it returns 6 of them, but that can be modified by passing the `snapCount` variable.
     *
     * @param {object} state
     * @returns {Array.<T>}
     */
    hotSnaps(state) {
        if (state.snaps.length > 0) {
            const snapCount = 6;

            // Return the 6 snaps that were last edited
            // Create a copy of the array to not mutate the state in a getter
            const sortedByHotness = state.snaps.slice(0).sort((a, b) => b.timesEdited - a.timesEdited);

            // Keep only the first N snaps
            return sortedByHotness.slice(0, snapCount); // Using slice here to create a copy of the array is needed if the snapCount is superior to the length of the array
        }

        return [];
    },

    /**
     * Return all the snaps that have been favourited.
     *
     * @param {object} state
     * @returns {*}
     */
    favSnaps(state) {
        return state.snaps.filter(snap => snap.favorite);
    },

    /**
     * Calculate the number of snaps
     *
     * @returns {number}
     */
    snapCount(state) {
        return state.snaps.length;
    },

    /**
     * Return the snap of the given id
     *
     * @param state
     * @param id
     * @returns {object|''}
     */
    /*
    getSnap(state, id) { //FIXME Test this
        return state.snaps.filter(snap => snap.id === id)[0];
    },
    */
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
    /**
     * Modify and show the snackbar
     *
     * @param {object} state
     * @param {object} payload
     * @private
     */
    _showSnackbar(state, payload) {
        const { text, type } = payload;
        const colorType = type || 'info';
        mutations.modifySnackbarColor(state, colorType);
        mutations.modifySnackbarText(state, text);
        mutations.showSnackbar(state);
    },

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

    /**
     * Set the snackbar visibility.
     * If `value` is `true`, show the snackbar, otherwise hide it.
     *
     * @param {object} state
     * @param {boolean} value
     */
    setSnackbar(state, value) {
        state.snackbar = value;
    },

    // ---------------- Snaps management
    /**
     * Set all the snaps with the given snaps array
     *
     * @param {object} state
     * @param {array} snaps
     */
    setSnaps(state, snaps) {
        state.snaps = snaps;
    },

    /**
     * Overwrite completely the snap with the given id, with the given snap data
     *
     * @param {object} state
     * @param {object} payload
     */
    setSnap(state, payload) { //FIXME Test this
        const id = payload.id;
        const snapData = payload.snapData;

        // Find the snap
        const snapArrayIndex = state.snaps.findIndex(obj => obj.id === id);
        if (snapArrayIndex === -1) {
            // No index is found
            throw new Error(`Impossible to find the Snap with index ${id}`);
        }

        // Update the data
        state.snaps.splice(snapArrayIndex, 1, snapData); // cf. https://vuejs.org/v2/guide/list.html#Caveats
    },

    /**
     * Update the snap with the given id, with the given selected data
     *
     * @param {object} state
     * @param {object} payload
     */
    updateSnap(state, payload) {
        const id = payload.id;
        const snapData = payload.snapData;

        // Find the snap
        const snapArray = state.snaps.find(obj => obj.id === id);
        if (snapArray === void(0)) {
            throw new Error(`Impossible to find the Snap with index ${id}`);
        }

        // Update the data
        for (const prop in snapData) {
            if (snapData.hasOwnProperty(prop)) {
                snapArray[prop] = snapData[prop];
            }
        }
    },

    setInitialFetchFailed(state, failed) {
        state.initialFetchFailed = failed;
    },

    // ---------------- Search content management
    /**
     * Update the search terms used is the select/autocomplete component
     */
    updateSearchTerms(state) {
        state.titlesAndContent = ['']; // By default, the search terms are emptied. It also allows the user to select the empty string (no search string)
        state.snaps.forEach(snap => {
            state.titlesAndContent.push(snap.title);
            state.titlesAndContent.push(snap.content);
        });
    },
};

/**
 * Actions are needed when manipulating asynchronous data
 */
export const actions = {
    async getSnaps({ commit, state }) {
        return await axios.get(`${config.api.baseUrl}/posts`)
            .then(response => {
                commit('setSnaps', response.data);
//          console.log(`Snaps fetched!`); //DEBUG

                // The fetch succeeded
                commit('setInitialFetchFailed', false);

                // Tell the world about it
                commit('_showSnackbar', { text: `${state.snaps.length} snaps have been fetched successfully.`, type: 'success' });

                // Setup the search terms
                commit('updateSearchTerms');
            },
                  error => { // Response handler (rejected)
                      const errorMessage = `Impossible to fetch snap data. Please try again in a moment.`;
                      console.error(errorMessage, error); //DEBUG

                      // Send the event to show a flash message
                      commit('_showSnackbar', { text: errorMessage, type: 'error' });

                      commit('setInitialFetchFailed', true);
                  });
    },

    /**
     * Remove the snap
     * @param commit
     * @param state
     * @param {number} id
     */
    removeSnap({ commit, state }, id) {
        // Remove the snap from the server
        axios.delete(`${config.api.baseUrl}/posts/${id}`)
            .then(response => {
                console.log(`Snap ${id} deleted!`); //DEBUG

                // If that worked, also remove the snap from the local object `this.snaps`
                commit('setSnaps', state.snaps.filter(obj => obj.id !== id));

                // And also update the search terms
                commit('updateSearchTerms');

                // Show a confirmation for the user
                commit('_showSnackbar', { text: `The snap ${id} has been deleted.`, type: 'info' });
            },
                  error => { // Response handler (rejected)
                      const errorMessage = `Impossible to remove the snap with id ${id}. Please try again in a moment.`;
                      console.error(errorMessage, error); //DEBUG

                      // Send the event to show a flash message
                      commit('_showSnackbar', { text: errorMessage, type: 'error' });
                  });
    },

    /**
     * Update the database with the given snap data.
     * The snap data can be partial ; only the given data will be updated.
     * The already existing snap data in the target won't be touched if it's not present in the source.
     *
     * @param commit
     * @param {object} snapData
     * @private
     */
    updateSnap({ commit }, snapData) {
        // Send the updated data
        axios.put(`${config.api.baseUrl}/posts`, snapData)
            .then(response => {
                // console.log('response.data:', response.data); //DEBUG
                // Since the back-end accepted the modification, commit the change to the Vuex store state
                commit('updateSnap', { id: snapData.id, snapData }); // Call the mutation

                // Show a confirmation for the user
                commit('_showSnackbar', { text: `The snap ${snapData.id} "${snapData.title}" has been updated.`, type: 'info' });
            },
                  error => { // Response handler (rejected)
                      const errorMessage = `Impossible to update the snap "${snapData.title}" [${snapData.id}]. Please try again in a moment.`;
                      console.error(errorMessage, error); //DEBUG

                      // Send the event to show a flash message
                      commit('_showSnackbar', { text: errorMessage, type: 'error' });
                  }
            );
    },

    /**
     * Toggle the state of the `favorite` data, then transmit that change to the database
     *
     * @param state
     * @param dispatch
     * @param {number} id
     */
    toggleFavorite({ state, dispatch }, id) {
        // Get the snap data
        const filteredArray = state.snaps.filter(snap => snap.id === id);
        const modifiableSnap = clone(filteredArray[0]); // Here I clone the filtered array since all mutations must happen in a `mutation` method

        // Modify it
        modifiableSnap.favorite = !modifiableSnap.favorite;

        // Save the change in the database
        dispatch('updateSnap', modifiableSnap);
    },
};
