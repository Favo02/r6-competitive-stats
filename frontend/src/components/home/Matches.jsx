import Match from "./Match"

// import classnames from "classnames"
import MatchStyles from "./Matches.module.scss"

const Matches = ({ matches, deleteMatch }) => {
    return (
        <div className={MatchStyles.matchesDiv}>
            {matches.map(match => <Match key={match.id} match={match} deleteMatch={deleteMatch} />)}
        </div>
    )
}

export default Matches