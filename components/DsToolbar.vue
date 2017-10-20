<template>
	<v-toolbar fixed app>
		<v-toolbar-side-icon @click="toggleDrawer"></v-toolbar-side-icon>
		<nuxt-link to="/" class="homeLink">
			<v-toolbar-title v-text="title"></v-toolbar-title>
		</nuxt-link>
		<!--//FIXME Add permanent link to the 'create new snap', 'the user profile' or the 'login + sign up' buttons-->
		<!--//FIXME Also add a permanent search box-->
	</v-toolbar>
</template>

<script>
    export default {
        name: 'DsToolbar',

        props: [
            'title',
        ],

        data() {
            return {
                //
            };
        },

        methods: {
            toggleDrawer() {
                this.$store.commit('navigationDrawer/toggleDrawer');
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.homeLink {
		text-decoration: none;
	}
</style>
