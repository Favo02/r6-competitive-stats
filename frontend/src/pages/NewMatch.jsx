import Header from "../components/common/Header"
import MatchForm from "../components/newmatch/MatchForm"

import matchService from "../services/matches"

const NewMatch = ({ user, logout }) => {
    const newMatch = async (match) => {
        if (match) {
            try {
                const createdMatch = await matchService.create(match, user.token)
                console.log("match saved:", createdMatch)
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