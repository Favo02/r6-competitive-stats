import { Navigate } from "react-router-dom"

import Header from "../components/Header"

const Error404 = ({ user, logout }) => {

    if (user === null) {
        return (
            <Navigate to="/login" />
        )
    }

    return (
        <div>
            <Header user={user} logout={logout} />
            <h1>Page not found - error 404</h1>
        </div>
    )
}

export default Error404