import { useState, useEffect } from "react"

import teamService from "../../services/teams"

const Teams = ({ user }) => {
    // teams of the user
    const [teams, setTeams] = useState([])

    // gets user teams (only the one as admin)
    useEffect(() => {
        try {
            teamService
                .getAll(user.token)
                .then(teams => {
                    setTeams(
                        teams.map(t => ({
                            name: t.name,
                            id: t.id,
                            permission: t.members.find(m => m.id === user.id).permission
                        }))
                    )
                })
        }
        catch (exception) {
            console.log(exception)
            if (exception.response) {
                console.log("Error", exception.response.status, ":", exception.response.data.error)
            }
        }
    }, [])

    return (
        <>
            <h1>Your teams:</h1>
            {teams.map(t => <h1 key={t.name}>{t.name}: {t.permission}</h1>)}
        </>
    )
}

export default Teams