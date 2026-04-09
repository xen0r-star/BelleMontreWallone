import { Link, NavLink } from "react-router-dom";

const adminLinks = [
    { to: "/admin/gestion-montre", label: "Gestion Montres" },
    { to: "/admin/reservations", label: "Suivi Reservations" }
];

export default function SiteHeader({ isAdmin = false }) {
    return (
        <>
            <header className="hx-nav hx-nav--solid">
                <div className="hx-nav-inner">
                    <div className="hx-nav-left">
                        <NavLink to="/collection">Collection</NavLink>
                        {isAdmin && <span className="admin-badge">Compte Admin</span>}
                    </div>

                    <div className="hx-nav-center">
                        <Link to="/">Minimalisme Noble</Link>
                    </div>

                    <div className="hx-nav-right">
                        <NavLink to="/besoin-daide">Aide</NavLink>
                        {!isAdmin && (
                            <NavLink to="/connexion">
                                Connexion
                            </NavLink>
                        )}
                        {isAdmin &&
                            adminLinks.map((link) => (
                                <NavLink key={link.to} to={link.to}>
                                    {link.label}
                                </NavLink>
                            ))
                        }
                    </div>
                </div>
            </header>
            
            <div className="hx-nav-spacer" aria-hidden="true" />
        </>
    );
}
