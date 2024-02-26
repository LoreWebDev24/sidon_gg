<script setup>
import axios from "axios";
import  {onMounted, ref} from "vue"
import { useRouter } from "vue-router";
const { slug } = defineProps(["slug"]);
const playerGames = ref([]);

function replaceHashWithSlash(inputString) {

    const stringWithoutHash = inputString.replace(/#/g, '/');

  return stringWithoutHash;
}

onMounted(async () => {
  await axios
    .get("http://localhost:4000/past10Games", {
      params: { username: replaceHashWithSlash(slug) },
    })
    .then((resp) => {
      playerGames.value = resp.data;
      console.log(playerGames.value);
      console.log(slug);
      console.log(replaceHashWithSlash(slug));
      console.log(typeof(replaceHashWithSlash(slug)))
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>

<template></template>

<style></style>
