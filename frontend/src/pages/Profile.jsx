import Header from "../components/common/Header"
import Teams from "../components/profile/Teams"

const Profile = ({ user, logout }) => {
    return (
        <div>
            <Header user={user} logout={logout} />
            <Teams user={user}/>
        </div>
    )
}

export default Profile