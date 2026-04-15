import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const style = {
    page: "min-h-screen bg-[radial-gradient(circle_at_top,#f6efe5_0%,#f0e8db_45%,#ece4d7_100%)] text-[#1c1d21]",
    container: "mx-auto flex min-h-[calc(100vh-260px)] w-full max-w-[1440px] items-center px-6 py-10 md:py-14",
    card: "w-full rounded-[32px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.94)] p-8 shadow-[0_18px_50px_rgba(28,29,33,0.08)] md:p-12",
    kicker: "text-[0.72rem] uppercase tracking-[0.2em] text-[#8c775f]",
    title: "mt-4 font-['Cormorant_Garamond',serif] text-[4rem] leading-none md:text-[5.5rem]",
    muted: "mt-4 max-w-[60ch] text-[0.98rem] leading-relaxed text-[#5f6672]",
    actions: "mt-8 flex flex-wrap gap-3",
    linkBtn: "inline-flex items-center justify-center rounded-full border border-[#1c1d21] bg-[#1c1d21] px-5 py-3 text-[0.78rem] uppercase tracking-[0.12em] font-semibold text-[#faf5ed] transition-colors duration-200 hover:bg-transparent hover:text-[#1c1d21]",
    linkBtnGhost: "bg-transparent text-[#1c1d21]",
};

export default function NotFoundPage() {
    return (
        <div className={style.page}>
            <SiteHeader />
            <main className={style.container}>
                <section className={style.card}>
                    <p className={style.kicker}>Erreur de navigation</p>
                    <h1 className={style.title}>404</h1>
                    <p className={style.muted}>
                        La page demandee n'existe pas ou a ete deplacee.
                    </p>
                    <div className={style.actions}>
                        <Link to="/collection" className={style.linkBtn}>Retour a la collection</Link>
                        <Link to="/" className={`${style.linkBtn} ${style.linkBtnGhost}`}>Retour a l'accueil</Link>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}