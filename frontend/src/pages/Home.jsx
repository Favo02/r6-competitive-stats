import { useState, useEffect } from "react"

import matchService from "../services/matches"

import Header from "../components/common/Header"
import Loading from "../components/common/Loading"
import Matches from "../components/home/Matches"

const Home = ({ user, logout }) => {
    const [loading, setLoading] = useState(true)
    const [matches, setMatches] = useState([])

    useEffect(() => {
        setLoading(true)
        matchService
            .getAll(user.token)
            .then(matches => {
                setLoading(false)
                setMatches(matches.sort((a, b) => a.info.date > b.info.date ? -1 : 1))
            })
            .catch (exception => {
                setLoading(false)
                console.log(exception)
                if (exception.response) {
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })
    }, [])

    const deleteMatch = async (id) => {
        setLoading(true)
        matchService
            .remove(id, user.token)
            .then(() => {
                setLoading(false)
                setMatches(matches.filter(match => match.id !== id))
            })
            .catch (exception => {
                setLoading(false)
                console.log(exception)
                if (exception.response) {
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })
    }

    return (
        <div>
            <Header user={user} logout={logout} />

            {loading && <Loading />}
            <Matches matches={matches} deleteMatch={deleteMatch} />
        </div>
    )
}

export default Home