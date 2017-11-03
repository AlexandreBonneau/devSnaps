<template>
	<v-app dark>
		<ds-drawer></ds-drawer>
		<ds-toolbar :title="title"></ds-toolbar>
		<main>
			<v-content>
				<v-container fill-height>
					<v-flex column>
						<h4 v-if="error.statusCode === 404">Page not found</h4>
						<h4 v-else>An error has occurred</h4>
						<nuxt-link to="/">Go back to the home page</nuxt-link>
					</v-flex>
				</v-container>
			</v-content>
		</main>
		<ds-footer></ds-footer>
	</v-app>
</template>

<script>
    import DsToolbar from '../components/DsToolbar.vue';
    import DsDrawer from '../components/DsDrawer.vue';
    import DsFooter from '../components/DsFooter.vue';
    import config from '../config/base';

    export default {
        props: ['error'],

        layout: 'auth',

        data() {
            return {
                title: config.title,
            };
        },

        components: {
            DsToolbar,
            DsDrawer,
            DsFooter,
        },
    };
</script>
