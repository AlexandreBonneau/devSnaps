<template>
	<v-toolbar fixed app>
		<v-toolbar-side-icon @click="toggleDrawer"></v-toolbar-side-icon>
		<nuxt-link to="/" class="homeLink">
			<v-toolbar-title v-text="title"></v-toolbar-title>
		</nuxt-link>
		<!--//FIXME Add permanent link to the 'create new snap' page-->
		<v-spacer></v-spacer>
		<v-text-field solo single-line prepend-icon="search" label="Search"></v-text-field>

		<v-menu
				bottom
				left
				offset-y
				v-if="isAuthenticated"
		>
			<v-btn icon slot="activator" dark>
				<v-icon>account_circle</v-icon>
			</v-btn>
			<!--<v-avatar :tile="false" size="40px" dark slot="activator">-->
				<!--<img src="https://vuetifyjs.com/static/doc-images/john.jpg" alt="avatar">-->
			<!--</v-avatar>-->
			<v-card>
				<v-list class="avatarMenuHeader">
					<v-list-tile avatar>
						<v-list-tile-avatar>
							<img src="https://vuetifyjs.com/static/doc-images/john.jpg" alt="John">
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title>{{ username }}</v-list-tile-title>
							<v-list-tile-sub-title>{{ email }}</v-list-tile-sub-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
				<v-list>
					<!--//FIXME DRY this with DsDrawer.vue -->
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
					<v-divider></v-divider>
					<v-list-tile :to="'/logout'" router>
						<v-list-tile-action>
							<v-icon v-html="'power_settings_new'"></v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title v-text="'Logout'"></v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-card>
		</v-menu>
		<template v-else>
			<v-btn dark flat nuxt to="/login">Sign in</v-btn>
			<v-btn dark flat nuxt to="/signup">Register</v-btn>
		</template>
	</v-toolbar>
</template>

<script>
    import authMixin from '../mixins/auth';

    export default {
        name: 'DsToolbar',

        mixins: [authMixin],

        props: [
            'title',
        ],

        data() {
            return {
                //
            };
        },

        computed: {
            profileLink() { //FIXME DRY this with DsDrawer.vue
                return `/profile/${this.$store.getters['auth/getUsername']}`;
            },

            userSnapsLink() { //FIXME DRY this with DsDrawer.vue
                return `/${this.$store.getters['auth/getUsername']}/snaps`;
            },

//            avatar() { //FIXME Uncomment
//                return this.$store.getters['auth/getAvatar'];
//            },

            username() {
                return this.$store.getters['auth/getUsername'];
            },

            email() {
                return this.$store.getters['auth/getEmail'];
            },
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

	.avatarMenuHeader {
		background-color : rgb(51, 55, 62);
	}
</style>
