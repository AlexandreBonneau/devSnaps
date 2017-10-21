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
		<utility-elements></utility-elements>
	</v-layout>
</template>

<script>
    import Snap from '../components/Snap.vue';
    import UtilityElements from '../components/UtilityElements.vue';

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
            UtilityElements,
            Snap,
        },

        props: [
            //
        ],

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
        },

        mounted() {
            // Fetch the snap data from the server
            console.log(`Getting data from the server...`); //DEBUG
//            this.snaps = this.getSnaps();
            this._getSnaps();
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss">
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
