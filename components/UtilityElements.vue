<template>
	<div class="UtilityElements">
		<remove-dialog></remove-dialog>
		<snackbar></snackbar>
	</div>
</template>

<script type="text/babel">
    import RemoveDialog from './RemoveDialog.vue';
    import Snackbar from './Snackbar.vue';

    export default {
        name: 'UtilityElements',

        components: {
            Snackbar,
            RemoveDialog,
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
            this._getSnaps();
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	//
</style>
