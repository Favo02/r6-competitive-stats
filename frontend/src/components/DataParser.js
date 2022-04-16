const ParseData = (rawData) => {
    const data = JSON.parse(rawData)

    // General match infos as score, map, result, rosters
    const parsed = {
        gamemode: data[0].gamemode,
        map: data[0].map,
        my_team: data[0].local_team,
        match_uuid: data[0].ubisoft_match_uuid,
        rosters: parseRosters({
            blue_team: data[0].r6ui_match_data.blue_team,
            orange_team: data[0].r6ui_match_data.orange_team
        }, data[0].local_team),
        date: new Date(data[1].start),
        result: {
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
        },
    }

    console.log(parsed)
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

export default ParseData