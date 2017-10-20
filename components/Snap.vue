<template>
	<v-card class="mb-4 elevation-6">
		<v-card-title class="headline"
		              ref="title"
		              contenteditable="true"
		              @value="title"
		              @input="title = $event.target.textContent"
		>
			<v-btn flat
			       icon
			       @click="_toggleFavorite(id)"
			>
				<v-icon
						:color="favorite?'amber darken-1':'grey'"
				>star</v-icon>
			</v-btn>
			<nuxt-link :to="`/${id}/${slug}`"
			           class="snapLink"
			>{{ title }}
			</nuxt-link>
		</v-card-title>
		<!--//FIXME Create a link that shows only this snap in a `/18/this-is-its-slug` url-->
		<v-card-text>
			<vue-markdown ref="content"
			              :source="content"
			              @rendered="updateSyntaxHighligthing"
			></vue-markdown>
			<v-container fluid grid-list-sm>
				<!--//TODO Modify those data so it looks better-->
				<v-layout row justify-space-between>
					<v-flex>
						<small>Times viewed: {{ timesViewed }}</small>
					</v-flex>
					<v-flex>
						<small>Times edited: {{ timesEdited }}</small>
					</v-flex>
					<v-flex>
						<small>{{ createdSince() }}</small>
					</v-flex>
					<v-flex>
						<small>{{ updatedSince() }}</small>
					</v-flex>
				</v-layout>
			</v-container>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-tooltip bottom
			           open-delay="450"
			>
				<v-btn flat
				       icon
				       @click="_updateSnap(id)"
				       slot="activator"
				>
					<v-icon>mode_edit</v-icon>
				</v-btn>
				<span>Edit the snap</span>
			</v-tooltip>
			<v-tooltip bottom
			           open-delay="450"
			>
				<v-btn flat
				       icon
				       @click="displayRemoveModal(id, title)"
				       slot="activator"
				       class="removeButton"
				>
					<v-icon>delete</v-icon>
				</v-btn>
				<span>Delete the snap</span>
			</v-tooltip>
			<v-tooltip bottom
			           open-delay="450"
			>
				<v-btn flat
				       icon
				       :href="urlShare(id, slug)"
				       slot="activator"
				>
					<v-icon>share</v-icon>
				</v-btn>
				<span>Share</span>
			</v-tooltip>
			<v-tooltip bottom
			           open-delay="450"
			>
				<v-btn flat
				       icon
				       color="primary"
				       :href="urlSearch(title)"
				       target="_blank"
				       slot="activator"
				>
					<v-icon>public</v-icon>
				</v-btn>
				<span>Query the web with that question</span>
			</v-tooltip>
		</v-card-actions>
	</v-card>
</template>

<script>
    import axios from '../node_modules/axios/dist/axios.min';
    import VueMarkdown from '../node_modules/vue-markdown/src/VueMarkdown';
    import Prism from '../node_modules/prismjs/prism';
    import moment from '../node_modules/moment/moment';
    import config from '../config/base';
    import clone from '../node_modules/lodash/cloneDeep';

    export default {
        name: 'Snap',

        components: {
            VueMarkdown,
        },

        props: [
            'title',
            'id',
            'favorite',
            'slug',
            'content',
            'timesViewed',
            'timesEdited',
            'createdAt',
            'updatedAt',
        ],

        data() {
            return {
                //
            };
        },

        methods: {
            /**
             * Return a English string stating since how many time the snap has been created
             * //TODO i18n this
             */
            createdSince() {
                return `Created ${moment.utc(this.createdAt+'').fromNow()}`;
            },

            /**
             * Return a English string stating since how many time the snap has been last updated
             * //TODO i18n this
             */
            updatedSince() {
                return `Updated ${moment.utc(this.updatedAt).fromNow()}`;
            },

            /**
             * Return the URL for the given snap id and slug
             *
             * @param {number} snapId
             * @param {string} snapSlug
             * @returns {string}
             */
            urlShare(snapId, snapSlug) {
                return `/${snapId}/${snapSlug}`;
            },

            /**
             * Return the search engine URL with the given query
             *
             * @param {string} query
             * @returns {string}
             */
            urlSearch(query) {
                return `https://duckduckgo.com/?q=${query}&t=ffab`;
            },

            /**
             * Show the modal window for the remove confirmation
             */
            displayRemoveModal(id, title) {
                this.$store.commit('removeDialog/setRemoveDialogInfo', { id, title });
                this.$store.commit('removeDialog/showRemoveDialog');
            },

            /**
             * Toggle the state of the `favorite` data, then transmit that change to the database
             *
             * @param {number} id
             */
            _toggleFavorite(id) {
                this.$store.dispatch('snaps/toggleFavorite', id);
            },

            /**
             * Select the snap with the given id, and update the database with its data
             *
             * @param {number} id
             */
            _updateSnap(id) {
                // Get the snap data
                const snapArr = this.$store.state.snaps.snaps.filter(snap => snap.id === id)[0];
                const modifiableSnap = clone(snapArr); // Cloning is needed since I cannot mutate the snap data outside of Vuex mutation methods

                // Update the edit counter
                modifiableSnap.timesEdited++;

                // Save the change in the database
                this.$store.dispatch('snaps/updateSnap', modifiableSnap);
            },

            updateSyntaxHighligthing() {
//                console.log(`updateSyntaxHighligthing called.`, Prism); //DEBUG
                Prism.highlightAll(); //TODO Only call that once once all the snaps contents are loaded, and not for every single snaps
            },
        },
    };
</script>

<!--the style for the snap is defined in the SnapList for now-->
