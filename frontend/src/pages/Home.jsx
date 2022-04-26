import Header from "../components/Header"

// import HomeStyles from "./Home.module.scss"

const Home = ({ user, logout }) => {
    return (
        <div>
            <Header user={user} logout={logout} />
        </div>
    )
}

export default Home