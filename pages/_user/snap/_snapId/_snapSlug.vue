<template>
	<div>
		<p>This is added only to make sure a {snapId} is passed to /{user}/snap/{snapId}/{snapSlug}</p>
		<p>Index for /{{ $route.params.user }}/snap/{{ $route.params.snapId }}/{{ $route.params.snapSlug }}</p>
	</div>
</template>

<script>
    export default {
        name: 'SnapPageWithSlug',
    };
</script>
