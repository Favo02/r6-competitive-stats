import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

import matchService from "../../services/matches"
import teamService from "../../services/teams"

import FileUploader from "./FileUploader"
import Match from "../home/Match"
import Select from "react-select"

import classnames from "classnames"
import MatchStyles from "../home/Matches.module.scss"
import CommonStyles from "../../styles/common.module.scss"
import UploadMatchStyles from "./UploadMatch.module.scss"

const UploadMatch = ({ user, loading, setLoading }) => {

    // teams of the user
    const [teams, setTeams] = useState([])

    // upload status
    const [status, setStatus] = useState("")

    // match data uploaded (not stored yet)
    const [parsedData, setParsedData] = useState(null)

    // match category, team and public
    const [category, setCategory] = useState("")
    const [team, setTeam] = useState()
    const [publicMatch, setPublicMatch] = useState(false)

    // ref to file uploader component to reset the file input
    const fileUploaderRef = useRef()

    // gets user teams (only the one as admin)
    useEffect(() => {
        setLoading(true)
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
                setLoading(false)
            })
            .catch(exception => {
                setLoading(false)
                console.log(exception)
                // if token expired refresh the page to run Redirector.jsx that checks token expiration
                if (exception.response.data.error === "token expired") {
                    window.location.reload(false)
                    return
                }
                // if token invalid force logout (removing invalid token from local storage and then reloading)
                if (exception.response.data.error === "invalid token") {
                    localStorage.removeItem("loggedCompStatsUser")
                    window.location.reload(false)
                    return
                }
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
        parsedData.team = team.value
        parsedData.isPublic = publicMatch

        newMatch(parsedData)
    }

    // calls the service to create a new match
    const newMatch = async (match) => {
        if (match) {
            try {
                setLoading(true)
                setStatus("Saving match...")
                await matchService.create(match, user.token)
                setStatus("Match saved")
                setCategory("")
                setTeam("")
                fileUploaderRef.current() // call the unload file to reset file input
                setPublicMatch(false)
                setLoading(false)
            }
            catch (exception) {
                setLoading(false)
                // if token expired refresh the page to run Redirector.jsx that checks token expiration
                if (exception.response.data.error === "token expired") {
                    window.location.reload(false)
                    return
                }
                // if token invalid force logout (removing invalid token from local storage and then reloading)
                if (exception.response.data.error === "invalid token") {
                    localStorage.removeItem("loggedCompStatsUser")
                    window.location.reload(false)
                    return
                }
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
            <>
                <div className={UploadMatchStyles.background} />
                {!loading &&
                <>
                    <div className={UploadMatchStyles.noTeamError}>
                        <h1>Join or create a <span className={CommonStyles.highlighted}>team</span> to upload matches</h1>
                        <h3>You need to be <span className={CommonStyles.highlighted}>admin</span> of your team to upload a new match. Ask the team leader to promote you!</h3>
                        <div className={UploadMatchStyles.redirectDiv}>
                            <Link
                                to="/myteams"
                                className={classnames(CommonStyles.highlighLinkButton, CommonStyles.bigger)}
                            >
                                Create/Join a team now!
                            </Link>
                        </div>
                    </div>
                </>
                }
            </>
        )
    }

    // custom select

    const options = teams.map(t => ({ value: t.id, label: t.name }))

    const handleTeamSelectChange = selectedOption => {
        setTeam(selectedOption)
    }

    const selectStyles = {
        menuList: (provided) => ({
            ...provided,
            background: "#1D90F5"
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#FFFFFF"
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#9AA5B5 "
        }),
        control: (provided, state) => ({
            ...provided,
            width: "400px",
            background: "#323644",
            border: "1px solid #9AA5B5",
            color: state.isSelected ? "red" : "blue",
            padding: 20,
        }),
        option: (provided, state) => ({
            ...provided,
            background: state.isFocused ? "#323644" : "#272A37",
            color: state.isSelected ? "#FFFFFF" : "#9AA5B5",
            padding: 20,
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            color: state.isSelected ? "#9AA5B5" : state.isFocused ?"#9AA5B5" : "#9AA5B5",
        }),
    }

    return (
        <div className={UploadMatchStyles.uploadDiv}>
            <div className={UploadMatchStyles.background} />
            <h1 className={UploadMatchStyles.descText}>Upload your JSON file exported from <a href="https://r6analyst.com/" target="_blank" rel="noreferrer">R6Analyst</a> to store the match into your team database.</h1>

            <div className={UploadMatchStyles.fileUploader}>
                <FileUploader setParsedData={setParsedData} fileUploaderRef={fileUploaderRef} />
            </div>

            { parsedData &&
                <>
                    <div className={UploadMatchStyles.categoryDiv}>
                        <label>Team:</label>
                        <Select
                            options={options}
                            onChange={handleTeamSelectChange}
                            placeholder="Select a team"
                            value={team}
                            styles={selectStyles}
                        />
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

                    <div className={UploadMatchStyles.publicMatchDiv}>
                        <label className={UploadMatchStyles.container}>Official match
                            <input
                                type="checkbox"
                                value={publicMatch}
                                onChange={({ target }) => setPublicMatch(target.checked)}
                            />
                            <span className={UploadMatchStyles.checkmark} />
                        </label>
                        <div className={UploadMatchStyles.warningTextDiv}>
                            {publicMatch &&
                            <h3 className={UploadMatchStyles.warningText}>This match will be public!</h3>
                            }
                            <h4 className={UploadMatchStyles.warningText}>Official matches will be public, everyone (also outside of your team) will be able to see statistics of this match</h4>
                        </div>
                    </div>

                    <div className={MatchStyles.matchesDiv}>
                        <Match match={parsedData} isPreview={true} />
                    </div>

                    <div className={UploadMatchStyles.saveButton}>
                        <button
                            onClick={handleNewMatch}
                            className={CommonStyles.highlighLinkButton}
                        >Save match</button>
                    </div>
                </>
            }

            <h2 className={UploadMatchStyles.statusText}>{status}</h2>
        </div>
    )
}

export default UploadMatch