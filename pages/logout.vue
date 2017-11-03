<template>
	<v-container fluid fill-height>
		<v-layout justify-center align-center>
			<v-flex text-xs-center v-if="showLogoutMessage">
				<h2>You've successfully logged out!</h2>
				<h6>You can now browse back to the <router-link to="/">homepage</router-link>, or <router-link to="/login">log back in</router-link>.</h6>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
    import axios from 'axios';
    import config from '../config/base';
    import authMixin from '../mixins/auth';

    export default {
        name: 'LogoutPage',

        mixins: [authMixin],

        layout: 'auth',

        data() {
            return {
                showLogoutMessage: false,
            };
        },

        mounted() {
            if (this.isAuthenticated) {
                this.showLogoutMessage = true;
                this.$store.dispatch('auth/logout');
            } else {
                this.$router.push('/login');
            }
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
