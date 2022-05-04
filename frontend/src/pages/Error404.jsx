import { Link } from "react-router-dom"

import Header from "../components/common/Header"

import classnames from "classnames"
import CommonStyles from "../styles/common.module.scss"
import Error404Styles from "./Error404.module.scss"

const Error404 = ({ user, logout }) => {

    return (
        <div className={Error404Styles.background}>
            <Header user={user} logout={logout} />

            <div className={Error404Styles.center}>
                <div
                    // Added invisible char: the glitch effect does not work on the last word
                    className={Error404Styles.glitch}
                    data-text="Oops Page not found&zwnj;"
                >Oops Page <span className={CommonStyles.highlighted}>not found</span> &zwnj;</div>
                <div
                    className={Error404Styles.glitch}
                    data-text="Error 404 &zwnj;"
                >Error 404 &zwnj;</div>
                <h3 className={Error404Styles.text}>
                    It looks like that Mute jammed this page, we could not find it :&#40;
                </h3>
                <Link
                    className={classnames(
                        CommonStyles.highlighLinkButton,
                        Error404Styles.button
                    )}
                    to="/home"
                >Go back to home</Link>
            </div>
        </div>
    )
}

export default Error404