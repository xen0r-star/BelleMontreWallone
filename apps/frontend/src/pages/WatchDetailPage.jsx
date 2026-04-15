import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { formatPrice } from "../data/watches";
import { fetchWatches } from "../hooks/fetchAPI";

const style = {
    page: "min-h-screen bg-[radial-gradient(circle_at_top,#f6efe5_0%,#f0e8db_45%,#ece4d7_100%)] text-[#1c1d21]",
    container: "mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:py-12",
    loadingCard: "rounded-[28px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.92)] px-6 py-10 text-[#5f6672] shadow-[0_18px_50px_rgba(28,29,33,0.06)]",
    missingCard: "grid gap-4 rounded-[28px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.92)] px-6 py-10 shadow-[0_18px_50px_rgba(28,29,33,0.06)]",
    missingTitle: "font-['Cormorant_Garamond',serif] text-[2.8rem] leading-none",
    heroImage: "h-[540px] w-full rounded-[28px] border border-[#d8cdbd] bg-[#eceae6] object-contain shadow-[0_18px_40px_rgba(28,29,33,0.06)]",
    imageShell: "relative h-[540px] w-full overflow-hidden rounded-[28px] border border-[#d8cdbd] bg-[#eceae6] shadow-[0_18px_40px_rgba(28,29,33,0.06)]",
    image: "h-full w-full object-contain",
    skeleton: "absolute inset-0 animate-pulse bg-[linear-gradient(90deg,#ece7df_0%,#f7f4ef_45%,#ece7df_100%)] bg-[length:220%_100%]",
    panel: "grid content-start gap-4 rounded-[28px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.92)] p-6 shadow-[0_18px_50px_rgba(28,29,33,0.06)] md:p-8",
    kicker: "text-[0.72rem] uppercase tracking-[0.2em] text-[#8c775f]",
    title: "font-['Cormorant_Garamond',serif] text-[2.8rem] leading-none md:text-[4rem]",
    price: "text-[1.05rem] text-[#5f6672]",
    muted: "text-[0.96rem] leading-relaxed text-[#5f6672]",
    specList: "list-none border-t border-[#e1d7c8]",
    specItem: "flex items-center justify-between border-b border-[#e1d7c8] py-3 text-[0.95rem]",
    specLabel: "text-[#8c8d8e]",
    specValue: "font-medium text-[#1c1d21]",
    primaryButton: "inline-flex items-center justify-center rounded-full border border-[#1c1d21] bg-[#1c1d21] px-5 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#faf5ed] transition-colors duration-200 hover:bg-transparent hover:text-[#1c1d21]",
    modalBackdrop: "fixed inset-0 z-[99] grid place-items-center bg-black/45 p-4",
    modal: "w-full max-w-[760px] rounded-[28px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.98)] p-6 shadow-[0_18px_50px_rgba(28,29,33,0.12)] md:p-8",
    closeButton: "ml-auto inline-flex items-center rounded-full border border-[#d8cdbd] px-4 py-2 text-[0.76rem] uppercase tracking-[0.12em] text-[#5f6672] transition-colors hover:border-[#1c1d21] hover:text-[#1c1d21]",
    modalTitle: "mt-6 font-['Cormorant_Garamond',serif] text-[2rem] leading-none",
    form: "mt-5 grid gap-4",
    input: "h-12 rounded-full border border-[#d8cdbd] bg-white px-5 text-[0.95rem] text-[#1c1d21] outline-none transition-colors focus:border-[#1c1d21]",
    textarea: "min-h-[160px] rounded-[22px] border border-[#d8cdbd] bg-white px-5 py-4 text-[0.95rem] text-[#1c1d21] outline-none transition-colors focus:border-[#1c1d21]",
    success: "rounded-[22px] border border-[#c8d4c2] bg-[#eef5ea] px-5 py-4 text-[0.95rem] text-[#355044]",
};

function ImageWithSkeleton({ src, alt, className }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={style.imageShell}>
            {!isLoaded && <div className={style.skeleton} aria-hidden="true" />}
            <img
                src={src}
                alt={alt}
                className={`${style.image} ${className || ""}`}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
}

export default function WatchDetailPage() {
    const [watches, setWatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sent, setSent] = useState(false);
    const { id } = useParams();
    
    useEffect(() => {
        let isMounted = true;

        async function loadWatches() {
            setIsLoading(true);
            const data = await fetchWatches();

            if (isMounted) {
                setWatches(data);
                setIsLoading(false);
            }
        }

        loadWatches();

        return () => {
            isMounted = false;
        };
    }, []);

    if (!watches || watches.length === 0 || isLoading) {
        return (<div className={style.page}>
            <SiteHeader />
            
            <main className={style.container}>
                <div className={style.loadingCard}>Chargement de la montre...</div>
            </main>
            <SiteFooter />
        </div>);
    }

    const watch = watches.find((item) => String(item.watchId ?? item.id) === String(id));
    
    if (!watch) {
        return (
            <div className={style.page}>
                <SiteHeader />
                <main className={style.container}>
                    <section className={style.missingCard}>
                        <h1 className={style.missingTitle}>Montre introuvable</h1>
                        <Link to="/collection" className={style.primaryButton}>
                        Retour a la collection
                        </Link>
                    </section>
                </main>
                <SiteFooter />
            </div>
        );
    }

    function handleSubmit(event) {
        event.preventDefault();
        setSent(true);
    }

    return (
        <div className={style.page}>
            <SiteHeader />
            
            <main className={style.container}>
                <section>
                    <ImageWithSkeleton
                        src={watch.imageUrl}
                        alt={watch.model}
                        className={style.heroImage}
                    />
                </section>

                <section className={style.panel}>
                    <p className={style.kicker}>{watch.brand || "/"}</p>

                    <h1 className={style.title}>{watch.model}</h1>
                    <div className={style.price}>Prix de vente : {formatPrice(watch.retailPrice)}<hr/>Prix conseillé : {formatPrice(watch.marketPrice)}</div>
                    <p className={style.muted}>{watch.watchDesc ? ("Description : " + watch.watchDesc) : "Aucune description trouvé."}</p>

                    <ul className={style.specList}>
                        <li className={style.specItem}>
                            <span className={style.specLabel}>Mouvement</span>
                            <span className={style.specValue}>{watch.movement || "/"}</span>
                        </li>
                        <li className={style.specItem}>
                            <span className={style.specLabel}>Diamètre</span>
                            <span className={style.specValue}>{watch.diameter ? `${watch.diameter}mm` : "/"}</span>
                        </li>
                        <li className={style.specItem}>
                            <span className={style.specLabel}>Matériel</span>
                            <span className={style.specValue}>{watch.materials || "/"}</span>
                        </li>
                        <li className={style.specItem}>
                            <span className={style.specLabel}>Étanchéité</span>
                            <span className={style.specValue}>{watch.watertightness || "/"}</span>
                        </li>
                    </ul>

                    <button type="button" className={style.primaryButton} onClick={() => setIsModalOpen(true)}>
                        Demander une réservation
                    </button>
                </section>
            </main>

            {isModalOpen && (
                <div className={style.modalBackdrop} role="dialog" aria-modal="true">
                    <div className={style.modal}>
                        <button
                            type="button"
                            className={style.closeButton}
                            onClick={() => {
                                setIsModalOpen(false);
                                setSent(false);
                            }}
                        >
                            Fermer
                        </button>

                        <h2 className={style.modalTitle}>Réservation - {watch.model}</h2>
                        {!sent ? (
                            <form className={style.form} onSubmit={handleSubmit}>
                                <input className={style.input} required placeholder="Nom :" />
                                <input className={style.input} required placeholder="Prenom :" />
                                <input className={style.input} required type="email" placeholder="Email :" />
                                <input className={style.input} type="tel" placeholder="Telephone : [Format: +xx xxx xx xx xx]" pattern="[0-9]{2} [0-9]{3} [0-9]{2} [0-9]{2} [0-9]{2}"/>
                                <textarea className={style.textarea} rows="7" placeholder="Message :" />
                                <button className={style.primaryButton} type="submit">Envoyer</button>
                            </form>

                        ) : (
                            <p className={style.success}>Demande envoyée. Un de nos conseiller te contactera sous un délai de 24h.</p>
                        )}
                    </div>
                </div>
            )}

            <SiteFooter />
        </div>
    );
}
