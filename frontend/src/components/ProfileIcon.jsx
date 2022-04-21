import { useState } from "react"
import { FaUserCircle } from "react-icons/fa"
import { VscTriangleDown } from "react-icons/vsc"

import classnames from "classnames"
import ProfileIconStyles from "./ProfileIcon.module.scss"
import HeaderStyles from "./Header.module.scss"

const ProfileIcon = ({ user, logout }) => {
    const [cardVisible, setCardVisible] = useState(false)

    const toggleCardClick = () => {
        setCardVisible(!cardVisible)
    }

    if (cardVisible) {
        return (
            <div>
                <FaUserCircle
                    className={ProfileIconStyles.userIcon}
                    onClick={toggleCardClick}
                />
                <VscTriangleDown
                    className={classnames(ProfileIconStyles.arrowIcon, ProfileIconStyles.arrowRotated)}
                    onClick={toggleCardClick}
                />
                <div
                    className={classnames(
                        ProfileIconStyles.card,
                        ProfileIconStyles.cardText
                    )}>
                    <div className={ProfileIconStyles.arrowUp}></div>
                    <h1>Welcome, {user.username}</h1>
                    <button
                        onClick={logout}
                        className={classnames(
                            HeaderStyles.highlighLinkButton,
                            HeaderStyles.linkMarginTop
                        )}
                    >Logout</button>
                </div>
            </div>
        )
    }
    return (
        <div>
            <FaUserCircle
                className={ProfileIconStyles.userIcon}
                onClick={toggleCardClick}
            />
            <VscTriangleDown
                className={ProfileIconStyles.arrowIcon}
                onClick={toggleCardClick}
            />
        </div>
    )

}

export default ProfileIcon