import React from "react"
import { Link } from "react-router-dom"

import ProfileIcon from "./ProfileIcon"

import classnames from "classnames"
import CommonStyles from "../styles/common.module.scss"
import HeaderStyles from "./Header.module.scss"

const Header = ({ user, logout }) => {
    return (
        <header className={HeaderStyles.header}>
            <Link
                className={HeaderStyles.title}
                to="/home"
            >Comp
                <span
                    className={CommonStyles.highlighted}
                >Stats</span>
            </Link>

            <div className={HeaderStyles.linksDiv}>

                <Link
                    className={classnames(
                        HeaderStyles.linkButton,
                        HeaderStyles.linkMarginRight
                    )}
                    to="/settings"
                >
                    Settings
                </Link>

                <Link
                    className={classnames(
                        HeaderStyles.linkButton,
                        HeaderStyles.highlighLinkButton,
                        HeaderStyles.linkMarginRight
                    )}
                    to="/newmatch"
                >
                    Add new match
                </Link>

                <ProfileIcon user={user} logout={logout} />
            </div>

        </header>

    )
}

export default Header