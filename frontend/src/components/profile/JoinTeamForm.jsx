import { useState, useEffect, useRef } from "react"

import teamService from "../../services/teams"

import classnames from "classnames"
import NewTeamsStyles from "./NewTeams.module.scss"

const JoinTeamForm = ({ user }) => {

    // name the user has written in the input field
    const [search, setSearch] = useState("")
    // list of the teams matching the search
    const [searchedTeams, setSearchedTeams] = useState([])
    const [searchStatus, setSearchStatus] = useState("")

    useEffect(() => {
        if (search.length > 2) {
            teamService
                .getTeamByName(search)
                .then(teams => {
                    setSearchedTeams(
                        teams
                            .map(t => (
                                {
                                    name: t.name,
                                    id: t.id,
                                    member: t.members.map(member => member.id).includes(user.id) ? true : false,
                                    waitingMember: t.waitingMembers.includes(user.id) ? true : false,
                                }
                            ))
                    )
                    teams.length === 0
                        ? setSearchStatus("No teams found")
                        : setSearchStatus("")
                })
                .catch (exception => {
                    console.log(exception)
                    if (exception.response) {
                        console.log("Error", exception.response.status, ":", exception.response.data.error)
                    }
                })
        }
        else {
            setSearchedTeams([])
            setSearchStatus("Type at least 3 characters to search a team")
        }
    }, [search])

    const teamInput = useRef()
    const handleSearch = () => {
        setSearch(teamInput.current.value)
    }

    const handleJoinRequest = (team) => {
        teamService
            .addWaitingMember(team.id, user.token)
            .then(response => {
                setSearchedTeams([])
                setSearchStatus(`Added to waiting list of ${response.name}`)
            })
            .catch (exception => {
                console.log(exception)
                if (exception.response) {
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })
    }

    return (
        <div className={NewTeamsStyles.teamDiv}>
            <div className={NewTeamsStyles.backgroundDiv}>
                <h1 className={NewTeamsStyles.titleDiv}>Join a team:</h1>
                <h2 className={NewTeamsStyles.titleDiv}>Enter a team name and request to join</h2>
                <input
                    className={NewTeamsStyles.teamInput}
                    type="text"
                    ref={teamInput}
                    onChange={handleSearch}
                    placeholder="Enter team name"
                />
                <h3 className={
                    searchStatus !== ""
                        ? NewTeamsStyles.searchStatus
                        : ""
                }>{searchStatus}</h3>
                <div>{searchedTeams.map(t =>
                    <h3 className={NewTeamsStyles.teamFound} key={t.id}>
                        {t.name}
                        {t.member &&
                            <button
                                className={classnames(
                                    NewTeamsStyles.actionButton,
                                    NewTeamsStyles.disabledButton,
                                )}
                                disabled
                            >Already in this team</button>
                        }
                        {t.waitingMember &&
                            <button
                                className={classnames(
                                    NewTeamsStyles.actionButton,
                                    NewTeamsStyles.disabledButton,
                                )}
                                disabled
                            >Already requested to join this team</button>
                        }
                        {!t.member && !t.waitingMember &&
                            <button
                                className={NewTeamsStyles.actionButton}
                                onClick={() => handleJoinRequest(t)}
                            >Request to join</button>
                        }
                    </h3>
                )}</div>
            </div>
        </div>
    )
}

export default JoinTeamForm