import { useState, useEffect } from "react"

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

    // teams of the user
    const [teams, setTeams] = useState([])

    // upload loading and status
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")

    // match data uploaded (not stored yet)
    const [parsedData, setParsedData] = useState(null)

    // match category and team
    const [category, setCategory] = useState("")
    const [team, setTeam] = useState("")

    // gets user teams (only the one as admin)
    useEffect(() => {
        teamService
            .getAll(user.token)
            .then(teams => {
                const allTeams = teams.map(t => ({
                    name: t.name,
                    id: t.id,
                    permission: t.members.find(m => m.id.id === user.id).permission
                }))
                setTeams(
                    allTeams.filter(t => t.permission === "admin")
                )
            })
            .catch(exception => {
                console.log(exception)
                if (exception.response) {
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })
    }, [])

    // handle the new match creation
    const handleNewMatch = () => {
        if (!category) {
            setStatus("Insert a valid category")
            return
        }
        if (!team) {
            setStatus("Select a valid team")
            return
        }

        parsedData.info.category = category
        parsedData.team = team

        newMatch(parsedData)
    }

    // calls the service to create a new match
    const newMatch = async (match) => {
        if (match) {
            try {
                setLoading(true)
                setStatus("Saving match...")
                await matchService.create(match, user.token)
                setLoading(false)
                setStatus("Match saved")
                setCategory("")
                setTeam("")
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

    // if user has no teams as admin can't upload
    if (teams.length === 0) {
        return (
            <div className={UploadMatchStyles.noTeamError}>
                <div className={UploadMatchStyles.background} />
                <h1>Join or create a <span className={CommonStyles.highlighted}>team</span> to upload matches</h1>
                <h3>You need to be <span className={CommonStyles.highlighted}>admin</span> of your team to upload a new match. Ask the team leader to promote you!</h3>
            </div>
        )
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
                        <select
                            value={team}
                            onChange={({ target }) => setTeam(target.value)}
                        >
                            <option value="">Select a team:</option>
                            {teams.map(t => <option value={t.id} key={t.id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div className={UploadMatchStyles.categoryDiv}>
                        <label>Category:</label>
                        <input
                            type="text"
                            placeholder="Insert category name"
                            value={category}
                            onChange={({ target }) => setCategory(target.value)}
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