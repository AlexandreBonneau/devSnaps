import axios from '../node_modules/axios/dist/axios.min';
import config from '../config/base';

export const state = () => ({
    currentUser : null,
});

export const getters = {
    isAuthenticated(state) {
        // console.log(`store/auth.js isAuthenticated() called`, state.currentUser); //DEBUG
        return state.currentUser !== null &&
            state.currentUser.username !== '' &&
            state.currentUser.api_token !== '';
    },

    getUsername(state) {
        if (state.currentUser !== null) {
            return state.currentUser.username;
        }

        return '';
    },
};

export const mutations = {
    updateUser(state, user) {
        state.currentUser = user;

        // Save the logged user to localStorage
        if (user !== null) {
            window.localStorage.setItem('username', user.username);
            window.localStorage.setItem('email', user.email);
            window.localStorage.setItem('api_token', user.api_token);
            window.localStorage.setItem('id', user.id);
        } else {
            // ...or reset the user data
            window.localStorage.setItem('username', '');
            window.localStorage.setItem('email', '');
            window.localStorage.setItem('api_token', '');
            window.localStorage.setItem('id', '');
        }
    },
};

/**
 * Check in the server response if the user exists.
 * If it does, update the store state with its information.
 *
 * @param {object} response
 * @param {object} commit
 * @param {object} payload
 * @param {string} successText The string to display in the snackbar when the check is successful
 * @param {string} redirectUrl
 * @returns {boolean}
 */
function checkAndUpdateLoggedUser(response, commit, payload, successText, redirectUrl) {
    const user = response.data;
    const apiToken = user.api_token;
    if (user !== null && user !== '' && apiToken !== '') {
        // console.log(`User '${user.username}' logged in with the api token '${apiToken}'.`); //DEBUG

        // If that worked, update the Vuex state
        commit('updateUser', user);

        // Show a confirmation for the user
        commit('snackbar/_showSnackbar', { text: successText, type: 'success' }, { root: true });
        // Redirect to the user dashboard
        payload.router.push(redirectUrl);

        return true;
    }

    return false;
}

/**
 * Actions are needed when manipulating asynchronous data
 */
export const actions = {
    register({ commit, state }, payload) {
        //TODO Add a re-captcha in the signup process
        axios.post(`${config.api.baseUrl}/register`, {
            username: payload.username,
            email   : payload.email,
            password: payload.password,
        }).then(response => {
            if (response.data !== 'null') {
                checkAndUpdateLoggedUser(response, commit, payload, `You've successfully created your account.`, `/signupConfirmation`);
            } else {
                const errorMessage = `Impossible to create a new user, the username or email address is already used. Please try again with credentials.`;
                commit('snackbar/_showSnackbar', { text: errorMessage, type: 'error' }, { root: true });
            }
        },
                error => { // Response handler (rejected)
                    const errorMessage = `Impossible to create a new user due to a server problem. Please try again in a moment.`;
                    // Send the event to show a flash message
                    commit('snackbar/_showSnackbar', { text: errorMessage, type: 'error' }, { root: true });
                });
    },

    /**
     * What happens when a user just logged in
     * @param {object} commit
     * @param {object} state
     * @param {object} payload
     */
    login({ commit, state }, payload) {
        axios.post(`${config.api.baseUrl}/login`, {
            username: payload.username,
            password: payload.password,
        })
            .then(response => {
                if (!checkAndUpdateLoggedUser(response, commit, payload, `Welcome ${payload.username}, you've successfully logged in.`, `/${payload.username}/snaps`)) { //TODO Change the default redirect url to the dashboard
                    // No good credentials
                    const errorMessage = `The username, email or password you used are incorrect. Please check again.`;
                    // Send the event to show a flash message
                    commit('snackbar/_showSnackbar', { text: errorMessage, type: 'error' }, { root: true });
                }
            },
                  error => { // Response handler (rejected)
                      const errorMessage = `Impossible to login with user '${payload.username}' due to a server problem. Please try again in a moment.`;
                      // Send the event to show a flash message
                      commit('snackbar/_showSnackbar', { text: errorMessage, type: 'error' }, { root: true });
                  });
    },

    /**
     * When a user log out, a ping is sent to the back-end so that appropriate actions are called.
     * The `currentUser` state is also set back to `null`.
     *
     * @param {object} commit
     * @param {object} state
     */
    logout({ commit, state }) {
        // We are using the API Token way of authenticating requests from the user, and for additional security, we need to ping the server about the disconnection so that it can take the appropriate measures
        axios.post(`${config.api.baseUrl}/logout`, {
            username: state.currentUser.username,
            apiToken: state.currentUser.api_token,
        })
            .then(response => {
                if (response.data === 'ok') {
                    // Show a confirmation for the user
                    commit('snackbar/_showSnackbar', { text: `You've successfully logged out.`, type: 'success' }, { root: true });
                } else {
                    // No good credentials
                    const errorMessage = `The user credential used to logout are incorrect. Please check again.`;
                    // Send the event to show a flash message
                    commit('snackbar/_showSnackbar', { text: errorMessage, type: 'error' }, { root: true });
                }
            },
                  error => {
                      const errorMessage = `Impossible to logout due to a server problem. Please try again in a moment.`;
                      // Send the event to show a flash message
                      commit('snackbar/_showSnackbar', { text: errorMessage, type: 'error' }, { root: true });
                  });

        // Update the current user in the front-end
        commit('updateUser', null);
    },
};
