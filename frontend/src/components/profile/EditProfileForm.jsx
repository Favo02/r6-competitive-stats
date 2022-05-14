import { useState, useEffect } from "react"

import usersService from "../../services/users"

import Notification from "../common/Notification"

import classnames from "classnames"
import CommonStyles from "../../styles/common.module.scss"
import LoginFormStyles from "../login/LoginForm.module.scss"

import { FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

const EditProfileForm = ({ user, setUser, setLoading, notification, notificate }) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [curPassword, setCurPassword] = useState("")
    const [curPasswordShown, setCurPasswordShown] = useState(false)

    const [newPassword, setNewPassword] = useState("")
    const [newPassword2, setNewPassword2] = useState("")
    const [newPasswordShown, setNewPasswordShown] = useState(false)

    // get current username and email
    useEffect(() => {
        setLoading(true)
        usersService
            .getCurrent(user.token)
            .then(data => {
                setLoading(false)
                setUsername(data.username)
                setEmail(data.email)
            })
            .catch (exception => {
                setLoading(false)
                console.log(exception)
                // if token expired refresh the page to run Redirector.jsx that checks token expiration
                if (exception.response.data.error === "token expired") {
                    window.location.reload(false)
                    return
                }
                // if token invalid force logout (removing invalid token from local storage and then reloading)
                if (exception.response.data.error === "invalid token") {
                    localStorage.removeItem("loggedCompStatsUser")
                    window.location.reload(false)
                    return
                }
                if (exception.response) {
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })
    }, [])

    // edits the user profile
    const editProfile = (event) => {
        event.preventDefault()

        if (! (/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,14}[a-zA-Z0-9]$/.test(username))) {
            notificate("Enter a valid username", true)
            return
        }

        if (! (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            notificate("Enter a valid email", true)
            return
        }

        setLoading(true)
        usersService
            .editProfile(username, email, curPassword, user.token)
            .then(updatedUser => {
                setLoading(false)
                const newUser = {
                    id: user.id,
                    token: user.token,
                    username: updatedUser.username
                }
                setUser(newUser)
                setUsername(updatedUser.username)
                setEmail(updatedUser.email)
                notificate("Profile edited successfully")
            })
            .catch (exception => {
                setLoading(false)
                console.log(exception)
                // if token expired refresh the page to run Redirector.jsx that checks token expiration
                if (exception.response.data.error === "token expired") {
                    window.location.reload(false)
                    return
                }
                // if token invalid force logout (removing invalid token from local storage and then reloading)
                if (exception.response.data.error === "token expired") {
                    localStorage.removeItem("loggedCompStatsUser")
                    window.location.reload(false)
                    return
                }
                // errors only the backend can handle
                if (exception.response.data.error === "current password wrong") {
                    notificate("Current password is wrong", true)
                    console.log("Current password is wrong")
                    return
                }
                if (exception.response.data.error === "username taken") {
                    notificate("This username is already taken", true)
                    console.log("This username is already taken")
                    return
                }
                if (exception.response.data.error === "email taken") {
                    notificate("This email is already used by someone else", true)
                    console.log("This email is already used by someone else")
                    return
                }
                if (exception.response) {
                    notificate("Error", exception.response.status, ":", exception.response.data.error)
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })
    }

    const editPassword = (event) => {
        event.preventDefault()

        if (newPassword !== newPassword2) {
            notificate("The passwords don't match", true)
            return
        }

        if (! (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(newPassword))) {
            notificate("Enter a valid password", true)
            return
        }

        setLoading(true)
        usersService
            .editPassword(curPassword, newPassword, newPassword2, user.token)
            .then(updatedUser => {
                setLoading(false)
                const newUser = {
                    id: user.id,
                    token: user.token,
                    username: updatedUser.username
                }
                setUser(newUser)
                setUsername(updatedUser.username)
                setEmail(updatedUser.email)
                notificate("Password changed successfully")
            })
            .catch (exception => {
                setLoading(false)
                console.log(exception)
                // if token expired refresh the page to run Redirector.jsx that checks token expiration
                if (exception.response.data.error === "token expired") {
                    window.location.reload(false)
                    return
                }
                // if token invalid force logout (removing invalid token from local storage and then reloading)
                if (exception.response.data.error === "invalid token") {
                    localStorage.removeItem("loggedCompStatsUser")
                    window.location.reload(false)
                    return
                }
                // errors only the backend can handle
                if (exception.response.data.error === "current password wrong") {
                    notificate("Current password is wrong", true)
                    console.log("Current password is wrong")
                    return
                }
                if (exception.response.data.error === "username taken") {
                    notificate("This username is already taken", true)
                    console.log("This username is already taken")
                    return
                }
                if (exception.response.data.error === "email taken") {
                    notificate("This email is already used by someone else", true)
                    console.log("This email is already used by someone else")
                    return
                }
                if (exception.response) {
                    notificate("Error", exception.response.status, ":", exception.response.data.error)
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })
    }

    return (
        <div className={LoginFormStyles.profileDiv}>
            <Notification notificationObj={notification} />

            <div className={LoginFormStyles.editProfileForm}>
                <h1 className={LoginFormStyles.h1}>
                    <span
                        className={CommonStyles.highlighted}
                    >Edit </span>
                    your profile.
                </h1>
                <form onSubmit={editProfile}>
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

                    <div className={LoginFormStyles.div}>
                        <label
                            className={LoginFormStyles.label}
                        >Email</label>
                        <input
                            className={LoginFormStyles.input}
                            type="text"
                            value={email}
                            placeholder="email@email.com"
                            onChange={({ target }) => setEmail(target.value)}
                        />
                        <MdEmail
                            className={LoginFormStyles.icon}
                        />
                    </div>

                    <div className={LoginFormStyles.div}>
                        <label
                            className={LoginFormStyles.label}
                        >Current password</label>
                        <input
                            className={LoginFormStyles.input}
                            type={curPasswordShown ? "text" : "password"}
                            value={curPassword}
                            placeholder={curPasswordShown ? "Pa$$w0rD" : "●●●●●●●●"}
                            onChange={({ target }) => setCurPassword(target.value)}
                        />
                        { curPasswordShown
                            ? <FaEyeSlash
                                className={classnames(CommonStyles.pointer, LoginFormStyles.icon)}
                                onClick={() => setCurPasswordShown(!curPasswordShown)}
                            />
                            : <FaEye
                                className={classnames(CommonStyles.pointer, LoginFormStyles.icon)}
                                onClick={() => setCurPasswordShown(!curPasswordShown)}
                            />
                        }
                    </div>

                    <button
                        className={LoginFormStyles.loginButton}
                        type="submit"
                    >Edit</button>
                </form>
            </div>

            <div className={LoginFormStyles.editProfileForm}>
                <h1 className={LoginFormStyles.h1}>
                    Change&nbsp;
                    <span
                        className={CommonStyles.highlighted}
                    >password.</span>
                </h1>
                <form onSubmit={editPassword}>

                    <div className={LoginFormStyles.div}>
                        <label
                            className={LoginFormStyles.label}
                        >Current password</label>
                        <input
                            className={LoginFormStyles.input}
                            type={curPasswordShown ? "text" : "password"}
                            value={curPassword}
                            placeholder={curPasswordShown ? "Pa$$w0rD" : "●●●●●●●●"}
                            onChange={({ target }) => setCurPassword(target.value)}
                        />
                        { curPasswordShown
                            ? <FaEyeSlash
                                className={classnames(CommonStyles.pointer, LoginFormStyles.icon)}
                                onClick={() => setCurPasswordShown(!curPasswordShown)}
                            />
                            : <FaEye
                                className={classnames(CommonStyles.pointer, LoginFormStyles.icon)}
                                onClick={() => setCurPasswordShown(!curPasswordShown)}
                            />
                        }
                    </div>

                    <div className={LoginFormStyles.div}>
                        <label
                            className={LoginFormStyles.label}
                        >New password</label>
                        <input
                            className={LoginFormStyles.input}
                            type={newPasswordShown ? "text" : "password"}
                            value={newPassword}
                            placeholder={newPasswordShown ? "NewPa$$w0rd" : "●●●●●●●●"}
                            onChange={({ target }) => setNewPassword(target.value)}
                        />
                        <h4 className={LoginFormStyles.description}>Password should be min 8, max 16 characters, at least one letter, one number and one special character (@$!%*#?&)</h4>
                        { newPasswordShown
                            ? <FaEyeSlash
                                className={classnames(CommonStyles.pointer, LoginFormStyles.icon)}
                                onClick={() => setNewPasswordShown(!newPasswordShown)}
                            />
                            : <FaEye
                                className={classnames(CommonStyles.pointer, LoginFormStyles.icon)}
                                onClick={() => setNewPasswordShown(!newPasswordShown)}
                            />
                        }
                    </div>

                    <div className={LoginFormStyles.div}>
                        <label
                            className={LoginFormStyles.label}
                        >Confirm new password</label>
                        <input
                            className={LoginFormStyles.input}
                            type={newPasswordShown ? "text" : "password"}
                            value={newPassword2}
                            placeholder={newPasswordShown ? "NewPa$$w0rd" : "●●●●●●●●"}
                            onChange={({ target }) => setNewPassword2(target.value)}
                        />
                        { newPasswordShown
                            ? <FaEyeSlash
                                className={classnames(CommonStyles.pointer, LoginFormStyles.icon)}
                                onClick={() => setNewPasswordShown(!newPasswordShown)}
                            />
                            : <FaEye
                                className={classnames(CommonStyles.pointer, LoginFormStyles.icon)}
                                onClick={() => setNewPasswordShown(!newPasswordShown)}
                            />
                        }
                    </div>

                    <button
                        className={LoginFormStyles.loginButton}
                        type="submit"
                    >Edit</button>
                </form>
            </div>
        </div>
    )
}

export default EditProfileForm

