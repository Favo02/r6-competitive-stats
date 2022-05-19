import { useState } from "react"

import teamService from "../../services/teams"

import TeamsStyles from "./Teams.module.scss"

const Team = (
    {
        t, user,
        teams, setTeams, sortTeams,
        setLoading
    }
) => {
    const [isEditActive, setEditActive] = useState(false)
    const [editTeamName, setEditTeamName] = useState("")

    const updateTeams = (updatedTeam) => {
        //map the updated team like every team already mapped
        const newUpdatedTeam = [updatedTeam].map(t => {
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
        setTeams(
            sortTeams(
                teams
                    .filter(t => t.id !== updatedTeam.id)
                    .concat(newUpdatedTeam)
            )
        )
    }

    // kick a member of the team
    const handleKick = (teamId, userId, username) => {
        if (window.confirm(`Are you sure you wanto to kick ${username}?`)) {
            setLoading(true)
            teamService
                .kickMember(userId, teamId, user.token)
                .then(updatedTeam => {
                    updateTeams(updatedTeam)
                    setLoading(false)
                })
                .catch (exception => {
                    setLoading(false)
                    console.log(exception)
                    // if token expired refresh the page to run Redirector.jsx that checks token expiration
                    if (exception.response.data.error === "token expired") {
                        window.location.reload(false)
                        return
                    }
                    // if token invalid force logout (removing invalid token from local storage and then reloading)
                    if (exception.response.data.error === "token expired") {
                        localStorage.removeItem("loggedCompStatsUser")
                        window.location.reload(false)
                        return
                    }
                    if (exception.response) {
                        console.log("Error", exception.response.status, ":", exception.response.data.error)
                    }
                })
        }
    }

    // promote a member of the team
    const handlePromote = (teamId, userId, username) => {
        if (window.confirm(`Are you sure you wanto to promote ${username}?`)) {
            setLoading(true)
            teamService
                .promoteMember(userId, teamId, user.token)
                .then(updatedTeam => {
                    updateTeams(updatedTeam)
                    setLoading(false)
                })
                .catch (exception => {
                    setLoading(false)
                    console.log(exception)
                    // if token expired refresh the page to run Redirector.jsx that checks token expiration
                    if (exception.response.data.error === "token expired") {
                        window.location.reload(false)
                        return
                    }
                    // if token invalid force logout (removing invalid token from local storage and then reloading)
                    if (exception.response.data.error === "token expired") {
                        localStorage.removeItem("loggedCompStatsUser")
                        window.location.reload(false)
                        return
                    }
                    if (exception.response) {
                        console.log("Error", exception.response.status, ":", exception.response.data.error)
                    }
                })
        }
    }

    // accept the waiting user into the team
    const handleAccept = (teamId, userId, username) => {
        if (window.confirm(`Are you sure you wanto to accept ${username}?`)) {
            setLoading(true)
            teamService
                .acceptWaitingMember(userId, teamId, user.token)
                .then(updatedTeam => {
                    updateTeams(updatedTeam)
                    setLoading(false)
                })
                .catch (exception => {
                    setLoading(false)
                    console.log(exception)
                    // if token expired refresh the page to run Redirector.jsx that checks token expiration
                    if (exception.response.data.error === "token expired") {
                        window.location.reload(false)
                        return
                    }
                    // if token invalid force logout (removing invalid token from local storage and then reloading)
                    if (exception.response.data.error === "token expired") {
                        localStorage.removeItem("loggedCompStatsUser")
                        window.location.reload(false)
                        return
                    }
                    if (exception.response) {
                        console.log("Error", exception.response.status, ":", exception.response.data.error)
                    }
                })
        }
    }

    // decline the waiting user
    const handleDecline = (teamId, userId, username) => {
        if (window.confirm(`Are you sure you wanto to decline ${username}?`)) {
            setLoading(true)
            teamService
                .declineWaitingMember(userId, teamId, user.token)
                .then(updatedTeam => {
                    updateTeams(updatedTeam)
                    setLoading(false)
                })
                .catch (exception => {
                    setLoading(false)
                    console.log(exception)
                    // if token expired refresh the page to run Redirector.jsx that checks token expiration
                    if (exception.response.data.error === "token expired") {
                        window.location.reload(false)
                        return
                    }
                    // if token invalid force logout (removing invalid token from local storage and then reloading)
                    if (exception.response.data.error === "token expired") {
                        localStorage.removeItem("loggedCompStatsUser")
                        window.location.reload(false)
                        return
                    }
                    if (exception.response) {
                        console.log("Error", exception.response.status, ":", exception.response.data.error)
                    }
                })
        }
    }

    // leave a team
    const handleEdit = (teamId, teamName, newTeamName) => {

        if (window.confirm(`Are you sure you want to rename ${teamName} to ${newTeamName}?`)) {
            setLoading(true)
            teamService
                .edit(teamId, newTeamName, user.token)
                .then(updatedTeam => {
                    updateTeams(updatedTeam)
                    setLoading(false)
                    setEditActive(false)
                    setEditTeamName("")
                })
                .catch (exception => {
                    setLoading(false)
                    console.log(exception)
                    // if token expired refresh the page to run Redirector.jsx that checks token expiration
                    if (exception.response.data.error === "token expired") {
                        window.location.reload(false)
                        return
                    }
                    // if token invalid force logout (removing invalid token from local storage and then reloading)
                    if (exception.response.data.error === "token expired") {
                        localStorage.removeItem("loggedCompStatsUser")
                        window.location.reload(false)
                        return
                    }
                    if (exception.response.status === 400) {
                        alert(exception.response.data.error)
                    }
                    if (exception.response) {
                        console.log("Error", exception.response.status, ":", exception.response.data.error)
                    }
                })
        }
    }

    // leave a team
    const handleLeave = (teamId, teamName) => {
        if (window.confirm(`Are you sure you wanto to leave ${teamName}?`)) {
            setLoading(true)
            teamService
                .leaveTeam(teamId, user.token)
                .then(updatedTeam => {
                    setTeams(
                        sortTeams(
                            teams.filter(t => t.id !== updatedTeam.id)
                        )
                    )
                    setLoading(false)
                })
                .catch (exception => {
                    setLoading(false)
                    console.log(exception)
                    // if token expired refresh the page to run Redirector.jsx that checks token expiration
                    if (exception.response.data.error === "token expired") {
                        window.location.reload(false)
                        return
                    }
                    // if token invalid force logout (removing invalid token from local storage and then reloading)
                    if (exception.response.data.error === "token expired") {
                        localStorage.removeItem("loggedCompStatsUser")
                        window.location.reload(false)
                        return
                    }
                    if (exception.response.status === 400) {
                        alert(exception.response.data.error)
                    }
                    if (exception.response) {
                        console.log("Error", exception.response.status, ":", exception.response.data.error)
                    }
                })
        }
    }

    // disband a team
    const handleDisband = (teamId, teamName) => {
        if (window.confirm(`Are you sure you wanto to disband ${teamName}? EVERY MATCH SAVED WILL BE LOST`)) {
            setLoading(true)
            teamService
                .disbandTeam(teamId, user.token)
                .then(() => {
                    setTeams(
                        sortTeams(
                            teams.filter(t => t.id !== teamId)
                        )
                    )
                    setLoading(false)
                })
                .catch (exception => {
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
                    if (exception.response.status === 400) {
                        alert(exception.response.data.error)
                    }
                    if (exception.response) {
                        console.log("Error", exception.response.status, ":", exception.response.data.error)
                    }
                })
        }
    }


    return (
        <div className={TeamsStyles.teamDiv}>
            <div className={TeamsStyles.backgroundDiv}>
                <div className={TeamsStyles.titleDiv}>
                    {/* Team name if edit is not active */}
                    {!isEditActive &&
                    <h1>{t.name}</h1>
                    }

                    {/* Team name input if edit is active */}
                    {isEditActive &&
                    <input
                        className={TeamsStyles.editInput}
                        type="text"
                        value={editTeamName}
                        onChange={({ target }) => setEditTeamName(target.value)}
                        placeholder="New team name"
                    />
                    }

                    {/* Edit button that display or hide the input field */}
                    {t.members.find(mem => mem.id === user.id).permission === "admin" &&
                        <button className={TeamsStyles.actionButton} onClick={() => setEditActive(!isEditActive)}>{isEditActive ? "CANCEL" : "EDIT"}</button>
                    }

                    {/* Save buttons that saves the new team name */}
                    {t.members.find(mem => mem.id === user.id).permission === "admin" && isEditActive &&
                        <button className={TeamsStyles.actionButton} onClick={() => handleEdit(t.id, t.name, editTeamName)}>SAVE</button>
                    }

                    {/* Leave button */}
                    <button className={TeamsStyles.actionButton} onClick={() => handleLeave(t.id, t.name)}>LEAVE</button>

                    {/* Disband button shows up only for admin */}
                    {t.members.find(mem => mem.id === user.id).permission === "admin" &&
                        <button className={TeamsStyles.actionButton} onClick={() => handleDisband(t.id, t.name)}>DISBAND</button>
                    }
                </div>
                <div className={TeamsStyles.membersDiv}>
                    <h3 className={TeamsStyles.nMatches}>{t.nMatches} MATCHES</h3>
                    <h2 className={TeamsStyles.membersTitle}>MEMBERS:</h2>
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
                            {/* Button promote shows up only for admin and not for users already admin */}
                            {t.members.find(mem => mem.id === user.id).permission === "admin" &&
                            m.permission !== "admin" &&
                            <button className={TeamsStyles.actionButton} onClick={() => handlePromote(t.id, m.id, m.username)}>PROMOTE</button>
                            }
                        </div>
                    )}
                </div>
                <div className={TeamsStyles.membersDiv}>
                    {t.waitingMembers && t.waitingMembers.length > 0 &&
                        <>
                            <h2 className={TeamsStyles.membersTitle}>REQUESTS TO JOIN:</h2>
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
}

export default Team