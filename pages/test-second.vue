<template>
  <div>
    <button @click="toPage">INDEX</button>

    <div style="margin-top: 200px">
      <button @click="onAction('zoom-in')">
        <img src="~/assets/img/zoom-plus.svg" alt="" srcset="" />
      </button>

      <button @click="onAction('zoom-out')">
        <img src="~/assets/img/zoom-minus.svg" alt="" srcset="" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "test",
});

function toPage() {
  useRouter().push("/");
}

function onAction(action: string) {
  (window as any).electron.invoke("electron-controls", {
    action,
  });
}
</script>
