import "../../styles/Sidebar.css";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const menuItems = [
        {
            title: "Inicio",
            icon: "bi-house-door",
            path: "/inicio",
        },
        {
            title: "Dashboard",
            icon: "bi-grid",
            path: "/dashboard",
        },
        {
            title: "Scraping",
            icon: "bi-search",
            path: "/scraping",
        },
        {
            title: "Reportes",
            icon: "bi-bar-chart",
            path: "/reports",
        },
        {
            title: "Usuarios",
            icon: "bi-people",
            path: "/users",
        },
        {
            title: "Configuración",
            icon: "bi-gear",
            path: "/settings",
        },
    ];

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">

                DATA RIFT

            </div>

            <nav className="sidebar-menu">

                {menuItems.map((item) => (

                    <NavLink
                        key={item.title}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive
                                ? "menu-item active"
                                : "menu-item"
                        }
                    >

                        <i className={`bi ${item.icon}`}></i>

                        <span>{item.title}</span>

                    </NavLink>

                ))}

            </nav>

        </aside>
    );
}