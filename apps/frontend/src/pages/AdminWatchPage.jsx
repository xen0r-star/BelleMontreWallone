import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { fetchWatches, toggleWatchActif } from "../hooks/fetchAPI";

const emptyForm = {
    brand: "",
    model: "",
    watchDesc: "",
    watchCollection: "",
    imageUrl: "",
    retailPrice: "",
    marketPrice: "",
    isInProduction: false,
    movement: "",
    diameter: "",
    materials: "",
    watertightness: "",
    isActif: false
};

const MOVEMENT_OPTIONS = ["automatique", "mecanique", "quartz"];
const inputClass = "w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]";
const btnPrimaryClass = "inline-flex w-fit cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black";
const btnGhostClass = "inline-flex w-fit cursor-pointer border border-[#141823] bg-transparent px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#1c1d21] hover:bg-black hover:text-[#faf8f5]";

export default function AdminWatchPage() {
    const [showBuilder, setShowBuilder] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [watches, setWatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [toast, setToast] = useState("");
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    fetchWatches(setWatches, () => {}, setIsLoading, 1, {});
    if (!watches || watches.length === 0 || isLoading) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader isAdmin />
                <main className="mx-auto my-8 grid w-[min(1380px,calc(100%-5rem))] gap-4 justify-items-center max-[700px]:w-[calc(100%-1.5rem)]">
                    <section className="w-full max-w-310">
                        <h1>Panel Admin</h1>
                            <p className="text-[#8c8d8e]">
                                Gestion des montres.
                            </p>

                            <article
                                className="mt-4 grid cursor-pointer justify-items-center gap-3 rounded-[20px] border-2 border-dashed border-[color-mix(in_srgb,#0f4b22_35%,white)] bg-[color-mix(in_srgb,#0f4b22_5%,white)] p-6"
                                role="button"
                                tabIndex={0}
                            >
                                <span className="grid h-15.5 w-15.5 place-content-center rounded-full bg-[color-mix(in_srgb,#0f4b22_20%,white)] text-[2.2rem] text-[#0f4b22]">+</span>
                                <h2>Nouvelle montre</h2>
                                <p>
                                    Cliquez-ici pour ajouter une montre avec ses informations et son
                                    image.
                                </p>
                            </article>

                            <section className="mt-5">
                                <div className="mb-4 flex items-baseline justify-between gap-3 max-[700px]:flex-col max-[700px]:items-start">
                                    <h2>Montres ajoutées</h2>
                                    <p className="text-[#8c8d8e]">Modification et suppression disponibles</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4 max-[1024px]:grid-cols-1">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <article className="grid grid-rows-[auto_1fr_auto] gap-3 border border-[#ddd6cc] bg-white p-3" key={index}>
                                            <div className="h-65 w-full overflow-hidden border border-[#ddd6cc] bg-[#f4f3f1]">
                                                <ImageWithFallback
                                                    src="../public/icons/bmw_icon.png"
                                                    alt="/"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="my-1 font-serif">/ - /</h3>
                                                <p className="text-[0.83rem] text-[#8c8d8e]">Description: --</p>
                                                <p className="text-[0.83rem]">Collection: --</p>
                                                <p className="text-[0.83rem]">Prix revente:--</p>
                                                <p className="text-[0.83rem]">Prix neuf: --</p>
                                                <p className="text-[0.83rem]">En production: --</p>
                                                <p className="text-[0.83rem]">Mouvement: --</p>
                                                <p className="text-[0.83rem]">Diamètre: --</p>
                                                <p className="text-[0.83rem]">Matériaux boitier: --</p>
                                                <p className="text-[0.83rem]">Etancheite: --</p>
                                                <p className="text-[0.83rem]">Est actif: --</p>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                <button type="button" className="cursor-pointer border border-[#ddd6cc] bg-white px-2 py-1 text-[0.72rem]">Modifier</button>
                                                <button type="button" className="cursor-pointer border border-[#ddd6cc] bg-white px-2 py-1 text-[0.72rem]">
                                                    Supprimer
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                    </section>
                </main>
                <SiteFooter />
            </div>
        );
    }

    function pushToast(message) {
        setToast(message);
        window.setTimeout(() => {
            setToast("");
        }, 2200);
    }

    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }

    function handleImageChange(event) {
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setForm((prev) => ({ ...prev, imageUrl: String(reader.result || "") }));
        };
        reader.readAsDataURL(file);
    }

    function handleDrop(event) {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith("image/")) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setForm((prev) => ({ ...prev, imageUrl: String(reader.result || "") }));
        };
        reader.readAsDataURL(file);
    }

    function resetBuilder() {
        setForm(emptyForm);
        setEditingId(null);
    }

    function handleSaveWatch(event) {
        event.preventDefault();

        if (!form.brand || !form.model || !form.watchDesc || !form.movement) {
            return;
        }

        if (editingId) {
            setWatches((prev) =>
                prev.map((watch) =>
                    watch.id === editingId ? { ...watch, ...form } : watch
                )
            );
            pushToast("Montre modifiee avec succes.");
        } else {
            setWatches((prev) => [{ id: Date.now(), ...form }, ...prev]);
            pushToast("Montre ajoutee avec succes.");
        }

        setShowBuilder(false);
        resetBuilder();
    }

    async function handleToggleActif(watchId, currentIsActif) {
        const updated = await toggleWatchActif(watchId, currentIsActif ? 0 : 1);
        if (updated) {
            setWatches((prev) => prev.map((w) => w.watchId === watchId ? { ...w, isActif: updated.isActif } : w));
            pushToast(currentIsActif ? "Montre désactivée." : "Montre activée.");
        }
    }

    function handleEdit(id) {
        if (!watches) return;
        const watch = watches.find((item) => item.watchId === id);
        if (!watch) {
            return;
        }

        setShowBuilder(true);
        setEditingId(id);
        setForm({
            brand: watch.brand,
            model: watch.model,
            watchDesc: watch.watchDesc,
            watchCollection: watch.watchCollection,
            imageUrl: watch.imageUrl,
            retailPrice: watch.retailPrice,
            marketPrice: watch.marketPrice,
            isInProduction: Boolean(watch.isInProduction),
            movement: watch.movement,
            diameter: watch.diameter,
            materials: watch.materials,
            watertightness: watch.watertightness,
            isActif: Boolean(watch.isActif)
        });
    }

    function handleDelete(id) {
        setWatches((prev) => prev.filter((item) => item.watchId !== id));
        pushToast("Montre supprimee avec succes.");

        if (editingId === id) {
            setShowBuilder(false);
            resetBuilder();
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader isAdmin />
            <main className="mx-auto my-8 grid w-[min(1380px,calc(100%-5rem))] gap-4 justify-items-center max-[700px]:w-[calc(100%-1.5rem)]">
                <section className="w-full max-w-310">
                    <h1>Panel Admin</h1>
                    <p className="text-[#8c8d8e]">
                        Gestion des montres.
                    </p>

                    {!showBuilder && (
                        <article
                            className="mt-4 grid cursor-pointer justify-items-center gap-3 rounded-[20px] border-2 border-dashed border-[color-mix(in_srgb,#0f4b22_35%,white)] bg-[color-mix(in_srgb,#0f4b22_5%,white)] p-6"
                            role="button"
                            tabIndex={0}
                            onClick={() => setShowBuilder(true)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    setShowBuilder(true);
                                }
                            }}
                        >
                            <span className="grid h-15.5 w-15.5 place-content-center rounded-full bg-[color-mix(in_srgb,#0f4b22_20%,white)] text-[2.2rem] text-[#0f4b22]">+</span>
                            <h2>Nouvelle montre</h2>
                            <p>
                                Cliquez-ici pour ajouter une montre avec ses informations et son
                                image.
                            </p>
                        </article>
                    )}

                    {showBuilder && (
                        <section className="mt-4 border border-[color-mix(in_srgb,#0f4b22_20%,white)] bg-[color-mix(in_srgb,white_90%,#faf8f5)] p-4">
                            <div className="grid grid-cols-2 gap-4 max-[1024px]:grid-cols-1">
                                <article className="sticky top-24 self-start border border-[#ddd6cc] bg-[color-mix(in_srgb,white_85%,#faf8f5)] p-4 max-[1024px]:static">
                                    <h3>Prévisualisation en direct</h3>
                                    <div className="border border-[#ddd6cc] bg-white">
                                        <div className="h-130 w-[min(100%,600px)] overflow-hidden border border-[#ddd6cc] bg-[#f4f3f1]">
                                            <ImageWithFallback
                                                src={form.imageUrl}
                                                alt={`${form.brand || "Marque"} ${form.model || "Modèle"}`}
                                                fallbackText="Aucune image selectionnee"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <h4 className="mb-3 text-[1.3rem] leading-[1.2]">{(form.brand || "Marque") + " - " + (form.model || "Modèle")}</h4>
                                            <p className="my-1 text-[1rem] leading-[1.35] text-[#8c8d8e]">Description: {form.watchDesc || "--"}</p>
                                            <p className="my-1 text-[1rem] leading-[1.35] text-[#8c8d8e]">Collection: {form.watchCollection || "--"}</p>
                                            <p className="my-1 text-[1rem] leading-[1.35]">Prix revente: {(form.retailPrice || "--") + " €"}</p>
                                            <p className="my-1 text-[1rem] leading-[1.35]">Prix neuf: {(form.marketPrice || "--") + " €"}</p>
                                            <p className="my-1 text-[1rem] leading-[1.35]">En production: {form.isInProduction ? "Oui" : "Non"}</p>
                                            <p className="my-1 text-[1rem] leading-[1.35]">Mouvement: {form.movement || ""}</p>
                                            <p className="my-1 text-[1rem] leading-[1.35]">Diamètre: {(form.diameter || "") + " mm"}</p>
                                            <p className="my-1 text-[1rem] leading-[1.35]">Matériaux boitier: {form.materials || "--"}</p>
                                            <p className="my-1 text-[1rem] leading-[1.35]">Catégorie: {form.category || ""}</p>
                                            <p className="my-1 text-[1rem] leading-[1.35]">Etanchéité : {(form.watertightness || "--") + " m"}</p>
                                            <p className="my-1 text-[1rem] leading-[1.35]">Est actif : {form.isActif ? "Oui" : "Non"}</p>
                                        </div>
                                    </div>
                                </article>

                                <article className="border border-[#ddd6cc] bg-white p-4">
                                    <h3>Informations montre</h3>
                                    <form className="grid gap-3" onSubmit={handleSaveWatch}>

                                        <input className={inputClass} name="brand" required value={form.brand} onChange={handleChange} placeholder="Marque" />
                                        <input className={inputClass} name="model" required value={form.model} onChange={handleChange} placeholder="Modèle" />
                                        <input className={inputClass} name="watchDesc" required value={form.watchDesc} onChange={handleChange} placeholder="Description" />
                                        <input className={inputClass} name="watchCollection" value={form.watchCollection} onChange={handleChange} placeholder="Nom collection" />
                                        <input className={inputClass} name="retailPrice" type="double" min="1" value={form.retailPrice} onChange={handleChange} placeholder="Prix revente" />
                                        <input className={inputClass} name="marketPrice" type="double" min="1" value={form.marketPrice} onChange={handleChange} placeholder="Prix neuf" />
                                        <label className="inline-flex w-fit items-center gap-2 text-[0.92rem]">
                                            <input className="m-0 h-4 w-4" name="isInProduction" type="checkbox" checked={Boolean(form.isInProduction)} onChange={handleChange} />
                                            Toujours en production
                                        </label>
                                        <select className={inputClass} name="movement" required value={form.movement} onChange={handleChange}>
                                            <option value="">Choisir un mouvement</option>
                                            {MOVEMENT_OPTIONS.map((movementOption) => (
                                                <option key={movementOption} value={movementOption}>
                                                    {movementOption.charAt(0).toUpperCase() + movementOption.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <input className={inputClass} name="diameter" type="number" min="1" step="0.1" value={form.diameter} onChange={handleChange} placeholder="Diametre (mm)" />
                                        <input className={inputClass} name="materials" value={form.materials} onChange={handleChange} placeholder="Materiaux boitier" />
                                        <input className={inputClass} name="watertightness" value={form.watertightness} onChange={handleChange} placeholder="Etanchéité" />
                                        <label className="inline-flex w-fit items-center gap-2 text-[0.92rem]">
                                            <input className="m-0 h-4 w-4" name="isActif" type="checkbox" checked={Boolean(form.isActif)} onChange={handleChange} />
                                            Montre active
                                        </label>

                                        <label
                                            className="cursor-pointer border-2 border-dashed border-[color-mix(in_srgb,#0f4b22_28%,white)] bg-[color-mix(in_srgb,#faf8f5_92%,white)] p-4 text-center"
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={handleDrop}
                                        >
                                            <span>Glisser/déposer une image ou cliquer</span>
                                            <input className="hidden" type="file" accept="image/*" onChange={handleImageChange} />
                                        </label>

                                        <div className="flex flex-wrap gap-2">
                                            <button className={btnPrimaryClass} type="submit">
                                                {editingId ? "Mettre a jour la montre" : "Ajouter la montre"}
                                            </button>
                                            <button
                                                className={btnGhostClass}
                                                type="button"
                                                onClick={() => {
                                                    setShowBuilder(false);
                                                    resetBuilder();
                                                }}
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </form>
                                </article>
                            </div>
                        </section>
                    )}

                    <section className="mt-5">
                        <div className="mb-4 flex items-baseline justify-between gap-3 max-[700px]:flex-col max-[700px]:items-start">
                            <h2>Montres ajoutées</h2>
                            <p className="text-[#8c8d8e]">Modification et suppression disponibles</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 max-[1024px]:grid-cols-1">
                            {watches.length === 0 && (
                                <div className="border border-dashed border-[#ddd6cc] p-4 text-[#8c8d8e]">Aucune montre ajoutee pour le moment.</div>
                            )}

                            {watches.map((watch) => (
                                <article className="grid grid-rows-[auto_1fr_auto] gap-3 border border-[#ddd6cc] bg-white p-3" key={watch.watchId}>
                                    <div className="relative">
                                        <div className="h-65 w-full overflow-hidden border border-[#ddd6cc] bg-[#f4f3f1]">
                                            <ImageWithFallback
                                                src={watch.imageUrl}
                                                alt={`${watch.brand} ${watch.model}`}
                                            />
                                        </div>
                                        <span className={`absolute top-2 left-2 px-2 py-0.5 text-[0.68rem] uppercase tracking-[0.06em] font-medium ${watch.isActif ? "bg-[#d1fae5] text-[#065f46] border border-[#6ee7b7]" : "bg-[#ffe4e6] text-[#9f1239] border border-[#fda4af]"}`}>
                                            {watch.isActif ? "Actif" : "Inactif"}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="my-1 font-serif">{watch.brand} - {watch.model}</h3>
                                        <p className="text-[0.83rem] text-[#8c8d8e]">Description: {watch.watchDesc || "--"}</p>
                                        <p className="text-[0.83rem]">Collection: {watch.watchCollection || "--"}</p>
                                        <p className="text-[0.83rem]">Prix revente: {(watch.retailPrice || "--") + " €"}</p>
                                        <p className="text-[0.83rem]">Prix neuf: {(watch.marketPrice || "--") + " €"}</p>
                                        <p className="text-[0.83rem]">En production: {watch.isInProduction ? "Oui" : "Non"}</p>
                                        <p className="text-[0.83rem]">Mouvement: {watch.movement || "--"}</p>
                                        <p className="text-[0.83rem]">Diamètre: {(watch.diameter || "--") + " mm"}</p>
                                        <p className="text-[0.83rem]">Matériaux boitier: {watch.materials || "--"}</p>
                                        <p className="text-[0.83rem]">Etancheite: {(watch.watertightness || "--") + " m"}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        <button className="cursor-pointer border border-[#ddd6cc] bg-white px-2 py-1 text-[0.72rem]" type="button" onClick={() => handleEdit(watch.watchId)}>Modifier</button>
                                        <button
                                            className={`cursor-pointer border px-2 py-1 text-[0.72rem] ${watch.isActif ? "border-[#fda4af] bg-[#ffe4e6] text-[#9f1239]" : "border-[#6ee7b7] bg-[#d1fae5] text-[#065f46]"}`}
                                            type="button"
                                            onClick={() => handleToggleActif(watch.watchId, watch.isActif)}
                                        >
                                            {watch.isActif ? "Désactiver" : "Activer"}
                                        </button>
                                        <button className="cursor-pointer border border-[#ddd6cc] bg-white px-2 py-1 text-[0.72rem]" type="button" onClick={() => setPendingDeleteId(watch.watchId)}>
                                            Supprimer
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </section>

            </main>

            {pendingDeleteId && (
                <div className="fixed inset-0 z-99 grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true">
                    <div className="w-full max-w-130 border border-[#ddd6cc] bg-white p-5">
                        <h3>Confirmer la suppression</h3>
                        <p className="text-[#8c8d8e]">
                            Cette action supprimera definitivement la montre selectionnee.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                className={btnPrimaryClass}
                                onClick={() => {
                                    handleDelete(pendingDeleteId);
                                    setPendingDeleteId(null);
                                }}
                            >
                                Oui, supprimer
                            </button>
                            <button
                                type="button"
                                className={btnGhostClass}
                                onClick={() => setPendingDeleteId(null)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <div className="fixed bottom-5 right-5 z-120 border border-[#7ca584] bg-[#edf9ef] px-4 py-3 text-[#275030] shadow-[0_12px_24px_rgba(20,24,35,0.14)]">{toast}</div>}

            <SiteFooter />
        </div>
    );
}

function ImageWithFallback({ src, alt, fallbackText = "Aucune image" }) {
    const [hasError, setHasError] = useState(false);
    const imageSrc = typeof src === "string" ? src.trim() : "";
    useEffect(() => {
        setHasError(false);
    }, [imageSrc]);

    if (!imageSrc || hasError) {
        return <NoImage text={fallbackText} />;
    }

    return (
        <div className="relative h-full w-full">
            <img
                src={imageSrc}
                alt={alt}
                className="block h-full w-full object-contain"
                onError={() => setHasError(true)}
            />
        </div>
    );
}

function NoImage({ text = "Aucune image" }) {
    return (
        <div className="grid h-full w-full place-content-center justify-items-center gap-1 border border-dashed border-[#ddd6cc] bg-[#f8f6f2] text-[#8c8d8e]" aria-label="Aucune image disponible">
            <span className="material-symbols-outlined text-[2rem]" aria-hidden="true">image_not_supported</span>
            <p>{text}</p>
        </div>
    );
}