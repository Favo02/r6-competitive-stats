import Header from "../components/common/Header"
import Teams from "../components/profile/Teams"
import JoinTeamForm from "../components/profile/JoinTeamForm"

import ProfileStyles from "./Profile.module.scss"

const Profile = ({ user, logout }) => {
    return (
        <div>
            <Header user={user} logout={logout} />
            <div className={ProfileStyles.teamsDiv}>
                <Teams user={user}/>
                <JoinTeamForm user={user} />
            </div>
        </div>
    )
}

export default Profile