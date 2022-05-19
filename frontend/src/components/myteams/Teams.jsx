import React, { useEffect } from "react"

import teamService from "../../services/teams"

import Team from "./Team"

import TeamsStyles from "./Teams.module.scss"

const Teams = ({ user, teams, setTeams, setLoading }) => {

    // sorts alphabetically the teams
    const sortTeams = (unsortedTeams) => {
        return unsortedTeams.sort((t1, t2) => t1.name < t2.name ? -1 : 1)
    }

    // gets user teams
    useEffect(() => {
        setLoading(true)
        teamService
            .getAll(user.token)
            .then(teams => {
                setLoading(false)
                setTeams(
                    sortTeams(
                        teams
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
                if (exception.response) {
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })
    }, [])

    return (
        <div className={TeamsStyles.teamsDiv}>
            {teams.map(t => {
                return (
                    <Team
                        key={t.id}
                        t={t}
                        user={user}

                        teams={teams}
                        setTeams={setTeams}
                        sortTeams={sortTeams}

                        setLoading={setLoading}

                    />
                )
            })}
        </div>
    )
}

export default Teams