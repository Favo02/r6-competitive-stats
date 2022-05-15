import { useState } from "react"

import Header from "../components/common/Header"
import Loading from "../components/common/Loading"
import EditProfileForm from "../components/profile/EditProfileForm"
import DeleteAccount from "../components/profile/DeleteAccount"

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
            <DeleteAccount
                user={user}
                logout={logout}
                setLoading={setLoading}
                notificate={notificate}
            />
        </div>
    )
}

export default Profile