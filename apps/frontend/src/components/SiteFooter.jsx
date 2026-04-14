import { Link } from "react-router-dom";

// Place ton objet de styles Tailwind ici (ex: const style = { ... })

const style = {
    footer: "bg-[#15171b] border-t border-[#2a2f35] text-[#f1eee8]",
    container: "max-w-[1440px] mx-auto px-6 py-14 md:py-16",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12",
    brandTitle: "flex items-center gap-3 text-[1.1rem] md:text-[1.25rem] font-['Cormorant_Garamond',serif] tracking-[0.03em]",
    brandIcon: "h-8 w-8 object-contain",
    brandText: "mt-4 text-[0.9rem] leading-relaxed text-[#c6c2bb] max-w-[32ch]",
    sectionTitle: "text-[0.68rem] uppercase tracking-[0.14em] text-[#b9b4ab] mb-4",
    navList: "flex flex-col gap-2.5",
    navLink: "text-[0.88rem] text-[#f1eee8] transition-opacity duration-200 hover:opacity-80 w-fit",
    form: "flex flex-col gap-3",
    input: "h-11 px-4 bg-[#1f2329] border border-[#343a43] text-[0.9rem] text-[#f7f3ec] placeholder:text-[#8e98a8] focus:outline-none focus:border-[#aeb9c7] transition-colors",
    button: "h-11 px-4 inline-flex items-center justify-center gap-2 bg-[#e8dcc8] text-[#1c1d21] text-[0.76rem] uppercase tracking-[0.1em] font-semibold transition-colors duration-200 hover:bg-[#f2e7d5]",
    bottom: "mt-12 pt-6 border-t border-[#2a2f35] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
    copyright: "text-[0.78rem] text-[#9ea7b5]",
    bottomLinks: "flex items-center gap-5",
    bottomLink: "text-[0.76rem] uppercase tracking-[0.08em] text-[#d0cbc2] transition-opacity duration-200 hover:opacity-80",
};

export default function SiteFooter() {
    return (
        <footer className={style.footer} id="brand">
            <div className={style.container}>
                <div className={style.grid}>
                <div>
                    <h3 className={style.brandTitle}>
                        <img className={style.brandIcon} src="/icons/bmw_icon.png" alt="BMW Icon" />
                        Belle Montre Wallonne
                    </h3>
                    <p className={style.brandText}>
                        L'exclusivité horlogère pensée pour les connaisseurs. Une sélection
                        rigoureuse de garde-temps exceptionnels.
                    </p>
                </div>

                <div>
                    <h4 className={style.sectionTitle}>Navigation</h4>
                    <div className={style.navList}>
                        <Link className={style.navLink} to="/collection">Collection</Link>
                        <a className={style.navLink} href="#brand">La Marque</a>
                    </div>
                </div>

                <div>
                    <h4 className={style.sectionTitle}>Assistance</h4>
                    <div className={style.navList}>
                        <Link className={style.navLink} to="/besoin-daide">Aide</Link>
                        <Link className={style.navLink} to="/besoin-daide">Contact</Link>
                    </div>
                </div>

                <div>
                    <h4 className={style.sectionTitle}>Cercle Privé</h4>
                    <form className={style.form}>
                        <input className={style.input} type="email" placeholder="Votre adresse email" />
                        <button className={style.button} type="submit">
                            Rejoindre
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </form>
                </div>
                </div>

                <div className={style.bottom}>
                    <p className={style.copyright}>© 2026 Belle Montre Wallone, BMW. Tous droits réservés.</p>
                    <div className={style.bottomLinks}>
                        <a className={style.bottomLink} href="#legal">Mentions Légales</a>
                        <a className={style.bottomLink} href="#privacy">Confidentialité</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
