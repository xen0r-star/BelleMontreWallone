import { NavLink } from "react-router-dom";

export default function AdminHeader() {
    return (
        <header className="admin-header">
            <div className="container admin-header-inner">
                <h1 className="admin-title">Administration</h1>
                <nav className="nav">
                    <NavLink
                        to="/admin/gestion-montre"
                        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    >
                        Montres
                    </NavLink>
                    <NavLink
                        to="/admin/reservations"
                        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    >
                        Reservations
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
