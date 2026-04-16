import { Link, NavLink } from "react-router-dom";

const adminLinks = [
    { to: "/admin/gestion-montre", label: "Gestion Montres" },
    { to: "/admin/reservations", label: "Suivi Reservations" }
];

export default function SiteHeader({ isAdmin = false }) {
    return (
        <>
            <header className="fixed left-0 top-0 z-50 w-full border-b border-[#2a2f35] bg-[#1c1d21]">
                <div className="mx-auto flex h-24 w-full max-w-360 items-center justify-between px-6 max-lg:justify-center max-[700px]:h-18.5">
                    <div className="flex w-1/3 items-center gap-7.5 max-lg:hidden">
                        <NavLink to="/collection" className="relative text-[11px] font-medium uppercase tracking-[0.05em] text-[#faf8f5] transition-opacity duration-220 hover:opacity-[0.86] after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-px after:bg-current after:origin-left after:scale-x-0 after:transition-transform after:duration-240 hover:after:scale-x-100">Collection</NavLink>
                        {isAdmin && <span className="border border-[#d7e5dc] bg-[#edf3ef] px-[0.55rem] py-1 text-[0.65rem] uppercase tracking-[0.08em] text-[#0f4b22]">Compte Admin</span>}
                    </div>

                    <div className="flex w-1/3 justify-center max-lg:w-full">
                        <Link to="/" className="font-serif text-[34px] font-medium text-[#faf8f5] transition-transform duration-200 hover:-translate-y-px max-[700px]:text-[28px]">Belle Montre Wallonne</Link>
                    </div>

                    <div className="flex w-1/3 items-center justify-end gap-7.5 max-lg:hidden">
                        <NavLink to="/besoin-daide" className="relative text-[11px] font-medium uppercase tracking-[0.05em] text-[#faf8f5] transition-opacity duration-220 hover:opacity-[0.86] after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-px after:bg-current after:origin-left after:scale-x-0 after:transition-transform after:duration-240 hover:after:scale-x-100">Aide</NavLink>
                        {!isAdmin && (
                            <NavLink to="/connexion" className="relative text-[11px] font-medium uppercase tracking-[0.05em] text-[#faf8f5] transition-opacity duration-220 hover:opacity-[0.86] after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-px after:bg-current after:origin-left after:scale-x-0 after:transition-transform after:duration-240 hover:after:scale-x-100">
                                Compte
                            </NavLink>
                        )}
                        {isAdmin &&
                            adminLinks.map((link) => (
                                <NavLink key={link.to} to={link.to} className="relative text-[11px] font-medium uppercase tracking-[0.05em] text-[#faf8f5] transition-opacity duration-220 hover:opacity-[0.86] after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-px after:bg-current after:origin-left after:scale-x-0 after:transition-transform after:duration-240 hover:after:scale-x-100">
                                    {link.label}
                                </NavLink>
                            ))
                        }
                    </div>
                </div>
            </header>
            
            <div className="h-24 max-[700px]:h-18.5" aria-hidden="true" />
        </>
    );
}
