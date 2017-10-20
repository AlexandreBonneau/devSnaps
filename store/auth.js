export const state = () => ({
    currentUser : 'alex', //FIXME Get this data from the API
});

export const getters = {};

export const mutations = {
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
};

/**
 * Actions are needed when manipulating asynchronous data
 */
export const actions = {};
