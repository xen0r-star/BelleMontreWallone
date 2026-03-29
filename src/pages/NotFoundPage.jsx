import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function NotFoundPage() {
  return (
    <div className="page-root">
      <SiteHeader />
      <main className="container not-found-layout">
        <section className="not-found-card">
          <p className="kicker">Erreur de navigation</p>
          <h1>404</h1>
          <p className="muted">
            La page demandee n'existe pas ou a ete deplacee.
          </p>
          <div className="builder-actions">
            <Link to="/collection" className="btn">Retour a la collection</Link>
            <Link to="/" className="btn btn-ghost">Retour a l'accueil</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
