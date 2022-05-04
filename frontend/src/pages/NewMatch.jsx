import Header from "../components/common/Header"
import UploadMatch from "../components/newmatch/UploadMatch"

const NewMatch = ({ user, logout }) => {
    return (
        <div>
            <Header user={user} logout={logout} />
            <UploadMatch user={user} />
        </div>
    )
}

export default NewMatch