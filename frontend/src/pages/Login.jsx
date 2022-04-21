import { Navigate } from "react-router-dom"

import loginService from "../services/login"

import LoginForm from "../components/LoginForm"

import LoginStyles from "./Login.module.scss"

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
            <div className={LoginStyles.background}>
                <LoginForm login={login} notificationObj={notification} />
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
