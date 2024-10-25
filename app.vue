<template>
  <div>
    <button @click="onError">Error</button>
  </div>
</template>

<script lang="ts" setup>
function onError() {
  throw new Error("this is test error!!!");
}
</script>
