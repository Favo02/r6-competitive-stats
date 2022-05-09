import { useState } from "react"

import Header from "../components/common/Header"
import Loading from "../components/common/Loading"
import Teams from "../components/profile/Teams"
import NewTeamForm from "../components/profile/NewTeamForm"
import JoinTeamForm from "../components/profile/JoinTeamForm"

import classnames from "classnames"
import ProfileStyles from "./Profile.module.scss"

const Profile = ({ user, logout }) => {
    // loading
    const [loading, setLoading] = useState(false)
    // teams of the user
    const [teams, setTeams] = useState([])

    return (
        <div>
            <Header user={user} logout={logout} />
            <div className={ProfileStyles.teamsDiv}>
                {loading && <Loading />}
                <Teams user={user} teams={teams} setTeams={setTeams} setLoading={setLoading} />
                <div className={classnames(
                    ProfileStyles.newTeamsDiv,
                    teams.length === 0
                        ? ProfileStyles.noTeams
                        : ""
                )}>
                    <NewTeamForm user={user} teams={teams} setTeams={setTeams} setLoading={setLoading} />
                    <JoinTeamForm user={user} setLoading={setLoading} />
                </div>
            </div>
        </div>
    )
}

export default Profile