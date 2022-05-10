import jwt_decode from "jwt-decode"

import usersService from "../services/users"
import loginService from "../services/login"

import RegisterForm from "../components/register/RegisterForm"

import RegisterStyles from "./Register.module.scss"

const Register = ({ setUser, notification, notificate }) => {

    const register = async (username, email, password, password2) => {

        if (! (/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,14}[a-zA-Z0-9]$/.test(username))) {
            notificate("Enter a valid username", true)
            return
        }

        if (! (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            notificate("Enter a valid email", true)
            return
        }

        if (password !== password2) {
            notificate("The passwords don't match", true)
            return
        }

        if (! (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(password))) {
            notificate("Enter a valid password", true)
            return
        }

        try {
            await usersService.create(username, email, password)
            const user = await loginService.login(username, password)

            const decoded = jwt_decode(user.token)
            user.id = decoded.id

            notificate(`${user.username} logged in`, false)

            window.localStorage.setItem(
                "loggedR6statsUser", JSON.stringify(user)
            )
            setUser(user)
        }
        catch (exception) {
            console.log(exception)
            if (exception.response.data.error === "email taken") {
                notificate("This email is already used, try recoved password", true)
                return
            }
            if (exception.response.data.error === "username taken") {
                notificate("This username is already used", true)
                return
            }
            if (exception.response) {
                notificate(`Login error: code ${exception.response.status} - ${exception.response.data.error}`, true)
            }
        }
    }

    return (
        <div className={RegisterStyles.background}>
            <RegisterForm register={register} notificationObj={notification} />
        </div>
    )
}

export default Register