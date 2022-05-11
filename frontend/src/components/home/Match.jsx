import { useState } from "react"

import RoundHistory from "./RoundHistory"
import ToggleableMatchPerformance from "./ToggleableMatchPerformance"

import classnames from "classnames"
import MatchStyles from "./Matches.module.scss"

import { IoIosArrowDropleftCircle } from "react-icons/io"
import { MdDeleteForever } from "react-icons/md"

const Match = ({ match, deleteMatch, isPreview }) => {
    let team, isPublic, category
    if (!isPreview) {
        // team
        team = match.team.name

        // isPublic
        isPublic = match.isPublic

        // category
        category = match.info.category
    }

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

    // enemies
    const enemies = match.info.rosters.enemy_team

    // toggle performance
    const [isOpen, setOpen] = useState(false)

    // delete
    const handleDelete = (match) => {
        if (window.confirm(`Are you sure to delete ${date} ${map} ${my_team_score}-${enemy_team_score}?`)) {
            deleteMatch(match.id)
        }
    }

    return (
        <>
            <div>
                <div className={classnames(MatchStyles.matchDiv,
                    isOpen
                        ? MatchStyles.matchDivOpen
                        : ""
                )}>
                    {/* Map image and name */}
                    <div className={classnames(MatchStyles[mapClass], MatchStyles.mapImg)}>
                        <h2 className={MatchStyles.mapText}>{map.toUpperCase()}</h2>
                    </div>

                    {/* Team, isPublic */}
                    {!isPreview &&
                    <div className={MatchStyles.teamDiv}>
                        <h1>{team} {isPublic ? "public match" : "private match"}</h1>
                        <h1 className={MatchStyles.categoryText}>{category}</h1>
                    </div>
                    }

                    {/* Date, Category */}
                    <div className={MatchStyles.dateDiv}>
                        <h1>{day}</h1>
                        <h1 className={MatchStyles.categoryText}>{date}</h1>
                    </div>

                    {/* Score */}
                    <h1 className={classnames(MatchStyles.scoreText, MatchStyles[score_class])}>{my_team_score} - {enemy_team_score}</h1>

                    {/* Round history */}
                    <RoundHistory match={match} />

                    {/* Enemies */}
                    <div className={MatchStyles.enemiesDiv}>
                        <h2 className={MatchStyles.vsText}>VS</h2>
                        {enemies.map(enemy => <h3 key={enemy.username}>{enemy.username}</h3>)}
                    </div>

                    {/* Links */}
                    <div className={MatchStyles.linksDiv}>
                        <IoIosArrowDropleftCircle
                            onClick={() => setOpen(!isOpen)}
                            className={
                                isOpen
                                    ? MatchStyles.toggleButtonRotated
                                    : MatchStyles.toggleButton
                            }
                        />
                        {!isPreview &&
                        <MdDeleteForever
                            onClick={() => handleDelete(match)}
                            className={MatchStyles.deleteButton}
                        />
                        }
                    </div>
                </div>
                <ToggleableMatchPerformance
                    isOpen={isOpen}
                    match={match}
                />
            </div>
        </>
    )
}

export default Match