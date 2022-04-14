import { useEffect, useState } from "react"

import loginService from "./services/login"

import Login from "./components/Login"
import Notification from "./components/Notification"

function App() {
    const [user, setUser] = useState(null)

    const [notification, setNotification] = useState({ message: "", isError: false })

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedR6statsUser")
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])

    const notificate = (message, isError) => {
        console.log(message)
        setNotification({ message: message, isError: isError })
        setTimeout(() => {
            setNotification({ message: "", isError: isError })
        }, 5000)
    }

    const login = async (username, password) => {
        try {
            const user = await loginService.login({
                username, password,
            })

            notificate(`${user.username} logged in`, false)

            window.localStorage.setItem(
                "loggedR6statsUser", JSON.stringify(user)
            )
            setUser(user)
        }
        catch (exception) {
            if (exception.response.status === 401) {
                notificate("Wrong credentials", true)
            }
            else {
                notificate(`Login error: code ${exception.response.status} - ${exception.response.data.error}`, true)
            }
        }
    }

    const logout = () => {
        notificate("logged out", false)

        window.localStorage.removeItem("loggedR6statsUser")
        setUser(null)
    }

    if (user === null) {
        return (
            <div>
                <Notification notificationObj={notification} />
                <h2>Log in to application</h2>
                <Login login={login} />
            </div>
        )
    }

    return (
        <div>
            <Notification notificationObj={notification} />
            <p>Logged in as {user.username}</p>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default App
