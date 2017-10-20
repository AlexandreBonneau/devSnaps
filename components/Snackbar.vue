<template>
	<v-snackbar
			:timeout="$store.state.snackbar.snackbarTimeout"
			:top="$store.state.snackbar.snackbarY === 'top'"
			:bottom="$store.state.snackbar.snackbarY === 'bottom'"
			:right="$store.state.snackbar.snackbarX === 'right'"
			:left="$store.state.snackbar.snackbarX === 'left'"
			:multi-line="$store.state.snackbar.snackbarMode === 'multi-line'"
			:vertical="$store.state.snackbar.snackbarMode === 'vertical'"
			:color="$store.state.snackbar.snackbarColor"
			v-model="snackbar"
	>
		{{ $store.state.snackbar.snackbarText }}
		<v-btn flat
		       color="white"
		       @click.native="_hideSnackbar"
		>Close</v-btn>
	</v-snackbar>
</template>

<script>
    export default {
        name: 'Snackbar',

        data() {
            return {
                //
            };
        },

        computed: {
            snackbar: {
                get() {
                    return this.$store.state.snackbar.snackbar;
                },
                set(value) {
                    this.$store.commit('snackbar/setSnackbar', value);
                },
            },
        },

        methods: {
            /**
             * Hide the snackbar
             */
            _hideSnackbar() {
                this.$store.commit('snackbar/hideSnackbar');
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	//
</style>
