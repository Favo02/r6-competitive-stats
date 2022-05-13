import LoginForm from "../components/login/LoginForm"

import LoginStyles from "./Login.module.scss"

const Login = ({ setUser, notification, notificate }) => {

    return (
        <div className={LoginStyles.background}>
            <LoginForm notificationObj={notification} notificate={notificate} setUser={setUser} />
        </div>
    )
}

export default Login
