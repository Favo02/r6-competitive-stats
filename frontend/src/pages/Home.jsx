import { Navigate } from "react-router-dom"

import FileUploader from "../components/FileUploader"

import "./Home.module.scss"

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
            <FileUploader />
        </div>
    )
}

export default Home