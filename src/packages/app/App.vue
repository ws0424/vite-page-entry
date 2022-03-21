<template>
  我是app
  <HelloWordVue :msg="data.msg" />
  <router-view />
</template>

<script setup lang="ts">
import HelloWordVue from "@/components/HelloWord.vue";
import data from "@/data/config.json";
</script>
