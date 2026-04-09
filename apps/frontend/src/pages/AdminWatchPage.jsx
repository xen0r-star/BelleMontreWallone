import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
// import { getWatches } from '../services/api';

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

function normalizeMovement(value) {
    if (typeof value !== "string") {
        return "";
    }

    const normalized = value.toLowerCase().trim();
    if (normalized.includes("auto")) {
        return "automatique";
    }
    if (normalized.includes("mec")) {
        return "mecanique";
    }
    if (normalized.includes("quartz")) {
        return "quartz";
    }

    return "";
}

function getDiameterFromCase(caseValue) {
    if (typeof caseValue !== "string") {
        return "";
    }

    const match = caseValue.match(/(\d+(?:[.,]\d+)?)\s*mm/i);
    if (!match) {
        return "";
    }

    return match[1].replace(",", ".");
}

function mapCatalogWatchToAdminWatch(watch) {
    const imageUrl =
        typeof watch.imageUrl === "string"
            ? watch.imageUrl
            : typeof watch.images?.[0] === "string"
                ? watch.images[0]
                : typeof watch.imagesUrl?.[0] === "string"
                    ? watch.imagesUrl[0]
                    : "";

    return {
        id: watch.id,
        brand: watch.brand || "",
        model: watch.model || "",
        watchDesc: watch.watchDesc || "",
        watchCollection: watch.id || "",
        imageUrl,
        retailPrice: watch.retailPrice || "",
        marketPrice: watch.marketPrice || "",
        isInProduction: Boolean(watch.isInProduction),
        movement: normalizeMovement(watch.movement),
        materials: watch.materials || "",
        diameter: watch.diameter || "",
        watertightness: watch.watertightness || "",
    };
}

export default function AdminWatchPage() {
    const [showBuilder, setShowBuilder] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [watches, setWatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [toast, setToast] = useState("");
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    useEffect(() => {
        const fetchWatches = async () => {
            try {
                const response = await getWatches();
                if (response && response.data) {
                    setWatches((response.data).map(mapCatalogWatchToAdminWatch));
                }
            } catch (e) {
                console.error("Erreur lors du chargement des données:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWatches();
    }, [])

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

    function handleEdit(id) {
        if (!watches) return;
        const watch = watches.find((item) => item.id === id);
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
        setWatches((prev) => prev.filter((item) => item.id !== id));
        pushToast("Montre supprimee avec succes.");

        if (editingId === id) {
            setShowBuilder(false);
            resetBuilder();
        }
    }

    return (
        <div className="page-root">
            <SiteHeader isAdmin />
            <main className="container admin-page-layout">
                <section>
                    <h1>Panel Admin</h1>
                    <p className="muted">
                        Gestion des montres.
                    </p>

                    {!showBuilder && (
                        <article
                            className="add-watch-card"
                            role="button"
                            tabIndex={0}
                            onClick={() => setShowBuilder(true)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    setShowBuilder(true);
                                }
                            }}
                        >
                            <span className="plus-circle">+</span>
                            <h2>Nouvelle montre</h2>
                            <p>
                                Cliquez-ici pour ajouter une montre avec ses informations et son
                                image.
                            </p>
                        </article>
                    )}

                    {showBuilder && (
                        <section className="admin-builder">
                            <div className="admin-builder-grid">
                                <article className="preview-card">
                                    <h3>Prévisualisation en direct</h3>
                                    <div className="admin-watch-card">
                                        <div className="admin-preview-media-box">
                                            <ImageWithFallback
                                                src={form.imageUrl}
                                                alt={`${form.brand || "Marque"} ${form.model || "Modèle"}`}
                                                fallbackText="Aucune image selectionnee"
                                            />
                                        </div>
                                        <div>
                                            <h4>{(form.brand || "Marque") + " - " + (form.model || "Modèle")}</h4>
                                            <p className="muted small">Description: {form.watchDesc || "--"}</p>
                                            <p className="muted small">Collection: {form.watchCollection || "--"}</p>
                                            <p className="small">Prix revente: {(form.retailPrice || "--") + " €"}</p>
                                            <p className="small">Prix neuf: {(form.marketPrice || "--") + " €"}</p>
                                            <p className="small">En production: {form.isInProduction ? "Oui" : "Non"}</p>
                                            <p className="small">Mouvement: {form.movement || ""}</p>
                                            <p className="small">Diamètre: {(form.diameter || "") + " mm"}</p>
                                            <p className="small">Matériaux boitier: {form.materials || "--"}</p>
                                            <p className="small">Catégorie: {form.category || ""}</p>
                                            <p className="small">Etanchéité : {(form.watertightness || "--") + " m"}</p>
                                            <p className="small">Est actif : {form.isActif ? "Oui" : "Non"}</p>
                                        </div>
                                    </div>
                                </article>

                                <article className="form-panel">
                                    <h3>Informations montre</h3>
                                    <form className="form-grid" onSubmit={handleSaveWatch}>

                                        <input name="brand" required value={form.brand} onChange={handleChange} placeholder="Marque" />
                                        <input name="model" required value={form.model} onChange={handleChange} placeholder="Modèle" />
                                        <input name="watchDesc" required value={form.watchDesc} onChange={handleChange} placeholder="Description" />
                                        <input name="watchCollection" value={form.watchCollection} onChange={handleChange} placeholder="Nom collection" />
                                        <input name="retailPrice" type="double" min="1" value={form.retailPrice} onChange={handleChange} placeholder="Prix revente" />
                                        <input name="marketPrice" type="double" min="1" value={form.marketPrice} onChange={handleChange} placeholder="Prix neuf" />
                                        <label className="form-checkbox">
                                            <input name="isInProduction" type="checkbox" checked={Boolean(form.isInProduction)} onChange={handleChange} />
                                            Toujours en production
                                        </label>
                                        <select name="movement" required value={form.movement} onChange={handleChange}>
                                            <option value="">Choisir un mouvement</option>
                                            {MOVEMENT_OPTIONS.map((movementOption) => (
                                                <option key={movementOption} value={movementOption}>
                                                    {movementOption.charAt(0).toUpperCase() + movementOption.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <input name="diameter" type="number" min="1" step="0.1" value={form.diameter} onChange={handleChange} placeholder="Diametre (mm)" />
                                        <input name="materials" value={form.materials} onChange={handleChange} placeholder="Materiaux boitier" />
                                        <input name="watertightness" value={form.watertightness} onChange={handleChange} placeholder="Etanchéité" />
                                        <label className="form-checkbox">
                                            <input name="isActif" type="checkbox" checked={Boolean(form.isActif)} onChange={handleChange} />
                                            Montre active
                                        </label>

                                        <label
                                            className="drop-zone"
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={handleDrop}
                                        >
                                            <span>Glisser/déposer une image ou cliquer</span>
                                            <input type="file" accept="image/*" onChange={handleImageChange} />
                                        </label>

                                        <div className="builder-actions">
                                            <button className="btn" type="submit">
                                                {editingId ? "Mettre a jour la montre" : "Ajouter la montre"}
                                            </button>
                                            <button
                                                className="btn btn-ghost"
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

                    <section className="mt-section">
                        <div className="section-title-row">
                            <h2>Montres ajoutées</h2>
                            <p className="muted">Modification et suppression disponibles</p>
                        </div>

                        <div className="cards-grid admin-watches-grid">
                            {watches.length === 0 && (
                                <div className="empty-box">Aucune montre ajoutee pour le moment.</div>
                            )}

                            {watches.map((watch) => (
                                <article className="watch-card" key={watch.id}>
                                    <div className="collection-media-box">
                                        <ImageWithFallback
                                            src={watch.imageUrl}
                                            alt={`${watch.brand} ${watch.model}`}
                                        />
                                    </div>
                                    <div className="watch-meta">
                                        <h3>{watch.brand} - {watch.model}</h3>
                                        <p className="muted small">Description: {watch.watchDesc || "--"}</p>
                                        <p className="small">Collection: {watch.watchCollection || "--"}</p>
                                        <p className="small">Prix revente: {(watch.retailPrice || "--") + " €"}</p>
                                        <p className="small">Prix neuf: {(watch.marketPrice || "--") + " €"}</p>
                                        <p className="small">En production: {watch.isInProduction ? "Oui" : "Non"}</p>
                                        <p className="small">Mouvement: {watch.movement || "--"}</p>
                                        <p className="small">Diamètre: {(watch.diameter || "--") + " mm"}</p>
                                        <p className="small">Matériaux boitier: {watch.materials || "--"}</p>
                                        <p className="small">Etancheite: {(watch.watertightness || "--") + " m"}</p>
                                        <p className="small">Est actif: {watch.isActif ? "Oui" : "Non"}</p>
                                    </div>
                                    <div className="action-cell">
                                        <button type="button" onClick={() => handleEdit(watch.id)}>Modifier</button>
                                        <button type="button" onClick={() => setPendingDeleteId(watch.id)}>
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
                <div className="modal-backdrop" role="dialog" aria-modal="true">
                    <div className="modal-panel modal-panel--confirm">
                        <h3>Confirmer la suppression</h3>
                        <p className="muted">
                            Cette action supprimera definitivement la montre selectionnee.
                        </p>
                        <div className="builder-actions">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    handleDelete(pendingDeleteId);
                                    setPendingDeleteId(null);
                                }}
                            >
                                Oui, supprimer
                            </button>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => setPendingDeleteId(null)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <div className="toast toast-success">{toast}</div>}

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
        <div className="image-shell">
            <img
                src={imageSrc}
                alt={alt}
                onError={() => setHasError(true)}
            />
        </div>
    );
}

function NoImage({ text = "Aucune image" }) {
    return (
        <div className="no-image" aria-label="Aucune image disponible">
            <span className="material-symbols-outlined" aria-hidden="true">image_not_supported</span>
            <p>{text}</p>
        </div>
    );
}