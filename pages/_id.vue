<template>
	<div class="$componentName$">
		This is the page for id {{ id }}
	</div>
</template>

<script type="text/babel">
    export default {
        name: 'PostId', //FIXME Finish this

        components: {
            //
        },

        props: ['id'], //FIXME Delete this

        data() {
            return {
                //
            };
        },

        computed: {
            //
        },

        methods: {
            //
        },

        mounted() {
            console.log('/_id is ready.'); //DEBUG //FIXME Delete this
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	//
</style>
