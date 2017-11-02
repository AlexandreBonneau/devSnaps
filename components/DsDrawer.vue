<template>
	<v-navigation-drawer
			temporary
			:mini-variant="miniVariant"
			:clipped="clipped"
			:value="$store.state.navigationDrawer.showDrawer"
			@input="toggleDrawer"
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
							<use xlink:href="/svg-defs.svg#logo-devSnaps"></use>
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
					<v-badge color="indigo" v-if="item.to === '/favorites'">
						<v-list-tile-title v-text="item.title"></v-list-tile-title>
						<span slot="badge">{{ snapFavCount }}</span>
					</v-badge>
					<v-list-tile-title v-text="item.title" v-else></v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>
			<v-divider></v-divider>
			<template v-if="isAuthenticated">
				<v-list-tile :to="'/favorites'" router>
					<v-list-tile-action>
						<v-icon v-html="'star'"></v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title v-text="'Favorite snaps'"></v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile :to="userSnapsLink" router>
					<v-list-tile-action>
						<v-icon v-html="'assignment'"></v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title v-text="'My Snaps'"></v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile :to="profileLink" router>
					<v-list-tile-action>
						<v-icon v-html="'settings'"></v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title v-text="'Settings'"></v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile :to="'/logout'" router>
					<v-list-tile-action>
						<v-icon v-html="'power_settings_new'"></v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title v-text="'Logout'"></v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</template>
			<v-list-tile
					v-else
					router
					:to="item.to"
					:key="i"
					v-for="(item, i) in itemsGuest"
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
    import authMixin from '../mixins/auth';

    export default {
        name: 'DsDrawer',

        mixins: [authMixin],

        data() {
            return {
                clipped           : false,
                items             : [
                    { icon: 'home', title: 'Home', to: '/' },
                    { icon: 'view_quilt', title: 'All Snaps', to: '/snaps' },
                    { icon: 'whatshot', title: 'Hot snaps', to: '/hot' },

                    { icon: 'add_box', title: 'Create a new Snap', to: '/snap' },
                    { icon: 'book', title: 'Documentation', to: '/hi' },
//                    { icon: 'insert_chart', title: 'Statistics', to: '/stats' },
                    { icon: 'delete_forever', title: 'Testing a single snap', to: '/acid/snap/5/the-slug-to-use' }, //FIXME Delete this (only used for tests)
                ],
                miniVariant       : false,
                // Only display if a user is not logged in
                itemsGuest        : [
                    { icon: 'input', title: 'Login', to: '/login' },
                    { icon: 'account_box', title: 'Sign up', to: '/signup' },
                ],
            };
        },

        computed: {
            snapFavCount() {
                return this.$store.getters['snaps/snapFavCount'];
            },

            profileLink() {
                return `/profile/${this.$store.getters['auth/getUsername']}`;
            },

            userSnapsLink() {
                return `/${this.$store.getters['auth/getUsername']}/snaps`;
            },
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
