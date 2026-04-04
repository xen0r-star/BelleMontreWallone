import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { formatPrice } from "../data/watches";
import { getWatches } from '../services/api';

function ImageWithSkeleton({ src, alt, className }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`image-shell ${className || ""}`}>
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
    const { id } = useParams();

    useEffect(() => {
        const fetchWatches = async () => {
            try {
                const response = await getWatches();
                if (response && response.data) {
                    setWatches(response.data);
                }
            } catch (e) {
                console.error("Erreur lors du chargement des données:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWatches();
    }, [])

    const watch = watches.find((item) => item.id === id);

    const [imageIndex, setImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sent, setSent] = useState(false);

    if (isLoading) return <p>Chargement de la montre...</p>;
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
                        src={watch.images[imageIndex]}
                        alt={watch.model}
                        className="hero-image"
                    />
                    <div className="thumb-row">
                        {watch.images.map((image, index) => (
                            <button
                                key={image}
                                type="button"
                                className={`thumb ${index === imageIndex ? "active" : ""}`}
                                onClick={() => setImageIndex(index)}
                            >
                                <ImageWithSkeleton src={image} alt={`${watch.model} ${index + 1}`} />
                            </button>
                        ))}
                    </div>
                </section>

                <section className="detail-panel">
                    <p className="kicker">{watch.brand}</p>

                    <h1>{watch.model}</h1>
                    <p className="price">{formatPrice(watch.price)}</p>
                    <p className="muted">{watch.description}</p>

                    <ul className="spec-list">
                        <li>
                            <span>Mouvement</span>
                            <span>{watch.movement}</span>
                        </li>
                        <li>
                            <span>Calibre</span>
                            <span>{watch.caliber}</span>
                        </li>
                        <li>
                            <span>Boitier</span>
                            <span>{watch.case}</span>
                        </li>
                        <li>
                            <span>Réserve</span>
                            <span>{watch.reserve}</span>
                        </li>
                        <li>
                            <span>Étanchéité</span>
                            <span>{watch.waterResistance}</span>
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
