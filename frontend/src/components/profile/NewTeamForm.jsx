import { useState } from "react"

import teamService from "../../services/teams"

// import classnames from "classnames"
import JoinTeamFormStyles from "./JoinTeamForm.module.scss"

const NewTeamForm = ({ user, teams, setTeams }) => {
    const [teamName, setTeamName] = useState("")

    const handleNewTeam = () => {
        try {
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

                    setTeams(teams.concat(newSavedTeam).sort((t1, t2) => t1.name < t2.name ? -1 : 1))
                })
        }
        catch (exception) {
            console.log(exception)
            if (exception.response) {
                console.log("Error", exception.response.status, ":", exception.response.data.error)
            }
        }
    }

    return (
        <div className={JoinTeamFormStyles.teamDiv}>
            <div className={JoinTeamFormStyles.backgroundDiv}>
                <h1 className={JoinTeamFormStyles.titleDiv}>Create a new team:</h1>
                <h2 className={JoinTeamFormStyles.titleDiv}>Team names are unique. Spaces will be replaced by dashes (-)</h2>
                <input
                    className={JoinTeamFormStyles.teamInput}
                    type="text"
                    onChange={({ target }) => setTeamName(target.value)}
                    placeholder="Enter team name"
                />
                <button
                    className={JoinTeamFormStyles.actionButton}
                    onClick={() => handleNewTeam()}
                >Create team</button>
            </div>
        </div>
    )

}

export default NewTeamForm