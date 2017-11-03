<template>
	<div>
		<p>The provided snap id is not correct.</p>
		<p>Redirecting to this user snaps page.</p>
	</div>
</template>

<script>
    export default {
        beforeCreate() {
            // Hack to redirect to the user snaps page, when no snapId is given
            setTimeout(() => {
                this.$router.replace(`/${this.$router.currentRoute.params.user}/snaps`);
            }, 1500);
        },
    };
</script>
