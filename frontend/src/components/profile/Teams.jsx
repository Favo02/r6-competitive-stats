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

    // kick a member of the team
    const handleKick = (teamId, userId, username) => {
        if (window.confirm(`Are you sure you wanto to kick ${username}?`)) {
            try {
                teamService
                    .kickMember(userId, teamId, user.token)
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
    }

    // accept the waiting user into the team
    const handleAccept = (teamId, userId, username) => {
        if (window.confirm(`Are you sure you wanto to accept ${username}?`)) {
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
    }

    // decline the waiting user
    const handleDecline = (teamId, userId, username) => {
        if (window.confirm(`Are you sure you wanto to decline ${username}?`)) {
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
    }

    return (
        <div className={TeamsStyles.teamsDiv}>
            {teams.map(t => {
                return (
                    <div key={t.id} className={TeamsStyles.teamDiv}>
                        <div className={TeamsStyles.backgroundDiv}>
                            <div className={TeamsStyles.titleDiv}>
                                <h1 className={TeamsStyles.teamName}>{t.name}</h1>
                                <h3 className={TeamsStyles.nMatches}>{t.nMatches} MATCHES</h3>
                            </div>
                            <div className={TeamsStyles.membersDiv}>
                                <h2 className={TeamsStyles.membersTitle}>MEMBERS</h2>
                                {t.members && t.members.map(m =>
                                    <div key={m.id} className={TeamsStyles.memberDiv}>
                                        <h3>{m.username}</h3>
                                        {/* Admin label */}
                                        {m.permission === "admin" && <div className={TeamsStyles.adminLabel}>ADMIN</div>}
                                        {/* Button kick shows up only for admin and not for yourself */}
                                        {t.members.find(mem => mem.id === user.id).permission === "admin" &&
                                        m.id !== user.id &&
                                                <button className={TeamsStyles.actionButton} onClick={() => handleKick(t.id, m.id, m.username)}>KICK</button>
                                        }
                                    </div>
                                )}
                            </div>
                            <div className={TeamsStyles.membersDiv}>
                                {t.waitingMembers && t.waitingMembers.length > 0 &&
                                    <>
                                        <h2 className={TeamsStyles.membersTitle}>REQUESTS TO JOIN</h2>
                                        {t.waitingMembers.map(m =>
                                            <div key={m.id} className={TeamsStyles.memberDiv}>
                                                <h3>{m.username}</h3>
                                                {/* Buttons to accept/decline the request */}
                                                <button className={TeamsStyles.actionButton} onClick={() => handleAccept(t.id, m.id, m.username)}>ACCEPT</button>
                                                <button className={TeamsStyles.actionButton} onClick={() => handleDecline(t.id, m.id, m.username)}>DECLINE</button>
                                            </div>
                                        )}
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Teams