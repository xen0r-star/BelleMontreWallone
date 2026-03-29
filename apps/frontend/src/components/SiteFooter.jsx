import { Link } from "react-router-dom";

export default function SiteFooter() {
    return (
        <footer className="hx-footer" id="brand">
            <div className="hx-footer-grid">
                <div>
                    <h3>Minimalisme Noble</h3>
                    <p>
                        L'exclusivite horlogere pensee pour les connaisseurs. Une selection
                        rigoureuse de garde-temps exceptionnels.
                    </p>
                </div>

                <div>
                    <h4>Navigation</h4>
                    <Link to="/collection">Collection</Link>
                    <a href="#brand">La Marque</a>
                    <a href="#journal">Journal</a>
                </div>

                <div>
                    <h4>Assistance</h4>
                    <Link to="/besoin-daide">Conciergerie</Link>
                    <Link to="/besoin-daide">FAQ</Link>
                    <Link to="/besoin-daide">Contact</Link>
                </div>

                <div>
                    <h4>Cercle Prive</h4>
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
                <p>© 2024 Minimalisme Noble. Tous droits reserves.</p>
                <div>
                    <a href="#legal">Mentions Legales</a>
                    <a href="#privacy">Confidentialite</a>
                </div>
            </div>
        </footer>
    );
}
