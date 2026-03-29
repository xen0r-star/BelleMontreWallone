import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { watches as catalogWatches } from "../data/watches";

const emptyForm = {
  brand: "",
  reference: "",
  model: "",
  year: "",
  diameter: "",
  caseMaterial: "",
  category: "Classique",
  image: ""
};

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
  return {
    id: watch.id,
    brand: watch.brand || "",
    reference: watch.id || "",
    model: watch.model || "",
    year: "",
    diameter: getDiameterFromCase(watch.case),
    caseMaterial: watch.material || "",
    category: watch.category || "Classique",
    image: typeof watch.images?.[0] === "string" ? watch.images[0] : ""
  };
}

export default function AdminWatchPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [watches, setWatches] = useState(() => catalogWatches.map(mapCatalogWatchToAdminWatch));
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  function pushToast(message) {
    setToast(message);
    window.setTimeout(() => {
      setToast("");
    }, 2200);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: String(reader.result || "") }));
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
      setForm((prev) => ({ ...prev, image: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  }

  function resetBuilder() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleSaveWatch(event) {
    event.preventDefault();

    if (!form.brand || !form.reference || !form.model) {
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
    const watch = watches.find((item) => item.id === id);
    if (!watch) {
      return;
    }

    setShowBuilder(true);
    setEditingId(id);
    setForm({
      brand: watch.brand,
      reference: watch.reference,
      model: watch.model,
      year: watch.year,
      diameter: watch.diameter,
      caseMaterial: watch.caseMaterial,
      category: watch.category,
      image: watch.image
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
                Clique ici pour ajouter une montre avec ses informations et son
                image.
              </p>
            </article>
          )}

          {showBuilder && (
            <section className="admin-builder">
              <div className="admin-builder-grid">
                <article className="preview-card">
                  <h3>Preview en direct</h3>
                  <div className="admin-watch-card">
                    <div className="admin-preview-media-box">
                      <ImageWithFallback
                        src={form.image}
                        alt={`${form.brand || "Marque"} ${form.model || "Modele"}`}
                        fallbackText="Aucune image selectionnee"
                      />
                    </div>
                    <div>
                      <h4>{(form.brand || "Marque") + " - " + (form.model || "Modele")}</h4>
                      <p className="muted small">Reference: {form.reference || "--"}</p>
                      <p className="small">Annee: {form.year || "--"}</p>
                      <p className="small">Diametre: {(form.diameter || "--") + " mm"}</p>
                      <p className="small">Materiaux boitier: {form.caseMaterial || "--"}</p>
                      <p className="small">Categorie: {form.category || "Classique"}</p>
                    </div>
                  </div>
                </article>

                <article className="form-panel">
                  <h3>Informations montre</h3>
                  <form className="form-grid" onSubmit={handleSaveWatch}>
                    <input name="brand" required value={form.brand} onChange={handleChange} placeholder="Marque" />
                    <input name="reference" required value={form.reference} onChange={handleChange} placeholder="Reference" />
                    <input name="model" required value={form.model} onChange={handleChange} placeholder="Modele" />
                    <input name="year" type="number" min="1900" max="2100" value={form.year} onChange={handleChange} placeholder="Annee" />
                    <input name="diameter" type="number" min="1" step="0.1" value={form.diameter} onChange={handleChange} placeholder="Diametre (mm)" />
                    <input name="caseMaterial" value={form.caseMaterial} onChange={handleChange} placeholder="Materiaux boitier" />
                    <select name="category" value={form.category} onChange={handleChange}>
                      <option>Classique</option>
                      <option>Sport</option>
                      <option>Luxe</option>
                    </select>

                    <label
                      className="drop-zone"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={handleDrop}
                    >
                      <span>Glisse/depose une image ou clique</span>
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
              <h2>Montres ajoutees</h2>
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
                      src={watch.image}
                      alt={`${watch.brand} ${watch.model}`}
                    />
                  </div>
                  <div className="watch-meta">
                    <h3>{watch.brand} - {watch.model}</h3>
                    <p className="muted small">Reference: {watch.reference}</p>
                    <p className="small">Annee: {watch.year || "--"}</p>
                    <p className="small">Diametre: {(watch.diameter || "--") + " mm"}</p>
                    <p className="small">Materiaux: {watch.caseMaterial || "--"}</p>
                    <p className="small">Categorie: {watch.category}</p>
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
  const [isLoaded, setIsLoaded] = useState(false);
  const imageSrc = typeof src === "string" ? src.trim() : "";

  if (!imageSrc || hasError) {
    return <NoImage text={fallbackText} />;
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

function NoImage({ text = "Aucune image" }) {
  return (
    <div className="no-image" aria-label="Aucune image disponible">
      <span className="material-symbols-outlined">image_not_supported</span>
      <p>{text}</p>
    </div>
  );
}
