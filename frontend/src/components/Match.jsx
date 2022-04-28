import classnames from "classnames"
import MatchStyles from "./Matches.module.scss"

const Match = ({ match }) => {
    const map = match.info.map.charAt(0).toUpperCase() + match.info.map.slice(1)
    const date = new Date(match.info.date).toLocaleDateString("it-IT")
    const my_team_score = match.result.my_team.score
    const enemy_team_score = match.result.enemy_team.score

    const mapClass = (MatchStyles[map.toLowerCase()] ? map.toLowerCase() : "unknown")

    return (
        <div className={MatchStyles.matchDiv}>
            <div className={classnames(MatchStyles[mapClass], MatchStyles.mapImg)}>
                <h2 className={MatchStyles.mapText}>{map.toUpperCase()}</h2>
            </div>
            <h1 className={MatchStyles.scoreText}>{my_team_score} - {enemy_team_score}</h1>
            <h1>{date}</h1>
        </div>
    )
}

export default Match