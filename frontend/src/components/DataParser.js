const ParseData = (rawData) => {
    const data = JSON.parse(rawData)

    const matchinfo = data.slice(0, 1)[0]
    const rounds = data.slice(1)

    const parsed = {
        info: {},
        result: {},
        performance: {},
        rounds: {}
    }

    // general match infos as map, rosters, date
    parsed.info = {
        gamemode: matchinfo.gamemode,
        map: matchinfo.map,
        my_team: matchinfo.local_team,
        match_uuid: matchinfo.ubisoft_match_uuid,
        rosters: parseRosters({
            blue_team: matchinfo.r6ui_match_data.blue_team,
            orange_team: matchinfo.r6ui_match_data.orange_team
        }, matchinfo.local_team),
        date: new Date(data[1].start),
    }

    // round history (includes killfeed and round performance)
    parsed.rounds = parseRounds(rounds)

    // match result
    parsed.result = {
        my_team: {
            score: null,
            score_at_half: null,
            atks: null,
            defs: null,
            start_as: null,
            overtime_as: null
        },
        enemy_team: {
            score: null,
            score_at_half: null,
            atks: null,
            defs: null,
            start_as: null,
            overtime_as: null
        }
    }

    console.log("COMPLETE PARSE: ", parsed)
    return parsed
}

const parseRosters = ({ blue_team, orange_team }, my_team_color ) => {
    const players = { ...blue_team, ...orange_team }

    let my_team = []
    let enemy_team = []
    for (const player in players) {
        if (players[player].team.toLowerCase() === my_team_color.toLowerCase()) {
            my_team.push({ [players[player].username]: player })
        }
        else {
            enemy_team.push({ [players[player].username]: player })
        }

    }
    return { my_team, enemy_team }
}

const parseRounds = (rounds) => {
    let roundsArray = []
    rounds.forEach((round, i) => {
        // check if valid round
        if (round.events.length < 3) {
            console.log(`Round ${i} not complete, skipped`)
            return
        }

        // remove useless props
        delete round.start
        delete round.sixthpick

        // round info and result
        round.info = {
            site: round.site,
            my_team_kills: round.end.your_kills,
            enemy_team_kills: round.end.enemy_kills,
            winner: round.end.winner,
            my_team_side: round.end.local_side
        }
        delete round.end
        delete round.site

        // players performance
        round.performance = []
        for (let i = 0; i < 10; i++) {
            round.performance.push(round[`roster_${i}`])
            delete round[`roster_${i}`]
        }

        roundsArray.push(round)
    })

    console.log(roundsArray)
    return roundsArray
}

export default ParseData