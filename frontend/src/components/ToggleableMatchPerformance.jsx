import classnames from "classnames"
import MatchStyles from "./Matches.module.scss"

const ToggleableMatchPerformance = ({ match, isOpen }) => {
    // only my team players
    let performances = match.performance.filter(perf => perf.team === "my_team")
    // sort performances by rating
    performances = performances.sort((a, b) => parseFloat(a.rating) > parseFloat(b.rating) ? -1 : 1)

    // conditional formatting colors for rating
    const cf = {
        "1.3": "cf_1",
        "1.2": "cf_2",
        "1.1": "cf_3",
        "1.0": "cf_4",
        "0.9": "cf_5",
        "0.8": "cf_6",
        "0.7": "cf_7",
        "0.6": "cf_8"
    }

    return (
        <div className={
            isOpen
                ? MatchStyles.performanceDiv
                : MatchStyles.hiddenPerformanceDiv
        }>
            <table className={MatchStyles.perfTable}>
                <tbody>
                    <tr>
                        <th className={MatchStyles.tdLeftAlign}>Player</th>
                        <th>Rating</th>
                        <th>K-D (+/-)</th>
                        <th>Entry (+/-)</th>
                        <th>KOST</th>
                        <th>KPR</th>
                        <th>SRV</th>
                        <th>1vX</th>
                        <th>Plants</th>
                        <th>HS%</th>
                    </tr>
                    {performances.map(p =>
                        <tr key={p.username} className={MatchStyles.trBorder}>

                            <td className={MatchStyles.tdLeftAlign}>{p.username}</td>

                            {/* conditional formatting: parse rating to 1 decimal and get relative class from associative array. If class doesn't exists check if > tham 1.3 or lower than 0.6 */}
                            <td className={classnames(
                                MatchStyles.tdHighlight,

                                MatchStyles[cf[parseFloat(p.rating).toFixed(1)]]
                                    ? MatchStyles[cf[parseFloat(p.rating).toFixed(1)]]
                                    : parseFloat(p.rating).toFixed(1) > 1.3
                                        ? MatchStyles.cf_1
                                        : MatchStyles.cf_8

                            )}>{p.rating}</td>

                            <td>{p.kills}-{p.deaths} ({((p.kills-p.deaths) < 0 ? "" : "+") + (p.kills-p.deaths)})</td>

                            <td>{p.okills}-{p.odeaths} ({((p.okills-p.odeaths) < 0 ? "" : "+") + (p.okills-p.odeaths)})</td>

                            <td>{p.matchkost}</td>

                            <td>{p.kpr}</td>

                            <td>{p.srv}</td>

                            <td>{p.clutches}</td>

                            <td>{p.pdefuser}</td>

                            <td>{Math.round(p.headshots / p.kills * 100)}%</td>

                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

}

export default ToggleableMatchPerformance