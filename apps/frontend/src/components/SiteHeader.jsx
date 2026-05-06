import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const adminLinks = [
    { to: "/admin/gestion-montre", label: "Gestion Montres" },
    { to: "/admin/reservations", label: "Suivi Reservations" }
];

const MOBILE_MENU_ANIMATION_MS = 310;

const desktopLinkClass = "relative text-[11px] font-medium uppercase tracking-[0.05em] text-[#faf8f5] transition-opacity duration-220 hover:opacity-[0.86] after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-px after:bg-current after:origin-left after:scale-x-0 after:transition-transform after:duration-240 hover:after:scale-x-100";
const mobileLinkClass = "inline-flex min-h-11 items-center border border-[#3a4047] bg-[#22272e] px-4 text-[0.72rem] font-medium uppercase tracking-[0.08em] text-[#faf8f5] transition-colors duration-200 hover:bg-[#2b3139] max-[375px]:min-h-10 max-[375px]:px-3 max-[375px]:text-[0.68rem] max-[320px]:text-[0.66rem]";

export default function SiteHeader({ isAdmin = false, transparentOnTop = false, reserveSpace = true }) {
    const location = useLocation();
    const toggleButtonRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAdminFromAuth, setIsAdminFromAuth] = useState(false);

    useEffect(() => {
        if (isAdmin) return;
        fetch(`${API_URL}/auth/me`, { method: 'GET', credentials: 'include' })
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (Number(data?.user?.isAdmin) === 1) setIsAdminFromAuth(true); })
            .catch(() => {});
    }, [isAdmin]);

    const showAdmin = isAdmin || isAdminFromAuth;

    const mobileLinks = showAdmin
        ? [
            { to: "/collection", label: "Collection" },
            { to: "/besoin-daide", label: "Aide" },
            ...adminLinks,
            { to: "/connexion", label: "Compte" }
        ]
        : [
            { to: "/collection", label: "Collection" },
            { to: "/besoin-daide", label: "Aide" },
            { to: "/connexion", label: "Compte" }
        ];

    const openMobileMenu = () => {
        setIsMobileMenuVisible(true);
        setIsMobileMenuOpen(true);
    };

    const closeMobileMenu = (shouldFocusButton = false) => {
        setIsMobileMenuOpen(false);

        if (shouldFocusButton) {
            toggleButtonRef.current?.focus();
        }
    };

    useEffect(() => {
        if (!transparentOnTop) {
            setIsScrolled(true);
            return;
        }

        const onScroll = () => {
            setIsScrolled(window.scrollY > 24);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [transparentOnTop]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname, location.search, location.hash]);

    useEffect(() => {
        if (!isMobileMenuVisible || isMobileMenuOpen) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setIsMobileMenuVisible(false);
        }, MOBILE_MENU_ANIMATION_MS);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [isMobileMenuVisible, isMobileMenuOpen]);

    useEffect(() => {
        if (!isMobileMenuVisible) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMobileMenuVisible]);

    useEffect(() => {
        if (!isMobileMenuVisible) {
            return;
        }

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                closeMobileMenu(true);
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isMobileMenuVisible]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        const onChange = (event) => {
            if (event.matches) {
                setIsMobileMenuOpen(false);
            }
        };

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", onChange);

            return () => {
                mediaQuery.removeEventListener("change", onChange);
            };
        }

        mediaQuery.addListener(onChange);

        return () => {
            mediaQuery.removeListener(onChange);
        };
    }, []);

    const isSolidHeader = !transparentOnTop || isScrolled || isMobileMenuVisible;
    const headerClassName = `fixed left-0 top-0 z-50 w-full border-b transition-colors duration-200 ${isSolidHeader ? "border-[#2a2f35] bg-[#1c1d21]" : "border-[rgba(255,255,255,0.1)] bg-transparent"}`;

    return (
        <>
            <header className={headerClassName}>
                <div className="mx-auto flex h-24 w-full max-w-360 items-center justify-between px-6 max-[700px]:h-18.5 max-[700px]:px-4 max-[375px]:px-3 max-[320px]:px-2.5">
                    <div className="flex w-1/3 items-center gap-7.5 max-lg:hidden">
                        <NavLink to="/collection" className={desktopLinkClass}>Collection</NavLink>
                        {showAdmin && <span className="border border-[#d7e5dc] bg-[#edf3ef] px-[0.55rem] py-1 text-[0.65rem] uppercase tracking-[0.08em] text-[#0f4b22]">Compte Admin</span>}
                    </div>

                    <button
                        ref={toggleButtonRef}
                        type="button"
                        className="grid h-11 w-11 place-content-center border border-[rgba(255,255,255,0.48)] bg-[rgba(9,11,14,0.72)] lg:hidden max-[375px]:h-10 max-[375px]:w-10 max-[320px]:h-9 max-[320px]:w-9"
                        aria-controls="mobile-site-menu"
                        aria-expanded={isMobileMenuOpen}
                        aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        onClick={() => {
                            if (isMobileMenuOpen) {
                                closeMobileMenu(false);
                                return;
                            }

                            openMobileMenu();
                        }}
                    >
                        <span className="sr-only">Menu</span>
                        <span className={`block h-[1.5px] w-5 bg-[#faf8f5] transition-transform duration-220 max-[375px]:w-4.5 max-[320px]:w-4 ${isMobileMenuOpen ? "translate-y-1.5 rotate-45" : ""}`} aria-hidden="true" />
                        <span className={`my-1 block h-[1.5px] w-5 bg-[#faf8f5] transition-opacity duration-220 max-[375px]:w-4.5 max-[320px]:w-4 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} aria-hidden="true" />
                        <span className={`block h-[1.5px] w-5 bg-[#faf8f5] transition-transform duration-220 max-[375px]:w-4.5 max-[320px]:w-4 ${isMobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} aria-hidden="true" />
                    </button>

                    <div className="flex w-1/3 justify-center max-lg:flex-1">
                        <Link to="/" className="font-serif text-[34px] font-medium text-[#faf8f5] transition-transform duration-200 hover:-translate-y-px max-[700px]:text-[28px] max-[375px]:text-[22px] max-[320px]:text-[20px]">Belle Montre Wallonne</Link>
                    </div>

                    <div className="flex w-1/3 items-center justify-end gap-7.5 max-lg:hidden">
                        <NavLink to="/besoin-daide" className={desktopLinkClass}>Aide</NavLink>
                        {!showAdmin && (
                            <NavLink to="/connexion" className={desktopLinkClass}>
                                Compte
                            </NavLink>
                        )}
                        {showAdmin &&
                            adminLinks.map((link) => (
                                <NavLink key={link.to} to={link.to} className={desktopLinkClass}>
                                    {link.label}
                                </NavLink>
                            ))
                        }
                        {showAdmin && (
                            <NavLink to="/connexion" className={desktopLinkClass}>
                                Compte
                            </NavLink>
                        )}
                    </div>

                    <div className="h-11 w-11 lg:hidden max-[375px]:h-10 max-[375px]:w-10 max-[320px]:h-9 max-[320px]:w-9" aria-hidden="true" />
                </div>
            </header>

            {isMobileMenuVisible && (
                <>
                    <button
                        type="button"
                        className={`fixed inset-0 z-40 bg-black/58 transition-opacity duration-200 lg:hidden ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
                        aria-label="Fermer le menu"
                        onClick={() => closeMobileMenu(false)}
                    />

                    <nav
                        id="mobile-site-menu"
                        className={`mobile-menu-panel fixed left-0 right-0 top-24 z-50 max-h-[calc(100vh-6rem)] overflow-y-auto border-b border-[#2a2f35] bg-[#1c1d21] px-6 pb-5 pt-3 shadow-[0_20px_36px_rgba(0,0,0,0.5)] max-[700px]:top-18.5 max-[700px]:max-h-[calc(100vh-4.625rem)] max-[375px]:px-3 max-[375px]:pb-4 max-[375px]:pt-2.5 lg:hidden ${isMobileMenuOpen ? "mobile-menu-panel-open" : "mobile-menu-panel-close pointer-events-none"}`}
                        aria-label="Navigation mobile"
                    >
                        <ul className="m-0 grid list-none gap-2 p-0 max-[375px]:gap-1.5">
                            {mobileLinks.map((link, index) => (
                                <li
                                    key={link.to}
                                    className={isMobileMenuOpen ? "mobile-menu-item-open" : "mobile-menu-item-close"}
                                    style={{ animationDelay: `${isMobileMenuOpen ? 60 + index * 55 : 24 + (mobileLinks.length - index - 1) * 32}ms` }}
                                >
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) => `${mobileLinkClass} ${isActive ? "border-[#d5c7b2] text-[#faf8f5]" : "text-[#f1ece4]"}`}
                                        onClick={() => closeMobileMenu(false)}
                                    >
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        {showAdmin && (
                            <p
                                className={`${isMobileMenuOpen ? "mobile-menu-item-open" : "mobile-menu-item-close"} mt-3 border border-[#d7e5dc] bg-[#edf3ef] px-3 py-2 text-[0.65rem] uppercase tracking-[0.08em] text-[#0f4b22] max-[375px]:text-[0.62rem]`}
                                style={{ animationDelay: `${isMobileMenuOpen ? 80 + mobileLinks.length * 55 : 24}ms` }}
                            >
                                Compte Admin
                            </p>
                        )}
                    </nav>
                </>
            )}
            
            {reserveSpace && <div className="h-24 max-[700px]:h-18.5" aria-hidden="true" />}
        </>
    );
}
