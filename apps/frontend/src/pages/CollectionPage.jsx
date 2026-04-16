import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { formatPrice } from "../data/watches";
import { fetchWatches } from "../hooks/fetchAPI";

function NoImagePlaceholder() {
    return (
        <div className="grid h-full w-full place-content-center justify-items-center gap-1 border border-dashed border-[#ddd6cc] bg-[#f8f6f2] text-[#8c8d8e]" aria-label="Image indisponible">
            <span className="material-symbols-outlined text-[2rem]">image_not_supported</span>
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
        <div className="relative h-full w-full">
            {!isLoaded && <div className="absolute inset-0 animate-pulse bg-linear-to-r from-[#ece7df] via-[#f7f4ef] to-[#ece7df]" aria-hidden="true" />}
            <img
                src={imageSrc}
                alt={alt}
                className="block h-full w-full object-contain"
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

    const [activeBrands, setActiveBrands] = useState([]);
    const [activeMaterials, setActiveMaterials] = useState([]);
    const [activeMovements, setActiveMovements] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [diameter, setDiameter] = useState("");
    const [sortBy, setSortBy] = useState("featured");

    fetchWatches(setWatches, setIsLoading);

    const availableBrands = useMemo(() => {
        const brands = watches.map(w => w.brand).filter(Boolean);
        return [...new Set(brands)].sort();
    }, [watches]);

    const availableMaterials = useMemo(() => {
        const mats = watches.map(w => w.materials).filter(Boolean);
        return [...new Set(mats)].sort();
    }, [watches]);

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

            const minPriceOk = minPrice === "" || (watch.retailPrice && watch.retailPrice >= Number(minPrice));
            const maxPriceOk = maxPrice === "" || (watch.retailPrice && watch.retailPrice <= Number(maxPrice));
            
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
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="mx-auto my-8 grid w-[min(1440px,calc(100%-5rem))] grid-cols-[260px_1fr] items-start gap-6 max-[1024px]:grid-cols-1 max-[700px]:w-[calc(100%-1.5rem)]">
                    <p>Chargement des montres...</p>
                </main>
                <SiteFooter />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="mx-auto my-8 grid w-[min(1440px,calc(100%-5rem))] grid-cols-[260px_1fr] items-start gap-6 max-[1024px]:grid-cols-1 max-[700px]:w-[calc(100%-1.5rem)]">
                <aside className="sticky top-32 grid max-h-[calc(100vh-9rem)] w-full gap-4 overflow-y-auto border border-[#ddd6cc] bg-[color-mix(in_srgb,white_85%,#faf8f5)] p-4 max-[1024px]:static max-[1024px]:max-h-none">
                    <h2>Recherche de produit</h2>
                    <div className="border-t border-[#ddd6cc] pt-3">
                        <p className="text-[#8c8d8e]">Marque</p>
                        <div className="flex flex-wrap gap-2">
                            {availableBrands.map((brand) => (
                                <button
                                    key={brand}
                                    type="button"
                                    className={`cursor-pointer border px-2 py-1 text-xs uppercase tracking-[0.07em] ${activeBrands.includes(brand) ? "border-[#141823] bg-[#141823] text-[#faf8f5]" : "border-[#ddd6cc] bg-white text-[#1c1d21]"}`}
                                    onClick={() => toggleBrand(brand)}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-[#ddd6cc] pt-3">
                        <p className="text-[#8c8d8e]">Matière</p>
                        <div className="flex flex-wrap gap-2">
                            {availableMaterials.map((material) => (
                                <button
                                    key={material}
                                    type="button"
                                    className={`cursor-pointer border px-2 py-1 text-xs uppercase tracking-[0.07em] ${activeMaterials.includes(material) ? "border-[#141823] bg-[#141823] text-[#faf8f5]" : "border-[#ddd6cc] bg-white text-[#1c1d21]"}`}
                                    onClick={() => toggleMaterial(material)}
                                >
                                    {material}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-[#ddd6cc] pt-3">
                        <p className="text-[#8c8d8e]">Trier</p>
                        <select className="w-full border border-[#ddd6cc] bg-white px-3 py-2 text-[#1c1d21]" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="featured">Sélection maison</option>
                            <option value="priceAsc">Prix croissant</option>
                            <option value="priceDesc">Prix décroissant</option>
                            <option value="nameAsc">Nom A-Z</option>
                        </select>
                    </div>
                    <div className="border-t border-[#ddd6cc] pt-3">
                        <p className="text-[#8c8d8e]">Prix Retail (€)</p>
                        <div className="flex gap-2.5">
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={minPrice} 
                                onChange={(e) => setMinPrice(e.target.value)} 
                                className="w-full border border-[#ddd6cc] bg-white px-2 py-1"
                            />
                            <input 
                                type="number" 
                                placeholder="Max" 
                                value={maxPrice} 
                                onChange={(e) => setMaxPrice(e.target.value)} 
                                className="w-full border border-[#ddd6cc] bg-white px-2 py-1"
                            />
                        </div>
                    </div>
                    <div className="border-t border-[#ddd6cc] pt-3">
                        <p className="text-[#8c8d8e]">Diamètre (mm)</p>
                        <input 
                            type="number" 
                            placeholder="Ex: 40" 
                            value={diameter} 
                            onChange={(e) => setDiameter(e.target.value)} 
                            className="w-full border border-[#ddd6cc] bg-white px-2 py-1"
                        />
                    </div>
                    <div className="border-t border-[#ddd6cc] pt-3">
                        <p className="text-[#8c8d8e]">Mouvement</p>
                        <div className="flex flex-wrap gap-2">
                            {availableMovements.map((mvmt) => (
                                <button
                                    key={mvmt}
                                    type="button"
                                    className={`cursor-pointer border px-2 py-1 text-xs uppercase tracking-[0.07em] ${activeMovements.includes(mvmt) ? "border-[#141823] bg-[#141823] text-[#faf8f5]" : "border-[#ddd6cc] bg-white text-[#1c1d21]"}`}
                                    onClick={() => toggleMovement(mvmt)}
                                >
                                    {mvmt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="inline-flex w-fit cursor-pointer border border-[#141823] bg-transparent px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#1c1d21] hover:bg-black hover:text-[#faf8f5]"
                        onClick={resetFilters}
                    >
                        Réinitialiser
                    </button>
                    <Link className="inline-flex w-full items-center justify-center border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black" to="/connexion">
                        Connexion
                    </Link>
                </aside>
                <section>
                    <div className="mb-4 flex items-baseline justify-between gap-3 max-[700px]:flex-col max-[700px]:items-start">
                        <h1>Collection</h1>
                        <p className="text-[#8c8d8e]">{filteredWatches.length} modèle(s)</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 max-[1024px]:grid-cols-2 max-[700px]:grid-cols-1">
                        {filteredWatches.map((watch) => (
                            <article className="grid grid-rows-[auto_1fr_auto] gap-3 border border-[#ddd6cc] bg-white p-3" key={watch.watchId}>
                                <Link to={`/montre/${watch.watchId}`} className="block">
                                    <div className="h-65 w-full overflow-hidden border border-[#ddd6cc] bg-[#f4f3f1] max-[700px]:h-57.5">
                                        <WatchImage watch={watch} />
                                    </div>
                                </Link>
                                <div>
                                    <p className="text-[0.83rem] text-[#8c8d8e]">{watch.brand || "/"}</p>
                                    <h3 className="my-1 font-serif">{watch.model}</h3>
                                    <p>{formatPrice(watch.retailPrice)}</p>
                                </div>
                                <div>
                                    <Link className="inline-flex w-fit cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black" to={`/montre/${watch.watchId}`}>
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

