<script setup lang='ts'>
const prompt = ref('');
const loading = ref(false);
const toast = useToast();

const { data: exams } = await useFetch<any>('/api/schema');

const pasteText = (event: ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain');
    if (text) {
        prompt.value = text;
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;

        // 현재 선택된 범위 가져오기
        const range = selection.getRangeAt(0);

        // 텍스트 노드 생성 및 삽입
        range.deleteContents(); // 기존 선택된 내용 제거
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // 커서를 삽입된 텍스트 뒤로 이동
        range.setStartAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

const handleInput = (event: any) => {
    const text = event.target.innerText;
    prompt.value = text
};

const moveModelPage = (event: any) => {
    if (event.ctrlKey || event.shiftKey || event.metaKey) {
        console.log('Enter key pressed without any modifier keys');
        return;
    }
    event.preventDefault();
    if (!prompt.value) {
        toast.add({ title: '내용을 입력해주세요!' });
        return;
    }
    if (prompt.value.length < 2) {
        toast.add({ title: '2자 이상 입력해주세요!' });
        return;
    }
    loading.value = true;
    navigateTo({ path: '/model', query: { prompt: encodeURIComponent(prompt.value) } })
}
const moveDataPage = (rest: string, schema: string) => {
    loading.value = true;
    navigateTo({ path: '/data', query: { rest, schema } })
}

const moveGemini = () => navigateTo('https://gemini.google.com/', { open: { target: 'gemini' } })
const moveFirebase = () => navigateTo('https://firebase.google.com/', { open: { target: 'firebase' } })
const moveJocoding = () => navigateTo('https://www.youtube.com/@jocoding', { open: { target: 'jocoding' } })
</script>

<template>
    <div class="w-full flex flex-col items-center gap-3 p-3">
        <div class="logo">Gurabase</div>
        <div>
            <p class="slogan">Gemini와 함께 창의적인 데이터를 손쉽게 만들어 보세요!</p>
            <p class="slogan2 mt-6">무엇을 만들고 계신가요?</p>
            <p class="slogan2">{{ `심지어, <typescript type>, <java dto> 넣어도 됩니다!` }}</p>
        </div>
        <div contenteditable="true"
            class="relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-base px-3.5 py-2.5 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 whitespace-pre-wrap"
            @paste="pasteText" @input="handleInput" @keypress.enter="moveModelPage">
        </div>
        <UButton class="submit" :loading="loading" @click="moveModelPage">Get Started</UButton>
        <div class="mt-10 flex flex-col items-center gap-1">
            <UDivider class="my-3">
                <div class="flex items-center gap-1">
                    <UIcon name="i-heroicons-circle-stack" />
                    <span>Recent data</span>
                </div>
            </UDivider>
            <div class="flex flex-wrap gap-1">
                <template v-for="{ id, rest } in exams">
                    <UButton color="white" @click="moveDataPage(rest, id)">{{ rest }}</UButton>
                </template>
            </div>
        </div>

        <div class="mt-10 flex flex-col items-center gap-1">
            <p>
                Powered by
                <span class="text-blue-500 underline cursor-pointer" @click="moveGemini()">Gemini</span>,
                <span class="underline cursor-pointer" @click="moveFirebase()">Firebase</span>,
                and
                <span class="underline cursor-pointer" @click="moveJocoding()">Jocoding</span>
            </p>
            <p>&copy; 2024 Gurabase. All rights reserved.</p>
        </div>
    </div>
</template>

<style lang='scss' scoped></style>
