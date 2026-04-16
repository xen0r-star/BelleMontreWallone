import { NavLink } from "react-router-dom";

export default function AdminHeader() {
    return (
        <header className="sticky top-0 z-30 border-b border-[#ddd6cc] bg-[#f7f6f3]">
            <div className="mx-auto flex min-h-18.5 w-full max-w-345 items-center gap-4 px-6">
                <h1 className="font-serif text-4xl">Administration</h1>
                <nav className="ml-auto flex flex-wrap gap-4 max-[700px]:ml-0 max-[700px]:w-full">
                    <NavLink
                        to="/admin/gestion-montre"
                        className={({ isActive }) => `inline-flex min-h-8 items-center justify-center border-b pb-[0.2rem] text-[0.78rem] uppercase tracking-[0.08em] ${isActive ? "border-[#9c8561] text-[#1c1d21]" : "border-transparent text-[#8c8d8e] hover:border-[#9c8561] hover:text-[#1c1d21]"}`}
                    >
                        Montres
                    </NavLink>
                    <NavLink
                        to="/admin/reservations"
                        className={({ isActive }) => `inline-flex min-h-8 items-center justify-center border-b pb-[0.2rem] text-[0.78rem] uppercase tracking-[0.08em] ${isActive ? "border-[#9c8561] text-[#1c1d21]" : "border-transparent text-[#8c8d8e] hover:border-[#9c8561] hover:text-[#1c1d21]"}`}
                    >
                        Reservations
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
