const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

// API KEY THAT AS TO BE REGENERATED AND PASTED HERE EVERY 24H FROM RIOT CLIENT (JUST CAUSE IS THE BASIC API_KEY)

const API_KEY = "RGAPI-1690c37f-0cf9-41aa-8b74-161d876b16fb"

function getPlayerPUUID(playerName) {
    return axios.get("https://europe.api.riotgames.com" + "/riot/account/v1/accounts/by-riot-id/" + playerName + "?api_key=" + API_KEY )
    .then(response => {
        console.log(response.data);
        return response.data.puuid
    }).catch(err => err);
}

app.get('/past10Games', async (req, res) =>{
    const playerName = req.query.username;
    console.log(playerName);
    const PUUID = await getPlayerPUUID(playerName);
    const API_CALL = "https://europe.api.riotgames.com" + "/lol/match/v5/matches/by-puuid/" + PUUID + "/ids?start=0&count=20" + "&api_key=" + API_KEY

    const gameIDs = await axios.get(API_CALL)
    .then(response => response.data)
    .catch(err => err)

    console.log(gameIDs);

    let matchDataArray = [];
    for (let i = 0 ; i < gameIDs.length - 10 ; i++ ) {
        const matchID = gameIDs[i];
        const matchData = await axios.get("https://europe.api.riotgames.com" + "/lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY)
        .then(response => response.data)
        .catch(err => err)
        matchDataArray.push(matchData)
    }
    const SUMMONER_ID = matchDataArray[0].info.participants.find((p) => p.puuid === PUUID).summonerId;
    const arrayWithPUUID = [matchDataArray,PUUID,SUMMONER_ID];    
    res.json(arrayWithPUUID);

});

app.get('/summonerRankedInfos', async (req, res) =>{
    const playerSummonerID = req.query.summonerID;
    console.log(playerSummonerID);
    let rankedInfos = [];
    const API_CALL_RANKED_INFOS = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + playerSummonerID + "?api_key=" + API_KEY

    rankedInfos = await axios.get(API_CALL_RANKED_INFOS)
    .then(response => response.data)
    .catch(err => err)

    console.log(rankedInfos);
 
    res.json(rankedInfos);

});

app.listen(4000, function(){
    console.log("Server started on port 4000");
});