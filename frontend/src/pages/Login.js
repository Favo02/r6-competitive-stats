import { Navigate } from "react-router-dom"

import loginService from "../services/login"

import LoginForm from "../components/LoginForm"
import Notification from "../components/Notification"

const Login = ({ user, setUser, notification, notificate }) => {

    const login = async (username, password) => {
        try {
            const user = await loginService.login({
                username, password,
            })

            notificate(`${user.username} logged in`, false)

            window.localStorage.setItem(
                "loggedR6statsUser", JSON.stringify(user)
            )
            setUser(user)
        }
        catch (exception) {
            if (exception.response.status === 401) {
                notificate("Wrong credentials", true)
            }
            else {
                notificate(`Login error: code ${exception.response.status} - ${exception.response.data.error}`, true)
            }
        }
    }

    if (user === null) {
        return (
            <div>
                <Notification notificationObj={notification} />
                <h2>Log in to application</h2>
                <LoginForm login={login} />
            </div>
        )
    }
    else {
        return (
            <Navigate to={{ pathname: "/home" }} />
        )
    }
}

export default Login
