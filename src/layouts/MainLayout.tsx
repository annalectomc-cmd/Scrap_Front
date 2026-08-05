import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import "../styles/MainLayout.css";

export default function MainLayout(){

    return(

        <div className="layout">

            <Navbar/>

            <div className="layout-content">

                <Sidebar/>

                <main className="main-content">

                    <Outlet/>

                </main>

            </div>

        </div>

    )

}