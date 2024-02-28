<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
import { ref } from "vue";
const playerSearch = ref("");
const errorSpan = ref("");

// async function fetchPlayer() {

// }

function hasOneAndOnlyOneHash(str) {
  const matches = str.match(/#/g);
  return matches && matches.length === 1;
}

function hashToWord(inputString) {
  let outputString = inputString.replace(/#/g, "TAG");
  return outputString;
}

// FUNCTION THAT VERIFY THAT STRING HAS AT LEAST 3 CHAR AFTER HASH

function verifyStringAfterHash(inputString) {
  let indexHashtag = inputString.indexOf("#");
  if (indexHashtag !== -1 && inputString.length >= indexHashtag + 4) {
    let subStringAfterHash = inputString.substring(
      indexHashtag + 1,
      indexHashtag + 4
    );
    if (subStringAfterHash.length >= 3) {
      return true;
    }
  }
  return false;
}

function verifyStringAfterHashNoMoreThanFiveChars(inputStr) {
  let indexHash = inputStr.indexOf("#");
  if (indexHash !== -1) {
    let subStringAfterHashTag = inputStr.substring(indexHash + 1);
    return subStringAfterHashTag.length > 5;
  }
}

function fetchPlayer() {
  if (
    playerSearch.value === "" ||
    !hasOneAndOnlyOneHash(playerSearch.value) ||
    playerSearch.value.length < 6 ||
    playerSearch.value.length > 30 ||
    !verifyStringAfterHash(playerSearch.value) ||
    verifyStringAfterHashNoMoreThanFiveChars(playerSearch.value)
  ) {
    errorSpan.value = "Insert a valid NickName and Tag";
    return;
  }

  router.push({
    name: "PlayerDetail",
    params: { slug: hashToWord(playerSearch.value) },
  });
}
</script>

<template>
  <section class="search_section bg-[#1C1C1F]">
    <div class="container my-0 mx-auto px-4 h-[50px]">
      <form id="searchPlayer">
        <div class="flex justify-center">
          <label
            for="search-dropdown"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          ></label>
          <button
            id="dropdown-button"
            data-dropdown-toggle="dropdown"
            class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            type="button"
          >
            EUW
            <!-- <svg
            class="w-2.5 h-2.5 ms-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 4 4 4-4"
            />
          </svg> -->
          </button>
          <!-- <div
          id="dropdown"
          class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            class="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdown-button"
          >
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >EUW</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >NA</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >News</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >Finance</a
              >
            </li>
          </ul>
        </div> -->
          <div class="relative w-full max-w-[700px]">
            <input
              v-model="playerSearch"
              type="search"
              id="search-dropdown"
              class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
              placeholder="Insert your Summoner Name"
            />
            <button
              type="submit"
              @click.prevent="fetchPlayer()"
              class="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-[#5383E8] rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                class="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="container w-[614px] my-0 mx-auto">
          <span class="text-red-600 text-xs">{{ errorSpan }}</span>
        </div>
      </form>
    </div>
  </section>
</template>

<style>
.search_section {
  height: calc(100vh - 96px);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
