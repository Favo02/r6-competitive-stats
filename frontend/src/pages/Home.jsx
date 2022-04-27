import { useState, useEffect } from "react"

import matchService from "../services/matches"

import Header from "../components/Header"

// import HomeStyles from "./Home.module.scss"

const Home = ({ user, logout }) => {
    const [matches, setMatches] = useState([])

    useEffect(() => {
        try {
            matchService
                .getAll(user.token)
                .then(matches =>
                    setMatches(matches.sort((a, b) => a.info.date > b.info.date ? -1 : 1))
                )
        }
        catch (exception) {
            console.log(exception)
            if (exception.response) {
                console.log("Error", exception.response.status, ":", exception.response.data.error)
            }
        }
    }, [])

    return (
        <div>
            <Header user={user} logout={logout} />
            <div>{JSON.stringify(matches)}</div>
        </div>
    )
}

export default Home