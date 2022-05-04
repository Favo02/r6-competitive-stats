import NotificationStyles from "./Notification.module.scss"

const Notification = ({ notificationObj }) => {

    if (notificationObj.message === null || notificationObj.message === "") {
        return null
    }

    if (notificationObj.isError) {
        return (
            <div className={NotificationStyles.errorNotification}>
                {notificationObj.message}
            </div>
        )
    }
    return (
        <div className={NotificationStyles.infoNotification}>
            {notificationObj.message}
        </div>
    )
}

export default Notification