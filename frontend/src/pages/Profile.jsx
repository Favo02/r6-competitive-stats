import { useState } from "react"

import Header from "../components/common/Header"
import Loading from "../components/common/Loading"
import EditProfileForm from "../components/profile/EditProfileForm"

const Profile = ({ user, setUser, logout, notificate, notification }) => {
    const [loading, setLoading] = useState(false)

    return (
        <div>
            {loading && <Loading />}
            <Header user={user} logout={logout} />
            <EditProfileForm
                user={user}
                setUser={setUser}
                setLoading={setLoading}
                notification={notification}
                notificate={notificate}
            />
        </div>
    )
}

export default Profile