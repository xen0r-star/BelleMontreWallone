import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { formatPrice } from "../data/watches";
import { fetchWatches, fetchWatchFilters } from "../hooks/fetchAPI";

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
    const [pagination, setPagination] = useState({ page: 1, perPage: 20, total: 0, totalPages: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState({ brand: [], materials: [], movement: [], diameter: [] });

    const [activeBrand, setActiveBrand] = useState(null);
    const [activeMaterial, setActiveMaterial] = useState(null);
    const [activeMovement, setActiveMovement] = useState(null);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [diameter, setDiameter] = useState("");
    const [draftMinPrice, setDraftMinPrice] = useState("");
    const [draftMaxPrice, setDraftMaxPrice] = useState("");
    const [draftDiameter, setDraftDiameter] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    const [currentPage, setCurrentPage] = useState(1);

    fetchWatchFilters(setFilterOptions);
    fetchWatches(setWatches, setPagination, setIsLoading, currentPage, {
        brand: activeBrand,
        materials: activeMaterial,
        movement: activeMovement,
        diameter,
        minRetailPrice: minPrice,
        maxRetailPrice: maxPrice,
    });

    const sortedWatches = useMemo(() => {
        const sorted = [...watches];
        if (sortBy === "priceAsc") sorted.sort((a, b) => a.retailPrice - b.retailPrice);
        if (sortBy === "priceDesc") sorted.sort((a, b) => b.retailPrice - a.retailPrice);
        if (sortBy === "nameAsc") sorted.sort((a, b) => a.model.localeCompare(b.model, "fr"));
        return sorted;
    }, [watches, sortBy]);

    function selectBrand(brand) {
        setActiveBrand(prev => prev === brand ? null : brand);
        setCurrentPage(1);
    }

    function selectMaterial(material) {
        setActiveMaterial(prev => prev === material ? null : material);
        setCurrentPage(1);
    }

    function selectMovement(movement) {
        setActiveMovement(prev => prev === movement ? null : movement);
        setCurrentPage(1);
    }

    function applyPriceFilters() {
        setMinPrice(draftMinPrice);
        setMaxPrice(draftMaxPrice);
        setDiameter(draftDiameter);
        setCurrentPage(1);
    }

    function resetFilters() {
        setActiveBrand(null);
        setActiveMaterial(null);
        setActiveMovement(null);
        setMinPrice("");
        setMaxPrice("");
        setDiameter("");
        setDraftMinPrice("");
        setDraftMaxPrice("");
        setDraftDiameter("");
        setSortBy("featured");
        setCurrentPage(1);
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
                            {filterOptions.brand.map((brand) => (
                                <button
                                    key={brand}
                                    type="button"
                                    className={`cursor-pointer border px-2 py-1 text-xs uppercase tracking-[0.07em] ${activeBrand === brand ? "border-[#141823] bg-[#141823] text-[#faf8f5]" : "border-[#ddd6cc] bg-white text-[#1c1d21]"}`}
                                    onClick={() => selectBrand(brand)}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-[#ddd6cc] pt-3">
                        <p className="text-[#8c8d8e]">Matière</p>
                        <div className="flex flex-wrap gap-2">
                            {filterOptions.materials.map((material) => (
                                <button
                                    key={material}
                                    type="button"
                                    className={`cursor-pointer border px-2 py-1 text-xs uppercase tracking-[0.07em] ${activeMaterial === material ? "border-[#141823] bg-[#141823] text-[#faf8f5]" : "border-[#ddd6cc] bg-white text-[#1c1d21]"}`}
                                    onClick={() => selectMaterial(material)}
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
                                value={draftMinPrice}
                                onChange={(e) => setDraftMinPrice(e.target.value)}
                                className="w-full border border-[#ddd6cc] bg-white px-2 py-1"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={draftMaxPrice}
                                onChange={(e) => setDraftMaxPrice(e.target.value)}
                                className="w-full border border-[#ddd6cc] bg-white px-2 py-1"
                            />
                        </div>
                    </div>
                    <div className="border-t border-[#ddd6cc] pt-3">
                        <p className="text-[#8c8d8e]">Diamètre (mm)</p>
                        <input
                            type="number"
                            placeholder="Ex: 40"
                            value={draftDiameter}
                            onChange={(e) => setDraftDiameter(e.target.value)}
                            className="w-full border border-[#ddd6cc] bg-white px-2 py-1"
                        />
                    </div>
                    <div className="border-t border-[#ddd6cc] pt-3">
                        <p className="text-[#8c8d8e]">Mouvement</p>
                        <div className="flex flex-wrap gap-2">
                            {filterOptions.movement.map((mvmt) => (
                                <button
                                    key={mvmt}
                                    type="button"
                                    className={`cursor-pointer border px-2 py-1 text-xs uppercase tracking-[0.07em] ${activeMovement === mvmt ? "border-[#141823] bg-[#141823] text-[#faf8f5]" : "border-[#ddd6cc] bg-white text-[#1c1d21]"}`}
                                    onClick={() => selectMovement(mvmt)}
                                >
                                    {mvmt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="inline-flex w-fit cursor-pointer border border-[#141823] bg-transparent px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#1c1d21] hover:bg-black hover:text-[#faf8f5]"
                            onClick={resetFilters}
                        >
                            Réinitialiser
                        </button>
                        <button
                            type="button"
                            className="inline-flex flex-1 items-center justify-center cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black"
                            onClick={applyPriceFilters}
                        >
                            Valider
                        </button>
                    </div>
                </aside>
                <section>
                    <div className="mb-4 flex items-baseline justify-between gap-3 max-[700px]:flex-col max-[700px]:items-start">
                        <h1>Collection</h1>
                        <p className="text-[#8c8d8e]">{pagination.total} modèle(s)</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 max-[1024px]:grid-cols-2 max-[700px]:grid-cols-1">
                        {sortedWatches.map((watch) => (
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
                    {pagination.totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="cursor-pointer border border-[#141823] bg-transparent px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#1c1d21] hover:bg-[#141823] hover:text-[#faf8f5] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Précédent
                            </button>
                            <span className="text-sm text-[#8c8d8e]">{currentPage} / {pagination.totalPages}</span>
                            <button
                                type="button"
                                disabled={currentPage >= pagination.totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="cursor-pointer border border-[#141823] bg-transparent px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#1c1d21] hover:bg-[#141823] hover:text-[#faf8f5] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Suivant
                            </button>
                        </div>
                    )}
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
