<script setup lang='ts'>
import type { MultiFormatResponseType } from '~/types/comm-type';
import hljs from 'highlight.js';

const route = useRoute();
const prompt = decodeURIComponent(String(route.query.prompt));
const labels = [
    { label: 'JSON Schema', language: 'json' },
    { label: 'Typescript Type', language: 'typescript' },
    { label: 'Java Dto', language: 'java' },
];

const { data } = await useFetch<MultiFormatResponseType>('/api/model', {
    params: { prompt },
});

if (!data.value) {
    //bomb!
    throw new Error();
}

const { error, rest, formats } = data.value;
if (error) {
    //bomb!
    throw new Error();
}

const items = formats.map(f => ({ ...f, label: labels.find(l => l.language === f.language)?.label }));
const loading = ref(false);

const moveDataPage = async () => {
    loading.value = true;
    const { data } = await useFetch<any>('/api/schema', {
        method: 'POST',
        body: { rest, schema: items[0].content },
    });
    const { id } = data.value;
    navigateTo({ path: '/data', query: { rest, schema: id } })
}
</script>

<template>
    <div class="w-full h-dvh flex flex-col gap-3">
        <div class="mt-3">
            <div class="logo sm">/{{ rest }}</div>
            <div class="slogan2">{{ prompt }}</div>
        </div>
        <UButton class="submit" :loading="loading" @click="moveDataPage">Generate</UButton>
        <div class="flex-1 ">
            <UTabs :items="items">
                <template #item="{ item: { content, language } }">
                    <div class="text-sm">
                        <pre>
                            <code class="hljs mb-0 p-4 min-h-full overflow-auto"
                                v-html="hljs.highlight(content, { language }).value" />
                        </pre>
                    </div>
                </template>
            </UTabs>
        </div>
    </div>
</template>

<style lang='scss' scoped></style>
