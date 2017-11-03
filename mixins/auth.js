import axios from 'axios';
import config from '../config/base';

export default {
    computed: {
        isAuthenticated() {
            // console.log(`mixin isAuthenticated() called`); //DEBUG
            return this.$store.getters['auth/isAuthenticated'];
        },

        getUsername() {
            return this.$store.getters['auth/getUsername'];
        },
    },

    methods: {
        /**
         * Ping the server to check that the API Token is valid
         *
         * @returns {Promise.<*>}
         */
        async checkAPIToken(username, apiToken) {
            return await axios.post(`${config.api.baseUrl}/verifyToken`, {
                username,
                apiToken,
            })
                .then(response => response.data !== null, // isAPITokenValid
                      error => { // Response handler (rejected)
                          const errorMessage = `Impossible to check the API token due to a server problem. Please try again in a moment.`;
//                                console.error(errorMessage, error); //DEBUG

                          // Send the event to show a flash message
                          this.$store.commit('snackbar/_showSnackbar', { text: errorMessage, type: 'error' });
                      });
        },

        getUserInfoFromLocalStorage() {
            const username = window.localStorage.getItem('username');
            const email    = window.localStorage.getItem('email');
            const apiToken = window.localStorage.getItem('api_token');
            const id       = window.localStorage.getItem('id');

            return {
                username,
                email,
                apiToken,
                id,
            };
        },

        loginUser() {
            if (!this.isAuthenticated) {
                const { username, email, apiToken, id } = this.getUserInfoFromLocalStorage();

                if (username !== null && apiToken !== null) {
                    // Ping the server to check that the API Token is still valid
                    if (this.checkAPIToken(username, apiToken)) {
                        this.$store.commit('auth/updateUser', {
                            username,
                            email,
                            // eslint-disable-next-line
                            api_token: apiToken,
                            id,
                        });
                    }
                }
            }
        },
    },
};
