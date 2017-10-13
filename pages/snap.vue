<template>
	<v-layout column justify-center>
		<v-flex xs12 sm12 md8 lg8>
			<div class="text-xs-center">
				<p>Add a new snap</p>
			</div>
			<v-form v-model="valid" ref="form">
				<v-text-field
						label="Title"
						v-model="title"
						:rules="titleRules"
						:counter="3"
						required
						prepend-icon="event_note"
				></v-text-field>
				<v-text-field
						label="Slug"
						v-model="slug"
						:rules="slugRules"
						required
						prepend-icon="event_note"
				></v-text-field>
				<v-checkbox :label="`Favorite snap? ${favorite?'yes':'no'}`"
				            v-model="favorite"
				></v-checkbox>
				<v-text-field
						label="Content"
						v-model="content"
						:rules="contentRules"
						required
						prepend-icon="insert_comment"
						multi-line
				></v-text-field>
				<v-tooltip bottom
				           open-delay="450"
				>
					<v-btn flat
					       icon
					       nuxt
					       to="/"
					       slot="activator"
					>
						<v-icon>cancel</v-icon>
					</v-btn>
					<span>Cancel the snap creation</span>
				</v-tooltip>
				<v-tooltip bottom
				           open-delay="450"
				>
					<v-btn flat
					       @click.native="clearForm"
					       slot="activator"
					>
						<!--<v-icon>clear</v-icon>-->
						<span>Clear</span>
					</v-btn>
					<span>Clear the form</span>
				</v-tooltip>
				<v-tooltip bottom
				           open-delay="450"
				>
					<v-btn ref="submitButton"
					       @click.native="submit"
					       :loading="loading"
					       :disabled="loading || !valid"
					       slot="activator"
					>
						<v-icon>add</v-icon>
						<span>Add snap</span>
					</v-btn>
					<span>Add snap</span>
				</v-tooltip>
			</v-form>
		</v-flex>
	</v-layout>
</template>

<script>
    import axios from '../node_modules/axios/dist/axios.min';

    export default {
        name: 'AddSnapPage',

        components: {
            //
        },

        props: [
            //
        ],

        data() {
            return {
                valid           : false,
                title           : '',
                content         : '',
                titleRules      : [
                    v => !!v || 'A title is required',
                    v => (v !== null && v.length >= 3) || 'Title must be at least 3 characters long',
                ],
                contentRules    : [
                    v => !!v || 'An empty content is not allowed',
//                    v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
                ],
                slugRules       : [ //FIXME à terminer
//	                v => this.checkCharInStr(v, [' ', '?', '+', '&']),
                ],
                loading         : false,
                modifyingTheSlug: false, // Keep track if the user is currently modifying the slug
                favorite        : false, // Is this snap a favorite?
            };
        },

        computed: {
            slug: {
                get() {
                    if (this.title !== null) {
                        return this.slugify(this.title);
                    }

                    return '';
                },
                set(newValue) {
                    if (!this.modifyingTheSlug && this.slug !== newValue) {
                        this.modifyingTheSlug = true; // This prevent calling the computed setter in an infinite loop
                        this.slug = newValue;
                        this.modifyingTheSlug = false;
                    }
                },
            },
        },

        methods: {
            checkCharInStr(string, substringsArray) { //FIXME à tester
                return substringsArray.some(v => string.indexOf(v) >= 0);
            },

            submit() {
                console.log(`Submitting the new snap...`); //DEBUG
//                console.log('this.$refs.submitButton:', this.$refs.submitButton); //DEBUG
//                console.log('this.$refs.submitButton.$el:', this.$refs.submitButton.$el); //DEBUG
//                this.$refs.submitButton.$el.submit();

                if (this.$refs.form.validate()) {
//                    console.log(`Form is valid`); //DEBUG
                    // Native form submission is not yet supported
                    this.postSnap();
                }
            },

            postSnap() {
                console.log(`Posting the snap...`); //DEBUG
                const snapData = {
                    title      : this.title,
                    slug       : this.slug,
                    content    : this.content,
                    favorite   : this.favorite,
                    timesViewed: 1, // By default we consider creating the snap count as its first view
                    timesEdited: 0,
                };

                 //FIXME uncomment -->
                // Method 1
                /*
                axios.post('http://devsnaps:4242/posts', snapData)
                    .then(response => {
                        console.log(`Posting was successful.`);
                    }, error => {
                        throw new Error(`Error while trying to post the new snap (sic!).`, error);
                    });
                    */

                // Method 2
                axios({
                    method: 'post',
                    url   : 'http://devsnaps:4242/posts',
                    data  : snapData,
                }).then(response => {
                    console.log(`Posting was successful.`);

                    // Then redirect to the all snaps page
                    //TODO Redirect to the /user/snaps page instead?
                    this.$router.replace({ path: '/snaps' });
                }, error => {
                    throw new Error(`Error while trying to post the new snap.`, error);
                });
            },

            clearForm() {
                this.$refs.form.reset();
            },

            slugify(text) {
                return text.toString().toLowerCase()
                    .replace(/\s+/g, '-')    // Replace spaces with '-'
                    .replace(/&/g, '-and-')  // Replace & with 'and'
                    .replace(/[^\w-]+/g, '') // Remove all non-word characters
                    .replace(/--+/g, '-');   // Replace multiple '-' with a single '-'
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
