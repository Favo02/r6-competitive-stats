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

    const deleteMatch = async (id) => {
        try {
            await matchService.remove(id, user.token)
            setMatches(matches.filter(match => match.id !== id))
        }
        catch (exception) {
            console.log(exception)
        }
    }

    return (
        <div>
            <Header user={user} logout={logout} />
            <Matches matches={matches} deleteMatch={deleteMatch} />
        </div>
    )
}

export default Home