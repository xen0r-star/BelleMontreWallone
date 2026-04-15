import { Link, NavLink } from "react-router-dom";

const adminLinks = [
    { to: "/admin/gestion-montre", label: "Gestion Montres" },
    { to: "/admin/reservations", label: "Suivi Reservations" }
];

const style = {
    header: "fixed top-0 left-0 z-50 w-full border-b border-[#2a2f35] bg-[#1c1d21]/95 backdrop-blur-md",
    container: "mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-6 md:h-24",
    navWrapper: "hidden w-1/3 items-center gap-[30px] lg:flex",
    navLink: "relative text-[11px] font-medium uppercase tracking-[0.05em] text-[#faf8f5] transition-opacity duration-200 hover:opacity-85 after:absolute after:-bottom-[6px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 hover:after:scale-x-100",
    logoWrapper: "flex w-full justify-center lg:w-1/3",
    logoText: "font-['Cormorant_Garamond',serif] text-[28px] font-medium tracking-[0.02em] text-[#faf8f5] transition-transform duration-200 hover:-translate-y-px md:text-[34px]",
    adminBadge: "border border-[color-mix(in_srgb,var(--admin-green)_25%,#fff)] bg-[color-mix(in_srgb,var(--admin-green)_8%,#fff)] px-[0.55rem] py-[0.25rem] text-[0.65rem] uppercase tracking-[0.08em] text-[var(--admin-green)]",
    spacer: "h-[74px] md:h-24",
};

export default function SiteHeader({ isAdmin = false }) {
    return (
        <>
            <header className={style.header}>
                <div className={style.container}>
                    <div className={style.navWrapper}>
                        <NavLink className={style.navLink} to="/collection">
                            Collection
                        </NavLink>
                        {isAdmin && <span className={style.adminBadge}>
                            Compte Admin
                        </span>}
                    </div>

                    <div className={style.logoWrapper}>
                        <Link to="/" className={style.logoText}>
                            Belle Montre Wallonne
                        </Link>
                    </div>

                    <div className={`${style.navWrapper} justify-end`}>
                        <NavLink className={style.navLink} to="/besoin-daide">
                            Aide
                        </NavLink>
                        {!isAdmin && (
                            <NavLink className={style.navLink} to="/connexion">
                                Connexion
                            </NavLink>
                        )}
                        {isAdmin &&
                            adminLinks.map((link) => (
                                <NavLink key={link.to} className={style.navLink} to={link.to}>
                                    {link.label}
                                </NavLink>
                            ))
                        }
                    </div>
                </div>
            </header>

            <div className={style.spacer} aria-hidden="true" />
        </>
    );
}
