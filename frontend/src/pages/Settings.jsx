import Header from "../components/common/Header"

const Settings = ({ user, logout }) => {
    return (
        <div>
            <Header user={user} logout={logout} />
        </div>
    )
}

export default Settings