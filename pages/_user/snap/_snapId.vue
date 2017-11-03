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
    import axios from '../../../node_modules/axios/dist/axios.min';
    import config from '../../../config/base';
    import Snap from '~/components/Snap.vue';

    export default {
        name: 'SnapPage',

        components: {
            Snap,
        },
        //FIXME Only show that page if the user is allowed with the correct api token?

        data() {
            return {
                snap              : null,
                initialFetchFailed: false,
            };
        },

        mounted() {
            // Fetch the snap data from the server
//            console.log(`Getting data from the server...`); //DEBUG
            this.getSnap();
        },

        /*
        async validate({ params }) { //FIXME This does not redirect if the snapId is not found
            const snapData = await axios.get(`${config.api.baseUrl}/posts/${params.snapId}`);
            this.snap = snapData;
            if (snapData.error) {
                // If the snap ID is not found in the database, redirect to a 404 error page
                console.log(`An error has been found!`, snapData); //DEBUG
                return false;
            }

            return true;
        },
        */

        /*
        async fetch({ store, params }) { //TODO Ideally we would prefer to fetch the data in there instead on in 'mounted'
            console.log('params.snapId:', params.snapId); //DEBUG
            console.log('`${config.api.baseUrl}/posts/${params.snapId}`:', `${config.api.baseUrl}/posts/${params.snapId}`); //DEBUG
            const { data } = await axios.get(`${config.api.baseUrl}/posts/${params.snapId}`);
            if (data.error) {
                console.log(`An error has been found!`, data); //DEBUG
            }
        },
        */

        methods: {
            async getSnap() {
                return await axios.get(`${config.api.baseUrl}/posts/${this.$route.params.snapId}`)
                    .then(response => {
                        this.snap = response.data;
//                        console.log(`Snap fetched!`, this.snap); //DEBUG
                        if (this.snap.error) {
                            console.error(`Error getting this snap id`); //DEBUG
                            //FIXME Display a 404 (pending answers from https://github.com/nuxt/nuxt.js/issues/2022)
                            this.$router.replace({ path: '/404' });
                        }
                    },
                          error => { // Response handler (rejected)
                              const errorMessage = `Impossible to fetch snap data. Please try again in a moment.`;
                              console.error(errorMessage, error); //DEBUG

                              // Send the event to show a flash message
                              this.$store.dispatch('snackbar/_showSnackbar', { text: errorMessage, type: 'error' });

                              this.initialFetchFailed = true;
                          });
            },
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
