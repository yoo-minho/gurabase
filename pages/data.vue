<script setup lang='ts'>
import hljs from 'highlight.js';

const route = useRoute();
const schema = String(route.query.schema);
const rest = String(route.query.rest);
const url = ref(`${location.origin}/api/${rest}?schema=${schema}`);

const { data } = await useFetch<any>('/api/data', {
    params: { rest, schema },
})

if (!data.value) {
    //bomb!
    throw new Error();
}

const output = hljs.highlight(prettyJsonStr(data.value), { language: 'json' }).value;
</script>
<template>
    <div class="w-full h-dvh flex flex-col gap-3">
        <div class="mt-3">
            <div class="logo sm">/{{ rest }}</div>
        </div>
        <UInput class="w-full tracking-tight" v-model="url" size="xl" disabled />
        <div class="text-sm">
            <pre>
                <code class="hljs mb-0 p-4 block min-h-full overflow-auto" v-html="output"></code>
            </pre>
        </div>
    </div>
</template>

<style lang='scss' scoped></style>
