import { Navigate } from "react-router-dom"

import Header from "../components/Header"

const NewMatch = ({ user, logout }) => {

    if (user === null) {
        return (
            <Navigate to={{ pathname: "/login" }} />
        )
    }

    return (
        <div>
            <Header user={user} logout={logout} />
        </div>
    )
}

export default NewMatch