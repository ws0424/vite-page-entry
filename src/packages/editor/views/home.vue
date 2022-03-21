<template>
  我是editor-home <img src="../assets/logo.png" alt="" srcset="" />
  <HelloWordVue :msg="data.msg" />
</template>

<script lang="ts" setup>
import HelloWordVue from "@/components/HelloWord.vue";
import data from "@/data/config.json";
</script>
