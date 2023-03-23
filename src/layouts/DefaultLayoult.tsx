import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";


export function DefaultLayoult() {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    )
}