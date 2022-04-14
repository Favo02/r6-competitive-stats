import React from "react"
import { Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"

import Login from "./pages/Login"
import Home from "./pages/Home"

const Main = () => {
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

    const logout = () => {
        notificate("logged out", false)
        window.localStorage.removeItem("loggedR6statsUser")
        setUser(null)
    }

    return (
        <Routes>
            <Route path="/home" element={
                <Home
                    user={user}
                    notification={notification}
                    notificate={notificate}
                    logout={logout}
                />
            }></Route>
            <Route path="/login" element={
                <Login
                    user={user}
                    setUser={setUser}
                    notification={notification}
                    notificate={notificate}
                />
            }></Route>
        </Routes>
    )
}

export default Main