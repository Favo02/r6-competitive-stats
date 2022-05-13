import RegisterForm from "../components/register/RegisterForm"

import RegisterStyles from "./Register.module.scss"

const Register = ({ setUser, notification, notificate }) => {

    return (
        <div className={RegisterStyles.background}>
            <RegisterForm notificate={notificate} notificationObj={notification} setUser={setUser} />
        </div>
    )
}

export default Register