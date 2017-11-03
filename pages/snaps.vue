<template>
	<v-layout column justify-center align-center>
		<v-flex xs12 sm8 md8 v-if="!initialFetchFailed">
			<div class="text-xs-center">
				<p>Search the <strong>{{ snapCount }}</strong> snaps</p>
				<v-select
						:items="$store.state.snaps.titlesAndContent"
						v-model="search"
						label="Search snaps..."
						autocomplete
				></v-select>
			</div>
			<snap v-for="snap in $store.state.snaps.snaps"
			      :key="snap.id"
			      :id="snap.id"
			      :title="snap.title"
			      :favorite="snap.favorite"
			      :slug="snap.slug"
			      :content="snap.content"
			      :timesViewed="snap.timesViewed"
			      :timesEdited="snap.timesEdited"
			      :createdAt="snap.created_at"
			      :updatedAt="snap.updated_at"
			      :author="author(snap)"
			></snap>
			<v-btn fab
			       dark
			       color="indigo"
			       to="/snap"
			>
			       <!--bottom-->
			       <!--right-->
			       <!--absolute-->
				<v-icon dark>add</v-icon>
			</v-btn>
		</v-flex>
		<v-flex xs12 sm8 md6 v-else>
			<v-alert color="error" icon="warning" value="true">
				Impossible to fetch the snaps from the server.<br>Please check your connection and try again later.
			</v-alert>
			<v-btn @click.native="_getSnaps">Try to fetch the data from the server again</v-btn>
			<!--//FIXME Add a button to try to fetch the data again, without having to reload the page-->
		</v-flex>
	</v-layout>
</template>

<script>
    import Snap from '../components/Snap.vue';

    /**
     * Define the Exception object
     * cf. http://www.sitepoint.com/exceptional-exception-handling-in-javascript/
     *
     * @static
     * @param msg
     */
    function Exception(msg) {
        this.message = msg || '';
        this.name = 'Exception';
    }
    Exception.prototype = new Error();
    Exception.prototype.constructor = Exception;

    export default {
        name: 'SnapList',

        components: {
            Snap,
        },

        data() {
            return {
                initialFetchFailed  : false,
                search              : null, // The search term is empty by default
            };
        },

        computed: {
            snapCount() {
                return this.$store.getters['snaps/snapCount'];
            },
        },

        methods: {
            /**
             * Fetch all the snaps
             */
            _getSnaps() {
                this.$store.dispatch('snaps/getSnaps');
            },

            /**
             * Returns the author username
             *
             * @param {object|null} authorInfo
             * @returns {string}
             */
            author(authorInfo) { //FIXME DRY this with _snapId.vue
                let author = 'Anonymous';
                if (authorInfo !== null && authorInfo.user !== null && authorInfo.user !== void(0)) {
                    author = authorInfo.user.username;
                }

                return author;
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss">

</style>
