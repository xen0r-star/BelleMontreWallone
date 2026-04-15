import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { fetchWatches } from "../hooks/fetchAPI";

const style = {
    page: "min-h-screen bg-[radial-gradient(circle_at_top,#f6efe5_0%,#f0e8db_45%,#ece4d7_100%)] text-[#1c1d21]",
    container: "mx-auto w-full max-w-[1440px] px-6 py-8 lg:py-12",
    pageTitle: "font-['Cormorant_Garamond',serif] text-[2.6rem] leading-none md:text-[4rem]",
    muted: "text-[0.96rem] leading-relaxed text-[#5f6672]",
    loadingGrid: "grid gap-5",
    addWatchCard: "mt-4 grid cursor-pointer justify-items-center gap-4 rounded-[28px] border-2 border-dashed border-[color-mix(in_srgb,var(--admin-green)_35%,#fff)] bg-[color-mix(in_srgb,var(--admin-green)_5%,#fff)] p-6 text-center shadow-[0_18px_50px_rgba(28,29,33,0.05)]",
    plusCircle: "grid h-[62px] w-[62px] place-items-center rounded-full bg-[color-mix(in_srgb,var(--admin-green)_20%,#fff)] text-[2.2rem] text-[var(--admin-green)]",
    section: "mt-6 grid gap-4",
    sectionRow: "flex items-end justify-between gap-4",
    sectionTitle: "font-['Cormorant_Garamond',serif] text-[1.9rem] leading-none",
    sectionMuted: "text-[0.92rem] text-[#5f6672]",
    grid: "grid gap-4 xl:grid-cols-3",
    card: "grid gap-4 rounded-[26px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.92)] p-4 shadow-[0_16px_40px_rgba(28,29,33,0.05)]",
    mediaBox: "h-[260px] w-full overflow-hidden rounded-[18px] border border-[#e1d7c8] bg-[#f4f3f1]",
    imageShell: "relative h-full w-full",
    image: "h-full w-full object-contain",
    noImage: "grid h-full w-full place-content-center justify-items-center gap-2 border border-dashed border-[#ddd6cc] bg-[color-mix(in_srgb,var(--bg)_88%,#fff)] text-[#8c8d8e]",
    noImageIcon: "text-4xl",
    watchMeta: "grid gap-1 px-1",
    watchTitle: "font-['Cormorant_Garamond',serif] text-[1.6rem] leading-none text-[#1c1d21]",
    small: "text-[0.84rem] text-[#5f6672]",
    actionCell: "flex flex-wrap gap-2 pt-1",
    actionButton: "inline-flex items-center justify-center rounded-full border border-[#d8cdbd] bg-white px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-[#1c1d21] transition-colors hover:border-[#1c1d21]",
    actionDanger: "inline-flex items-center justify-center rounded-full border border-[#e1b9b9] bg-[#f8eded] px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-[#8f3737] transition-colors hover:border-[#c77a7a]",
    builder: "mt-4 rounded-[28px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.92)] p-4 shadow-[0_18px_50px_rgba(28,29,33,0.05)]",
    builderGrid: "grid gap-4 lg:grid-cols-2",
    previewCard: "grid gap-4 rounded-[24px] border border-[#e1d7c8] bg-[#fffaf3] p-4",
    previewMediaBox: "h-[520px] w-full overflow-hidden rounded-[18px] border border-[#e1d7c8] bg-[#f4f3f1]",
    formPanel: "grid gap-4 rounded-[24px] border border-[#e1d7c8] bg-white p-4",
    formGrid: "grid gap-3",
    formRow: "grid gap-3 sm:grid-cols-2",
    input: "h-12 rounded-full border border-[#d8cdbd] bg-white px-4 text-[0.95rem] text-[#1c1d21] outline-none transition-colors focus:border-[#1c1d21]",
    select: "h-12 rounded-full border border-[#d8cdbd] bg-white px-4 text-[0.95rem] text-[#1c1d21] outline-none transition-colors focus:border-[#1c1d21]",
    checkbox: "inline-flex items-center gap-2 text-[0.92rem] text-[#5f6672]",
    checkboxInput: "h-4 w-4",
    dropZone: "grid cursor-pointer place-items-center rounded-[22px] border-2 border-dashed border-[color-mix(in_srgb,var(--admin-green)_28%,#fff)] bg-[color-mix(in_srgb,var(--bg)_92%,#fff)] px-4 py-5 text-center text-[0.92rem] text-[#5f6672]",
    builderActions: "flex flex-wrap gap-3",
    primaryButton: "inline-flex items-center justify-center rounded-full border border-[#1c1d21] bg-[#1c1d21] px-5 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#faf5ed] transition-colors duration-200 hover:bg-transparent hover:text-[#1c1d21]",
    secondaryButton: "inline-flex items-center justify-center rounded-full border border-[#d8cdbd] bg-white px-5 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#1c1d21] transition-colors duration-200 hover:border-[#1c1d21]",
    emptyBox: "rounded-[24px] border border-dashed border-[#d8cdbd] bg-white px-5 py-8 text-center text-[#5f6672]",
    modalBackdrop: "fixed inset-0 z-[99] grid place-items-center bg-black/45 p-4",
    modal: "w-full max-w-[520px] rounded-[28px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.98)] p-6 shadow-[0_18px_50px_rgba(28,29,33,0.12)]",
    toast: "fixed bottom-5 right-5 z-[120] rounded-full border border-[#7ca584] bg-[#edf9ef] px-4 py-3 text-[#275030] shadow-[0_12px_24px_rgba(20,24,35,0.14)]",
};

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

export default function AdminWatchPage() {
    const [showBuilder, setShowBuilder] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [watches, setWatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [toast, setToast] = useState("");
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

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

    function getWatchKey(watch) {
        return watch.id ?? watch.watchId;
    }

    if (!watches || watches.length === 0 || isLoading) {
        return (
            <div className={style.page}>
                <SiteHeader isAdmin />
                <main className={style.container}>
                    <section className={style.loadingGrid}>
                        <h1 className={style.pageTitle}>Panel Admin</h1>
                            <p className={style.muted}>
                                Gestion des montres.
                            </p>

                            <article
                                className={style.addWatchCard}
                                role="button"
                                tabIndex={0}
                            >
                                <span className={style.plusCircle}>+</span>
                                <h2>Nouvelle montre</h2>
                                <p>
                                    Cliquez-ici pour ajouter une montre avec ses informations et son
                                    image.
                                </p>
                            </article>

                            <section className={style.section}>
                                <div className={style.sectionRow}>
                                    <h2 className={style.sectionTitle}>Montres ajoutées</h2>
                                    <p className={style.sectionMuted}>Modification et suppression disponibles</p>
                                </div>
                                <div className={style.grid}>
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <article className={style.card} key={index}>
                                            <div className={style.mediaBox}>
                                                <ImageWithFallback
                                                    src="../public/icons/bmw_icon.png"
                                                    alt="/"
                                                />
                                            </div>
                                            <div className={style.watchMeta}>
                                                <h3 className={style.watchTitle}>/ - /</h3>
                                                <p className={style.small}>Description: --</p>
                                                <p className={style.small}>Collection: --</p>
                                                <p className={style.small}>Prix revente:--</p>
                                                <p className={style.small}>Prix neuf: --</p>
                                                <p className={style.small}>En production: --</p>
                                                <p className={style.small}>Mouvement: --</p>
                                                <p className={style.small}>Diamètre: --</p>
                                                <p className={style.small}>Matériaux boitier: --</p>
                                                <p className={style.small}>Etancheite: --</p>
                                                <p className={style.small}>Est actif: --</p>
                                            </div>
                                            <div className={style.actionCell}>
                                                <button type="button" >Modifier</button>
                                                <button type="button" >
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
                    String(getWatchKey(watch)) === String(editingId) ? { ...watch, ...form } : watch
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

    function handleEdit(id) {
        if (!watches) return;
        const watch = watches.find((item) => String(getWatchKey(item)) === String(id));
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
        setWatches((prev) => prev.filter((item) => String(getWatchKey(item)) !== String(id)));
        pushToast("Montre supprimee avec succes.");

        if (editingId === id) {
            setShowBuilder(false);
            resetBuilder();
        }
    }

    return (
        <div className={style.page}>
            <SiteHeader isAdmin />
            <main className={style.container}>
                <section>
                    <h1 className={style.pageTitle}>Panel Admin</h1>
                    <p className={style.muted}>
                        Gestion des montres.
                    </p>

                    {!showBuilder && (
                        <article
                            className={style.addWatchCard}
                            role="button"
                            tabIndex={0}
                            onClick={() => setShowBuilder(true)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    setShowBuilder(true);
                                }
                            }}
                        >
                            <span className={style.plusCircle}>+</span>
                            <h2>Nouvelle montre</h2>
                            <p>
                                Cliquez-ici pour ajouter une montre avec ses informations et son
                                image.
                            </p>
                        </article>
                    )}

                    {showBuilder && (
                        <section className={style.builder}>
                            <div className={style.builderGrid}>
                                <article className={style.previewCard}>
                                    <h3 className={style.sectionTitle}>Prévisualisation en direct</h3>
                                    <div className={style.card}>
                                        <div className={style.previewMediaBox}>
                                            <ImageWithFallback
                                                src={form.imageUrl}
                                                alt={`${form.brand || "Marque"} ${form.model || "Modèle"}`}
                                                fallbackText="Aucune image selectionnee"
                                            />
                                        </div>
                                        <div className={style.watchMeta}>
                                            <h4 className={style.watchTitle}>{(form.brand || "Marque") + " - " + (form.model || "Modèle")}</h4>
                                            <p className={style.small}>Description: {form.watchDesc || "--"}</p>
                                            <p className={style.small}>Collection: {form.watchCollection || "--"}</p>
                                            <p className={style.small}>Prix revente: {(form.retailPrice || "--") + " €"}</p>
                                            <p className={style.small}>Prix neuf: {(form.marketPrice || "--") + " €"}</p>
                                            <p className={style.small}>En production: {form.isInProduction ? "Oui" : "Non"}</p>
                                            <p className={style.small}>Mouvement: {form.movement || ""}</p>
                                            <p className={style.small}>Diamètre: {(form.diameter || "") + " mm"}</p>
                                            <p className={style.small}>Matériaux boitier: {form.materials || "--"}</p>
                                            <p className={style.small}>Catégorie: {form.category || ""}</p>
                                            <p className={style.small}>Etanchéité : {(form.watertightness || "--") + " m"}</p>
                                            <p className={style.small}>Est actif : {form.isActif ? "Oui" : "Non"}</p>
                                        </div>
                                    </div>
                                </article>

                                <article className={style.formPanel}>
                                    <h3 className={style.sectionTitle}>Informations montre</h3>
                                    <form className={style.formGrid} onSubmit={handleSaveWatch}>

                                        <input className={style.input} name="brand" required value={form.brand} onChange={handleChange} placeholder="Marque" />
                                        <input className={style.input} name="model" required value={form.model} onChange={handleChange} placeholder="Modèle" />
                                        <input className={style.input} name="watchDesc" required value={form.watchDesc} onChange={handleChange} placeholder="Description" />
                                        <input className={style.input} name="watchCollection" value={form.watchCollection} onChange={handleChange} placeholder="Nom collection" />
                                        <input className={style.input} name="retailPrice" type="double" min="1" value={form.retailPrice} onChange={handleChange} placeholder="Prix revente" />
                                        <input className={style.input} name="marketPrice" type="double" min="1" value={form.marketPrice} onChange={handleChange} placeholder="Prix neuf" />
                                        <label className={style.checkbox}>
                                            <input className={style.checkboxInput} name="isInProduction" type="checkbox" checked={Boolean(form.isInProduction)} onChange={handleChange} />
                                            Toujours en production
                                        </label>
                                        <select className={style.select} name="movement" required value={form.movement} onChange={handleChange}>
                                            <option value="">Choisir un mouvement</option>
                                            {MOVEMENT_OPTIONS.map((movementOption) => (
                                                <option key={movementOption} value={movementOption}>
                                                    {movementOption.charAt(0).toUpperCase() + movementOption.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <input className={style.input} name="diameter" type="number" min="1" step="0.1" value={form.diameter} onChange={handleChange} placeholder="Diametre (mm)" />
                                        <input className={style.input} name="materials" value={form.materials} onChange={handleChange} placeholder="Materiaux boitier" />
                                        <input className={style.input} name="watertightness" value={form.watertightness} onChange={handleChange} placeholder="Etanchéité" />
                                        <label className={style.checkbox}>
                                            <input className={style.checkboxInput} name="isActif" type="checkbox" checked={Boolean(form.isActif)} onChange={handleChange} />
                                            Montre active
                                        </label>

                                        <label
                                            className={style.dropZone}
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={handleDrop}
                                        >
                                            <span>Glisser/déposer une image ou cliquer</span>
                                            <input type="file" accept="image/*" onChange={handleImageChange} />
                                        </label>

                                        <div className={style.builderActions}>
                                            <button className={style.primaryButton} type="submit">
                                                {editingId ? "Mettre a jour la montre" : "Ajouter la montre"}
                                            </button>
                                            <button
                                                className={style.secondaryButton}
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

                    <section className={style.section}>
                        <div className={style.sectionRow}>
                            <h2 className={style.sectionTitle}>Montres ajoutées</h2>
                            <p className={style.sectionMuted}>Modification et suppression disponibles</p>
                        </div>

                        <div className={style.grid}>
                            {watches.length === 0 && (
                                <div className={style.emptyBox}>Aucune montre ajoutee pour le moment.</div>
                            )}

                            {watches.map((watch) => (
                                <article className={style.card} key={getWatchKey(watch)}>
                                    <div className={style.mediaBox}>
                                        <ImageWithFallback
                                            src={watch.imageUrl}
                                            alt={`${watch.brand} ${watch.model}`}
                                        />
                                    </div>
                                    <div className={style.watchMeta}>
                                        <h3 className={style.watchTitle}>{watch.brand} - {watch.model}</h3>
                                        <p className={style.small}>Description: {watch.watchDesc || "--"}</p>
                                        <p className={style.small}>Collection: {watch.watchCollection || "--"}</p>
                                        <p className={style.small}>Prix revente: {(watch.retailPrice || "--") + " €"}</p>
                                        <p className={style.small}>Prix neuf: {(watch.marketPrice || "--") + " €"}</p>
                                        <p className={style.small}>En production: {watch.isInProduction ? "Oui" : "Non"}</p>
                                        <p className={style.small}>Mouvement: {watch.movement || "--"}</p>
                                        <p className={style.small}>Diamètre: {(watch.diameter || "--") + " mm"}</p>
                                        <p className={style.small}>Matériaux boitier: {watch.materials || "--"}</p>
                                        <p className={style.small}>Etancheite: {(watch.watertightness || "--") + " m"}</p>
                                        <p className={style.small}>Est actif: {watch.isActif ? "Oui" : "Non"}</p>
                                    </div>
                                    <div className={style.actionCell}>
                                        <button className={style.actionButton} type="button" onClick={() => handleEdit(watch.id)}>Modifier</button>
                                        <button className={style.actionDanger} type="button" onClick={() => setPendingDeleteId(watch.id)}>
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
                <div className={style.modalBackdrop} role="dialog" aria-modal="true">
                    <div className={style.modal}>
                        <h3>Confirmer la suppression</h3>
                        <p className={style.muted}>
                            Cette action supprimera definitivement la montre selectionnee.
                        </p>
                        <div className={style.builderActions}>
                            <button
                                type="button"
                                className={style.primaryButton}
                                onClick={() => {
                                    handleDelete(pendingDeleteId);
                                    setPendingDeleteId(null);
                                }}
                            >
                                Oui, supprimer
                            </button>
                            <button
                                type="button"
                                className={style.secondaryButton}
                                onClick={() => setPendingDeleteId(null)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <div className={style.toast}>{toast}</div>}

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
        <div className={style.imageShell}>
            <img
                src={imageSrc}
                alt={alt}
                className={style.image}
                onError={() => setHasError(true)}
            />
        </div>
    );
}

function NoImage({ text = "Aucune image" }) {
    return (
        <div className={style.noImage} aria-label="Aucune image disponible">
            <span className={`material-symbols-outlined ${style.noImageIcon}`} aria-hidden="true">image_not_supported</span>
            <p>{text}</p>
        </div>
    );
}