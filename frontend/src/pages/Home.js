import { Navigate } from "react-router-dom"

const Home = ({ user, logout }) => {

    if (user === null) {
        return (
            <Navigate to={{ pathname: "/login" }} />
        )
    }

    return (
        <div>
            <p>Logged in as {user.username}</p>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Home