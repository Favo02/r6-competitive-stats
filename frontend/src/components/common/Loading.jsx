import LoadingStyles from "./Loading.module.scss"

const Loading = () => {
    return (
        <>
            <div className={LoadingStyles.loading} />
            <div className={LoadingStyles.blurBackground} />
        </>
    )
}

export default Loading