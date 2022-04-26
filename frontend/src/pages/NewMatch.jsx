import Header from "../components/Header"
import FileUploader from "../components/FileUploader"

import React, { useState } from "react"

const NewMatch = ({ user, logout }) => {
    const [parsedData, setParsedData] = useState(null)

    window.onbeforeunload = function(e) {
        if (parsedData) {
            const dialogText = "Match not saved yet. Data will be lost"
            e.returnValue = dialogText
            return dialogText
        }
    }

    return (
        <div>
            <Header user={user} logout={logout} />
            <FileUploader setParsedData={setParsedData} />
            { parsedData
                ?
                <>
                    <h1>Match caricato:</h1>
                    <h2>{parsedData.info.map.charAt(0).toUpperCase() + parsedData.info.map.slice(1)} - {parsedData.info.date.toLocaleDateString("it-IT")}: {parsedData.result.my_team.score} - {parsedData.result.enemy_team.score}</h2>
                    <button>Salva match</button>
                </>
                :
                <>
                    <h1>Nessun match caricato</h1>
                </>
            }
        </div>
    )
}

export default NewMatch