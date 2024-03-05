<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const { slug } = defineProps(["slug"]);
const playerGames = ref([]);
const soloQueInfo = ref([]);
const flexInfo = ref([]);
const rankedInfos = ref([]);
const PUUID = ref("");
const SUMMONER_ID = ref("");
let rankImagePath = ref("");
let summonerIcon = ref("");
let isSoloQue = ref(true);
// let isFlex = false;
// const SUMMONER_ID = getSummonerID();

function getPlayerInTheMatch(game) {
  let partecipant = game.info.participants.find((p) => p.puuid === PUUID.value);
  return partecipant;
}

function getSummonerIcon() {
  const player = playerGames.value[0].info.participants.find(
    (p) => p.puuid === PUUID.value
  );
  const icon = player.profileIcon;
  return "/14.4/img/profileicon/" + icon + ".png";
}

function getWinRateInSoloQue() {
  let wins = soloQueInfo.value.wins;
  let losses = soloQueInfo.value.losses;
  let totalSoloQueGames = wins + losses;
  let winRate = ((wins / totalSoloQueGames) * 100).toFixed(2);
  console.log(wins, losses, totalSoloQueGames, winRate);
  return winRate;
}

function getImageOfSoloQueRank() {
  let soloQueRank = rankedInfos.value.find(
    (element) => element.queueType == "RANKED_SOLO_5x5"
  );

  return "/14.4/img/ranks/" + soloQueRank.tier + ".png";
}

function getPathOfThePicture(game, type) {
  const participant = getPlayerInTheMatch(game);
  let runes = undefined;
  if (type === "mainRune") {
    runes = participant.perks.styles[0].selections[0].perk;
  } else if (type === "secondThreeOfRuines") {
    runes = participant.perks.styles[1].style;
  }
  return (
    participant &&
    `/14.4/img/${runes ? "runes" : type}/${
      runes ? runes : participant.championName
    }.png`
  );
}

function getMinutesOfGameDuration(game) {
  const seconds = game.info.gameDuration;
  const minutes = seconds / 60;
  return minutes;
}

function getPlayerSummonerSpellOne(game) {
  let participant = getPlayerInTheMatch(game);
  if (participant === undefined) {
    return;
  }
  return "/14.4/img/spell/" + participant.summoner1Id + ".png";
}

function getPlayerSummonerSpellTwo(game) {
  let participant = getPlayerInTheMatch(game);
  if (participant === undefined) {
    return;
  }
  return "/14.4/img/spell/" + participant.summoner2Id + ".png";
}

function getTotalCs(game) {
  const partecipant = getPlayerInTheMatch(game);
  return (
    partecipant &&
    partecipant.totalMinionsKilled + partecipant.neutralMinionsKilled
  );
}

function getmatchResult(game) {
  const participant = getPlayerInTheMatch(game);
  return participant && participant.win;
}

function replaceHashWithSlash(inputString) {
  const stringWithoutHash = inputString.replace(/TAG/g, "/");

  return stringWithoutHash;
}

function replaceTAGWithHash(inputString) {
  const stringWithHash = inputString.replace(/TAG/g, "#");

  return stringWithHash;
}

function getTypeOfGame(game) {
  const queID = game.info.queueId;
  const gameTypes = [
    {
      id: 400,
      matchType: "Normal Draft",
    },
    {
      id: 420,
      matchType: "Ranked Solo/Duo",
    },
    {
      id: 1900,
      matchType: "URF",
    },
    {
      id: 440,
      matchType: "Flex 5V5",
    },
  ];
  for (let i = 0; i < gameTypes.length; i++) {
    if (gameTypes[i].id === queID) {
      const gameString = gameTypes[i].matchType;
      console.log(gameString);
      return gameString;
    }
  }
  for (let i = 0; i < gameTypes.length; i++) {
    if (gameTypes[i].id !== queID) {
      return "Normal";
    }
  }
}

function getKdaStat(game) {
  const kills = getPlayerInTheMatch(game).kills;
  const deaths = getPlayerInTheMatch(game).deaths;
  const assists = getPlayerInTheMatch(game).assists;

  return ((kills + assists) / deaths).toFixed(1);
}

// function timestampToDate(timestamp) {
//   const date = new Date(timestamp);

//   const year = date.getFullYear();
//   const month = date.getMonth() + 1;
//   const day = date.getDate();
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const seconds = date.getSeconds();

//   const formattedDate = `${month < 10 ? "0" + month : month}-${
//     day < 10 ? "0" + day : day
//   }`;
//   const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
//     minutes < 10 ? "0" + minutes : minutes
//   }`;

//   const formattedDateTime = `${formattedDate} ${formattedTime}`;

//   return formattedDateTime;
// }

function formatNicknameForTeamsDisplay(str) {
  if (str.length > 14) {
    return str.substring(0, 11) + "...";
  } else {
    return str;
  }
}

function formattDamages(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

onMounted(async () => {
  await axios
    .get("http://localhost:4000/past10Games", {
      params: {
        username: replaceHashWithSlash(slug),
        summonerID: SUMMONER_ID.value,
      },
    })
    .then((resp) => {
      playerGames.value = resp.data[0];
      PUUID.value = resp.data[1];
      SUMMONER_ID.value = resp.data[2];
      console.log(playerGames.value, PUUID.value, SUMMONER_ID.value);
      console.log(slug);
      console.log(replaceHashWithSlash(slug));
      console.log(typeof replaceHashWithSlash(slug));
    })
    .catch((error) => {
      console.log(error);
    });

  await axios
    .get("http://localhost:4000/summonerRankedInfos", {
      params: {
        summonerID: SUMMONER_ID.value,
      },
    })
    .then((resp) => {
      rankedInfos.value = resp.data;
      soloQueInfo.value = resp.data.find(
        (element) => element.queueType == "RANKED_SOLO_5x5"
      );
      flexInfo.value = resp.data.find(
        (element) => element.queueType == "RANKED_FLEX_SR"
      );
      console.log(rankedInfos.value);
      rankImagePath.value = getImageOfSoloQueRank();
      summonerIcon.value = getSummonerIcon();
    })
    .catch((error) => {
      console.log(error);
    });

  // EXAMPLE HOW TO TAKE RUNES ETC FROM DDRAGON INSTEAD OF LOCALE FILES

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
  <section
    class="games_section bg-[#1C1C1F] pt-[100px] mb-[100px] text-[#9E9EB1] flex justify-around"
  >
    <div class="container w-[1000px]">
      <div class="games_detail_wrapper grid gap-7 w-[1000px]">
        <template v-for="(game, i) in playerGames">
          <div
            v-if="game.info.endOfGameResult === 'GameComplete'"
            :key="i"
            class="single_game_details h-[160px] rounded flex p-6 w-[1100px]"
            :class="getmatchResult(game) ? 'bg-[#28344E]' : 'bg-[#59343B]'"
          >
            <div
              class="ml-4 game_info flex flex-col w-[15%] justify-center text-sm"
            >
              <span
                class="mb-6 text-[18px] font-bold"
                :class="[
                  getmatchResult(game) === true
                    ? 'text-[#5383E8] '
                    : 'text-[#E84057]',
                ]"
              >
                {{ getmatchResult(game) ? "VICTORY" : "DEFEAT" }}
              </span>
              <span class="font-bold mb-4">
                {{ getTypeOfGame(game) }}
              </span>
              <span class="font-bold text-[16px]">
                {{
                  new Date(game.info.gameDuration * 1000)
                    .toISOString()
                    .slice(14, 19)
                }}
              </span>
              <!--   -->
            </div>
            <div class="wrapper_kda_and_items flex flex-col w-[30%] gap-3">
              <div class="icons_and_kda flex w-[100%] h-[50%] mt-2">
                <div class="flex justify-center items-center">
                  <div class="image_and_level_wrapper relative">
                    <div
                      class="player_level absolute bg min-w-[20px] min-h-[20px] bg-[#202D37] rounded-2xl flex items-center justify-center bottom-0 right-0 font-bold text-sm"
                    >
                      {{ getPlayerInTheMatch(game).champLevel }}
                    </div>
                    <img
                      class="w-[60px] h-[50px] rounded-[50%]"
                      :src="getPathOfThePicture(game, 'champion')"
                      alt=""
                    />
                  </div>
                </div>
                <div class="ml-3 summoner_spells flex justify-center flex-col">
                  <img
                    class="w-[28px] rounded-[20%]"
                    :src="getPlayerSummonerSpellOne(game)"
                    alt=""
                  />
                  <img
                    class="w-[28px] rounded-[20%]"
                    :src="getPlayerSummonerSpellTwo(game)"
                    alt=""
                  />
                </div>
                <div
                  class="ruines flex flex-col justify-center ml-3 items-center"
                >
                  <img
                    class="h-[35px] w-[40px]"
                    :src="getPathOfThePicture(game, 'mainRune')"
                    alt=""
                  />
                  <img
                    class="h-[16px] w-[18px]"
                    :src="getPathOfThePicture(game, 'secondThreeOfRuines')"
                    alt=""
                  />
                </div>
                <div
                  class="kda flex items-center w-[160px] justify-center font-extrabold text-[17px]"
                >
                  <span>
                    {{ getPlayerInTheMatch(game).kills }} <span></span
                  ></span>
                  <span>/ </span>
                  <span> {{ getPlayerInTheMatch(game).deaths }}</span>
                  <span>/ </span>
                  <span> {{ getPlayerInTheMatch(game).assists }}</span>
                </div>
                <span class="text-xs text-center flex items-center"
                  >{{ getKdaStat(game) }} KDA</span
                >
              </div>
              <div class="items_and_ward">
                <div class="items_wrapper flex gap-2">
                  <figure v-if="getPlayerInTheMatch(game).item0">
                    <img
                      class="h-[34px] w-[34px] rounded-[6%]"
                      :src="`/14.4/img/item/${
                        getPlayerInTheMatch(game).item0
                      }.png`"
                      alt=""
                    />
                  </figure>
                  <figure v-else>
                    <div
                      class="h-[34px] w-[34px] rounded-[6%] backdrop-blur-sm bg-white/30"
                    ></div>
                  </figure>
                  <figure v-if="getPlayerInTheMatch(game).item1">
                    <img
                      class="h-[34px] w-[34px] rounded-[6%]"
                      :src="`/14.4/img/item/${
                        getPlayerInTheMatch(game).item1
                      }.png`"
                      alt=""
                    />
                  </figure>
                  <figure v-else>
                    <div
                      class="h-[34px] w-[34px] rounded-[6%] backdrop-blur-sm bg-white/30"
                    ></div>
                  </figure>
                  <figure v-if="getPlayerInTheMatch(game).item2">
                    <img
                      class="h-[34px] w-[34px] rounded-[6%]"
                      :src="`/14.4/img/item/${
                        getPlayerInTheMatch(game).item2
                      }.png`"
                      alt=""
                    />
                  </figure>
                  <figure v-else>
                    <div
                      class="h-[34px] w-[34px] rounded-[6%] backdrop-blur-sm bg-white/30"
                    ></div>
                  </figure>
                  <figure v-if="getPlayerInTheMatch(game).item3">
                    <img
                      class="h-[34px] w-[34px] rounded-[6%]"
                      :src="`/14.4/img/item/${
                        getPlayerInTheMatch(game).item3
                      }.png`"
                      alt=""
                    />
                  </figure>
                  <figure v-else>
                    <div
                      class="h-[34px] w-[34px] rounded-[6%] backdrop-blur-sm bg-white/30"
                    ></div>
                  </figure>
                  <figure v-if="getPlayerInTheMatch(game).item4">
                    <img
                      class="h-[34px] w-[34px] rounded-[6%]"
                      :src="`/14.4/img/item/${
                        getPlayerInTheMatch(game).item4
                      }.png`"
                      alt=""
                    />
                  </figure>
                  <figure v-else>
                    <div
                      class="h-[34px] w-[34px] rounded-[6%] backdrop-blur-sm bg-white/30"
                    ></div>
                  </figure>
                  <figure v-if="getPlayerInTheMatch(game).item5">
                    <img
                      class="h-[34px] w-[34px] rounded-[6%]"
                      :src="`/14.4/img/item/${
                        getPlayerInTheMatch(game).item5
                      }.png`"
                      alt=""
                    />
                  </figure>
                  <figure v-else>
                    <div
                      class="h-[34px] w-[34px] rounded-[6%] backdrop-blur-sm bg-white/30"
                    ></div>
                  </figure>
                  <div class="ward">
                    <figure v-if="getPlayerInTheMatch(game).item6">
                      <img
                        class="h-[34px] w-[34px]"
                        :src="`/14.4/img/item/${
                          getPlayerInTheMatch(game).item6
                        }.png`"
                        alt=""
                      />
                    </figure>
                    <figure v-else>
                      <div
                        class="h-[34px] w-[34px] rounded-[6%] backdrop-blur-sm bg-white/30"
                      ></div>
                    </figure>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="cs_wards w-[20%] flex flex-col justify-center text-center border-l-[1px] border-r-[1px] border-white ml-14 bl text-sm"
            >
              <span class="font-extrabold">
                CS:
                {{ getTotalCs(game) }} ({{
                  (getTotalCs(game) / getMinutesOfGameDuration(game)).toFixed(
                    1
                  )
                }})</span
              >
              <span class="font-bold">
                Damage:
                {{
                  formattDamages(
                    getPlayerInTheMatch(game).totalDamageDealtToChampions
                  )
                }}</span
              >
              <span>
                Control Ward:
                {{ getPlayerInTheMatch(game).visionWardsBoughtInGame }}
              </span>

              <span>
                Ward Palced: {{ getPlayerInTheMatch(game).wardsPlaced }}</span
              >
              <span>
                Vision Score: {{ getPlayerInTheMatch(game).visionScore }}</span
              >
              <div
                class="w-[78px] h-[14px] bg-red-600 flex items-center justify-center text-white rounded-md text-xs my-1 mx-auto"
                v-if="
                  getPlayerInTheMatch(game).pentaKills !== 0 ||
                  getPlayerInTheMatch(game).quadraKills !== 0 ||
                  getPlayerInTheMatch(game).tripleKills !== 0
                "
              >
                <div
                  v-if="
                    getPlayerInTheMatch(game).pentaKills === 0 &&
                    getPlayerInTheMatch(game).quadraKills === 0
                  "
                >
                  <span>Triple Kill</span>
                </div>
                <div
                  v-if="
                    getPlayerInTheMatch(game).pentaKills === 0 &&
                    getPlayerInTheMatch(game).quadraKills > 0
                  "
                >
                  <span>Quadra Kill</span>
                </div>
                <div v-if="getPlayerInTheMatch(game).pentaKills > 0">
                  <span>Pentakiller</span>
                </div>
              </div>
            </div>
            <div class="teams_wrapper w-[35%] flex justify-center">
              <div class="teams_with_champ_icon">
                <div
                  v-for="partecipantOfTheGame in game.info.participants"
                  class="player_with_champ_icon flex gap-2 w-[130px] text-sm whitespace-nowrap"
                >
                  <img
                    class="h-[18px] w-[18px] rounded-[6%]"
                    :src="`/14.4/img/champion/${partecipantOfTheGame.championName}.png`"
                    alt="champion_image"
                  />
                  <span class="">
                    {{
                      formatNicknameForTeamsDisplay(
                        partecipantOfTheGame.riotIdGameName
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-if="playerGames.length > 0" class="container w-[600px] bg-[#515163]">
      <div
        v-if="soloQueInfo"
        class="player_general_details text-center flex justify-center flex-col gap-3 items-center py-20 px-5"
      >
        <img
          class="w-[200px] h-[200px] rounded-[1rem] mb-4"
          :src="summonerIcon"
          alt=""
        />
        <h1>{{ replaceTAGWithHash(slug) }}</h1>
        <div v-if="isSoloQue.value" class="rank_image_wrapper">
          <img class="w-[240px]" :src="rankImagePath" alt="" />
        </div>
        <div v-else>
          <img class="w-[240px]" :src="rankImagePath" alt="" />
        </div>
        <div class="ranked_info">
          <div class="ranked_buttons_wrapper flex">
            <div
              class="soloQ_button h-[60px] w-[300px] flex justify-center items-center bg-[#31313C]"
            >
              <span>Solo Queue </span>
            </div>
            <div
              class="flex_button h-[60px] w-[300px] flex justify-center items-center bg-[#31313C]"
            >
              <span>Flex</span>
            </div>
          </div>
          <div class="solo_que_info" v-if="isSoloQue">
            <h3>{{ soloQueInfo.tier }} {{ soloQueInfo.rank }}</h3>
            <h3>{{ soloQueInfo.leaguePoints }} LP</h3>
            <h3>{{ soloQueInfo.wins }} WIN {{ soloQueInfo.losses }} LOSE</h3>
            <h3>WR {{ getWinRateInSoloQue() }} %</h3>
          </div>
          <div v-else class="flex_info"  @click="console.log('pippo')">
            <div class="flex_info_click">
              <h3>{{ flexInfo.tier }} {{ flexInfo.rank }}</h3>
              <h3>{{ flexInfo.leaguePoints }} LP</h3>
              <h3>{{ flexInfo.wins }} WIN {{ flexInfo.losses }} LOSE</h3>
              <!-- <h3>WR {{ getWinRateInSoloQue() }} %</h3> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.teams_with_champ_icon {
  display: flex;
  flex-flow: column wrap;
  gap: 2px 14px;
  justify-content: center;
}
</style>
