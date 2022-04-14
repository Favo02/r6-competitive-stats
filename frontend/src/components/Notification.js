const Notification = ({ notificationObj }) => {
    const style = {
        "background": "lightgrey",
        "fontSize": "20px",
        "borderStyle": "solid",
        "borderRadius": "5px",
        "padding": "10px",
        "marginBottom": "10px"
    }

    const error = {
        "color": "red"
    }

    const notification = {
        "color": "green"
    }

    if (notificationObj.message === null || notificationObj.message === "") {
        return null
    }

    if (notificationObj.isError) {
        return (
            <div style={{ ...style, ...error }}>
                {notificationObj.message}
            </div>
        )
    }
    return (
        <div style={{ ...style, ...notification }}>
            {notificationObj.message}
        </div>
    )
}

export default Notification