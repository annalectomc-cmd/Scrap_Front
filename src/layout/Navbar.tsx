import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../features/notifications/components/NotificationBell";
import "../layout/Navbar.css";

export default function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    const logout = () => {

        // Aquí después eliminaremos el token

        navigate("/");

    };

    return (

        <header className="navbar">

            <div></div>

            <div className="navbar-right">

                {/* NOTIFICACIONES */}

                <NotificationBell />

                <div className="profile-container">

                    <button
                        className="profile-avatar"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >

                        U

                    </button>

                    {menuOpen && (

                        <div className="profile-menu">

                            <div className="profile-name">

                                Usuario

                            </div>

                            <button
                                className="logout-button"
                                onClick={logout}
                            >

                                <i className="bi bi-box-arrow-right"></i>

                                Cerrar sesión

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>

    );

}