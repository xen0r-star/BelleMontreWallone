import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { formatPrice } from "../data/watches";
import { fetchWatches } from "../services/hooks/fetchAPI";

function ImageWithSkeleton({ src, alt, className }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`image-shell-coll ${className || ""}`}>
            {!isLoaded && <div className="skeleton skeleton-image" aria-hidden="true" />}
            <img
                src={src}
                alt={alt}
                className={className}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
}

export default function WatchDetailPage() {
    const [watches, setWatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sent, setSent] = useState(false);
    const { id } = useParams();
    fetchWatches(setWatches, setIsLoading);

    if (!watches || watches.length === 0 || isLoading) {
        return/*  <p>Chargement de la montre...</p> */;
    }

    const watch = watches.find(item => Number(item.watchId) === Number(id));
    
    if (!watch) {
        return (
            <div className="page-root">
                <SiteHeader />
                <main className="container center-box">
                    <h1>Montre introuvable</h1>
                    <Link to="/collection" className="btn">
                        Retour a la collection
                    </Link>
                </main>
                <SiteFooter />
            </div>
        );
    }

    function handleSubmit(event) {
        event.preventDefault();
        setSent(true);
    }

    return (
        <div className="page-root">
            <SiteHeader />
            
            <main className="container detail-layout">
                <section>
                    <ImageWithSkeleton
                        src={watch.imageUrl}
                        alt={watch.model}
                        className="hero-image"
                    />
                </section>

                <section className="detail-panel">
                    <p className="kicker">{watch.brand || "/"}</p>

                    <h1>{watch.model}</h1>
                    <p className="price">Prix de vente : {formatPrice(watch.retailPrice)}</p><hr/><p>Prix conseillé : {formatPrice(watch.marketPrice)}</p>
                    <p className="muted">{watch.watchDesc ? ("Description : " + watch.watchDesc) : "Aucune description trouvé."}</p>

                    <ul className="spec-list">
                        <li>
                            <span>Mouvement</span>
                            <span>{watch.movement || "/"}</span>
                        </li>
                        <li>
                            <span>Diamètre</span>
                            <span>{watch.diameter + "mm" || "/"}</span>
                        </li>
                        <li>
                            <span>Matériel</span>
                            <span>{watch.materials || "/"}</span>
                        </li>
                        <li>
                            <span>Étanchéité</span>
                            <span>{watch.watertightness || "/"}</span>
                        </li>
                    </ul>

                    <button type="button" className="btn" onClick={() => setIsModalOpen(true)}>
                        Demander une réservation
                    </button>
                </section>
            </main>

            {isModalOpen && (
                <div className="modal-backdrop" role="dialog" aria-modal="true">
                    <div className="modal-panel modal-panel--reservation">
                        <button
                            type="button"
                            className="close-modal"
                            onClick={() => {
                                setIsModalOpen(false);
                                setSent(false);
                            }}
                        >
                            Fermer
                        </button>

                        <h2>Reservation - {watch.model}</h2>
                        {!sent ? (
                            <form className="form-grid" onSubmit={handleSubmit}>
                                <input required placeholder="Nom" />
                                <input required placeholder="Prenom" />
                                <input required type="email" placeholder="Email" />
                                <input placeholder="Telephone" />
                                <textarea rows="4" placeholder="Message" />
                                <button className="btn" type="submit">Envoyer</button>
                            </form>

                        ) : (
                            <p className="success-msg">Demande envoyee. Un conseiller te contactera sous 24h.</p>
                        )}
                    </div>
                </div>
            )}

            <SiteFooter />
        </div>
    );
}
