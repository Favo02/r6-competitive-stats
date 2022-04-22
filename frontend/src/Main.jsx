import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"

import Login from "./pages/Login"
import Home from "./pages/Home"
import Settings from "./pages/Settings"
import NewMatch from "./pages/NewMatch"
import Profile from "./pages/Profile"
import Error404 from "./pages/Error404"

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
        notificate("Logged out", false)
        window.localStorage.removeItem("loggedR6statsUser")
        setUser(null)
    }

    return (
        <>
            <Routes>

                {/* Not logged in routing */}

                <Route path="/login" element={
                    user === null
                        ?
                        <Login
                            setUser={setUser}
                            notification={notification}
                            notificate={notificate}
                        />
                        :
                        <Navigate to="/home" />
                }></Route>


                {/* Logged in routing */}

                <Route path="/home" element={
                    <Home
                        user={user}
                        logout={logout}
                    />
                }></Route>

                <Route path="/settings" element={
                    <Settings
                        user={user}
                        logout={logout}
                    />
                }></Route>

                <Route path="/newmatch" element={
                    <NewMatch
                        user={user}
                        logout={logout}
                    />
                }></Route>

                <Route path="/profile" element={
                    <Profile
                        user={user}
                        logout={logout}
                    />
                }></Route>


                {/* 404 Routing */}

                <Route path="/404" element={
                    <Error404
                        user={user}
                        logout={logout}
                    />
                }></Route>

                <Route path="/*" element={
                    <Navigate to="/404" />
                }>
                </Route>

            </Routes>
        </>
    )
}

export default Main