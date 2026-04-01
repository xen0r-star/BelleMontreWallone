import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";

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
        <div className="page-root home-exact">
            <nav className={`hx-nav ${isScrolled ? "hx-nav--solid" : ""}`}>
                <div className="hx-nav-inner">
                    <div className="hx-nav-left">
                        <Link to="/collection">Collection</Link>
                    </div>

                    <div className="hx-nav-center">
                        <Link to="/">Minimalisme Noble</Link>
                    </div>

                    <div className="hx-nav-right">
                        <Link to="/besoin-daide">Aide</Link>
                        <Link to="/connexion">Connexion</Link>
                    </div>
                </div>
            </nav>

            <section
                className="hx-hero"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(28, 29, 33, 0.4), rgba(28, 29, 33, 0.6)), url('/images/imageFondAcceuil.jpg')"
                }}
            >
                <div className="hx-hero-content">
                    <h1>Le Temps, Sublime.</h1>
                    <a className="hx-btn-outline" href="#discover">Découvrir</a>
                </div>

                <div className="hx-scroll-indicator">
                    <span className="material-symbols-outlined">expand_all</span>
                </div>
            </section>

            <div className="hx-main" id="discover">
                <section className="hx-editorial">
                    <article className="hx-editorial-text">
                        <span className="hx-label">Héritage</span>
                        <h2>L'Art de la Précision Absolue</h2>
                        <p>
                            Chaque garde-temps est une célébration silencieuse du savoir-faire
                            Artisanal. Nous ne créons pas de simples montres, nous forgeons des
                            Héritages conçus pour traverser les générations avec une élégance
                            Discrète.
                        </p>
                        <Link to="/collection" className="hx-btn-solid">Explorez la Collection</Link>
                    </article>

                    <div
                        className="hx-editorial-image"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfYS_Y8e8Xxa4T1HTACpSXWhCqY3bYWNEw4nC8jEna5dtppi2mC4OPn74NrTAGjhF79Sbh5HZQ46ZXoNbl5C4MaR2j8fCbjNhhuJWa6611sTcMWLadDNlm02l7wcAeSM8BOUcxIub7tZNEz6sdEaDq19eJgDdivj-0pyPYuLRV0FC_IE_1FTlWFZCvi_tLf3cyZERYSDKqa38ML49FBR2hwqwALMgIG7uq5QgkpCLNnEfmTdamsJxKfSM-4ZFYqFjXsBHwfLg5hj0')"
                        }}
                        aria-label="Montre minimaliste"
                    />
                </section>

                <div className="hx-divider" />

                <section className="hx-editorial reverse">
                    <div
                        className="hx-editorial-image"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAQTdR00jRJCS48u178XDVXxb191H2HBkVPVVwwug_g_MVxCAgOzT-BP7f-CGH4l9pdFYf-k9YFuo6BTTViFmHI4mcwwAYiO5ThQdmjsXGwAWleT5zY1vaIJOqxu3pifR3vPKmNirOe5CaXTWOv-Wi9d04c3FITaUoB2fY9FJx4SHeFKbW8LGiOxAWwY1JW3wV0hzYA9guf54oYQYW3r6egktHMSF4DBt1_AJ-G5F9WEB34TiO_2hFm1_9gsqG4syJ8O0JP42XOgG4')"
                        }}
                        aria-label="Portrait horloger"
                    />

                    <article className="hx-editorial-text">
                        <span className="hx-label">Philosophie</span>
                        <h2>Le Luxe Dans Sa Plus Simple Expression</h2>
                        <p>
                            Dans un monde bruyant, nous choisissons le murmure. Nos créations
                            refusent l'ostentation au profit d'une pureté de lignes et d'une
                            sélection de matériaux nobles. Le veritable luxe se ressent, il ne
                            s'affiche pas.
                        </p>
                        <a className="hx-link-inline" href="#brand">
                            Découvrir Notre Marque
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </article>
                </section>
            </div>

            <SiteFooter />
        </div>
    );
}
