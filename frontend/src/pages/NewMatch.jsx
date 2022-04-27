import Header from "../components/Header"
import MatchForm from "../components/MatchForm"

import matchService from "../services/matches"

const NewMatch = ({ user, logout }) => {
    const newMatch = async (match) => {
        const tempmatch = {
            info: match.info,
            performance: match.performance
        }

        if (match) {
            try {
                const createdMatch = await matchService.create(tempmatch, user.token)
                console.log("saved match:", createdMatch)
            }
            catch (exception) {
                if (exception.response) {
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            }
        }
    }

    return (
        <div>
            <Header user={user} logout={logout} />
            <MatchForm newMatch={newMatch} />
        </div>
    )
}

export default NewMatch