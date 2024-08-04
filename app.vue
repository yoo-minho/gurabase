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
  letter-spacing: -4px;
  font-size: 84px;
  line-height: 96px;
  font-weight: bold;
  background: linear-gradient(90deg, #3c82f6, #c86fc9);
  -webkit-background-clip: text;
  color: transparent;
  width: fit-content;
}

.logo.sm {
  letter-spacing: -0.05em;
  font-size: 28px;
  line-height: 32px;
}

.slogan {
  font-size: 28px;
  line-height: 32px;
  letter-spacing: -0.5px;
}

.slogan2 {
  font-size: 16px;
  line-height: 20px;
  opacity: 0.7;
  letter-spacing: -0.5px;
}

.submit {
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  background: #1a73e8;
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, .3), 0 4px 8px 3px rgba(60, 64, 67, .15);
  padding-left: 24px;
  padding-right: 24px;
  line-height: 36px;
  border-radius: 24px;
}
</style>