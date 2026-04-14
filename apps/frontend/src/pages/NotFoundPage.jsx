import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

// Place ton objet de styles Tailwind ici (ex: const style = { ... })
const style = {
    pageRoot : `min-height: 100vh display: flex flex-direction: column`,
    notFoundLayout : `min-height: calc(100vh - 260px) display: grid 
                        place-items: center padding-block: 2rem`,
    notFoundCard : `width: min(760px, 100%) border: 1px solid var(--line) 
                    background: linear-gradient(135deg, #f8f5ef 0%, #ffffff 100%)
                    padding: clamp(1.4rem, 4vw, 2.4rem) display: grid gap: 0.75rem`,
    kicker : `margin: 0 color: color-mix(in srgb, var(--muted) 90%, #fff)
                text-transform: uppercase letter-spacing: 0.12em font-size: 0.8rem`,
    muted : `color: var(--muted)`,
    builderActions : `display: flex gap: 0.55rem flex-wrap: wrap;`,
    linkBtn : `display: inline-flex width: fit-content border: 1px solid var(--dark) 
                background: var(--dark) color: var(--bg) p: 0.7rem 1rem text-transform: uppercase
                letter-spacing: 0.08em font-size: 0.75rem cursor: pointer`,
    linkBtnGhost : `background: transparent color: var(--text)`
};

export default function NotFoundPage() {
    return (
        <div className={style.pageRoot}>
            <SiteHeader />
            
            <main className={style.notFoundLayout}>
                <section className={style.notFoundCard}>
                    <p className={style.kicker}>Erreur de navigation</p>

                    <h1>404</h1>
                    <p className={style.muted}>
                        La page demandee n'existe pas ou a ete deplacee.
                    </p>

                    <div className={style.builderActions}>
                        <Link to="/collection" className={style.linkBtn}>Retour a la collection</Link>
                        <Link to="/" className={style.linkBtnGhost}>Retour a l'accueil</Link>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
