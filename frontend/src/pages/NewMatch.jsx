import Header from "../components/Header"

const NewMatch = ({ user, logout }) => {
    return (
        <div>
            <Header user={user} logout={logout} />
        </div>
    )
}

export default NewMatch