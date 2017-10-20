<template>
	<v-navigation-drawer
			temporary
			:mini-variant="miniVariant"
			:clipped="clipped"
			:value="$store.state.navigationDrawer.showDrawer"
			@input="toggleDrawer"
			app
	>
			<!--@input="toggleDrawer"-->
			<!--v-model="$store.state.navigationDrawer.showDrawer"-->
		<v-list>
			<v-list-tile v-if="miniVariant"
			             @click.stop="miniVariant = !miniVariant"
			>
				<v-list-tile-action>
					<v-icon>chevron_right</v-icon>
				</v-list-tile-action>
			</v-list-tile>
			<v-list-tile avatar tag="div">
				<v-list-tile-avatar>
					<nuxt-link to="/">
						<svg class="logo">
							<use xlink:href="svg-defs.svg#logo-devSnaps"></use>
						</svg>
					</nuxt-link>
				</v-list-tile-avatar>
				<v-list-tile-content>
					<v-list-tile-title>Dev Snaps</v-list-tile-title>
				</v-list-tile-content>
				<v-list-tile-action>
					<v-btn icon @click.stop="miniVariant = !miniVariant">
						<v-icon>chevron_left</v-icon>
					</v-btn>
				</v-list-tile-action>
			</v-list-tile>
		</v-list>
		<v-list>
			<v-divider></v-divider>
			<v-list-tile
					router
					:to="item.to"
					:key="i"
					v-for="(item, i) in items"
			>
				<v-list-tile-action>
					<v-icon v-html="item.icon"></v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title v-text="item.title"></v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
    export default {
        name: 'DsDrawer',

        data() {
            return {
                clipped    : false,
                items      : [
                    { icon: 'home', title: 'Home', to: '/' },
                    { icon: 'view_quilt', title: 'All Snaps', to: '/snaps' },
//                    { icon: 'search', title: 'Search the posts', to: '/search' },
                    { icon: 'star', title: 'Selected posts', to: '/favorites' },
                    { icon: 'whatshot', title: 'Hot posts', to: '/hot' },
                    { icon: 'assignment', title: 'My Snaps', to: `/${this.$store.state.auth.currentUser}/snaps` },

                    { icon: 'add_box', title: 'Create a new Snap', to: '/snap' },
                    { icon: 'book', title: 'Documentation', to: '/hi' },
                    { icon: 'input', title: 'Login', to: '/login' },
                    { icon: 'account_box', title: 'Sign up', to: '/signup' }, //FIXME Only display if a user is not logged in
//                    { icon: 'insert_chart', title: 'Statistics', to: '/stats' },
                    { icon: 'settings', title: 'Settings', to: `/profile/${this.$store.state.auth.currentUser}` },
//                    { icon: 'file_download', title: 'Export all your snaps', to: `/${this.$store.state.auth.currentUser}/export` }, //FIXME Only display if a user is logged in //FIXME Display that only in the settings page
                    { icon: 'power_settings_new', title: 'Logout', to: '/logout' }, //FIXME Only display if a user is logged in
                    { icon: 'delete_forever', title: 'Testing a single snap', to: '/acid/snap/5/the-slug-to-use' }, //FIXME Delete this (only used for tests)
                ],
                miniVariant: false,
            };
        },

        methods: {
            toggleDrawer(payload) {
                if (!payload) {
                    // Only toggle back the drawer if this tries to hide it
                    // The 'hide' action is done when user clicks on the scrim
                    // If I were to commit 'toggleDrawer' in all cases, I end up having an infinite loop
                    this.$store.commit('navigationDrawer/toggleDrawer');
                }
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.logo {
		color : #76F8FF;
		width : 40px;
	}
</style>
