import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import matchService from "../services/matches"

import Header from "../components/common/Header"
import Loading from "../components/common/Loading"
import Matches from "../components/home/Matches"

import classnames from "classnames"
import CommonStyles from "../styles/common.module.scss"
import HomeStyles from "./Home.module.scss"

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
                // if token expired refresh the page to run Redirector.jsx that checks token expiration
                if (exception.response.data.error === "token expired") {
                    window.location.reload(false)
                    return
                }
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
                // if token expired refresh the page to run Redirector.jsx that checks token expiration
                if (exception.response.data.error === "token expired") {
                    window.location.reload(false)
                    return
                }
                if (exception.response) {
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })
    }

    // if user has no matches
    if (matches.length === 0) {
        return (
            <>
                <Header user={user} logout={logout} />

                {loading && <Loading />}

                {!loading &&
                <div className={HomeStyles.noMatchesError}>
                    <h1>You don&apos;t have any <span className={CommonStyles.highlighted}>match</span> stored :(</h1>
                    <h3>Upload a <span className={CommonStyles.highlighted}>match</span> right now!</h3>
                    <div className={HomeStyles.redirectDiv}>
                        <Link
                            to="/newmatch"
                            className={classnames(CommonStyles.highlighLinkButton, CommonStyles.bigger)}
                        >
                            Upload a match now!
                        </Link>
                    </div>
                </div>
                }
            </>
        )
    }

    return (
        <>
            <Header user={user} logout={logout} />

            {loading && <Loading />}
            <Matches matches={matches} deleteMatch={deleteMatch} />
        </>
    )
}

export default Home