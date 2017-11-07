<template>
	<v-layout justify-center>
		<v-flex xs12 sm8 md8>
			<snap v-if="snap !== null"
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
			      :author="author"
			></snap>
		</v-flex>
	</v-layout>
</template>


<script>
    import axios from 'axios';
    import config from '../../../config/base';
    import Snap from '~/components/Snap.vue';

    export default {
        name: 'SnapPage',

        components: {
            Snap,
        },
        //TODO Only show that page if the user is allowed with the correct api token when the post if marked as 'private'

        data() {
            return {
                snap              : null,
                initialFetchFailed: false,
            };
        },

        asyncData({ params, store, error }) {
            // Fetch the snap data from the server
            return axios.get(`${config.api.baseUrl}/posts/${params.snapId}`)
                .then(response => {
                    const snap = response.data;
//                        console.log(`Snap fetched!`, this.snap); //DEBUG
                    if (snap.error) {
                        // cf. https://nuxtjs.org/api/context
                        error({ statusCode: 404, message: 'Error getting this snap id' });
                    }

                    return {
                        snap,
                    };
                },
                      error => { // Response handler (rejected)
                          const errorMessage = `Impossible to fetch snap data. Please try again in a moment.`;
                          console.error(errorMessage, error); //DEBUG

                          // Send the event to show a flash message
                          store.dispatch('snackbar/_showSnackbar', { text: errorMessage, type: 'error' });

                          this.initialFetchFailed = true;
                      });
        },

        mounted() {
            // Increment the view counter each time the snap is showed on this page
            this.$store.dispatch('snaps/incrementSnapViews', this.snap.id);
        },

        computed: {
            author() {
                let author = 'Anonymous';
                if (this.snap !== null && this.snap.user !== null && this.snap.user !== void(0)) {
                    author = this.snap.user.username;
                }

                return author;
            },
        },
    };
</script>
