import { useState } from "react"
import PropTypes from "prop-types"

import Notification from "./Notification"

import styles from "./LoginForm.module.scss"

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
        <div id={styles.form}>
            <Notification notificationObj={notificationObj} />
            <h1><span className={styles.textHighlight}>Login</span> into the webapp.</h1>
            <h3>Don&apos;t have an account? Contact <a
                className={styles.textHighlight}
                target="_blank"
                rel="noreferrer"
                href="https://linktr.ee/imprudenza"
            >imprudenza</a>
            </h3>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="Username">Username</label>
                    <input
                        id="username-input"
                        type="text"
                        value={username}
                        name="Username"
                        placeholder="Grande Puffo"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                    <FaUserAlt />
                </div>
                <div>
                    <label htmlFor="Password">Password</label>
                    <input
                        id="password-input"
                        type={passwordShown ? "text" : "password"}
                        value={password}
                        name="Password"
                        placeholder={passwordShown ? "Pa$$w0rD" : "●●●●●●●●"}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                    { passwordShown
                        ? <FaEyeSlash className={styles.pointer} onClick={toggleShowPassword} />
                        : <FaEye className={styles.pointer} onClick={toggleShowPassword} />
                    }
                </div>
                <button type="submit" id="login-button">Login</button>
            </form>
        </div>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired
}

export default Login