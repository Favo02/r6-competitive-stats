import { useState } from "react"

import Header from "../components/common/Header"
import Loading from "../components/common/Loading"
import UploadMatch from "../components/newmatch/UploadMatch"

const NewMatch = ({ user, logout }) => {
    const [loading, setLoading] = useState(true)

    return (
        <div>
            <Header user={user} logout={logout} />
            {loading && <Loading />}
            <UploadMatch user={user} loading={loading} setLoading={setLoading} />
        </div>
    )
}

export default NewMatch