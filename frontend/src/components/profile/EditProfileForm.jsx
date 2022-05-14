import { useState, useEffect } from "react"

import usersService from "../../services/users"

import Notification from "../common/Notification"

const EditProfileForm = ({ user, setUser, setLoading, notification, notificate }) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [curPassword, setCurPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPassword2, setNewPassword2] = useState("")
    // const [passwordShown, setPasswordShown] = useState(false)

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
                if (exception.response) {
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })
    }, [])

    // edits the user profile
    const editProfile = (event) => {
        event.preventDefault()
        setLoading(true)
        usersService
            .edit(username, email, curPassword, newPassword, newPassword2, user.token)
            .then(updatedUser => {
                setLoading(false)
                setUser(updatedUser)
                setUsername(updatedUser.username)
                setEmail(updatedUser.email)
            })
            .catch (exception => {
                setLoading(false)
                console.log(exception)
                // if token expired refresh the page to run Redirector.jsx that checks token expiration
                if (exception.response.data.error === "token expired") {
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
        <>
            <Notification notificationObj={notification} />
            <form>
                <input
                    type="text"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                    placeholder="Username"
                />
                <input
                    type="text"
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    placeholder="email@email.com"
                />
                <input
                    type="password"
                    value={curPassword}
                    onChange={({ target }) => setCurPassword(target.value)}
                    placeholder="Pa$$w0rd"
                />
                <input
                    type="password"
                    value={newPassword}
                    onChange={({ target }) => setNewPassword(target.value)}
                    placeholder="NewPa$$w0rd"
                />
                <input
                    type="password"
                    value={newPassword2}
                    onChange={({ target }) => setNewPassword2(target.value)}
                    placeholder="NewPa$$w0rd"
                />
                <button onClick={editProfile}>Edit profile</button>
            </form>
        </>
    )
}

export default EditProfileForm