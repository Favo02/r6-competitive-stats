import { useState } from "react"
import { Link } from "react-router-dom"
import jwt_decode from "jwt-decode"

import usersService from "../../services/users"
import loginService from "../../services/login"

import Notification from "../common/Notification"

import classnames from "classnames"
import CommonStyles from "../../styles/common.module.scss"
import LoginFormStyles from "../login/LoginForm.module.scss"

import { FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

const RegisterForm = ({ notificate, notificationObj, setUser }) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [passwordShown, setPasswordShown] = useState(false)

    const handleRegister = async (event) => {
        event.preventDefault()

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

            window.localStorage.setItem(
                "loggedCompStatsUser", JSON.stringify(user)
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

    const toggleShowPassword = () => {
        setPasswordShown(!passwordShown)
    }

    return (
        <div className={LoginFormStyles.registerForm}>
            <Notification notificationObj={notificationObj} />
            <h1 className={LoginFormStyles.h1}>
                <span
                    className={CommonStyles.highlighted}
                >Register </span>
                to CompStats.
            </h1>
            <h3 className={LoginFormStyles.h3}>
                Already have an account? Go to&nbsp;
                <Link
                    className={classnames(LoginFormStyles.link, CommonStyles.highlighted)}
                    to="/login"
                >Login</Link>
            </h3>
            <form onSubmit={handleRegister}>
                {/* Username */}
                <div className={LoginFormStyles.div}>
                    <label
                        className={LoginFormStyles.label}
                    >Username</label>
                    <input
                        className={LoginFormStyles.input}
                        type="text"
                        value={username}
                        placeholder="Grande Puffo"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                    <h4 className={LoginFormStyles.description}>Username is unique and should be min 4, max characters, alphanumeric, underscore and dot (_ .) allowed. Special characters can&apos;t be at start or end and can&apos;t be consecutive</h4>
                    <FaUserAlt
                        className={LoginFormStyles.icon}
                    />
                </div>

                {/* Email */}
                <div className={LoginFormStyles.div}>
                    <label
                        className={LoginFormStyles.label}
                    >Email</label>
                    <input
                        className={LoginFormStyles.input}
                        type="text"
                        value={email}
                        placeholder="grandepuffo@pmail.com"
                        onChange={({ target }) => setEmail(target.value)}
                    />
                    <MdEmail
                        className={LoginFormStyles.icon}
                    />
                </div>

                {/* Password */}
                <div className={LoginFormStyles.div}>
                    <label
                        className={LoginFormStyles.label}
                    >Password</label>
                    <input
                        className={LoginFormStyles.input}
                        type={passwordShown ? "text" : "password"}
                        value={password}
                        placeholder={passwordShown ? "Pa$$w0rD" : "●●●●●●●●"}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                    <h4 className={LoginFormStyles.description}>Password should be min 8, max 16 characters, at least one letter, one number and one special character (@$!%*#?&)</h4>
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

                {/* Confirm password */}
                <div className={LoginFormStyles.div}>
                    <label
                        className={LoginFormStyles.label}
                    >Confirm password</label>
                    <input
                        className={LoginFormStyles.input}
                        type={passwordShown ? "text" : "password"}
                        value={password2}
                        placeholder={passwordShown ? "Pa$$w0rD" : "●●●●●●●●"}
                        onChange={({ target }) => setPassword2(target.value)}
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
                    id="register-button"
                >Register</button>
            </form>
        </div>
    )
}

export default RegisterForm