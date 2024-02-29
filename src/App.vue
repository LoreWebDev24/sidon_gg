<script setup>
import Header from "./components/Header.vue";
</script>

<template>
  <Header />
  <main>
    <router-view> </router-view>
  </main>
</template>

<style>
body {
  background-color: #1C1C1F;
}
</style>
