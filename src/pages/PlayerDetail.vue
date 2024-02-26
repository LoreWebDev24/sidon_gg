<script setup>
import axios from "axios";
import  {onMounted, ref} from "vue"
import { useRouter } from "vue-router";
const { slug } = defineProps(["slug"]);
const playerGames = ref([]);

onMounted(async () => {
  await axios
    .get("http://localhost:4000/past10Games", {
      params: { username: slug },
    })
    .then((resp) => {
      playerGames.value = resp.data;
      console.log(playerGames.value);
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>

<template></template>

<style></style>
