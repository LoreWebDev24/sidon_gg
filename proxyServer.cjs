const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

// API KEY THAT AS TO BE REGENERATED AND PASTED HERE EVERY 24H FROM RIOT CLIENT (JUST CAUSE IS THE BASIC API_KEY)

const API_KEY = "RGAPI-6e99f92e-c45e-4aca-879a-045d68ffd64e"

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
    for (let i = 0 ; i < gameIDs.length - 10; i++ ) {
        const matchID = gameIDs[i];
        const matchData = await axios.get("https://europe.api.riotgames.com" + "/lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY)
        .then(response => response.data)
        .catch(err => err)
        matchDataArray.push(matchData)
    }
    const arrayWithPUUID = [matchDataArray,PUUID]    
    res.json(arrayWithPUUID);

})

app.listen(4000, function(){
    console.log("Server started on port 4000");
});