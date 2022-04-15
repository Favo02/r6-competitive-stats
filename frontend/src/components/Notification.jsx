import classes from "./Notification.module.scss"

const Notification = ({ notificationObj }) => {

    if (notificationObj.message === null || notificationObj.message === "") {
        return null
    }

    if (notificationObj.isError) {
        return (
            <div className={classes.errorNotification}>
                {notificationObj.message}
            </div>
        )
    }
    return (
        <div className={classes.infoNotification}>
            {notificationObj.message}
        </div>
    )
}

export default Notification