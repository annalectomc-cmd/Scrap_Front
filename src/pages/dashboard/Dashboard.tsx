import DashboardCard from "../../components/layout/DashboardCard";
import "../../styles/Dashboard.css";

export default function Dashboard() {

    return (

        <div className="dashboard">

            <div className="dashboard-background"></div>

            <div className="welcome-card">

                <h1>

                    Bienvenido (Nombre de usuario)

                </h1>

                <p>

                    ¿Qué deseas hacer hoy?

                </p>

                <div className="dashboard-buttons">

                    <DashboardCard
                        title="Nuevo Scraping"
                        icon="bi-plus-circle"
                    />

                    <DashboardCard
                        title="Historial"
                        icon="bi-clock-history"
                    />

                    <DashboardCard
                        title="Reportes"
                        icon="bi-bar-chart"
                    />

                </div>

            </div>

        </div>

    );

}