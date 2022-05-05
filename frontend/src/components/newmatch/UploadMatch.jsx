import { useState, useEffect, useRef } from "react"

import matchService from "../../services/matches"
import teamService from "../../services/teams"

import FileUploader from "./FileUploader"
import Loading from "../common/Loading"
import Match from "../home/Match"

// import classnames from "classnames"
import MatchStyles from "../home/Matches.module.scss"
import CommonStyles from "../../styles/common.module.scss"
import UploadMatchStyles from "./UploadMatch.module.scss"

const UploadMatch = ({ user }) => {

    // match data uploaded (not stored yet)
    const [parsedData, setParsedData] = useState(null)

    // upload loading and status
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")

    // teams of the user
    const [teams, setTeams] = useState([])

    useEffect(() => {
        try {
            teamService
                .getAll(user.token)
                .then(teams =>
                    setTeams(teams)
                )
        }
        catch (exception) {
            console.log(exception)
            if (exception.response) {
                console.log("Error", exception.response.status, ":", exception.response.data.error)
            }
        }
    }, [])

    const newMatch = async (match) => {
        if (match) {
            try {
                setLoading(true)
                setStatus("Saving match...")
                await matchService.create(match, user.token)
                setLoading(false)
                setStatus("Match saved")
            }
            catch (exception) {
                setLoading(false)
                setStatus(`Error saving the match: ${exception}`)
                if (exception.response) {
                    setStatus(`Error ${exception.response.status}: ${exception.response.data.error}`)
                }
            }
        }
    }

    const categoryInput = useRef()
    const teamInput = useRef()
    const handleNewMatch = () => {
        const cat = categoryInput.current.value
        if (!cat) {
            setStatus("Insert a valid category")
            return
        }
        const team = teamInput.current.value
        if (!team) {
            setStatus("Select a valid team")
            return
        }

        console.log(team)

        parsedData.info.category = cat
        parsedData.team = team

        newMatch(parsedData)
    }

    return (
        <div className={UploadMatchStyles.uploadDiv}>
            <h1 className={UploadMatchStyles.descText}>Upload your JSON file exported from <a href="https://r6analyst.com/" target="_blank" rel="noreferrer">R6Analyst</a> to store the match into your team database.</h1>

            <div className={UploadMatchStyles.fileUploader}>
                <FileUploader setParsedData={setParsedData} />
            </div>

            { parsedData &&
                <>

                    <div className={UploadMatchStyles.categoryDiv}>
                        <label>Team:</label>
                        <select ref={teamInput}>
                            {teams.map(t => <option value={t.id} key={t.id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div className={UploadMatchStyles.categoryDiv}>
                        <label>Category:</label>
                        <input
                            type="text"
                            placeholder="Insert category name"
                            ref={categoryInput}
                        />
                    </div>

                    <div className={MatchStyles.matchesDiv}>
                        <Match match={parsedData}/>
                    </div>

                    <div className={UploadMatchStyles.saveButton}>
                        <button
                            onClick={handleNewMatch}
                            className={CommonStyles.highlighLinkButton}
                        >Save match</button>
                    </div>
                </>
            }

            {loading && <Loading />}
            <h2 className={UploadMatchStyles.statusText}>{status}</h2>
        </div>
    )
}

export default UploadMatch