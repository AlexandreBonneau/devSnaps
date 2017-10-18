<template>
	<v-footer :fixed="fixed" app>
		<span>&copy; 2017 DevSnaps</span>
	</v-footer>
</template>

<script>
    export default {
        name: 'DsFooter',

        data() {
            return {
                fixed: false,
            };
        },
    };
</script>
