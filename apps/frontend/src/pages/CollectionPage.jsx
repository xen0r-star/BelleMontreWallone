import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { formatPrice, watches } from "../data/watches";

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
    return <ImageWithFallback src={watch.images?.[0]} alt={watch.model} />;
}

export default function CollectionPage() {
    const [activeCategories, setActiveCategories] = useState([]);
    const [activeMaterials, setActiveMaterials] = useState([]);
    const [sortBy, setSortBy] = useState("featured");

    const filteredWatches = useMemo(() => {
        const filtered = watches.filter((watch) => {
            const categoryOk =
                activeCategories.length === 0 || activeCategories.includes(watch.category);
            const materialOk =
                activeMaterials.length === 0 || activeMaterials.includes(watch.material);

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
    }, [activeCategories, activeMaterials, sortBy]);

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
                    <h2>Filtres & Tri</h2>

                    <div className="filter-section">
                        <p className="muted">Trier</p>
                        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                            <option value="featured">Selection maison</option>
                            <option value="priceAsc">Prix croissant</option>
                            <option value="priceDesc">Prix decroissant</option>
                            <option value="nameAsc">Nom A-Z</option>
                        </select>
                    </div>

                    <div className="filter-section">
                        <p className="muted">Categorie</p>
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
                        <p className="muted">Matiere</p>
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
                        Reinitialiser
                    </button>

                    <Link className="btn cta-collection-login" to="/connexion">
                        Connexion
                    </Link>
                </aside>

                <section>
                    <div className="section-title-row">
                        <h1>Collection</h1>
                        <p className="muted">{filteredWatches.length} modele(s)</p>
                    </div>
                    <div className="cards-grid">
                        {filteredWatches.map((watch) => (
                            <article className="watch-card" key={watch.id}>
                                <Link to={`/montre/${watch.id}`} className="image-link">
                                    <div className="collection-media-box">
                                        <WatchImage watch={watch} />
                                    </div>
                                </Link>
                                <div className="watch-meta">
                                    <p className="muted small">{watch.brand}</p>
                                    <h3>{watch.model}</h3>
                                    <p>{formatPrice(watch.price)}</p>
                                </div>
                                <div className="watch-actions">
                                    <Link className="btn" to={`/montre/${watch.id}`}>
                                        Voir le detail
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
