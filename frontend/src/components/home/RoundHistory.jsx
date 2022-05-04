// import classnames from "classnames"
import MatchStyles from "./Matches.module.scss"

import { TiArrowShuffle } from "react-icons/ti"

import atkImg from "../../imgs/sides/atk.png"
import defImg from "../../imgs/sides/def.png"
import React from "react"

const RoundHistory = ({ match }) => {

    const my_team_color = match.info.my_team
    const enemy_team_color = my_team_color === "orange" ? "blue" : "orange"

    const atk =
        <img
            src={atkImg}
            className={MatchStyles.sideImg}
        />

    const def =
        <img
            src={defImg}
            className={MatchStyles.sideImg}
        />
    const empty =
        <img
            className={MatchStyles.sideEmptyImg}
        />

    return (
        <div className={MatchStyles.roundHistoryDiv}>
            {match.rounds.map((round, i) => {

                const my_team_side =
                    round.info.my_team_side === "attack"
                        ? <div className={MatchStyles[my_team_color]}>{atk}</div>
                        : <div className={MatchStyles[my_team_color]}>{def}</div>

                const enemy_team_side =
                    round.info.enemy_team_side === "attack"
                        ? <div className={MatchStyles[enemy_team_color]}>{atk}</div>
                        : <div className={MatchStyles[enemy_team_color]}>{def}</div>

                let top, bottom
                if (round.info.winner === "my_team") {
                    top = my_team_side
                    bottom = empty
                }
                else {
                    top = empty
                    bottom = enemy_team_side
                }

                // swap sides
                if (i === 6 || i === 12 || i === 13 || round === 14) {
                    return (
                        <React.Fragment key="swap">
                            <TiArrowShuffle className={MatchStyles.swapIcon} />
                            <div key={i} className={MatchStyles.sidesDiv}>
                                {top}
                                {bottom}
                            </div>
                        </React.Fragment>
                    )
                }

                return (
                    <div key={i} className={MatchStyles.sidesDiv}>
                        {top}
                        {bottom}
                    </div>
                )
            })}
        </div>
    )
}

export default RoundHistory