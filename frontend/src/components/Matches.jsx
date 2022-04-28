import Match from "./Match"

// import classnames from "classnames"
import MatchStyles from "./Matches.module.scss"

const Matches = ({ matches }) => {
    return (
        <div className={MatchStyles.matchesDiv}>
            {matches.map(match => <Match key={match.id} match={match}/>)}
        </div>
    )
}

export default Matches