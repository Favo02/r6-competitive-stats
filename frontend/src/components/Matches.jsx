import Match from "./Match"

const Matches = ({ matches }) => {
    return (
        matches.map(match => <Match key={match.id} match={match}/>)
    )
}

export default Matches