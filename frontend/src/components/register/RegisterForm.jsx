import { useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

import Notification from "../common/Notification"

import classnames from "classnames"
import CommonStyles from "../../styles/common.module.scss"
import LoginFormStyles from "../login/LoginForm.module.scss"

import { FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

const RegisterForm = ({ register, notificationObj }) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [passwordShown, setPasswordShown] = useState(false)

    const handleRegister = (event) => {
        event.preventDefault()
        register(username, email, password, password2)
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
                    <h4 className={LoginFormStyles.description}>Username is unique and should be min 4, max characters, alphanumeric, underscore and dot (_ .) allowed. Special characters can&apos;t be at start or end and can&apos;t be consecutive</h4>
                    <FaUserAlt
                        className={LoginFormStyles.icon}
                    />
                </div>
                {/* Email */}
                <div className={LoginFormStyles.div}>
                    <label
                        className={LoginFormStyles.label}
                        htmlFor="Email"
                    >Email</label>
                    <input
                        className={LoginFormStyles.input}
                        id="email-input"
                        type="text"
                        value={email}
                        name="Email"
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
                        htmlFor="Password2"
                    >Confirm password</label>
                    <input
                        className={LoginFormStyles.input}
                        id="password2-input"
                        type={passwordShown ? "text" : "password"}
                        value={password2}
                        name="Password2"
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

RegisterForm.propTypes = {
    register: PropTypes.func.isRequired
}

export default RegisterForm