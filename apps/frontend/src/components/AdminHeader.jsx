import { NavLink } from "react-router-dom";

// Place ton objet de styles Tailwind ici (ex: const style = { ... })

const style = {
    header: "bg-[#17191e] border-b border-[#2a2f35]",
    container: "max-w-[1440px] mx-auto px-6",
    inner: "h-[72px] md:h-[82px] flex items-center justify-between gap-6",
    title: "text-[#f3efe8] font-['Cormorant_Garamond',serif] text-[1.45rem] md:text-[1.75rem] tracking-[0.03em]",
    nav: "flex items-center gap-2 md:gap-3",
    linkBase: "px-3 py-2 md:px-4 md:py-2.5 text-[0.68rem] md:text-[0.72rem] uppercase tracking-[0.09em] border transition-colors duration-200",
    linkIdle: "border-[#3a404a] text-[#c9c3b9] hover:text-[#f3efe8] hover:border-[#6c7481]",
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
