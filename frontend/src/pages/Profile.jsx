import Header from "../components/Header"

const Profile = ({ user, logout }) => {
    return (
        <div>
            <Header user={user} logout={logout} />
        </div>
    )
}

export default Profile