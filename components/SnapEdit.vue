<template>
	<v-form v-model="valid" ref="form">
		<v-text-field
				label="Title"
				v-model="titleToUse"
				:rules="titleRules"
				:counter="3"
				required
				prepend-icon="event_note"
		></v-text-field>
		<v-text-field
				label="Slug"
				v-model="slugToShow"
				:rules="slugRules"
				required
				prepend-icon="event_note"
		></v-text-field>
		<v-checkbox :label="`Favorite snap? ${favoriteToUse?'yes':'no'}`"
		            v-model="favoriteToUse"
		></v-checkbox>
		<v-text-field
				label="Content"
				v-model="contentToUse"
				:rules="contentRules"
				required
				prepend-icon="insert_comment"
				multi-line
		></v-text-field>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-tooltip bottom
			           open-delay="450"
			>
				<v-btn flat
				       icon
				       @click.native="cancelEdition"
				       slot="activator"
				>
					<v-icon>cancel</v-icon>
				</v-btn>
				<span>{{ actionCancelTitle }}</span>
			</v-tooltip>
			<v-tooltip bottom
			           open-delay="450"
			>
				<v-btn flat
				       color="error"
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
				       color="primary"
				       slot="activator"
				>
					<v-icon>{{ icon }}</v-icon>
					<span>{{ actionSubmit }}</span>
				</v-btn>
				<span>{{ actionSubmitTitle }}</span>
			</v-tooltip>
		</v-card-actions>
	</v-form>
</template>

<script>
    export default {
        name: 'SnapEdit',

        props: {
            icon        : {
                type    : String,
                required: false,
                default : 'add', // Default name for the material icon
            },
            actionSubmit     : {
                type    : String,
                required: false,
                default : 'Add Snap',
            },
            actionSubmitTitle: {
                type    : String,
                required: false,
                default : 'Add a new Snap',
            },
            actionCancelTitle: {
                type    : String,
                required: false,
                default : 'Cancel',
            },
            // Snap data
            id               : {
                type    : Number,
                required: false,
            },
            title            : {
                type    : String,
                required: false,
            },
            slug             : {
                type    : String,
                required: false,
            },
            favorite         : {
                type    : Boolean,
                required: false,
                default : false, // Is this snap a favorite?
            },
            content          : {
                type    : String,
                required: false,
            },
        },

        data() {
            return {
                valid           : false,
                titleRules      : [
                    v => !!v || 'A title is required',
                    v => (v !== null && v !== void(0) && v.length >= 3) || 'Title must be at least 3 characters long',
                ],
                contentRules    : [
                    v => !!v || 'An empty content is not allowed',
//                    v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
                ],
                slugRules       : [
                    v => !this.checkCharInStr((this.slugToUse === null || this.slugToUse === void(0))?'':this.slugToUse, [' ', '?', '+', '&']) || `This must not contain the following characters: ' ', '?', '+' or '&'.`,
                ],
                loading         : false,
                modifyingTheSlug: false, // Keep track if the user is currently modifying the slug
                titleToUse      : null,
                slugToUse       : null,
                contentToUse    : null,
                favoriteToUse   : null,
            };
        },

        mounted() {
            this.titleToUse = this.title;
            this.slugToUse = this.slug;
            this.contentToUse = this.content;
            this.favoriteToUse = this.favorite;
        },

        computed: {
            slugToShow: {
                get() {
                    if (this.titleToUse !== null && this.titleToUse !== '' && this.titleToUse !== void(0)) {
                        return this.slugify(this.titleToUse);
                    }

                    return '';
                },
                set(newValue) {
                    if (!this.modifyingTheSlug && this.slugToUse !== newValue) {
                        this.modifyingTheSlug = true; // This prevent calling the computed setter in an infinite loop
                        this.slugToUse = newValue;
                        this.modifyingTheSlug = false;
                    }
                },
            },
        },

        methods: {
            checkCharInStr(string, substringsArray) {
                return substringsArray.some(v => string.indexOf(v) >= 0);
            },

            submit() {
//                console.log(`Submitting the new snap...`); //DEBUG
//                console.log('this.$refs.submitButton:', this.$refs.submitButton); //DEBUG
//                console.log('this.$refs.submitButton.$el:', this.$refs.submitButton.$el); //DEBUG
//                this.$refs.submitButton.$el.submit();

                if (this.$refs.form.validate()) {
                    // Native form submission is not yet supported
                    this.$emit('snapSubmitted', {
                        title      : this.titleToUse,
                        slug       : (this.slugToUse !== void(0))?this.slugToUse:this.slugToShow, //TODO Improve this
                        content    : this.contentToUse,
                        favorite   : this.favoriteToUse,
                        timesViewed: 1, // By default we consider creating the snap count as its first view
                        timesEdited: 0,
                        id         : (this.id !== void(0))?this.id:null,
                    });
                }
            },

            clearForm() {
                this.$refs.form.reset();
            },

            cancelEdition() {
                this.$emit('snapCancelled');
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
