import React, { useState, useEffect } from "react"

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
                        teams.map(t => {
                            return ({
                                name: t.name,
                                id: t.id,
                                nMatches: t.matches.length,
                                permission: t.members.find(m => m.id.id === user.id).permission,
                                members: t.members.find(m => m.id.id === user.id).permission === "admin"
                                    ? t.members.map(m => ({
                                        id: m.id.id,
                                        username: m.id.username,
                                        permission: m.permission
                                    }))
                                    : null,
                                waitingMembers: t.members.find(m => m.id.id === user.id).permission === "admin"
                                    ? t.waitingMembers.map(m => ({
                                        id: m.id,
                                        username: m.username
                                    }))
                                    : null
                            })
                        })
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
            {teams.map(t => {
                return (
                    <React.Fragment key={t.id}>
                        <h1>{t.name}</h1>
                        <h2>Members:</h2>
                        {t.members.map(m => <h3 key={m.id}>{m.username} - {m.permission}</h3>)}
                        <h2>Waiting members:</h2>
                        {t.waitingMembers.map(m => <h3 key={m.id}>{m.username}</h3>)}
                        <br />
                        <br />
                    </React.Fragment>
                )
            })}
        </>
    )
}

export default Teams