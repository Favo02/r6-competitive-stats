import { Navigate } from "react-router-dom"

import Header from "../components/Header"

const Settings = ({ user, logout }) => {

    if (user === null) {
        return (
            <Navigate to="/login" />
        )
    }

    return (
        <div>
            <Header user={user} logout={logout} />
        </div>
    )
}

export default Settings