<script setup lang='ts'>
const prompt = ref('');
const loading = ref(false);
const toast = useToast();

const { data: exams } = await useFetch<any>('/api/schema');

const moveModelPage = () => {
    if (!prompt.value) {
        toast.add({ title: '내용을 입력해주세요!' });
        return;
    }
    if (prompt.value.length < 4) {
        toast.add({ title: '4자 이상 입력해주세요!' });
        return;
    }
    loading.value = true;
    navigateTo({ path: '/model', query: { prompt: encodeURIComponent(prompt.value) } })
}


const moveDataPage = (rest: string, schema: string) => {
    loading.value = true;
    navigateTo({ path: '/data', query: { rest, schema } })
}
</script>

<template>
    <div class="w-full flex flex-col items-center gap-3">
        <div class="logo">Gurabase</div>
        <p class="slogan">Gemini와 함께 창의적인 데이터를 손쉽게 만들어 보세요!</p>
        <p class="slogan2">어떤 서비스 혹은 기능을 만들 예정이신가요?</p>
        <UInput class="w-full" v-model="prompt" size="xl" @keydown.enter="moveModelPage()" autofocus :maxlength="50"
            placeholder="어떤 언어로든 작성 가능합니다" />
        <UButton class="submit" :loading="loading" @click="moveModelPage">Get Started</UButton>

        <div class="mt-10 flex flex-col items-center gap-1">
            <UDivider class="my-3">
                <div class="flex items-center gap-1">
                    <UIcon name="i-heroicons-circle-stack" />
                    <span>Recent data</span>
                </div>
            </UDivider>
            <div class="flex gap-1">
                <template v-for="{ id, rest } in exams">
                    <UButton color="white" @click="moveDataPage(rest, id)">{{ rest }}</UButton>
                </template>
            </div>
        </div>

        <footer class="mt-10 flex flex-col items-center gap-1">
            <p>Powered by <span class="text-blue-500">Gemini</span>, Firebase, Nuxt.js, and Jocoding</p>
            <p>&copy; 2024 Gurabase. All rights reserved.</p>
        </footer>
    </div>
</template>

<style lang='scss' scoped></style>
