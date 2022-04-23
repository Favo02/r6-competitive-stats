import Header from "../components/Header"
import FileUploader from "../components/FileUploader"

// import HomeStyles from "./Home.module.scss"

const Home = ({ user, logout }) => {
    return (
        <div>
            <Header user={user} logout={logout} />
            <FileUploader />
        </div>
    )
}

export default Home