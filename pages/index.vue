<template>
  <div>
    <button @click="toPage">TEST 2</button>
  </div>
</template>

<script lang="ts" setup>
function toPage() {
  useRouter().push("/test-second");
}
</script>
