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
    if (matchinfo.map === "chalet_rework")
        matchinfo.map = "chalet"
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
    parsed.rounds = parseRounds(rounds, parsed.info.rosters)

    // match result
    parsed.result = parseResult(parsed.rounds)

    parsed.performance = parsePerformance(parsed.info.rosters, performance)

    parsed.roundPerformance = parseRoundPerformance(parsed.rounds, parsed.info.my_team)

    // removes round performance from the round, it has been moved to roundPerformance
    parsed.rounds = clearRound(parsed.rounds)

    console.log("COMPLETE PARSE:")
    console.log(parsed)
    return parsed
}

const parseRosters = ({ blue_team, orange_team }, my_team_color ) => {
    const enemy_team_color = my_team_color.toLowerCase() === "orange" ? "blue" : "orange"
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
        else if (players[player].team.toLowerCase() === enemy_team_color) {
            enemy_team.push({
                username: players[player].username,
                roster: player
            })
        }

    }
    return { my_team, enemy_team }
}

const parseRounds = (rounds, rosters) => {
    const players = [ ...rosters.my_team, ...rosters.enemy_team ]

    let roundsArray = []
    rounds.forEach((round, i) => {

        if (!round.events) {
            console.log(`Round ${i} not complete, skipped`)
            return
        }

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

        // players performance, will be removed and moved to roundPerformance
        round.performance = []
        players.forEach(player => {
            round.performance.push(round[player.roster])
            delete round[player.roster]
        })
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

const parseRoundPerformance = (rounds, my_team) => {
    rounds = rounds.map(round => round.performance)
    rounds = rounds.map(round =>
        round.map(player => {
            player.team =
                player.team.toLowerCase() === my_team.toLowerCase()
                    ? "my_team"
                    : "enemy_team"

            delete player.disconnected
            delete player.is_local
            delete player.is_dead
            delete player.drone_stats
            delete player.round_score

            // get operator from overwold id, using overwolf list below
            player.operator = operators_ids.find(op => op.overwolf_id === player.operator)

            // if operator not in the list (=== undefined) then 0 (unknown operator)
            if (player.operator === undefined) {
                player.operator = operators_ids.find(op => op.overwolf_id === 0)
            }

            // extract only the operator name
            player.operator = player.operator.operator_name

            return (
                player
            )
        })
    )

    return rounds
}

const clearRound = (rounds) => {
    rounds.forEach(round => {
        delete round.performance
    })
    return rounds
}

const operators_ids = [
    {
        "operator_name": "Unknown",
        "overwolf_id": 0,
    },
    {
        "side": "atk",
        "operator_name": "Sledge",
        "overwolf_id": 768,
        "ubisoft_id": "4:1"
    },
    {
        "side": "atk",
        "operator_name": "Thatcher",
        "overwolf_id": 1024,
        "ubisoft_id": "5:1"
    },
    {
        "side": "atk",
        "operator_name": "Ash",
        "overwolf_id": 513,
        "ubisoft_id": "3:2"
    },
    {
        "side": "atk",
        "operator_name": "Thermite",
        "overwolf_id": 1025,
        "ubisoft_id": "5:2"
    },
    {
        "side": "atk",
        "operator_name": "Twitch",
        "overwolf_id": 770,
        "ubisoft_id": "4:3"
    },
    {
        "side": "atk",
        "operator_name": "Montagne",
        "overwolf_id": 1026,
        "ubisoft_id": "5:3"
    },
    {
        "side": "atk",
        "operator_name": "Glaz",
        "overwolf_id": 259,
        "ubisoft_id": "2:4"
    },
    {
        "side": "atk",
        "operator_name": "Fuze",
        "overwolf_id": 515,
        "ubisoft_id": "3:4"
    },
    {
        "side": "atk",
        "operator_name": "Blitz",
        "overwolf_id": 260,
        "ubisoft_id": "2:5"
    },
    {
        "side": "atk",
        "operator_name": "IQ",
        "overwolf_id": 516,
        "ubisoft_id": "3:5"
    },
    {
        "side": "atk",
        "operator_name": "Buck",
        "overwolf_id": 261,
        "ubisoft_id": "2:6"
    },
    {
        "side": "atk",
        "operator_name": "Blackbeard",
        "overwolf_id": 262,
        "ubisoft_id": "2:7"
    },
    {
        "side": "atk",
        "operator_name": "Capitao",
        "overwolf_id": 263,
        "ubisoft_id": "2:8"
    },
    {
        "side": "atk",
        "operator_name": "Hibana",
        "overwolf_id": 264,
        "ubisoft_id": "2:9"
    },
    {
        "side": "atk",
        "operator_name": "Jackal",
        "overwolf_id": 265,
        "ubisoft_id": "2:A"
    },
    {
        "side": "atk",
        "operator_name": "Ying",
        "overwolf_id": 266,
        "ubisoft_id": "2:B"
    },
    {
        "side": "atk",
        "operator_name": "Zofia",
        "overwolf_id": 523,
        "ubisoft_id": "3:C"
    },
    {
        "side": "atk",
        "operator_name": "Dokkaebi",
        "overwolf_id": 268,
        "ubisoft_id": "2:D"
    },
    {
        "side": "atk",
        "operator_name": "Lion",
        "overwolf_id": 525,
        "ubisoft_id": "3:E"
    },
    {
        "side": "atk",
        "operator_name": "Finka",
        "overwolf_id": 781,
        "ubisoft_id": "4:E"
    },
    {
        "side": "atk",
        "operator_name": "Maverick",
        "overwolf_id": 271,
        "ubisoft_id": "2:10"
    },
    {
        "side": "atk",
        "operator_name": "Nomad",
        "overwolf_id": 272,
        "ubisoft_id": "2:11"
    },
    {
        "side": "atk",
        "operator_name": "Gridlock",
        "overwolf_id": 529,
        "ubisoft_id": "3:12"
    },
    {
        "side": "atk",
        "operator_name": "Nokk",
        "overwolf_id": 274,
        "ubisoft_id": "2:13"
    },
    {
        "side": "atk",
        "operator_name": "Amaru",
        "overwolf_id": 277,
        "ubisoft_id": "2:16"
    },
    {
        "side": "atk",
        "operator_name": "Kali",
        "overwolf_id": 278,
        "ubisoft_id": "2:17"
    },
    {
        "side": "atk",
        "operator_name": "Iana",
        "overwolf_id": 280,
        "ubisoft_id": "2:19"
    },
    {
        "side": "atk",
        "operator_name": "Ace",
        "overwolf_id": 790,
        "ubisoft_id": "4:17"
    },
    {
        "side": "atk",
        "operator_name": "Zero",
        "overwolf_id": 26,
        "ubisoft_id": "1:1B"
    },
    {
        "side": "atk",
        "operator_name": "Flores",
        "overwolf_id": 535,
        "ubisoft_id": "3:18"
    },
    {
        "side": "atk",
        "operator_name": "Osa",
        "overwolf_id": 1302,
        "ubisoft_id": "6:17"
    },
    {
        "side": "atk",
        "operator_name": "Recruit",
        "overwolf_id": 1,
        "ubisoft_id": "recruit"
    },
    {
        "side": "def",
        "operator_name": "Smoke",
        "overwolf_id": 256,
        "ubisoft_id": "2:1"
    },
    {
        "side": "def",
        "operator_name": "Mute",
        "overwolf_id": 512,
        "ubisoft_id": "3:1"
    },
    {
        "side": "def",
        "operator_name": "Castle",
        "overwolf_id": 257,
        "ubisoft_id": "2:2"
    },
    {
        "side": "def",
        "operator_name": "Pulse",
        "overwolf_id": 769,
        "ubisoft_id": "4:2"
    },
    {
        "side": "def",
        "operator_name": "Doc",
        "overwolf_id": 258,
        "ubisoft_id": "2:3"
    },
    {
        "side": "def",
        "operator_name": "Rook",
        "overwolf_id": 514,
        "ubisoft_id": "3:3"
    },
    {
        "side": "def",
        "operator_name": "Kapkan",
        "overwolf_id": 771,
        "ubisoft_id": "4:4"
    },
    {
        "side": "def",
        "operator_name": "Tachanka",
        "overwolf_id": 1027,
        "ubisoft_id": "5:4"
    },
    {
        "side": "def",
        "operator_name": "Jager",
        "overwolf_id": 772,
        "ubisoft_id": "4:5"
    },
    {
        "side": "def",
        "operator_name": "Bandit",
        "overwolf_id": 1028,
        "ubisoft_id": "5:5"
    },
    {
        "side": "def",
        "operator_name": "Frost",
        "overwolf_id": 517,
        "ubisoft_id": "3:6"
    },
    {
        "side": "def",
        "operator_name": "Valkyrie",
        "overwolf_id": 518,
        "ubisoft_id": "3:7"
    },
    {
        "side": "def",
        "operator_name": "Caveira",
        "overwolf_id": 519,
        "ubisoft_id": "3:8"
    },
    {
        "side": "def",
        "operator_name": "Echo",
        "overwolf_id": 520,
        "ubisoft_id": "3:9"
    },
    {
        "side": "def",
        "operator_name": "Mira",
        "overwolf_id": 521,
        "ubisoft_id": "3:A"
    },
    {
        "side": "def",
        "operator_name": "Lesion",
        "overwolf_id": 522,
        "ubisoft_id": "3:B"
    },
    {
        "side": "def",
        "operator_name": "Ela",
        "overwolf_id": 267,
        "ubisoft_id": "2:C"
    },
    {
        "side": "def",
        "operator_name": "Vigil",
        "overwolf_id": 524,
        "ubisoft_id": "3:D"
    },
    {
        "side": "def",
        "operator_name": "Maestro",
        "overwolf_id": 270,
        "ubisoft_id": "2:F"
    },
    {
        "side": "def",
        "operator_name": "Alibi",
        "overwolf_id": 526,
        "ubisoft_id": "3:F"
    },
    {
        "side": "def",
        "operator_name": "Clash",
        "overwolf_id": 527,
        "ubisoft_id": "3:10"
    },
    {
        "side": "def",
        "operator_name": "Kaid",
        "overwolf_id": 528,
        "ubisoft_id": "3:11"
    },
    {
        "side": "def",
        "operator_name": "Mozzie",
        "overwolf_id": 273,
        "ubisoft_id": "2:12"
    },
    {
        "side": "def",
        "operator_name": "Warden",
        "overwolf_id": 275,
        "ubisoft_id": "2:14"
    },
    {
        "side": "def",
        "operator_name": "Goyo",
        "overwolf_id": 276,
        "ubisoft_id": "2:15"
    },
    {
        "side": "def",
        "operator_name": "Wamai",
        "overwolf_id": 534,
        "ubisoft_id": "3:17"
    },
    {
        "side": "def",
        "operator_name": "Oryx",
        "overwolf_id": 279,
        "ubisoft_id": "2:18"
    },
    {
        "side": "def",
        "operator_name": "Melusi",
        "overwolf_id": 281,
        "ubisoft_id": "2:1A"
    },
    {
        "side": "def",
        "operator_name": "Aruni",
        "overwolf_id": 1046,
        "ubisoft_id": "5:17"
    },
    {
        "side": "def",
        "operator_name": "Thunderbird",
        "overwolf_id": 27,
        "ubisoft_id": "1:1C"
    },
    {
        "side": "def",
        "operator_name": "Thorn",
        "overwolf_id": 28,
        "ubisoft_id": "unknown"
    },
    {
        "side": "def",
        "operator_name": "Azami",
        "overwolf_id": 791,
        "ubisoft_id": "unknown"
    },
    {
        "side": "def",
        "operator_name": "Recruit",
        "overwolf_id": 1,
        "ubisoft_id": "recruit"
    }
]

export default ParseData