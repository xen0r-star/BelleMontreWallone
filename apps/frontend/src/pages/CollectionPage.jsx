import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { formatPrice } from "../data/watches";
import { fetchWatches } from "../hooks/fetchAPI";

const style = {
    page: "min-h-screen bg-[radial-gradient(circle_at_top,#f6efe5_0%,#f0e8db_45%,#ece4d7_100%)] text-[#1c1d21]",
    container: "mx-auto grid w-full max-w-[1440px] gap-6 px-6 py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-12",
    loadingCard: "rounded-[28px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.92)] px-6 py-10 text-[#5f6672] shadow-[0_18px_50px_rgba(28,29,33,0.06)]",
    filtersCard: "sticky top-[104px] grid gap-4 self-start rounded-[28px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.92)] p-5 shadow-[0_18px_50px_rgba(28,29,33,0.06)]",
    filtersTitle: "font-['Cormorant_Garamond',serif] text-[1.9rem] leading-none text-[#1c1d21]",
    filterSection: "grid gap-3 border-t border-[#e1d7c8] pt-4",
    label: "text-[0.72rem] uppercase tracking-[0.2em] text-[#8c775f]",
    chipsRow: "flex flex-wrap gap-2",
    chip: "inline-flex items-center rounded-full border border-[#d8cdbd] bg-white px-3 py-2 text-[0.74rem] uppercase tracking-[0.08em] text-[#1c1d21] transition-colors duration-200 hover:border-[#1c1d21]",
    chipActive: "border-[#1c1d21] bg-[#1c1d21] text-[#faf5ed]",
    select: "h-12 rounded-full border border-[#d8cdbd] bg-white px-4 text-[0.92rem] text-[#1c1d21] outline-none transition-colors focus:border-[#1c1d21]",
    inputRow: "grid gap-3 sm:grid-cols-2",
    input: "h-12 rounded-full border border-[#d8cdbd] bg-white px-4 text-[0.92rem] text-[#1c1d21] outline-none transition-colors focus:border-[#1c1d21]",
    resetButton: "inline-flex items-center justify-center rounded-full border border-[#1c1d21] bg-[#1c1d21] px-5 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#faf5ed] transition-colors duration-200 hover:bg-transparent hover:text-[#1c1d21]",
    loginButton: "inline-flex items-center justify-center rounded-full border border-[#c7b79d] bg-[#e8dcc8] px-5 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#1c1d21] transition-colors duration-200 hover:bg-[#f2e7d5]",
    content: "grid gap-5",
    headerRow: "flex items-end justify-between gap-4",
    headerTitle: "font-['Cormorant_Garamond',serif] text-[2.4rem] leading-none md:text-[3.4rem]",
    headerMuted: "text-[0.92rem] text-[#5f6672]",
    cardsGrid: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
    card: "grid gap-4 rounded-[26px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.92)] p-4 shadow-[0_16px_40px_rgba(28,29,33,0.05)]",
    mediaLink: "block overflow-hidden rounded-[18px] border border-[#e1d7c8] bg-[#f4f3f1]",
    mediaBox: "h-[260px] w-full overflow-hidden bg-[#f4f3f1]",
    imageShell: "relative h-full w-full",
    image: "h-full w-full object-contain",
    skeleton: "absolute inset-0 animate-pulse bg-[linear-gradient(90deg,#ece7df_0%,#f7f4ef_45%,#ece7df_100%)] bg-[length:220%_100%]",
    noImage: "grid h-full w-full place-content-center justify-items-center gap-2 border border-dashed border-[#ddd6cc] bg-[color-mix(in_srgb,var(--bg)_88%,#fff)] text-[#8c8d8e]",
    noImageIcon: "text-4xl",
    watchMeta: "grid gap-1 px-1",
    watchBrand: "text-[0.72rem] uppercase tracking-[0.16em] text-[#8c8d8e]",
    watchTitle: "font-['Cormorant_Garamond',serif] text-[1.6rem] leading-none text-[#1c1d21]",
    watchPrice: "text-[0.98rem] text-[#5f6672]",
    watchActions: "pt-1",
    empty: "rounded-[24px] border border-dashed border-[#d8cdbd] bg-white px-5 py-8 text-center text-[#5f6672]",
};

function NoImagePlaceholder() {
    return (
        <div className={style.noImage} aria-label="Image indisponible">
            <span className={`material-symbols-outlined ${style.noImageIcon}`}>image_not_supported</span>
            <p>Aucune image</p>
        </div>
    );
}

function ImageWithFallback({ src, alt }) {
    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const imageSrc = typeof src === "string" ? src.trim() : "";

    if (!imageSrc || hasError) {
        return <NoImagePlaceholder />;
    }

    return (
        <div className={style.imageShell}>
            {!isLoaded && <div className={style.skeleton} aria-hidden="true" />}
            <img
                src={imageSrc}
                alt={alt}
                className={style.image}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
            />
        </div>
    );
}

function WatchImage({ watch }) {
    return <ImageWithFallback src={watch.imageUrl} alt={watch.model} />;
}

export default function CollectionPage() {
    const [watches, setWatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Nouveaux états pour les filtres
    const [activeBrands, setActiveBrands] = useState([]);
    const [activeMaterials, setActiveMaterials] = useState([]);
    const [activeMovements, setActiveMovements] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [diameter, setDiameter] = useState("");
    const [sortBy, setSortBy] = useState("featured");

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

    // Listes dynamiques basées sur les données reçues du backend
    const availableBrands = useMemo(() => {
        const brands = watches.map(w => w.brand).filter(Boolean);
        return [...new Set(brands)].sort();
    }, [watches]);

    const availableMaterials = useMemo(() => {
        const mats = watches.map(w => w.materials).filter(Boolean);
        return [...new Set(mats)].sort();
    }, [watches]);

    // Mouvements dynamiques basés sur les données reçues du backend
    const availableMovements = useMemo(() => {
        const movements = watches.map(w => w.movement).filter(Boolean);
        return [...new Set(movements)].sort();
    }, [watches]);

    const filteredWatches = useMemo(() => {
        if (!watches || watches.length === 0) return [];

        const filtered = watches.filter((watch) => {
            const brandOk = activeBrands.length === 0 || activeBrands.includes(watch.brand);
            const materialOk = activeMaterials.length === 0 || activeMaterials.includes(watch.materials);
            const movementOk = activeMovements.length === 0 || activeMovements.includes(watch.movement);

            // Filtre par prix
            const minPriceOk = minPrice === "" || (watch.retailPrice && watch.retailPrice >= Number(minPrice));
            const maxPriceOk = maxPrice === "" || (watch.retailPrice && watch.retailPrice <= Number(maxPrice));
            
            // Filtre par diamètre
            const diameterOk = diameter === "" || (watch.diameter && Number(watch.diameter) === Number(diameter));

            return brandOk && materialOk && movementOk && minPriceOk && maxPriceOk && diameterOk;
        });

        const sorted = [...filtered];
        if (sortBy === "priceAsc") {
            sorted.sort((a, b) => a.retailPrice - b.retailPrice);
        }
        if (sortBy === "priceDesc") {
            sorted.sort((a, b) => b.retailPrice - a.retailPrice);
        }
        if (sortBy === "nameAsc") {
            sorted.sort((a, b) => a.model.localeCompare(b.model, "fr"));
        }
        return sorted;
    }, [watches, activeBrands, activeMaterials, activeMovements, minPrice, maxPrice, diameter, sortBy]);

    // Fonctions utilitaires pour le toggle des filtres
    function toggleBrand(brand) {
        setActiveBrands((prev) => prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand]);
    }

    function toggleMaterial(material) {
        setActiveMaterials((prev) => prev.includes(material) ? prev.filter((item) => item !== material) : [...prev, material]);
    }

    function toggleMovement(movement) {
        setActiveMovements((prev) => prev.includes(movement) ? prev.filter((item) => item !== movement) : [...prev, movement]);
    }

    function resetFilters() {
        setActiveBrands([]);
        setActiveMaterials([]);
        setActiveMovements([]);
        setMinPrice("");
        setMaxPrice("");
        setDiameter("");
        setSortBy("featured");
    }

    if (isLoading) {
        return (
            <div className={style.page}>
                <SiteHeader />
                <main className={style.container}>
                    <div className={style.loadingCard}>Chargement des montres...</div>
                </main>
                <SiteFooter />
            </div>
        );
    }

    return (
        <div className={style.page}>
            <SiteHeader />
            <main className={style.container}>
                <aside className={style.filtersCard}>
                    <h2 className={style.filtersTitle}>Recherche de produit</h2>
                    <div className={style.filterSection}>
                        <p className={style.label}>Marque</p>
                        <div className={style.chipsRow}>
                            {availableBrands.map((brand) => (
                                <button
                                    key={brand}
                                    type="button"
                                    className={`${style.chip} ${activeBrands.includes(brand) ? style.chipActive : ""}`}
                                    onClick={() => toggleBrand(brand)}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={style.filterSection}>
                        <p className={style.label}>Matière</p>
                        <div className={style.chipsRow}>
                            {availableMaterials.map((material) => (
                                <button
                                    key={material}
                                    type="button"
                                    className={`${style.chip} ${activeMaterials.includes(material) ? style.chipActive : ""}`}
                                    onClick={() => toggleMaterial(material)}
                                >
                                    {material}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={style.filterSection}>
                        <p className={style.label}>Trier</p>
                        <select className={style.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="featured">Sélection maison</option>
                            <option value="priceAsc">Prix croissant</option>
                            <option value="priceDesc">Prix décroissant</option>
                            <option value="nameAsc">Nom A-Z</option>
                        </select>
                    </div>
                    <div className={style.filterSection}>
                        <p className={style.label}>Prix Retail (€)</p>
                        <div className={style.inputRow}>
                            <input 
                                className={style.input}
                                type="number" 
                                placeholder="Min" 
                                value={minPrice} 
                                onChange={(e) => setMinPrice(e.target.value)} 
                            />
                            <input 
                                className={style.input}
                                type="number" 
                                placeholder="Max" 
                                value={maxPrice} 
                                onChange={(e) => setMaxPrice(e.target.value)} 
                            />
                        </div>
                    </div>
                    <div className={style.filterSection}>
                        <p className={style.label}>Diamètre (mm)</p>
                        <input 
                            className={style.input}
                            type="number" 
                            placeholder="Ex: 40" 
                            value={diameter} 
                            onChange={(e) => setDiameter(e.target.value)} 
                        />
                    </div>
                    <div className={style.filterSection}>
                        <p className={style.label}>Mouvement</p>
                        <div className={style.chipsRow}>
                            {availableMovements.map((mvmt) => (
                                <button
                                    key={mvmt}
                                    type="button"
                                    className={`${style.chip} ${activeMovements.includes(mvmt) ? style.chipActive : ""}`}
                                    onClick={() => toggleMovement(mvmt)}
                                >
                                    {mvmt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        className={style.resetButton}
                        onClick={resetFilters}
                    >
                        Réinitialiser
                    </button>
                    <Link className={style.loginButton} to="/connexion">
                        Connexion
                    </Link>
                </aside>
                <section className={style.content}>
                    <div className={style.headerRow}>
                        <h1 className={style.headerTitle}>Collection</h1>
                        <p className={style.headerMuted}>{filteredWatches.length} modèle(s)</p>
                    </div>
                    <div className={style.cardsGrid}>
                        {filteredWatches.map((watch) => (
                            <article key={watch.watchId ?? watch.id} className={style.card}>
                                <Link to={`/montre/${watch.watchId ?? watch.id}`} className="image-link">
                                    <div className={style.mediaBox}>
                                        <WatchImage watch={watch} />
                                    </div>
                                </Link>
                                <div className={style.watchMeta}>
                                    <p className={style.watchBrand}>{watch.brand || "/"}</p>
                                    <h3 className={style.watchTitle}>{watch.model}</h3>
                                    <p className={style.watchPrice}>{formatPrice(watch.retailPrice)}</p>
                                </div>
                                <div className={style.watchActions}>
                                    <Link className={style.resetButton} to={`/montre/${watch.watchId ?? watch.id}`}>
                                        Voir le détail
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}

