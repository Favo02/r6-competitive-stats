import { Navigate } from "react-router-dom"

import Notification from "../components/Notification"

const Home = ({ user, notification, logout }) => {

    if (user === null) {
        return (
            <Navigate to={{ pathname: "/login" }} />
        )
    }

    return (
        <div>
            <Notification notificationObj={notification} />
            <p>Logged in as {user.username}</p>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Home