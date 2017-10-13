<template>
	<v-app dark>
		<v-navigation-drawer
				temporary
				:mini-variant="miniVariant"
				:clipped="clipped"
				v-model="drawer"
				app
		>
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
		<v-toolbar fixed app>
			<v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
			<nuxt-link to="/" class="homeLink">
				<v-toolbar-title v-text="title"></v-toolbar-title>
			</nuxt-link>
			<!--//FIXME Add permanent link to the 'create new snap', 'the user profile' or the 'login + sign up' buttons-->
			<!--//FIXME Also add a permanent search box-->
		</v-toolbar>
		<main>
			<v-content>
				<v-container>
					<nuxt/>
				</v-container>
			</v-content>
		</main>
		<v-footer :fixed="fixed" app>
			<span>&copy; 2017 DevSnaps</span>
		</v-footer>
	</v-app>
</template>

<script>
    export default {
        data() {
            return {
                clipped    : false,
                drawer     : false, // Hide the drawer by default
                fixed      : false,
                items      : [
                    { icon: 'home', title: 'Home', to: '/' },
                    { icon: 'view_quilt', title: 'All Snaps', to: '/snaps' },
//                    { icon: 'search', title: 'Search the posts', to: '/search' },
                    { icon: 'star', title: 'Selected posts', to: '/favorites' },
                    { icon: 'whatshot', title: 'Hot posts', to: '/hot' },
                    { icon: 'assignment', title: 'My Snaps', to: `/${this.$store.state.currentUser}/snaps` },

                    { icon: 'add_box', title: 'Create a new Snap', to: '/snap' },
                    { icon: 'book', title: 'Documentation', to: '/hi' },
                    { icon: 'input', title: 'Login', to: '/login' },
                    { icon: 'account_box', title: 'Sign up', to: '/signup' }, //FIXME Only display if a user is not logged in
//                    { icon: 'insert_chart', title: 'Statistics', to: '/stats' },
                    { icon: 'settings', title: 'Settings', to: `/profile/${this.$store.state.currentUser}` },
//                    { icon: 'file_download', title: 'Export all your snaps', to: `/${this.$store.state.currentUser}/export` }, //FIXME Only display if a user is logged in //FIXME Dislay that only in the settings page
                    { icon: 'power_settings_new', title: 'Logout', to: '/logout' }, //FIXME Only display if a user is logged in
                    { icon: 'delete_forever', title: 'Testing a single snap', to: '/acid/snap/5/the-slug-to-use' }, //FIXME Delete this (only used for tests)
                ],
                miniVariant: false,
                right      : true,
                rightDrawer: false,
                title      : 'Dev Snaps',
            };
        },

        methods: {
            isLogged() { //FIXME Test this
                return this.$store.state.currentUser !== null;
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.logo {
		color : #76F8FF;
		width : 40px;
	}

	.homeLink {
		text-decoration: none;
	}
</style>
