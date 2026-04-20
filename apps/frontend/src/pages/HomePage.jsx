import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col bg-[#faf8f5] text-[#1c1d21]">
            <SiteHeader transparentOnTop={true} reserveSpace={false} />

            <section
                className="relative flex h-screen w-full items-center justify-center bg-[#1c1d21] bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(28, 29, 33, 0.4), rgba(28, 29, 33, 0.6)), url('/images/imageFondAcceuil.jpg')"
                }}
            >
                <div className="relative z-10 flex flex-col items-center px-4 text-center">
                    <h1 className="mb-7 font-serif text-[clamp(52px,6vw,82px)] font-normal leading-[1.05] text-[#faf8f5]">Le Temps, Sublime.</h1>
                    <a className="inline-flex items-center justify-center border border-[#faf8f5] bg-transparent px-8 py-3.75 text-[11px] font-medium uppercase tracking-widest text-[#faf8f5]" href="#discover">Découvrir</a>
                </div>

                <div className="absolute bottom-10.5 left-1/2 -translate-x-1/2 text-[#faf8f5]">
                    <span className="material-symbols-outlined text-[19px]">expand_all</span>
                </div>
            </section>

            <div className="bg-[#faf8f5]" id="discover">
                <section className="mx-auto flex min-h-204.75 w-full max-w-360 items-stretch max-lg:flex-col">
                    <article className="flex w-1/2 flex-col justify-center px-24 py-20 max-lg:w-full max-[700px]:px-6 max-[700px]:py-13">
                        <span className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#8c8d8e]">Héritage</span>
                        <h2 className="mb-7.5 font-serif text-[clamp(50px,4.5vw,74px)] font-normal leading-[1.06]">L'Art de la Précision Absolue</h2>
                        <p className="mb-10 max-w-130 text-base font-light leading-[1.72] text-[rgba(28,29,33,0.82)]">
                            Chaque garde-temps est une célébration silencieuse du savoir-faire
                            Artisanal. Nous ne créons pas de simples montres, nous forgeons des
                            Héritages conçus pour traverser les générations avec une élégance
                            Discrète.
                        </p>
                        <Link to="/collection" className="inline-flex w-fit items-center justify-center bg-[#2a2f35] px-8 py-3.75 text-[11px] font-medium uppercase tracking-widest text-[#faf8f5] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1f2328] hover:shadow-[0_12px_22px_rgba(28,29,33,0.18)]">Explorez la Collection</Link>
                    </article>

                    <div
                        className="min-h-128 w-1/2 bg-cover bg-center bg-no-repeat max-lg:w-full"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfYS_Y8e8Xxa4T1HTACpSXWhCqY3bYWNEw4nC8jEna5dtppi2mC4OPn74NrTAGjhF79Sbh5HZQ46ZXoNbl5C4MaR2j8fCbjNhhuJWa6611sTcMWLadDNlm02l7wcAeSM8BOUcxIub7tZNEz6sdEaDq19eJgDdivj-0pyPYuLRV0FC_IE_1FTlWFZCvi_tLf3cyZERYSDKqa38ML49FBR2hwqwALMgIG7uq5QgkpCLNnEfmTdamsJxKfSM-4ZFYqFjXsBHwfLg5hj0')"
                        }}
                        aria-label="Montre minimaliste"
                    />
                </section>

                <div className="mx-auto h-px w-full max-w-360 bg-[#efebe4]" />

                <section className="mx-auto flex min-h-204.75 w-full max-w-360 items-stretch max-lg:flex-col">
                    <div
                        className="min-h-128 w-1/2 bg-cover bg-center bg-no-repeat max-lg:w-full"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAQTdR00jRJCS48u178XDVXxb191H2HBkVPVVwwug_g_MVxCAgOzT-BP7f-CGH4l9pdFYf-k9YFuo6BTTViFmHI4mcwwAYiO5ThQdmjsXGwAWleT5zY1vaIJOqxu3pifR3vPKmNirOe5CaXTWOv-Wi9d04c3FITaUoB2fY9FJx4SHeFKbW8LGiOxAWwY1JW3wV0hzYA9guf54oYQYW3r6egktHMSF4DBt1_AJ-G5F9WEB34TiO_2hFm1_9gsqG4syJ8O0JP42XOgG4')"
                        }}
                        aria-label="Portrait horloger"
                    />

                    <article className="flex w-1/2 flex-col justify-center px-24 py-20 max-lg:w-full max-[700px]:px-6 max-[700px]:py-13">
                        <span className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#8c8d8e]">Philosophie</span>
                        <h2 className="mb-7.5 font-serif text-[clamp(50px,4.5vw,74px)] font-normal leading-[1.06]">Le Luxe Dans Sa Plus Simple Expression</h2>
                        <p className="mb-10 max-w-130 text-base font-light leading-[1.72] text-[rgba(28,29,33,0.82)]">
                            Dans un monde bruyant, nous choisissons le murmure. Nos créations
                            refusent l'ostentation au profit d'une pureté de lignes et d'une
                            sélection de matériaux nobles. Le veritable luxe se ressent, il ne
                            s'affiche pas.
                        </p>
                        <a className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-[#1c1d21] transition-colors duration-200 hover:text-[#2a2f35]" href="#brand">
                            Découvrir Notre Marque
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </a>
                    </article>
                </section>
            </div>

            <SiteFooter />
        </div>
    );
}
