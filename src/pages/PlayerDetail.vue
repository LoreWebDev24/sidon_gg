<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const { slug } = defineProps(["slug"]);
const playerGames = ref([]);
const PUUID = ref("");
// let matchResult = ref("");
// const runesArray = ref([]);

function isCurrentPlayer(partecipant){
  return partecipant.puuid === PUUID
}



function getmatchResult(game) {
  let participant = game.info.participants.find(p => p.puuid === PUUID.value);
  if(participant === undefined) {
    return 
    
  }
  return participant.win;
}

function replaceHashWithSlash(inputString) {
  const stringWithoutHash = inputString.replace(/TAG/g, "/");

  return stringWithoutHash;
}

function timestampToDate(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; 
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedDate = `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  const formattedDateTime = `${formattedDate} ${formattedTime}`;

  return formattedDateTime;
}

// function daysAgoFromTimestamp(timestamp) {
//   const currentTimestamp = new Date().getTime();
//   const differenceInMillis = currentTimestamp - timestamp;
//   const daysAgo = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));

//   return daysAgo;
// }

onMounted(async () => {
  await axios
    .get("http://localhost:4000/past10Games", {
      params: { username: replaceHashWithSlash(slug) },
    })
    .then((resp) => {
      playerGames.value = resp.data[0];
      PUUID.value = resp.data[1];
      console.log(playerGames.value, PUUID.value);
      console.log(slug);
      console.log(replaceHashWithSlash(slug));
      console.log(typeof replaceHashWithSlash(slug));
    })
    .catch((error) => {
      console.log(error);
    });

  // await axios
  // .get("https://ddragon.leagueoflegends.com/cdn/14.4.1/data/en_US/runesReforged.json", {
  // })
  // .then((resp) => {
  //   runesArray.value = resp.data;
  //   console.log( runesArray.value);
  // })
  // .catch((error) => {
  //   console.log(error);
  // });
});
</script>

<template>
  <section class="games_section bg-[#1C1C1F] pt-[100px] mb-[100px]">
    <div class="container my-0 mx-auto">
      <div class="games_detail_wrapper grid grid-cols-1 gap-7">
        <div
          v-for="game in playerGames"
          class="single_game_details h-[130px] border-[1px] border-[white] rounded flex bg-[#659BE0]"
        >
          <div class="ml-4 game_info flex flex-col w-[20%] justify-center">
            <span class="text-center"> {{ getmatchResult(game)
 }}</span>
            <span> {{ game.info.gameMode }} </span>
            <span> {{ timestampToDate(game.info.gameEndTimestamp) }} </span>
            <span>
              {{
                new Date(game.info.gameDuration * 1000)
                  .toISOString()
                  .slice(14, 19)
              }}
            </span>
          </div>
          <div class="wrapper_kda_and_items flex flex-col w-[30%] gap-3">
            <div class="icons_and_kda flex w-[100%] h-[50%] mt-2">
              <div class="flex justify-center items-center">
                <img
                  class="w-[60px] h-[60px] rounded-[50%]"
                  src="/14.4/img/champion/Samira.png"
                  alt=""
                />
              </div>
              <div class="ml-3 summoner_spells flex justify-center flex-col">
                <img
                  class="w-[26px] rounded-[20%]"
                  src="/public/14.4/img/spell/SummonerFlash.png"
                  alt=""
                />
                <img
                  class="w-[26px] rounded-[20%]"
                  src="/public/14.4/img/spell/SummonerHeal.png"
                  alt=""
                />
              </div>
              <div
                class="ruines flex flex-col justify-center ml-3 items-center"
              >
                <img
                  class="h-[35px] w-[35px]"
                  src="/public/14.4/img/runes/8010.png"
                  alt=""
                />
                <img
                  class="h-[20px] w-[20px]"
                  src="/public/14.4/img/runes/8100.png"
                  alt=""
                />
              </div>
              <div class="kda flex items-center ml-12">
                <span> 1 / </span>
                <span> 4 / </span>
                <span> 0 </span>
              </div>
            </div>
            <div class="items_and_ward">
              <div class="items_wrapper flex gap-2">
                <figure>
                  <img
                    class="h-[34px] w-[34px] rounded-[6%]"
                    src="/14.4/img/item/6673.png"
                    alt=""
                  />
                </figure>
                <figure>
                  <img
                    class="h-[34px] w-[34px] rounded-[6%]"
                    src="/14.4/img/item/3031.png"
                    alt=""
                  />
                </figure>
                <figure>
                  <img
                    class="h-[34px] w-[34px] rounded-[6%]"
                    src="/14.4/img/item/6676.png"
                    alt=""
                  />
                </figure>
                <figure>
                  <img
                    class="h-[34px] w-[34px] rounded-[6%]"
                    src="/14.4/img/item/3036.png"
                    alt=""
                  />
                </figure>
                <figure>
                  <img
                    class="h-[34px] w-[34px] rounded-[6%]"
                    src="/14.4/img/item/6665.png"
                    alt=""
                  />
                </figure>
                <figure>
                  <img
                    class="h-[34px] w-[34px] rounded-[6%]"
                    src="/14.4/img/item/3111.png"
                    alt=""
                  />
                </figure>
                <div class="ward">
                  <figure>
                    <img
                      class="h-[34px] w-[34px]"
                      src="/14.4/img/item/3363.png"
                      alt=""
                    />
                  </figure>
                </div>
              </div>
            </div>
          </div>

          <div
            class="cs_wards w-[20%] flex flex-col justify-center text-center border-l-[1px] border-white ml-14 bl"
          >
            <span> Control Ward: 0 </span>
            <span> CS: 102 (6.7) </span>
            <span> Ward Palced: 12 </span>
            <span> Damage: 41000</span>
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
    </div>
  </section>
</template>

<style></style>
