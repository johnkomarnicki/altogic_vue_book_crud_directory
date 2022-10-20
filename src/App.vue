<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <Suspense>
    <RouterView />
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</template>

<style scoped></style>
