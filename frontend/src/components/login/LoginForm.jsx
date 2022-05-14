import { useState } from "react"
import { Link } from "react-router-dom"
import jwt_decode from "jwt-decode"

import loginService from "../../services/login"

import Notification from "../common/Notification"

import classnames from "classnames"
import CommonStyles from "../../styles/common.module.scss"
import LoginFormStyles from "./LoginForm.module.scss"

import { FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa"

const Login = ({ notificationObj, notificate, setUser }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordShown, setPasswordShown] = useState(false)

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login(username, password)

            const decoded = jwt_decode(user.token)
            user.id = decoded.id

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

    const toggleShowPassword = () => {
        setPasswordShown(!passwordShown)
    }

    return (
        <div className={LoginFormStyles.loginForm}>
            <Notification notificationObj={notificationObj} />
            <h1 className={LoginFormStyles.h1}>
                <span
                    className={CommonStyles.highlighted}
                >Login </span>
                into CompStats.
            </h1>
            <h3 className={LoginFormStyles.h3}>
                Don&apos;t have an account? Go to&nbsp;
                <Link
                    className={classnames(LoginFormStyles.link, CommonStyles.highlighted)}
                    to="/register"
                >Register</Link>
            </h3>
            <form onSubmit={handleLogin}>
                <div className={LoginFormStyles.div}>
                    <label
                        className={LoginFormStyles.label}
                        htmlFor="Username"
                    >Username</label>
                    <input
                        className={LoginFormStyles.input}
                        id="username-input"
                        type="text"
                        value={username}
                        name="Username"
                        placeholder="Grande Puffo"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                    <FaUserAlt
                        className={LoginFormStyles.icon}
                    />
                </div>
                <div className={LoginFormStyles.div}>
                    <label
                        className={LoginFormStyles.label}
                        htmlFor="Password"
                    >Password</label>
                    <input
                        className={LoginFormStyles.input}
                        id="password-input"
                        type={passwordShown ? "text" : "password"}
                        value={password}
                        name="Password"
                        placeholder={passwordShown ? "Pa$$w0rD" : "●●●●●●●●"}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                    { passwordShown
                        ? <FaEyeSlash
                            className={classnames(CommonStyles.pointer, LoginFormStyles.icon)}
                            onClick={toggleShowPassword}
                        />
                        : <FaEye
                            className={classnames(CommonStyles.pointer, LoginFormStyles.icon)}
                            onClick={toggleShowPassword}
                        />
                    }
                </div>
                <button
                    className={LoginFormStyles.loginButton}
                    type="submit"
                    id="login-button"
                >Login</button>
            </form>
        </div>
    )
}

export default Login