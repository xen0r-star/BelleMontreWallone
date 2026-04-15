import { NavLink } from "react-router-dom";

const style = {
    header: "border-b border-[#2a2f35] bg-[#17191e]",
    container: "mx-auto max-w-[1440px] px-6",
    inner: "flex h-[72px] items-center justify-between gap-6 md:h-[82px]",
    title: "font-['Cormorant_Garamond',serif] text-[1.45rem] tracking-[0.03em] text-[#f3efe8] md:text-[1.75rem]",
    nav: "flex items-center gap-2 md:gap-3",
    linkBase: "border px-3 py-2 text-[0.68rem] uppercase tracking-[0.09em] transition-colors duration-200 md:px-4 md:py-2.5 md:text-[0.72rem]",
    linkIdle: "border-[#3a404a] text-[#c9c3b9] hover:border-[#6c7481] hover:text-[#f3efe8]",
    linkActive: "border-[var(--admin-green)] bg-[color-mix(in_srgb,var(--admin-green)_14%,#fff)] text-[var(--admin-green)]",
};

export default function AdminHeader() {
    return (
        <header className={style.header}>
            <div className={style.container}>
                <div className={style.inner}>
                <h1 className={style.title}>Administration</h1>
                <nav className={style.nav}>
                    <NavLink
                        to="/admin/gestion-montre"
                        className={({ isActive }) => `${style.linkBase} ${isActive ? style.linkActive : style.linkIdle}`}
                    >
                        Montres
                    </NavLink>
                    <NavLink
                        to="/admin/reservations"
                        className={({ isActive }) => `${style.linkBase} ${isActive ? style.linkActive : style.linkIdle}`}
                    >
                        Reservations
                    </NavLink>
                </nav>
                </div>
            </div>
        </header>
    );
}
