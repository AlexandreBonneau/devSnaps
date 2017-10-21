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
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	//
</style>
