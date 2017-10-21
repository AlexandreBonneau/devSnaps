<template>
	<v-dialog v-model="$store.state.removeDialog.removeDialog" lazy absolute>
		<v-card>
			<v-card-title>
				<div class="headline">Are you sure you want to delete that snap?</div>
			</v-card-title>
			<v-card-text>Deleting the snap [<i>{{ $store.state.removeDialog.pendingTitleToRemove }}</i>] <strong>cannot be undone</strong>.<br><br>Use with care.</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" flat @click.native="cancelRemove">Cancel</v-btn>
				<v-btn color="red darken-1" @click.native="acceptRemove">Delete</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
    export default {
        name: 'RemoveDialog',

        methods: {
            /**
             * The user confirmed the removal of the snap
             */
            acceptRemove() {
                this.$store.commit('removeDialog/hideRemoveDialog');
                this._removeSnap(this.$store.state.removeDialog.pendingIdToRemove);
                //TODO Use a better mean than `setTimeout` to reset the dialog info _after_ the modal is completely hidden
                window.setTimeout(() => this.$store.commit('removeDialog/setRemoveDialogInfo', { id: null, title: null }), 300);
            },

            /**
             * The user cancelled the removal of the snap
             */
            cancelRemove() {
                this.$store.commit('removeDialog/hideRemoveDialog');
                //TODO Use a better mean than `setTimeout` to reset the dialog info _after_ the modal is completely hidden
                window.setTimeout(() => this.$store.commit('removeDialog/setRemoveDialogInfo', { id: null, title: null }), 300);
            },

            /**
             * Remove the snap of the given `id`
             *
             * @param {number} id
             */
            _removeSnap(id) {
                this.$store.dispatch('snaps/removeSnap', id);
            },
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.removeButton:hover {
		color: #FF5252 !important;
	}
</style>
