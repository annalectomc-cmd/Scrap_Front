import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";

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

                <button className="icon-button">

                    <i className="bi bi-bell"></i>

                </button>

                <div className="profile-container">

                    <button
                        className="profile-avatar"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >

                        N

                    </button>

                    {menuOpen && (

                        <div className="profile-menu">

                            <div className="profile-name">

                                Nicolás Neira

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