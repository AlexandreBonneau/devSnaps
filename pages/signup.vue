<template>
	<v-container fluid fill-height>
		<v-layout justify-center align-center>
			<v-flex text-xs-center xs12 sm10 md6>
				<h4>Create a new account</h4>
				<v-form v-model="valid">
					<v-flex>
						<v-text-field
								label="Username"
								v-model="username"
								:rules="usernameRules"
								hint="Choose wisely, this cannot be changed afterward"
								required
						></v-text-field>
					</v-flex>
					<v-flex>
						<v-text-field
								label="E-mail"
								v-model="email"
								:rules="emailRules"
								required
						></v-text-field>
					</v-flex>
					<v-flex>
						<v-text-field
								type="password"
								:append-icon="showPassword?'visibility':'visibility_off'"
								:append-icon-cb="() => (showPassword = !showPassword)"
								:type="showPassword?'text':'password'"
								label="Password"
								v-model="password"
								:counter="passwordMinLength"
								:rules="passwordRules"
								hint="Your password must be at least 12 characters long"
								required
						></v-text-field>
					</v-flex>
					<v-flex>
						<v-text-field
								type="password"
								:append-icon="showPassword?'visibility':'visibility_off'"
								:append-icon-cb="() => (showPassword = !showPassword)"
								:type="showPassword?'text':'password'"
								label="Password confirmation"
								v-model="passwordRepeat"
								:rules="passwordConfirmationRules"
								required
						></v-text-field>
					</v-flex>
					<v-btn @click.native="register"
					       :disabled="!valid || !doPasswordMatch"
					>Register</v-btn>
				</v-form>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
    import config from '../config/base';
    import authMixin from '../mixins/auth';

    export default {
        name: 'RegisterPage',

        mixins: [authMixin],

        middleware: 'guest',

        layout: 'auth',

        data() {
            return {
                valid        : false,
                username     : '',
                usernameRules: [
                    v => !!v || 'Username is required',
                    v => v.length >= 3 || 'The username must be at least 3 characters long',
                ],
                email        : '',
                emailRules   : [
                    v => !!v || 'An email is required',
                    value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                        return pattern.test(value) || 'Invalid e-mail.';
                    },
                ],

                // Password-related data
                showPassword             : false,
                password                 : '',
                passwordRepeat           : '',
                passwordMinLength        : 12,
                passwordRules            : [
                    v => !!v || 'Password is required',
                    v => v.length >= this.passwordMinLength || 'Password must be long enough',
                ],
                passwordConfirmationRules: [
                    v => !!v || 'The password must be confirmed',
                    v => v === this.password || 'The passwords must match', //TODO The error message is not updated when changing the `password` v-model
                ],
            };
        },

        computed: {
            doPasswordMatch() {
                return this.password === this.passwordRepeat;
            },
        },

        methods: {
            register() {
//                console.log(`Register with username [${this.username}], email [${this.email}] and password [${this.password}]`); //DEBUG
                // If the creation is ok, this will redirect to the default page after a successful login
                // Try to create an account on the server, and display the response
                this.$store.dispatch('auth/register', {
                    username: this.username,
                    email   : this.email,
                    password: this.password,
                    router  : this.$router, //XXX I need to pass the router so that the Vuex action can modify the url
                });
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
