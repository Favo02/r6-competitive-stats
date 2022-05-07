import React, { useState, useEffect } from "react"

import teamService from "../../services/teams"

import TeamsStyles from "./Teams.module.scss"

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

    const handleAccept = (teamId, userId) => {
        try {
            teamService
                .acceptWaitingMember(userId, teamId, user.token)
                .then(updatedTeam => {
                    return (
                        setTeams(
                            teams
                                .filter(t => t.id !== updatedTeam.id)
                                .concat(updatedTeam)
                                .map(t => {
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
                                })
                        )
                    )
                })
        }
        catch (exception) {
            console.log(exception)
            if (exception.response) {
                console.log("Error", exception.response.status, ":", exception.response.data.error)
            }
        }
    }

    const handleDecline = (teamId, userId) => {
        try {
            teamService
                .declineWaitingMember(userId, teamId, user.token)
                .then(updatedTeam => {
                    return (
                        setTeams(
                            teams
                                .filter(t => t.id !== updatedTeam.id)
                                .concat(updatedTeam)
                                .map(t => {
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
                                })
                        )
                    )
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
        <>
            {teams.map(t => {
                return (
                    <div key={t.id} className={TeamsStyles.teamDiv}>
                        <h1>{t.name}</h1>
                        <h2>Members:</h2>
                        {t.members && t.members.map(m => <h3 key={m.id}>{m.username} - {m.permission}</h3>)}
                        <h2>Request to join:</h2>
                        {t.waitingMembers && t.waitingMembers.map(m =>
                            <h3 key={m.id}>
                                {m.username}
                                <button onClick={() => handleAccept(t.id, m.id)}>Accept</button>
                                <button onClick={() => handleDecline(t.id, m.id)}>Decline</button>
                            </h3>)}
                        <br />
                        <br />
                    </div>
                )
            })}
        </>
    )
}

export default Teams