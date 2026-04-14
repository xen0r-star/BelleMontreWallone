import { Link, NavLink } from "react-router-dom";

const adminLinks = [
    { to: "/admin/gestion-montre", label: "Gestion Montres" },
    { to: "/admin/reservations", label: "Suivi Reservations" }
];

const style = {
    header: "fixed top-0 left-0 w-full z-50 bg-[#1c1d21] border-b border-[#2a2f35] transition-colors duration-[180ms]",
    container: "max-w-[1440px] mx-auto px-6 h-[74px] md:h-[96px] flex items-center justify-between",
    navWrapper: "hidden lg:flex w-1/3 items-center gap-[30px]",
    navLink: `
            text-[#faf8f5] text-[11px] tracking-[0.05em] uppercase font-medium relative transition-opacity duration-200
            hover:opacity-85 after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:w-full after:h-px 
            after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100
            `,
    logoWrapper: "w-full lg:w-1/3 flex justify-center",
    logoText: `
            text-[#faf8f5] font-['Cormorant_Garamond',serif] text-[28px] md:text-[34px] tracking-[0.02em] font-medium 
            transition-transform duration-200 hover:-translate-y-[1px]
            `,
    adminBadge: `
            border border-[color-mix(in_srgb,var(--admin-green)_25%,#fff)] bg-[color-mix(in_srgb,var(--admin-green)_8%,#fff)] 
            text-[var(--admin-green)] py-[0.25rem] px-[0.55rem] uppercase tracking-[0.08em] text-[0.65rem]
            `,
    spacer: "h-[74px] md:h-[96px]",
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

                    <div className= {`${style.navWrapper} justify-end`}>
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
