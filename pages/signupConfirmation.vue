<template>
	<v-container fluid fill-height>
		<v-layout justify-center align-center>
			<v-flex text-xs-center>
				<h4>Congratulations {{ username }}, you have successfully created an account!</h4>
				<h5>We just sent you a confirmation link on your email for validating your account.</h5>
				<v-flex>
					<v-btn nuxt to="/">Homepage</v-btn>
					<v-btn nuxt to="/snap">Create a new snap</v-btn>
					<v-btn nuxt :to="profileLink">Go to your account profile</v-btn>
				</v-flex>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
    import config from '../config/base';
    import authMixin from '../mixins/auth';

    export default {
        name: 'RegisterConfirmationPage',

        mixins: [authMixin],

        middleware: 'authenticated',

        layout: 'auth',

        data() {
            return {
                //
            };
        },

        mounted() {
//            console.log(`-----------> signupConfirmation mounted!`); //DEBUG
        },

        computed: {
            profileLink() {
                return `/profile/${this.$store.getters['auth/getUsername']}`;
            },

            userSnapsLink() {
                return `/${this.$store.getters['auth/getUsername']}/snaps`;
            },

            username() {
                return this.$store.getters['auth/getUsername'];
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
