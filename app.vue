<script setup lang="ts">
</script>
<template>

  <NuxtLayout>
    <NuxtPage></NuxtPage>
    <UNotifications />
  </NuxtLayout>
</template>
<style>
@font-face {
  font-family: 'SUIT-Regular';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

body {
  font-family: 'SUIT-Regular', sans-serif;
}

.hljs-attr {
  color: #3c82f6;
}

.logo {
  letter-spacing: -0.1rem;
  font-size: 72px;
  line-height: 84px;
  word-break: break-word;
  width: fit-content;
  font-weight: bold;
  background: linear-gradient(90deg, #3c82f6, #c86fc9);
  -webkit-background-clip: text;
  color: transparent;
}

.logo.sm {
  font-size: 28px;
  line-height: 32px;
}

.slogan {
  font-size: 28px;
  line-height: 32px;
  font-weight: 500;
  letter-spacing: -1px;
}

.slogan2 {
  color: rgb(31, 31, 31);
  font-size: 17px;
  font-weight: 400;
  line-height: 26.5px;
}

.submit {
  font-size: 16px;
  justify-content: center;
  background: #1a73e8;
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, .3), 0 4px 8px 3px rgba(60, 64, 67, .15);
  padding-left: 24px;
  padding-right: 24px;
  line-height: 36px;
  border-radius: 24px;
}
</style>