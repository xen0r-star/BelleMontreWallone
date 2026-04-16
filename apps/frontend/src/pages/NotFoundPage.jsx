import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            
            <main className="grid min-h-[calc(100vh-260px)] place-items-center py-8">
                <section className="grid w-[min(760px,100%)] gap-3 border border-[#ddd6cc] bg-linear-to-br from-[#f8f5ef] to-white p-[clamp(1.4rem,4vw,2.4rem)]">
                    <p className="m-0 text-[0.8rem] uppercase tracking-[0.12em] text-[#8c8d8e]">Erreur de navigation</p>

                    <h1 className="m-0 font-serif text-[clamp(2.5rem,7vw,4.5rem)] leading-none">404</h1>
                    <p className="text-[#8c8d8e]">
                        La page demandee n'existe pas ou a ete deplacee.
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <Link to="/collection" className="inline-flex w-fit cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black">Retour a la collection</Link>
                        <Link to="/" className="inline-flex w-fit cursor-pointer border border-[#141823] bg-transparent px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#1c1d21] hover:bg-black hover:text-[#faf8f5]">Retour a l'accueil</Link>
                   </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
