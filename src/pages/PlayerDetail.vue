<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const { slug } = defineProps(["slug"]);
const playerGames = ref([]);
const runesArray = ref([]);


function replaceHashWithSlash(inputString) {
  const stringWithoutHash = inputString.replace(/TAG/g, "/");

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
      console.log(typeof replaceHashWithSlash(slug));
    })
    .catch((error) => {
      console.log(error);
    });

    await axios
    .get("https://ddragon.leagueoflegends.com/cdn/14.4.1/data/en_US/runesReforged.json", {
    })
    .then((resp) => {
      runesArray.value = resp.data;
      console.log( runesArray.value);
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>

<template>
  <section class="games_section bg-[#1C1C1F] pt-[100px]">
    <div class="container my-0 mx-auto">
      <div class="single_game_details h-[130px] border-2 border-[#659BE0] rounded flex bg-[#659BE0]">
        <div class="ml-4 game_info flex flex-col w-[20%] justify-center">
          <span class="text-center"> Vittoria</span>
          <span> Normale </span>
          <span> 13 ore fa </span>
          <span> 15:18 </span>
        </div>
        <div class="icons_and_items_kda flex w-[30%]">
          <div class="flex justify-center items-center">
            <img
              class="w-[60px] h-[60px]"
              src="/public/14.4/img/champion/Kaisa.png"
              alt=""
            />
          </div>
          <div class="ml-3 summoner_spells flex justify-center flex-col">
            <img
              class="w-[30px]"
              src="/public/14.4/img/spell/SummonerFlash.png"
              alt=""
            />
            <img
              class="w-[30px]"
              src="/public/14.4/img/spell/SummonerHeal.png"
              alt=""
            />
          </div>
          <div class="ruines">
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
          <div class="kda flex items-center ml-3">
            <span> 1 / </span>
            <span> 4 / </span>
            <span> 0 </span>
          </div>
        </div>
        <div class="cs_wards w-[20%] flex flex-col justify-center">
          <span> Control Ward 0 </span>
          <span> CS 102 (6.7) </span>
          <span> Ward Palced  12 </span>
        </div>
        <div class="teams_wrapper flex gap-5 w-[30%] justify-end mr-2">
          <div class="team_1_with_champ_icon flex flex-col justify-center">
            <div class="player_with_champ_icon flex gap-1">
              <img
                class="h-[18px] w-[18px]"
                src="/public/14.4/img/champion/Aatrox.png"
                alt=""
              />
              <span> Nicholas </span>
            </div>
            <div class="player_with_champ_icon flex gap-1">
              <img
                class="h-[18px] w-[18px]"
                src="/public/14.4/img/champion/Ahri.png"
                alt=""
              />
              <span> Zuuwu</span>
            </div>
            <div class="player_with_champ_icon flex gap-1">
              <img
                class="h-[18px] w-[18px]"
                src="/public/14.4/img/champion/Akali.png"
                alt=""
              />
              <span> LucyLiu</span>
            </div>
            <div class="player_with_champ_icon flex gap-1">
              <img
                class="h-[18px] w-[18px]"
                src="/public/14.4/img/champion/Camille.png"
                alt=""
              />
              <span> Kiting Deft</span>
            </div>
            <div class="player_with_champ_icon flex gap-1">
              <img
                class="h-[18px] w-[18px]"
                src="/public/14.4/img/champion/Fizz.png"
                alt=""
              />
              <span> Flashpowa</span>
            </div>
          </div>
          <div class="team_2_with_champ_icon flex flex-col justify-center">
            <div class="player_with_champ_icon flex gap-1">
              <img
                class="h-[18px] w-[18px]"
                src="/public/14.4/img/champion/Braum.png"
                alt=""
              />
              <span> CloneDH </span>
            </div>
            <div class="player_with_champ_icon flex gap-1">
              <img
                class="h-[18px] w-[18px]"
                src="/public/14.4/img/champion/Caitlyn.png"
                alt=""
              />
              <span> WS Tonto</span>
            </div>
            <div class="player_with_champ_icon flex gap-1">
              <img
                class="h-[18px] w-[18px]"
                src="/public/14.4/img/champion/Brand.png"
                alt=""
              />
              <span> Peix</span>
            </div>
            <div class="player_with_champ_icon flex gap-1">
              <img
                class="h-[18px] w-[18px]"
                src="/public/14.4/img/champion/Vayne.png"
                alt=""
              />
              <span> Lando</span>
            </div>
            <div class="player_with_champ_icon flex gap-1">
              <img
                class="h-[18px] w-[18px]"
                src="/public/14.4/img/champion/Aphelios.png"
                alt=""
              />
              <span> TΛUGREK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.games_section {
  height: calc(100vh - 96px);
}
</style>
