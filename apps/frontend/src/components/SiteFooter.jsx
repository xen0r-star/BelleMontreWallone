import { Link } from "react-router-dom";

export default function SiteFooter() {
    return (
        <footer className="hx-footer" id="brand">
            <div className="hx-footer-grid">
                <div>
                    <h3>Minimalisme Noble</h3>
                    <h3><img src="/icons/bmw_icon.png"></img>Belle Montre Wallonne</h3>
                    <p>
                        L'exclusivité horlogère pensée pour les connaisseurs. Une sélection
                        rigoureuse de garde-temps exceptionnels.
                    </p>
                </div>

                <div>
                    <h4>Navigation</h4>
                    <Link to="/collection">Collection</Link>
                    <a href="#brand">La Marque</a>
                </div>

                <div>
                    <h4>Assistance</h4>
                    <Link to="/besoin-daide">Aide</Link>
                    <Link to="/besoin-daide">Contact</Link>
                </div>

                <div>
                    <h4>Cercle Privé</h4>
                    <form>
                        <input type="email" placeholder="Votre adresse email" />
                        <button type="submit">
                            Rejoindre
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </form>
                </div>
            </div>

            <div className="hx-footer-bottom">
                <p>© 2026 Belle Montre Wallone. Tous droits réservés.</p>
                <div>
                    <a href="#legal">Mentions Légales</a>
                    <a href="#privacy">Confidentialité</a>
                </div>
            </div>
        </footer>
    );
}
