<template>
  <div>
    <button @click="toPage">INDEX</button>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "test",
});

function toPage() {
  useRouter().push("/");
}
</script>
