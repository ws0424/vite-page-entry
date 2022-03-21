<template>{{ msg }}</template>

<script lang="ts" setup>
defineProps({
  msg: {
    type: String,
    default: "default",
  },
});
</script>

<style></style>
