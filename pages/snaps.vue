<template>
	<v-layout column justify-center align-center>
		<v-flex xs12 sm8 md8 v-if="!initialFetchFailed">
			<div class="text-xs-center">
				<p>Search the <strong>{{ snapCount }}</strong> snaps</p>
				<v-select
						:items="titlesAndContent"
						v-model="search"
						label="Search snaps..."
						autocomplete
				></v-select>
			</div>
			<v-card v-for="snap in snaps"
			        :key="snap.id"
			        class="mb-4 elevation-6"
			>
				<v-card-title class="headline"
				              ref="title"
				              contenteditable="true"
				              @value="snap.title"
				              @input="snap.title = $event.target.textContent"
				>
					<v-btn flat
					       icon
					       @click="toggleFavorite(snap.id)"
					>
						<v-icon
								:color="snap.favorite?'amber darken-1':'grey'"
						>star</v-icon>
					</v-btn>
					<nuxt-link :to="`/${snap.id}/${snap.slug}`"
					           class="snapLink"
					>{{ snap.title }}
					</nuxt-link>
				</v-card-title>
				<!--//FIXME Create a link that shows only this snap in a `/18/this-is-its-slug` url-->
				<v-card-text>
					<vue-markdown ref="content"
					              :source="snap.content"
					              @rendered="updateSyntaxHighligthing"
					></vue-markdown>
					<v-container fluid grid-list-sm>
						<!--//TODO Modify those data so it looks better-->
						<v-layout row justify-space-between>
							<v-flex>
								<small>Times viewed: {{ snap.timesViewed }}</small>
							</v-flex>
							<v-flex>
								<small>Times edited: {{ snap.timesEdited }}</small>
							</v-flex>
							<v-flex>
								<small>{{ createdSince(snap) }}</small>
							</v-flex>
							<v-flex>
								<small>{{ updatedSince(snap) }}</small>
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
						       @click="update(snap.id)"
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
						       @click="displayRemoveModal(snap.id, snap.title)"
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
						       :href="urlShare(snap.id, snap.slug)"
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
						       :href="urlSearch(snap.title)"
						       target="_blank"
						       slot="activator"
						>
							<v-icon>public</v-icon>
						</v-btn>
						<span>Query the web with that question</span>
					</v-tooltip>
				</v-card-actions>
			</v-card>
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
			<v-btn @click.native="getSnaps">Try to fetch the data from the server again</v-btn>
			<!--//FIXME Add a button to try to fetch the data again, without having to reload the page-->
		</v-flex>
		<v-dialog v-model="removeDialog" lazy absolute>
			<v-card>
				<v-card-title>
					<div class="headline">Are you sure you want to delete that snap?</div>
				</v-card-title>
				<v-card-text>Deleting the snap [<i>{{ pendingTitleToRemove }}</i>] <strong>cannot be undone</strong>.<br><br>Use with care.</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" flat @click.native="cancelRemove">Cancel</v-btn>
					<v-btn color="red darken-1" @click.native="acceptRemove">Delete</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-snackbar
				:timeout="$store.state.snackbarTimeout"
				:top="$store.state.snackbarY === 'top'"
				:bottom="$store.state.snackbarY === 'bottom'"
				:right="$store.state.snackbarX === 'right'"
				:left="$store.state.snackbarX === 'left'"
				:multi-line="$store.state.snackbarMode === 'multi-line'"
				:vertical="$store.state.snackbarMode === 'vertical'"
				:color="$store.state.snackbarColor"
				v-model="snackbar"
		>
			{{ $store.state.snackbarText }}
			<v-btn flat
			       color="white"
			       @click.native="_hideSnackbar"
			>Close</v-btn>
		</v-snackbar>
	</v-layout>
</template>

<script>
    import axios from '../node_modules/axios/dist/axios.min';
    import VueMarkdown from '../node_modules/vue-markdown/src/VueMarkdown';
    import Prism from '../node_modules/prismjs/prism';
    import moment from '../node_modules/moment/moment';
    import config from '../config/base';

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
            VueMarkdown,
        },

        props: [
            'snapType',
        ],

        data() {
            return {
                removeDialog        : false, // The modal is not displayed by default
                pendingIdToRemove   : null, // Keep track of the snap id to remove if the user confirms the action
                pendingTitleToRemove: null, // Keep track of the snap title to remove if the user confirms the action
                snaps               : [], // Store all the existing snaps //TODO Add pagination on this page (or infinite scroll)
                initialFetchFailed  : false,
                titlesAndContent    : [''], // By default, the search terms are empty
                search              : null, // The search term is empty by default
            };
        },

        computed: {
            /**
             * Calculate the number of snaps
             *
             * @returns {number}
             */
            snapCount() {
                return Object.keys(this.snaps).length;
            },

            snackbar: {
                get() {
                    return this.$store.state.snackbar;
                },
                set(value) {
                    this.$store.commit('setSnackbar', value);
                },
            },
        },

        methods: {
            /**
             * Return a English string stating since how many time the snap has been created
             * //TODO i18n this
             *
             * @param {object} snap
             */
            createdSince(snap) {
                return `Created ${moment.utc(snap.created_at+'').fromNow()}`;
            },

            /**
             * Return a English string stating since how many time the snap has been last updated
             * //TODO i18n this
             *
             * @param {object} snap
             */
            updatedSince(snap) {
                return `Updated ${moment.utc(snap.updated_at).fromNow()}`;
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
             * Update the search terms used is the select/autocomplete component
             */
            updateSearchTerms() {
                this.titlesAndContent = ['']; // By default, the search terms are empty
                this.snaps.forEach(snap => {
                    this.titlesAndContent.push(snap.title);
                    this.titlesAndContent.push(snap.content);
                });
            },

            async getSnaps() {
                return await axios.get(`${config.api.baseUrl}/posts`)
                    .then(response => {
                        this.snaps = response.data;
//                        console.log(`Snaps fetched!`); //DEBUG

                        // The fetch succeeded
                        this.initialFetchFailed = false;

                        // Tell the world about it
                        this._showSnackbar(`${this.snaps.length} snaps have been fetched successfully.`, 'success');

                        // Setup the search terms
                        this.updateSearchTerms();
                    },
                          error => { // Response handler (rejected)
                              const errorMessage = `Impossible to fetch snap data. Please try again in a moment.`;
                              console.error(errorMessage, error); //DEBUG

                              // Send the event to show a flash message
                              this._showSnackbar(errorMessage, 'error');

                              this.initialFetchFailed = true;
                          });
            },

            /**
             * Show a snackbar with the given text
             */
            _showSnackbar(text, type = 'info') {
                this.$store.commit('modifySnackbarColor', type);
                this.$store.commit('modifySnackbarText', text);
                this.$store.commit('showSnackbar');
            },

            /**
             * Hide the snackbar
             */
            _hideSnackbar() {
                this.$store.commit('hideSnackbar');
            },

            /**
             * Show the modal window for the remove confirmation
             */
            displayRemoveModal(id, title) {
                // First display a modal with a confirmation for the deletion
                this.removeDialog = true;
                this.pendingIdToRemove = id;
                this.pendingTitleToRemove = title;
            },

            /**
             * The user confirmed the removal of the snap
             */
            acceptRemove() {
                this.removeDialog = false;
                this.remove(this.pendingIdToRemove);
                this.pendingIdToRemove = null;
                this.pendingTitleToRemove = null;
            },

            /**
             * The user cancelled the removal of the snap
             */
            cancelRemove() {
                this.removeDialog = false;
                this.pendingIdToRemove = null;
                this.pendingTitleToRemove = null;
            },

            /**
             * Remove the snap
             * @param {number} id
             */
            remove(id) {
                // Remove the snap from the server
                axios.delete(`${config.api.baseUrl}/posts/${id}`)
                    .then(response => {
                        console.log(`Snap ${id} deleted!`); //DEBUG

                        // If that worked, also remove the snap from the local object `this.snaps`
                        this.snaps = this.snaps.filter(obj => obj.id !== id);

                        // And also update the search terms
                        this.updateSearchTerms();

                        // Show a confirmation for the user
                        this._showSnackbar(`The snap ${id} has been deleted.`, 'info');
                    },
                          error => { // Response handler (rejected)
                              const errorMessage = `Impossible to remove the snap with id ${id}. Please try again in a moment.`;
                              console.error(errorMessage, error); //DEBUG

                              // Send the event to show a flash message
                              this._showSnackbar(errorMessage, 'error');
                          });
            },

            /**
             * Update the database with the given snap data
             *
             * @param {object} snapData
             * @private
             */
            _updatePost(snapData) {
                // Send the updated data
                axios.put(`${config.api.baseUrl}/posts`, snapData)
                    .then(response => {
                        console.log('response.data:', response.data); //DEBUG

                        // Show a confirmation for the user
                        this._showSnackbar(`The snap ${snapData.id} "${snapData.title}" has been updated.`, 'info');
                    },
                          error => { // Response handler (rejected)
                              const errorMessage = `Impossible to update the snap with id ${snapData.id}. Please try again in a moment.`;
                              console.error(errorMessage, error); //DEBUG

                             // Send the event to show a flash message
                              this._showSnackbar(errorMessage, 'error');
                          }
                     );
            },

            /**
             * Toggle the state of the `favorite` data, then transmit that change to the database
             *
             * @param {number} id
             */
            toggleFavorite(id) {
                // Get the snap data
                const snapArr = this.snaps.filter(snap => snap.id === id)[0];

                // Modify it
                snapArr.favorite = !snapArr.favorite;

                // Save the change in the database
                this._updatePost(snapArr);
            },

            /**
             * Select the snap with the given id, and update the database with its data
             *
             * @param {number} id
             */
            update(id) {
                // Get the snap data
                const snapArr = this.snaps.filter(snap => snap.id === id)[0];

                // Update the edit counter
                snapArr.timesEdited++;

                // Save the change in the database
                this._updatePost(snapArr);
            },

            updateSyntaxHighligthing() {
//                console.log(`updateSyntaxHighligthing called.`, Prism); //DEBUG
                Prism.highlightAll(); //TODO Only call that once once all the snaps contents are loaded, and not for every single snaps
            },
        },

        mounted() {
            // Fetch the snap data from the server
            console.log(`Getting data from the server...`); //DEBUG
            this.snaps = this.getSnaps();
        },

        watch: {
            removeDialog(oldValue, newValue) {
                if (newValue === true) {
                    this.pendingIdToRemove = null;
                    this.pendingTitleToRemove = null;
                }
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss">
	/*@import '../node_modules/prismjs/themes/prism-okaidia.css';*/

	code {
		color: #A9B7C6;
		background-color: #2B2B2B;
		font-weight: 400 !important;
		padding: 0.2rem 0;
		margin: 0;
		border-radius: 3px;
		/*background-color: rgba(27,31,35,.05);*/

		&::after,
		&::before {
			letter-spacing: -.2em;
			content: "\A0";
		}
	}

	.snapLink {
		cursor          : pointer;
		text-decoration : none;
	}

	.removeButton:hover {
		color: #FF5252 !important;
	}

	// CSS rules for the prism.js code highlight
	/**
	 * AciD theme for JavaScript, CSS and HTML
	 * Loosely based on the Okaidia theme
	 * @author Alexandre Bonneau <alexandre.bonneau@linuxfr.eu>
	 */
	code[class*="language-"],
	pre[class*="language-"] {
		color: #A9B7C6;
		background: none;
		text-shadow: 0 1px rgba(0, 0, 0, 0.3);
		font-family: 'DejaVu Sans Mono', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
		font-weight: 400 !important; // I need to force that here since `_transitions.styl` has the code weight at 900!
		text-align: left;
		white-space: pre;
		word-spacing: normal;
		word-break: normal;
		word-wrap: normal;
		line-height: 1.5;
		tab-size: 4;
		hyphens: none;
	}

	/* Code blocks */
	pre[class*="language-"] {
		padding: 1em;
		margin: .5em 0;
		overflow: auto;
		border-radius: 0.3em;
	}

	:not(pre) > code[class*="language-"],
	pre[class*="language-"] {
		background: #2B2B2B;
	}

	/* Inline code */
	:not(pre) > code[class*="language-"] {
		padding: .1em;
		border-radius: .3em;
		white-space: normal;
	}

	.token.class-name {
		color: white;
	}

	.token.comment,
	.token.prolog,
	.token.doctype,
	.token.cdata {
		color: #808080;
	}

	.token.punctuation {
		color: #89BA26;
	}

	.namespace {
		opacity: .7;
	}

	// Html tags
	.token.tag {
		color: #E8BF6A;

		& > .token.punctuation {
			color: #E8BF6A;
		}
	}

	.language-css {
		.token.selector {
			color: white;
		}
	}

	.token.constant,
	.token.symbol,
	.token.deleted {
		color: #f92672;
	}

	.token.boolean {
		color: #06A5E5;
	}

	.token.number {
		color: #B08000;
	}

        .token.property,
	.token.attr-name {
		color: #AE81FF;
	}

	.token.selector,
	.token.char,
	.token.builtin,
	.token.inserted {
		color: #a6e22e;
	}

	.token.string {
		color: #E6DB74;
	}

	.token.operator {
		color: #CE0067;
	}

	.token.entity {
		color: #6D9CBE;
	}

	.token.url,
	.language-css .token.string,
	.style .token.string,
	.token.variable {
		color: #f8f8f2;
	}

	.token.atrule{
		color: #E6DB74;
	}

	.token.attr-value {
		color: #A5C261;
	}

	.token.function {
		color: #A6E22E;
	}

	.token.keyword {
		color: #06A5E5;
	}

	.token.regex{
		color: #fd971f;
	}

	.token.important {
		color: #CE0067;
	}

	.token.bold {
		font-weight: bold;
	}

	.token.italic {
		font-style: italic;
	}

	.token.entity {
		cursor: help;
	}
</style>
