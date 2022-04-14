const Notification = ({ message, isError }) => {
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

    if (message === null) {
        return null
    }

    if (isError) {
        return (
            <div style={{ ...style, ...error }}>
                {message}
            </div>
        )
    }
    return (
        <div style={{ ...style, ...notification }}>
            {message}
        </div>
    )
}

export default Notification