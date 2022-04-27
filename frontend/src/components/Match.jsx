const Match = ({ match }) => {
    const map = match.info.map.charAt(0).toUpperCase() + match.info.map.slice(1)
    const date = new Date(match.info.date).toLocaleDateString("it-IT")
    const my_team_score = match.result.my_team.score
    const enemy_team_score = match.result.enemy_team.score

    return (
        <h1>{map} {date}: {my_team_score} - {enemy_team_score}</h1>
    )
}

export default Match