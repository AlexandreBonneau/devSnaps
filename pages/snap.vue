<template>
	<v-layout column justify-center>
		<v-flex xs12 sm12 md8 lg8>
			<div class="text-xs-center">
				<p>Add a new Snap</p>
			</div>
			<snap-edit
					actionSubmit="Add Snap"
					actionSubmitTitle="Add a new Snap"
					actionCancelTitle="Cancel the Snap creation"
					@snapSubmitted="postSnap"
					@snapCancelled="cancelSnapEdit"
					icon="add"
			></snap-edit>
		</v-flex>
	</v-layout>
</template>

<script>
    import axios from 'axios';
    import config from '../config/base';
    import SnapEdit from '~/components/SnapEdit.vue';

    export default {
        name: 'AddSnapPage',

        components: {
            SnapEdit,
        },

        methods: {
            postSnap(snapData) {
                this.$store.dispatch('snaps/addSnap', {
                    snapData,
                    router: this.$router, //XXX I need to pass the router so that the Vuex action can modify the url
                });
            },

            cancelSnapEdit() {
                this.$router.push(config.defaultPageUrl);
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
