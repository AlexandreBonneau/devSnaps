<template>
	<v-app dark>
		<ds-drawer></ds-drawer>
		<ds-toolbar :title="title"></ds-toolbar>
		<main>
			<v-content>
				<v-container fill-height>
					<nuxt/>
				</v-container>
			</v-content>
		</main>
		<ds-footer></ds-footer>
		<utility-elements></utility-elements>
	</v-app>
</template>

<script>
    import DsToolbar from '../components/DsToolbar.vue';
    import DsDrawer from '../components/DsDrawer.vue';
    import DsFooter from '../components/DsFooter.vue';
    import UtilityElements from '../components/UtilityElements.vue';
    import config from '../config/base';

    export default {
        data() {
            return {
                title: config.title,
            };
        },

        components: {
            DsToolbar,
            DsDrawer,
            DsFooter,
            UtilityElements,
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
