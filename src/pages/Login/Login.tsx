import LoginForm from "../../components/auth/LoginForm";
import "./Login.css";

export default function Login() {
    return (
        <div className="login-page">

            <div className="background-overlay"></div>

            <div className="login-container">

                <div className="login-header">

                    {/* Luego reemplazaremos esto por el logo */}

                    <h1>DATA RIFT</h1>

                    <p>Omni-Channel Intelligence</p>

                </div>

                <LoginForm />

            </div>

        </div>
    );
}