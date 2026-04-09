import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { formatPrice } from "../data/watches";
import { fetchWatches } from "../hooks/fetchAPI";

function NoImagePlaceholder() {
    return (
        <div className="no-image" aria-label="Image indisponible">
            <span className="material-symbols-outlined">image_not_supported</span>
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
        <div className="image-shell">
            {!isLoaded && <div className="skeleton skeleton-image" aria-hidden="true" />}
            <img
                src={imageSrc}
                alt={alt}
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

    console.log("caca : " + isLoading);
    fetchWatches(setWatches, setIsLoading);

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

    // Affichage lors du chargement
    if (isLoading) {
        return (
            <div className="page-root">
                <SiteHeader />
                <main className="container collection-layout">
                    <p>Chargement des montres...</p>
                </main>
                <SiteFooter />
            </div>
        );
    }

    return (
        <div className="page-root">
            <SiteHeader />

            <main className="container collection-layout">
                <aside className="filters-card">
                    <h2>Recherche de produit</h2>

                    <div className="filter-section">
                        <p className="muted">Trier</p>
                        <select value="{sortBy}">
                            <option value="featured">Sélection maison</option>
                            <option value="priceAsc">Prix croissant</option>
                            <option value="priceDesc">Prix décroissant</option>
                            <option value="nameAsc">Nom A-Z</option>
                        </select>
                    </div>

                    <div className="filter-section">
                        <p className="muted">Prix Retail (€)</p>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={minPrice} 
                                onChange={(e) => setMinPrice(e.target.value)} 
                                style={{ width: "100%", padding: "5px" }}
                            />
                            <input 
                                type="number" 
                                placeholder="Max" 
                                value={maxPrice} 
                                onChange={(e) => setMaxPrice(e.target.value)} 
                                style={{ width: "100%", padding: "5px" }}
                            />
                        </div>
                    </div>

                    <div className="filter-section">
                        <p className="muted">Diamètre (mm)</p>
                        <input 
                            type="number" 
                            placeholder="Ex: 40" 
                            value={diameter} 
                            onChange={(e) => setDiameter(e.target.value)} 
                            style={{ width: "100%", padding: "5px" }}
                        />
                    </div>

                    <div className="filter-section">
                        <p className="muted">Mouvement</p>
                        <div className="chips-row">
                            {availableMovements.map((mvmt) => (
                                <button
                                    key={mvmt}
                                    type="button"
                                    className={`filter-chip ${activeMovements.includes(mvmt) ? "active" : ""}`}
                                    onClick={() => toggleMovement(mvmt)}
                                >
                                    {mvmt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-ghost"
                    >
                        Réinitialiser
                    </button>

                    <Link className="btn cta-collection-login">
                        Connexion
                    </Link>
                </aside>

                <section>
                    <div className="section-title-row">
                        <h1>Collection</h1>
                        <p className="muted">X modèle(s)</p>
                    </div>
                    <div className="cards-grid">
                        {filteredWatches.map((watch) => (
                            <article className="watch-card" key={watch.watchId}>
                                <Link className="image-link">
                                    <div className="collection-media-box">
                                        <WatchImage watch="" />
                                    </div>
                                </Link>
                                <div className="watch-meta">
                                    <p className="muted small">/</p>
                                    <h3>/</h3>
                                    <p>/</p>
                                </div>
                                <div className="watch-actions">
                                    <Link className="btn">
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

    function toggleCategory(category) {
        setActiveCategories((prev) =>
            prev.includes(category)
                ? prev.filter((item) => item !== category)
                : [...prev, category]
        );
    }

    function toggleMaterial(material) {
        setActiveMaterials((prev) =>
            prev.includes(material)
                ? prev.filter((item) => item !== material)
                : [...prev, material]
        );
    }
    return (
        <div className="page-root">
            <SiteHeader />

            <main className="container collection-layout">
                <aside className="filters-card">
                    <h2>Recherche de produit</h2>

                    <div className="filter-section">
                        <p className="muted">Marque</p>
                        <div className="chips-row">
                            {availableBrands.map((brand) => (
                                <button
                                    key={brand}
                                    type="button"
                                    className={`filter-chip ${activeBrands.includes(brand) ? "active" : ""}`}
                                    onClick={() => toggleBrand(brand)}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <p className="muted">Matière</p>
                        <div className="chips-row">
                            {availableMaterials.map((material) => (
                                <button
                                    key={material}
                                    type="button"
                                    className={`filter-chip ${activeMaterials.includes(material) ? "active" : ""}`}
                                    onClick={() => toggleMaterial(material)}
                                >
                                    {material}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={resetFilters}
                    >
                        Réinitialiser
                    </button>

                    <Link className="btn cta-collection-login" to="/connexion">
                        Connexion
                    </Link>
                </aside>

                <section>
                    <div className="section-title-row">
                        <h1>Collection</h1>
                        <p className="muted">{filteredWatches.length} modèle(s)</p>
                    </div>
                    <div className="cards-grid">
                        {filteredWatches.map((watch) => (
                            <article className="watch-card" key={watch.watchId}>
                                <Link to={`/montre/${watch.watchId}`} className="image-link">
                                    <div className="collection-media-box">
                                        <WatchImage watch={watch} />
                                    </div>
                                </Link>
                                <div className="watch-meta">
                                    <p className="muted small">{watch.brand || "/"}</p>
                                    <h3>{watch.model}</h3>
                                    <p>{formatPrice(watch.retailPrice)}</p>
                                </div>
                                <div className="watch-actions">
                                    <Link className="btn" to={`/montre/${watch.watchId}`}>
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

