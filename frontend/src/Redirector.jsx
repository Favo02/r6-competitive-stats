import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import jwt_decode from "jwt-decode"

import Login from "./pages/Login"
import Register from "./pages/Register"

import Error404 from "./pages/Error404"
import Loading from "./components/common/Loading"
import ProtectedRoute from "./utilities/ProtectedRoute"

import Home from "./pages/Home"
import MyTeams from "./pages/MyTeams"
import Settings from "./pages/Settings"
import NewMatch from "./pages/NewMatch"
import Profile from "./pages/Profile"

const Main = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    // reading user from local storage
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedR6statsUser")
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            const decoded = jwt_decode(user.token)
            if (decoded.exp * 1000 > Date.now()) {
                setUser(user)
            }
            else {
                window.localStorage.removeItem("loggedR6statsUser")
                notificate("Your login expired", true)
            }
        }
        setLoading(false)
    }, [])

    // removing user from local storage and state
    const logout = () => {
        notificate("Logged out", false)
        window.localStorage.removeItem("loggedR6statsUser")
        setUser(null)
    }

    // notificaiont: used in login and registration (shared with redirector due to login expiration and logout notification)
    const [notification, setNotification] = useState({ message: "", isError: false })
    const notificate = (message, isError) => {
        setNotification({ message: message, isError: isError })
        setTimeout(() => {
            setNotification({ message: "", isError: isError })
        }, 5000)
    }

    // User still not loaded: wait
    if (loading) {
        return (
            <Loading />
        )
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

                <Route path="/register" element={
                    user === null
                        ?
                        <Register
                            setUser={setUser}
                            notification={notification}
                            notificate={notificate}
                        />
                        :
                        <Navigate to="/home" />
                }></Route>

                {/* Logged in routing */}

                <Route path="/home" element={
                    <ProtectedRoute user={user}>
                        <Home
                            user={user}
                            logout={logout}
                        />
                    </ProtectedRoute>
                }></Route>

                <Route path="/myteams" element={
                    <ProtectedRoute user={user}>
                        <MyTeams
                            user={user}
                            logout={logout}
                        />
                    </ProtectedRoute>
                }></Route>

                <Route path="/settings" element={
                    <ProtectedRoute user={user}>
                        <Settings
                            user={user}
                            logout={logout}
                        />
                    </ProtectedRoute>
                }></Route>

                <Route path="/newmatch" element={
                    <ProtectedRoute user={user}>
                        <NewMatch
                            user={user}
                            logout={logout}
                        />
                    </ProtectedRoute>
                }></Route>

                <Route path="/profile" element={
                    <ProtectedRoute user={user}>
                        <Profile
                            user={user}
                            logout={logout}
                        />
                    </ProtectedRoute>
                }></Route>


                {/* Error 404 Routing */}

                <Route path="/*" element={
                    <ProtectedRoute user={user}>
                        <Error404
                            user={user}
                            logout={logout}
                        />
                    </ProtectedRoute>
                }>
                </Route>

            </Routes>
        </>
    )
}

export default Main