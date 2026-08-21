import LoginForm from "../../components/auth/LoginForm";
import "./Login.css";

export default function Login() {
    return (
        <div className="login-page">

            {/* Fondo animado */}
            <div className="bubbles">

                <span className="bubble bubble-1"></span>
                <span className="bubble bubble-2"></span>
                <span className="bubble bubble-3"></span>
                <span className="bubble bubble-4"></span>
                <span className="bubble bubble-5"></span>
                <span className="bubble bubble-6"></span>
                <span className="bubble bubble-7"></span>
                <span className="bubble bubble-8"></span>
                <span className="bubble bubble-9"></span>
                <span className="bubble bubble-10"></span>
                <span className="bubble bubble-11"></span>

            </div>

            {/* Capa de fondo */}
            <div className="background-overlay"></div>

            {/* Contenido del login */}
            <div className="login-container">

                <div className="login-header">

                    <h1>DATA RIFT</h1>

                    <p>Omni-Channel Intelligence</p>

                </div>

                <LoginForm />

            </div>

        </div>
    );
}