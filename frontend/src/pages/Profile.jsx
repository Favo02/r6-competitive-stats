import Header from "../components/common/Header"
import Teams from "../components/profile/Teams"
import NewTeamForm from "../components/profile/NewTeamForm"

const Profile = ({ user, logout }) => {
    return (
        <div>
            <Header user={user} logout={logout} />
            <Teams user={user}/>
            <NewTeamForm />
        </div>
    )
}

export default Profile