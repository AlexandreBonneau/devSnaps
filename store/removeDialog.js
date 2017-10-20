export const state = () => ({
    // Default values for the modal dialog state
    removeDialog        : false, // The modal is not displayed by default
    pendingIdToRemove   : null, // Keep track of the snap id to remove if the user confirms the action
    pendingTitleToRemove: null, // Keep track of the snap title to remove if the user confirms the action
});

export const getters = {};

export const mutations = {
    showRemoveDialog(state) {
        state.removeDialog = true;
    },

    hideRemoveDialog(state) {
        state.removeDialog = false;
    },

    setRemoveDialogInfo(state, { id, title }) {
        state.pendingIdToRemove = id;
        state.pendingTitleToRemove = title;
    },
};

/**
 * Actions are needed when manipulating asynchronous data
 */
export const actions = {};
