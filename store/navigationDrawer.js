export const state = () => ({
    showDrawer : false,
});

export const getters = {};

export const mutations = {
    toggleDrawer(state) {
        // This is called by `v-navigation-drawer`
        state.showDrawer = !state.showDrawer;
    },
};

/**
 * Actions are needed when manipulating asynchronous data
 */
export const actions = {};
