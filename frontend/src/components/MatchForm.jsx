import { useState } from "react"

import FileUploader from "./FileUploader"

const MatchForm = ({ newMatch }) => {
    const [parsedData, setParsedData] = useState(null)

    let map, date, my_team_score, enemy_team_score
    if (parsedData) {
        map = parsedData.info.map.charAt(0).toUpperCase() + parsedData.info.map.slice(1)
        date = parsedData.info.date.toLocaleDateString("it-IT")
        my_team_score = parsedData.result.my_team.score
        enemy_team_score = parsedData.result.enemy_team.score
    }

    // If match still not saved warning on reload / change page
    window.onbeforeunload = function(e) {
        if (parsedData) {
            const dialogText = "Match not saved yet. Data will be lost"
            e.returnValue = dialogText
            return dialogText
        }
    }

    const handleNewMatch = () => {
        newMatch(parsedData)
        setParsedData(null)
    }

    return (
        <>
            <FileUploader setParsedData={setParsedData} />
            { parsedData &&
                <>
                    <h2>{map} - {date}: {my_team_score} - {enemy_team_score}</h2>
                    <button onClick={handleNewMatch}>Save match</button>
                </>
            }
        </>
    )
}

export default MatchForm