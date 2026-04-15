import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";

// --- Objet de styles Tailwind réutilisables ---
const style = {
    navLink: "text-[#faf8f5] text-[11px] tracking-[0.05em] uppercase font-medium relative transition-opacity duration-[220ms] ease-in-out hover:opacity-[0.86] after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-[240ms] hover:after:scale-x-100",
    
    editorialArticle: "w-full lg:w-1/2 flex flex-col justify-center py-[52px] px-[24px] md:py-[80px] md:px-[96px]",
    editorialImage: "w-full lg:w-1/2 min-h-[512px] bg-center bg-no-repeat bg-cover",
    
    editorialLabel: "text-[#8c8d8e] uppercase tracking-[0.1em] text-[11px] font-medium mb-[24px]",
    editorialTitle: "font-['Cormorant_Garamond',serif] text-[50px] md:text-[clamp(50px,4.5vw,74px)] leading-[1.06] mb-[30px] font-normal",
    editorialParagraph: "max-w-[520px] text-[#1c1d21]/80 text-[16px] leading-[1.72] mb-[40px] font-light",
};

export default function HomePage() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY > 24);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-[#faf8f5] text-[#1c1d21]">
            <nav className={`fixed left-0 top-0 z-50 w-full border-b transition-colors duration-180 ease-in-out ${isScrolled ? "border-[#2a2f35] bg-[#1c1d21]" : "border-white/10 bg-transparent"}`}>
                <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-6 md:h-24">
                    <div className="hidden w-1/3 items-center gap-8 lg:flex">
                        <Link to="/collection" className={style.navLink}>
                            Collection
                        </Link>
                    </div>

                    <div className="flex w-full justify-center lg:w-1/3">
                        <Link to="/" className="font-['Cormorant_Garamond',serif] text-[28px] font-medium tracking-[0.02em] text-[#faf8f5] transition-transform duration-200 hover:-translate-y-px md:text-[34px]">
                            Belle Montre Wallonne
                        </Link>
                    </div>

                    <div className="hidden w-1/3 items-center justify-end gap-8 lg:flex">
                        <Link to="/besoin-daide" className={style.navLink}>
                            Aide
                        </Link>
                        <Link to="/connexion" className={style.navLink}>
                            Connexion
                        </Link>
                    </div>
                </div>
            </nav>

            <section
                className="h-screen w-full flex items-center justify-center relative bg-[#1c1d21] bg-center bg-no-repeat bg-cover"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(28, 29, 33, 0.4), rgba(28, 29, 33, 0.6)), url('/images/imageFondAcceuil.jpg')"
                }}
            >
                <div className="relative z-10 text-center px-4 flex flex-col items-center">
                    <h1 className="font-['Cormorant_Garamond',serif] text-[clamp(52px,6vw,82px)] text-[#faf8f5] font-normal leading-[1.05] tracking-[0.01em] mb-7">
                        Le Temps, Sublime.
                    </h1>
                    <a className="inline-flex items-center justify-center border border-[#faf8f5] text-[#faf8f5] px-8 py-4 uppercase tracking-widest text-[11px] font-medium bg-transparent transition-colors hover:bg-white/10" href="#discover">
                        Découvrir
                    </a>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#faf8f5]">
                    <span className="material-symbols-outlined text-[19px]">expand_all</span>
                </div>
            </section>

            <div className="bg-[#faf8f5]" id="discover">
                <section className="mx-auto flex min-h-0 max-w-screen-2xl flex-col items-stretch lg:flex-row md:min-h-screen">
                    <article className={style.editorialArticle}>
                        <span className={style.editorialLabel}>Héritage</span>
                        <h2 className={style.editorialTitle}>L'Art de la Précision Absolue</h2>
                        <p className={style.editorialParagraph}>
                            Chaque garde-temps est une célébration silencieuse du savoir-faire
                            Artisanal. Nous ne créons pas de simples montres, nous forgeons des
                            Héritages conçus pour traverser les générations avec une élégance
                            Discrète.
                        </p>
                        <Link to="/collection" className="inline-flex w-fit items-center justify-center bg-[#2a2f35] px-8 py-4 text-[11px] font-medium uppercase tracking-widest text-[#faf8f5] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[#1f2328] hover:shadow-[0_12px_22px_rgba(28,29,33,0.18)]">
                            Explorez la Collection
                        </Link>
                    </article>

                    <div
                        className={style.editorialImage}
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfYS_Y8e8Xxa4T1HTACpSXWhCqY3bYWNEw4nC8jEna5dtppi2mC4OPn74NrTAGjhF79Sbh5HZQ46ZXoNbl5C4MaR2j8fCbjNhhuJWa6611sTcMWLadDNlm02l7wcAeSM8BOUcxIub7tZNEz6sdEaDq19eJgDdivj-0pyPYuLRV0FC_IE_1FTlWFZCvi_tLf3cyZERYSDKqa38ML49FBR2hwqwALMgIG7uq5QgkpCLNnEfmTdamsJxKfSM-4ZFYqFjXsBHwfLg5hj0')"
                        }}
                        aria-label="Montre minimaliste"
                    />
                </section>

                <div className="mx-auto h-px max-w-screen-2xl bg-[#efebe4]" />

                {/* Ajout de lg:flex-row-reverse pour alterner l'image */}
                <section className="mx-auto flex min-h-0 max-w-screen-2xl flex-col items-stretch lg:flex-row-reverse md:min-h-screen">
                    <div
                        className={style.editorialImage}
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAQTdR00jRJCS48u178XDVXxb191H2HBkVPVVwwug_g_MVxCAgOzT-BP7f-CGH4l9pdFYf-k9YFuo6BTTViFmHI4mcwwAYiO5ThQdmjsXGwAWleT5zY1vaIJOqxu3pifR3vPKmNirOe5CaXTWOv-Wi9d04c3FITaUoB2fY9FJx4SHeFKbW8LGiOxAWwY1JW3wV0hzYA9guf54oYQYW3r6egktHMSF4DBt1_AJ-G5F9WEB34TiO_2hFm1_9gsqG4syJ8O0JP42XOgG4')"
                        }}
                        aria-label="Portrait horloger"
                    />

                    <article className={style.editorialArticle}>
                        <span className={style.editorialLabel}>Philosophie</span>
                        <h2 className={style.editorialTitle}>Le Luxe Dans Sa Plus Simple Expression</h2>
                        <p className={style.editorialParagraph}>
                            Dans un monde bruyant, nous choisissons le murmure. Nos créations
                            refusent l'ostentation au profit d'une pureté de lignes et d'une
                            sélection de matériaux nobles. Le veritable luxe se ressent, il ne
                            s'affiche pas.
                        </p>
                        <a className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-[#1c1d21] transition-colors duration-200 ease-in-out hover:text-[#2a2f35]" href="#brand">
                            Découvrir Notre Marque
                            <span className="material-symbols-outlined text-[18px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5">arrow_forward</span>
                        </a>
                    </article>
                </section>
            </div>

            <SiteFooter />
        </div>
    );
}