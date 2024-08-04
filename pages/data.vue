<script setup lang="ts">
import hljs from "highlight.js";

const toast = useToast();
const route = useRoute();
const { rest, ...params } = route.query;

const url = ref("...");
const lang = [
    { id: "ko", label: "한국어" },
    { id: "en", label: "영어" },
    { id: "fr", label: "프랑스어" },
    { id: "zh", label: "중국어" },
    { id: "es", label: "스페인어" },
    { id: "ja", label: "일본어" },
];
const selectedLang = ref(lang[0]);
const per_page = [1, 4, 10, 20];
const selectedPerPage = ref(per_page[1]);
const output = ref("");
const loading = ref(false);

const generateData = async (init: boolean) => {
    const paramArr = {
        ...params,
        lang: selectedLang.value.id,
        per_page: selectedPerPage.value,
    };
    !init && (loading.value = true);
    const { data } = await useFetch<any>("/api/data", { params: paramArr });
    !init && (loading.value = false);
    if (data.value) {
        output.value = hljs.highlight(prettyJsonStr(data.value), {
            language: "json",
        }).value;
        const search = new URLSearchParams(paramArr as any).toString();
        url.value = `${location?.origin || ""}/api/${rest}?${search}`;
        loading.value = false;
    }
}

await generateData(true);

const copyLink = async () => {
    if (!url.value || url.value.length < 10) return;
    await navigator.clipboard.writeText(url.value);
    toast.add({ title: '링크 복사 완료! 마음껏 활용하세요!' })
};
</script>
<template>
    <div class="w-full h-dvh flex flex-col gap-3">
        <div class="mt-3">
            <div class="logo sm">/{{ rest }}</div>
            <div class="slogan2 flex items-center justify-between">
                아래 링크를 복사하여 활용하세요!
            </div>
        </div>
        <div
            class="relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-base px-3.5 py-2.5 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400">
            {{ url }}
        </div>
        <div>언어</div>
        <USelectMenu v-model="selectedLang" :options="lang"></USelectMenu>
        <div>아웃풋 건수</div>
        <USelectMenu v-model="selectedPerPage" :options="per_page"></USelectMenu>
        <div class="w-full flex gap-2">
            <UButton class="submit flex-1" :loading="loading" @click="generateData(false)">Re:Generate</UButton>
            <UButton class="submit" @click="copyLink()">Copy</UButton>
        </div>
        <div v-if="!loading" class="text-sm">
            <pre>
                <code class="hljs mb-0 p-4 block min-h-full overflow-auto" v-html="output"></code>
            </pre>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
