<template>
	<v-card class="mb-4 elevation-6">
		<v-tabs dark fixed icons centered v-if="editMode">
			<v-tabs-bar>
				<v-tabs-slider></v-tabs-slider>
				<v-tabs-item href="#tab-1">
					<v-icon>mode_edit</v-icon>
					Write
				</v-tabs-item>
				<v-tabs-item href="#tab-2">
					<v-icon>insert_photo</v-icon>
					Preview
				</v-tabs-item>
			</v-tabs-bar>
			<v-tabs-items>
				<v-tabs-content id="tab-1">
					<snap-edit class="pa-3"
							actionSubmit="Update Snap"
							actionSubmitTitle="Update the Snap content"
							actionCancelTitle="Cancel the Snap edition"
							:title="title"
							:slug="slug"
							:favorite="favorite"
							:content="content"
							:id="id"
							@snapSubmitted="_updateSnap"
							@snapCancelled="cancelSnapEdition"
							icon="check"
					></snap-edit>
				</v-tabs-content>
				<v-tabs-content id="tab-2">
					<v-card flat>
						<!--//FIXME Modifying the data in the `snap-edit` does not update the preview since SnapEdit modify its own `titleToUse` data-->
						<v-card-title class="headline">{{ title }}</v-card-title>
						<v-card-text>
							<vue-markdown ref="content"
							              :source="content"
							></vue-markdown>
						</v-card-text>
					</v-card>
				</v-tabs-content>
			</v-tabs-items>
		</v-tabs>
		<template v-else>
			<v-card-title class="headline"
			              ref="title"
			>
				<v-btn flat
				       icon
				       @click="_toggleFavorite(id)"
				>
					<v-icon
							:color="favorite?'amber darken-1':'grey'"
					>star</v-icon>
				</v-btn>
				<nuxt-link :to="`/${author}/snap/${id}/${slug}`"
				           class="snapLink"
				>{{ title }}
				</nuxt-link>
			</v-card-title>
			<v-card-text>
				<vue-markdown ref="content"
				              :source="content"
				></vue-markdown>
				<v-container fluid grid-list-sm>
					<!--//TODO Modify those data so it looks better-->
					<v-layout row justify-space-between>
						<v-chip color="grey darken-2" text-color="white" small dark>
							<v-avatar class="grey darken-1">{{ timesViewed }}</v-avatar>
							Times viewed
						</v-chip>
						<v-chip color="grey darken-2" text-color="white" small dark>
							<v-avatar class="grey darken-1">{{ timesEdited }}</v-avatar>
							Times edited
						</v-chip>
						<v-chip color="grey darken-3" text-color="white" small dark>
							{{ createdSince() }}
						</v-chip>
						<v-chip color="grey darken-3" text-color="white" small dark>
							{{ updatedSince() }}
						</v-chip>
						<v-chip color="grey darken-4" small>
							<nuxt-link :to="authorLink" class="noDecoration">
								<v-avatar>
									<svg class="avatarAnon" v-if="author === 'Anonymous'">
										<use xlink:href="/svg-defs.svg#anonMask"></use>
									</svg>
									<!--//FIXME Get the avatar from the server-->
									<img src="https://randomuser.me/api/portraits/men/35.jpg" v-else :alt="author">
								</v-avatar>
								{{ author }}
							</nuxt-link>
						</v-chip>
						<!--<v-flex>-->
							<!--<small>Author: <nuxt-link :to="authorLink">{{ author }}</nuxt-link></small>-->
						<!--</v-flex>-->
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
					       @click="editMode = true"
					       slot="activator"
					>
						<!--//FIXME Do not display that button if the snap does not belong to the current user-->
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
		</template>
	</v-card>
</template>

<script>
    import axios from 'axios';
    import VueMarkdown from '../node_modules/vue-markdown/src/VueMarkdown';
    import SnapEdit from '~/components/SnapEdit.vue';
    import Prism from '../node_modules/prismjs/prism';
    import moment from '../node_modules/moment/moment';
    import clone from '../node_modules/lodash/cloneDeep';

    export default {
        name: 'Snap',

        components: {
            VueMarkdown,
            SnapEdit,
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
            'author',
        ],

        data() {
            return {
                editMode: false, // By default, the edit form is hidden
            };
        },

        computed: {
            authorLink() {
                return `/${this.author}/snaps`;
            },
        },

        mounted() {
            this.$nextTick(() => {
                // Code that will run only after the entire view has been rendered
                // This makes sure VueMarkdown has finished rendering before calling that
                Prism.highlightAll();
            });
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
                //FIXME When clicking on the scrim instead of the modal buttons, I get an error
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
             * Update the snap with the given data and update the store and the database with its data
             *
             * @param {object} snapData
             */
            _updateSnap(snapData) {
                // Save the change in the database
                this.$store.dispatch('snaps/updateSnap', snapData);
                //TODO If the update is successful, set the `editMode` to `false`
            },

            /**
             * Cancel the current Snap edition
             */
            cancelSnapEdition() {
                this.editMode = false;
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss">
	.snapLink {
		cursor          : pointer;
		text-decoration : none;
	}

	.noDecoration {
		text-decoration : none;
		color : whitesmoke !important;
	}

	.avatarAnon {
		color : whitesmoke;
		width : 20px;
	}

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

