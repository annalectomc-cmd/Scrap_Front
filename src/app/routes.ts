import { Routes } from "@angular/router";
import { Home } from "./components/home/home";

const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'Scrapp',
  },
];
export default routeConfig;