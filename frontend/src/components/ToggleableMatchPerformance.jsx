import MatchStyles from "./Matches.module.scss"

const ToggleableMatchPerformance = ({ match, isOpen }) => {
    console.log(match)

    return (
        <div className={
            isOpen
                ? MatchStyles.performanceDiv
                : MatchStyles.hiddenPerformanceDiv
        }>
            {JSON.stringify(match.performance)}
        </div>
    )

}

export default ToggleableMatchPerformance