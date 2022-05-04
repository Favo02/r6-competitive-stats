import jwt_decode from "jwt-decode"

import loginService from "../services/login"

import LoginForm from "../components/login/LoginForm"

import LoginStyles from "./Login.module.scss"

const Login = ({ setUser, notification, notificate }) => {

    const login = async (username, password) => {
        try {
            const user = await loginService.login({
                username, password,
            })

            const decoded = jwt_decode(user.token)
            user.id = decoded.id

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

    return (
        <div className={LoginStyles.background}>
            <LoginForm login={login} notificationObj={notification} />
        </div>
    )
}

export default Login
