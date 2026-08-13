import "../../styles/Inicio.css"


import {
    BsDatabase,
    BsSearch,
    BsBarChart,
    BsArrowRight,
} from "react-icons/bs";

import { useNavigate } from "react-router-dom";

export default function Inicio() {

    const navigate = useNavigate();

    return (

        <div className="inicio">

            {/* HERO */}

            <section className="inicio-hero">

                <div className="inicio-content">

                    <span className="inicio-badge">
                        DATA RIFT
                    </span>

                    <h1>
                        Descubre el poder de tus datos
                        <span>en plataformas de contenido</span>
                    </h1>

                    <p>
                        Data Rift es una plataforma diseñada para recopilar,
                        organizar y analizar información de contenido audiovisual de una
                        manera rápida y sencilla.
                    </p>

                    <button
                        className="inicio-primary-button"
                        onClick={() => navigate("/dashboard")}
                    >

                        Comenzar a explorar

                        <BsArrowRight />

                    </button>

                </div>

                <div className="inicio-visual">

                    <div className="floating-card card-one">

                        <BsSearch />

                        <div>

                            <strong>Scraping</strong>

                            <span>Obtén información</span>

                        </div>

                    </div>

                    <div className="floating-card card-two">

                        <BsDatabase />

                        <div>

                            <strong>Datos</strong>

                            <span>Organiza tus resultados</span>

                        </div>

                    </div>

                    <div className="floating-card card-three">

                        <BsBarChart />

                        <div>

                            <strong>Análisis</strong>

                            <span>Visualiza tus resultados</span>

                        </div>

                    </div>

                </div>

            </section>


            {/* CARACTERÍSTICAS */}

            <section className="inicio-features">

                <div className="feature">

                    <BsSearch />

                    <h3>
                        Recopila
                    </h3>

                    <p>
                        Realiza procesos de scraping y obtén
                        información relevante de TikTok.
                    </p>

                </div>


                <div className="feature">

                    <BsDatabase />

                    <h3>
                        Organiza
                    </h3>

                    <p>
                        Mantén tus resultados estructurados
                        para consultarlos posteriormente.
                    </p>

                </div>


                <div className="feature">

                    <BsBarChart />

                    <h3>
                        Analiza
                    </h3>

                    <p>
                        Convierte los datos obtenidos en
                        información útil para tus análisis.
                    </p>

                </div>

            </section>

        </div>

    );

}