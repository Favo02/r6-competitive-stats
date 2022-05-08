import { useState } from "react"

import Header from "../components/common/Header"
import Teams from "../components/profile/Teams"
import NewTeamForm from "../components/profile/NewTeamForm"
import JoinTeamForm from "../components/profile/JoinTeamForm"

import classnames from "classnames"
import ProfileStyles from "./Profile.module.scss"

const Profile = ({ user, logout }) => {
    // teams of the user
    const [teams, setTeams] = useState([])

    return (
        <div>
            <Header user={user} logout={logout} />
            <div className={ProfileStyles.teamsDiv}>
                <Teams user={user} teams={teams} setTeams={setTeams}/>
                <div className={classnames(
                    ProfileStyles.newTeamsDiv,
                    teams.length === 0
                        ? ProfileStyles.noTeams
                        : ""
                )}>
                    <NewTeamForm user={user} teams={teams} setTeams={setTeams}/>
                    <JoinTeamForm user={user} />
                </div>
            </div>
        </div>
    )
}

export default Profile