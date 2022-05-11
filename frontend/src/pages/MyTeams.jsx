import { useState } from "react"

import Header from "../components/common/Header"
import Loading from "../components/common/Loading"
import Teams from "../components/myteams/Teams"
import NewTeamForm from "../components/myteams/NewTeamForm"
import JoinTeamForm from "../components/myteams/JoinTeamForm"

import classnames from "classnames"
import MyTeamsStyles from "./MyTeams.module.scss"

const MyTeams = ({ user, logout }) => {
    // loading
    const [loading, setLoading] = useState(false)
    // teams of the user
    const [teams, setTeams] = useState([])

    return (
        <div>
            <Header user={user} logout={logout} />
            <div className={MyTeamsStyles.teamsDiv}>
                {loading && <Loading />}
                <Teams user={user} teams={teams} setTeams={setTeams} setLoading={setLoading} />
                <div className={classnames(
                    MyTeamsStyles.newTeamsDiv,
                    teams.length === 0
                        ? MyTeamsStyles.noTeams
                        : ""
                )}>
                    <NewTeamForm user={user} teams={teams} setTeams={setTeams} setLoading={setLoading} />
                    <JoinTeamForm user={user} setLoading={setLoading} />
                </div>
            </div>
        </div>
    )
}

export default MyTeams