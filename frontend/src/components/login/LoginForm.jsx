import { useState } from "react"
import PropTypes from "prop-types"

import Notification from "../common/Notification"

import classnames from "classnames"
import CommonStyles from "../../styles/common.module.scss"
import LoginFormStyles from "./LoginForm.module.scss"

import { FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa"

const Login = ({ login, notificationObj }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordShown, setPasswordShown] = useState(false)

    const handleLogin = (event) => {
        event.preventDefault()
        login(username, password)
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
                into the webapp.
            </h1>
            <h3 className={LoginFormStyles.h3}>
                Don&apos;t have an account? Contact&nbsp;
                <a
                    className={classnames(LoginFormStyles.a, CommonStyles.highlighted)}
                    target="_blank"
                    rel="noreferrer"
                    href="https://linktr.ee/imprudenza"
                >imprudenza</a>
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

Login.propTypes = {
    login: PropTypes.func.isRequired
}

export default Login