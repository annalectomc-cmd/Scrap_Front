import { FaGoogle } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {

        // Por ahora simplemente cambiaremos de página.
        // Más adelante acá validaremos el usuario.

        navigate("/inicio");

    };

    return (

        <div className="login-card">

            <h5>Correo</h5>

            <div className="input-group mb-3">

                <span className="input-group-text">

                    <HiOutlineMail />

                </span>

                <input

                    type="email"

                    className="form-control"

                    placeholder="Correo electrónico"

                    value={email}

                    onChange={(e) => setEmail(e.target.value)}

                />

            </div>

            <h5>Contraseña</h5>

            <div className="input-group mb-3">

                <span className="input-group-text">

                    <HiOutlineLockClosed />

                </span>

                <input

                    type="password"

                    className="form-control"

                    placeholder="********"

                    value={password}

                    onChange={(e) => setPassword(e.target.value)}

                />

            </div>

            <div className="form-check mb-3">

                <input

                    className="form-check-input"

                    type="checkbox"

                />

                <label className="form-check-label">

                    Recordarme

                </label>

            </div>

            <button
                className="btn btn-primary w-100 login-btn"
                onClick={handleLogin}
            >

                Iniciar sesión

            </button>

            <div className="divider">

                <span>o continuar con</span>

            </div>

            <button className="btn btn-outline-dark w-100 social-btn">

                <FaGoogle />

                <span>Google</span>

            </button>

            <button className="btn btn-outline-dark w-100 social-btn">

                Acceso Corporativo (Okta)

            </button>

            <div className="forgot">

                <a href="#">¿Olvidaste tu contraseña?</a>

            </div>

        </div>

    );

}