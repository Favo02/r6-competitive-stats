const ParseData = (rawData) => {
    const data = JSON.parse(rawData)

    const matchinfo = data.slice(0, 1)[0]
    const performance = matchinfo.r6ui_match_data
    const rounds = data.slice(1)

    const parsed = {
        info: {},
        result: {},
        performance: {},
        roundPerformance: {},
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
    parsed.result = parseResult(parsed.rounds)

    parsed.performance = parsePerformance(parsed.info.rosters, performance)

    parsed.roundPerformance = parseRoundPerformance(parsed.rounds)

    console.log("COMPLETE PARSE:")
    console.log(parsed)
    return parsed
}

const parseRosters = ({ blue_team, orange_team }, my_team_color ) => {
    const players = { ...blue_team, ...orange_team }

    let my_team = []
    let enemy_team = []
    for (const player in players) {
        if (players[player].team.toLowerCase() === my_team_color.toLowerCase()) {
            my_team.push({
                username: players[player].username,
                roster: player
            })
        }
        else {
            enemy_team.push({
                username: players[player].username,
                roster: player
            })
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
            spawn: round.spawn,
            my_team_kills: round.end.your_kills,
            enemy_team_kills: round.end.enemy_kills,
            winner: round.end.winner === round.end.local_team ? "my_team" : "enemy_team",
            my_team_side: round.end.local_side,
            enemy_team_side: round.end.local_side === "attack" ? "defence" : "attack"
        }
        delete round.end
        delete round.site
        delete round.spawn

        // players performance
        round.performance = []
        for (let i = 0; i < 10; i++) {
            round.performance.push(round[`roster_${i}`])
            delete round[`roster_${i}`]
        }

        roundsArray.push(round)
    })

    return roundsArray
}

const parseResult = (rounds) => {

    let result = {
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

    rounds.forEach((round, i) => {
        // round winner (score, score_at_half)
        if (round.info.winner === "my_team") {
            result.my_team.score++
            if (i < 6) {
                result.my_team.score_at_half++
            }

            // atks and defs
            if (round.info.my_team_side === "attack") {
                result.my_team.atks++
            }
            else if (round.info.my_team_side === "defence") {
                result.my_team.defs++
            }
        }
        else if (round.info.winner === "enemy_team") {
            result.enemy_team.score++
            if (i < 6) {
                result.enemy_team.score_at_half++
            }

            // atks and defs
            if (round.info.enemy_team_side === "attack") {
                result.enemy_team.atks++
            }
            else if (round.info.enemy_team_side === "defence") {
                result.enemy_team.defs++
            }
        }

        // start as (side)
        if (i === 0) {
            result.my_team.start_as = round.info.my_team_side
            result.enemy_team.start_as = round.info.enemy_team_side
        }
        // start as overtime (side)
        if (i === 12) {
            result.my_team.overtime_as = round.info.my_team_side
            result.enemy_team.overtime_as = round.info.enemy_team_side
        }
    })

    return result
}

const parsePerformance = (rosters, performance) => {
    const my_team = `${performance.local_team}_team`
    const enemy_team = my_team === "blue_team" ? "orange_team" : "blue_team"

    let performances = []

    rosters.my_team.forEach(player => {
        let p = performance[my_team][player.roster]

        p.team = "my_team"

        // useless data
        delete p.disconnected
        delete p.is_dead
        delete p.is_local
        delete p.operator_id
        delete p.points

        // data that can be obtained
        delete p.entry
        delete p.hs_match
        delete p.objplays

        performances.push(p)
    })

    rosters.enemy_team.forEach(player => {
        let p = performance[enemy_team][player.roster]

        p.team = "enemy_team"

        // useless data
        delete p.disconnected
        delete p.is_dead
        delete p.is_local
        delete p.operator_id
        delete p.points

        // data that can be obtained
        delete p.entry
        delete p.hs_match
        delete p.objplays

        performances.push(p)
    })

    return performances
}

const parseRoundPerformance = (rounds) => {
    rounds.forEach((round, i) => {
        console.log("Round ", i+1, ": ", round.performance)
    })
}

export default ParseData