import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { formatPrice } from "../data/watches";
import { fetchWatches } from "../hooks/fetchAPI";

const categories = ["Chronographe", "Plongee", "Dress", "Complication"];
const materials = ["Acier", "Or Rose", "Titane"];

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

    const [activeCategories, setActiveCategories] = useState([]);
    const [activeMaterials, setActiveMaterials] = useState([]);
    const [sortBy, setSortBy] = useState("featured");

    fetchWatches(setWatches, setIsLoading);
    
    const filteredWatches = useMemo(() => {
        if (!watches || watches.length === 0) return [];

        const filtered = watches.filter((watch) => {
            const categoryOk =
                activeCategories.length === 0 || activeCategories.includes(watch.watchCollection);
            const materialOk =
                activeMaterials.length === 0 || activeMaterials.includes(watch.materials);

            return categoryOk && materialOk;
        });

        const sorted = [...filtered];
        if (sortBy === "priceAsc") {
            sorted.sort((a, b) => a.price - b.price);
        }
        if (sortBy === "priceDesc") {
            sorted.sort((a, b) => b.price - a.price);
        }
        if (sortBy === "nameAsc") {
            sorted.sort((a, b) => a.model.localeCompare(b.model, "fr"));
        }
        return sorted;
    }, [watches, activeCategories, activeMaterials, sortBy]);

    if (isLoading) return (
        <div className="page-root">
            <SiteHeader />

            <main className="container collection-layout">
                <aside className="filters-card">
                    <h2>Recherche de produit</h2>

                    <div className="filter-section">
                        <p className="muted">Trier</p>
                        <select defaultValue="">
                            <option value="featured">Sélection maison</option>
                            <option value="priceAsc">Prix croissant</option>
                            <option value="priceDesc">Prix decroissant</option>
                            <option value="nameAsc">Nom A-Z</option>
                        </select>
                    </div>

                    <div className="filter-section">
                        <p className="muted">Catégorie</p>
                        <div className="chips-row">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    className={`filter-chip ${activeCategories.includes(category) ? "active" : ""}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <p className="muted">Matière</p>
                        <div className="chips-row">
                            {materials.map((material) => (
                                <button
                                    key={material}
                                    type="button"
                                    className={`filter-chip ${activeMaterials.includes(material) ? "active" : ""}`}
                                >
                                    {material}
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
                                        <div className="image-shell">
                                            <img src="../public/icons/bmw_icon.png" alt="/"></img>
                                        </div>
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
                        <p className="muted">Trier</p>
                        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                            <option value="featured">Sélection maison</option>
                            <option value="priceAsc">Prix croissant</option>
                            <option value="priceDesc">Prix decroissant</option>
                            <option value="nameAsc">Nom A-Z</option>
                        </select>
                    </div>

                    <div className="filter-section">
                        <p className="muted">Catégorie</p>
                        <div className="chips-row">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    className={`filter-chip ${activeCategories.includes(category) ? "active" : ""}`}
                                    onClick={() => toggleCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <p className="muted">Matière</p>
                        <div className="chips-row">
                            {materials.map((material) => (
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
                        onClick={() => {
                            setActiveCategories([]);
                            setActiveMaterials([]);
                            setSortBy("featured");
                        }}
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
