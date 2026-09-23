import { Outlet} from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import "../layout/MainLayout.css";

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