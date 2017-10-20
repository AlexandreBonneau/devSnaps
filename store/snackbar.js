// The module way (cf. https://nuxtjs.org/guide/vuex-store/)
export const state = () => ({
    // Default values for the Snackbar state
    snackbar       : false,
    snackbarY      : 'top',
    snackbarX      : 'right',
    snackbarMode   : '',
    snackbarTimeout: 6000,
    snackbarText   : '',
    snackbarColor  : '',
});

export const getters = {};

export const mutations = {
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
};

/**
 * Actions are needed when manipulating asynchronous data
 */
export const actions = {};
