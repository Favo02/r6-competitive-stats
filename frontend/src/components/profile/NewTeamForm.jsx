import { useState } from "react"

import teamService from "../../services/teams"

// import classnames from "classnames"
import NewTeamsStyles from "./NewTeams.module.scss"

const NewTeamForm = ({ user, teams, setTeams }) => {
    const [teamName, setTeamName] = useState("")
    const [status, setStatus] = useState("Team names are unique. Spaces will be replaced by dashes (-).")

    const handleTeamNameChange = (newTeamName) => {
        setStatus("Team names are unique. Spaces will be replaced by dashes (-).")
        setTeamName(newTeamName)
    }

    const handleNewTeam = () => {
        teamService
            .create(teamName, user.token)
            .then(savedTeam => {
                // map the saved team as every other team already saved and mapped
                const newSavedTeam = [savedTeam].map(t => {
                    return ({
                        name: t.name,
                        id: t.id,
                        nMatches: t.matches.length,
                        permission: t.members.find(m => m.id.id === user.id).permission,
                        members: t.members.map(m => ({
                            id: m.id.id,
                            username: m.id.username,
                            permission: m.permission
                        })),
                        waitingMembers: t.members.find(m => m.id.id === user.id).permission === "admin"
                            ? t.waitingMembers.map(m => ({
                                id: m.id,
                                username: m.username
                            }))
                            : null
                    })
                })[0]

                setTeamName("")
                setTeams(teams.concat(newSavedTeam).sort((t1, t2) => t1.name < t2.name ? -1 : 1))
            })
            .catch(exception => {
                console.log(exception)
                if (exception.response.status === 400) {
                    setStatus("Name aldready taken")
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })
    }

    return (
        <div className={NewTeamsStyles.teamDiv}>
            <div className={NewTeamsStyles.backgroundDiv}>
                <h1 className={NewTeamsStyles.titleDiv}>Create a new team:</h1>
                <input
                    className={NewTeamsStyles.teamInput}
                    type="text"
                    value={teamName}
                    onChange={({ target }) => handleTeamNameChange(target.value)}
                    placeholder="Enter team name"
                />
                <h4 className={NewTeamsStyles.searchStatus}>{status}</h4>
                <button
                    className={NewTeamsStyles.importantActionButton}
                    onClick={() => handleNewTeam()}
                >Create {teamName.trim().replace(" ", "-")}</button>
            </div>
        </div>
    )

}

export default NewTeamForm