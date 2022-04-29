import classnames from "classnames"
import MatchStyles from "./Matches.module.scss"

const Match = ({ match }) => {
    // map
    const map = match.info.map.charAt(0).toUpperCase() + match.info.map.slice(1)
    const mapClass = (MatchStyles[map.toLowerCase()] ? map.toLowerCase() : "unknown")

    // score
    const my_team_score = match.result.my_team.score
    const enemy_team_score = match.result.enemy_team.score
    // score class
    let score_class
    if (my_team_score > enemy_team_score) {
        score_class = "victory"
    }
    else if (my_team_score < enemy_team_score) {
        score_class = "defeat"
    }
    else {
        score_class = "draw"
    }

    // date
    const dateObj = new Date(match.info.date)
    const month = dateObj.getMonth()+1 > 9 ? dateObj.getMonth()+1 : `0${dateObj.getMonth()+1}`
    const date = `${dateObj.getDate()}/${month}/${dateObj.getFullYear()}`
    // day
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
    const day = days[dateObj.getDay()]

    return (
        <div className={MatchStyles.matchDiv}>
            {/* Map image and name */}
            <div className={classnames(MatchStyles[mapClass], MatchStyles.mapImg)}>
                <h2 className={MatchStyles.mapText}>{map.toUpperCase()}</h2>
            </div>
            {/* Score */}
            <h1 className={classnames(MatchStyles.scoreText, MatchStyles[score_class])}>{my_team_score} - {enemy_team_score}</h1>
            {/* Date */}
            <div className={MatchStyles.dateDiv}>
                <h1>{day}</h1>
                <h1>{date}</h1>
            </div>
        </div>
    )
}

export default Match