import usersService from "../../services/users"

import DeleteAccountStyles from "./DeleteAccount.module.scss"

const DeleteAccount = ({ user, logout, setLoading, notificate }) => {

    const handleDelete = () => {
        if (window.confirm("This actions is IRREVERSIBLE: do you want to delete your account?")) {
            setLoading(true)
            usersService
                .deleteAccount(user.token)
                .then(() => {
                    setLoading(false)
                    logout()
                    notificate("Account deleted", false)
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
                    if (exception.response.data.error === "user in a team") {
                        notificate("You need to leave every team before deleting your account", true)
                        console.log("You need to leave every team before deleting your account")
                        return
                    }
                })
        }
    }

    return (
        <div className={DeleteAccountStyles.deleteDiv}>
            <h2 className={DeleteAccountStyles.titleText}>Danger zone</h2>
            <button className={DeleteAccountStyles.deleteButton} onClick={handleDelete}>Delete account</button>
        </div>
    )

}

export default DeleteAccount