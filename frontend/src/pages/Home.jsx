import { useState, useEffect } from "react"

import matchService from "../services/matches"

import Header from "../components/common/Header"
import Matches from "../components/home/Matches"

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
            <Matches matches={matches} />
        </div>
    )
}

export default Home