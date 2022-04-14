import { useEffect, useState } from "react"

import loginService from "./services/login"

import Login from "./components/Login"

function App() {
    const [user, setUser] = useState(null)


    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedR6statsUser")
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])

    const login = async (username, password) => {
        try {
            const user = await loginService.login({
                username, password,
            })

            console.log(`${user.username} logged in successfully`)

            window.localStorage.setItem(
                "loggedR6statsUser", JSON.stringify(user)
            )
            setUser(user)
        }
        catch (exception) {
            console.log("wrong credentials")
            console.log(exception)
        }
    }

    const logout = () => {
        console.log("logged out")

        window.localStorage.removeItem("loggedR6statsUser")
        setUser(null)
    }

    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>
                <Login login={login} />
            </div>
        )
    }

    return (
        <div>
            <p>Logged in as {user.username}</p>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default App
