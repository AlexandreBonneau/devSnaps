<template>
	<v-container fluid fill-height>
		<v-layout justify-center align-center>
			<v-flex text-xs-center xs10 sm8 md4>
				<h4>Sign In</h4>
				<v-form v-model="valid" @keyup.native.enter="login">
					<v-text-field
							label="Username"
							v-model="username"
							:rules="usernameRules"
							required
					></v-text-field>
					<v-text-field
							type="password"
							:append-icon="showPassword?'visibility':'visibility_off'"
							:append-icon-cb="() => (showPassword = !showPassword)"
							:type="showPassword?'text':'password'"
							label="Password"
							v-model="password"
							:rules="passwordRules"
							required
					></v-text-field>
					<v-btn @click.native="login"
					       :disabled="!valid"
					>Login</v-btn>
				</v-form>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
    import axios from '../node_modules/axios/dist/axios.min';
    import config from '../config/base';
    import authMixin from '../mixins/auth';

    export default {
        name: 'LoginPage',

        mixins: [authMixin],

        middleware: 'guest',

        layout: 'auth',

        data() {
            return {
                valid                    : false,
                username                 : '',
                usernameRules                : [
                    v => !!v || 'Username is required',
                ],

                // Password-related data
                showPassword             : false,
                password                 : '',
                passwordRules            : [
                    v => !!v || 'Password is required',
                ],
            };
        },

        methods: {
            login() {
                // Try to login on the server, and get back an api_token
                this.$store.dispatch('auth/login', {
                    username: this.username,
                    password: this.password,
                    router  : this.$router, //XXX I need to pass the router so that the Vuex action can modify the url
                });
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
