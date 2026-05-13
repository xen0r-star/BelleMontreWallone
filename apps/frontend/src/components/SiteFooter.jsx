import { useState } from "react";
import { Link } from "react-router-dom";
import { subscribeNewsletter } from "../hooks/newsletter";

export default function SiteFooter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null); // null | 'success' | 'already' | 'error'
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!email || loading) return;
        setLoading(true);
        setStatus(null);
        await subscribeNewsletter(email, setStatus);
        setLoading(false);
        setEmail('');
    }

    return (
        <footer className="mt-auto border-t border-[#2a2f35] bg-[#1c1d21] px-6 pb-0 pt-20 text-[#faf8f5]" id="brand">
            <div className="mx-auto grid max-w-360 grid-cols-[1.2fr_1fr_1fr_1fr] gap-8 max-lg:grid-cols-2 max-[700px]:grid-cols-1">
                <div>
                    <h3 className="mb-6 flex items-center font-serif text-[32px] font-normal"><img src="/icons/bmw_icon.png" className="mr-2.5 h-12.5 w-auto"></img>Belle Montre Wallonne</h3>
                    <p className="max-w-[320px] text-sm leading-[1.7] text-[#8c8d8e]">
                        L'exclusivité horlogère pensée pour les connaisseurs. Une sélection
                        rigoureuse de garde-temps exceptionnels.
                    </p>
                </div>

                <div className="flex flex-col gap-2.5">
                    <h4 className="mb-4 text-[11px] font-medium uppercase tracking-widest text-[#8c8d8e]">Navigation</h4>
                    <Link to="/collection" className="w-fit text-sm text-[#faf8f5] transition-all duration-200 hover:translate-x-0.75 hover:text-[#d5c7b2]">Collection</Link>
                    <a href="#brand" className="w-fit text-sm text-[#faf8f5] transition-all duration-200 hover:translate-x-0.75 hover:text-[#d5c7b2]">La Marque</a>
                </div>

                <div className="flex flex-col gap-2.5">
                    <h4 className="mb-4 text-[11px] font-medium uppercase tracking-widest text-[#8c8d8e]">Assistance</h4>
                    <Link to="/besoin-daide" className="w-fit text-sm text-[#faf8f5] transition-all duration-200 hover:translate-x-0.75 hover:text-[#d5c7b2]">Aide</Link>
                    <Link to="/besoin-daide" className="w-fit text-sm text-[#faf8f5] transition-all duration-200 hover:translate-x-0.75 hover:text-[#d5c7b2]">Contact</Link>
                </div>

                <div className="flex flex-col gap-2.5">
                    <h4 className="mb-4 text-[11px] font-medium uppercase tracking-widest text-[#8c8d8e]">Cercle Privé</h4>
                    <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Votre adresse email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="border-b border-[#8c8d8e] bg-transparent px-0 py-2 text-sm text-[#faf8f5] outline-none transition-colors duration-200 hover:border-[#faf8f5] focus:border-[#faf8f5] disabled:opacity-50"
                        />
                        <button type="submit" disabled={loading} className="inline-flex items-center gap-1.5 self-start bg-transparent p-0 text-[11px] uppercase tracking-widest text-[#faf8f5] transition-colors duration-200 hover:text-[#d5c7b2] disabled:opacity-50">
                            {loading ? 'Envoi...' : 'Rejoindre'}
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </button>
                        {status === 'success' && <p className="text-xs text-[#d5c7b2]">Bienvenue dans le Cercle Privé.</p>}
                        {status === 'already' && <p className="text-xs text-[#8c8d8e]">Cet email est déjà inscrit.</p>}
                        {status === 'error' && <p className="text-xs text-red-400">Une erreur est survenue. Réessayez.</p>}
                    </form>
                </div>
            </div>

            <div className="mx-auto mt-20 flex max-w-360 items-center justify-between gap-4 border-t border-[#2a2f35] py-6 max-[700px]:items-start max-[700px]:flex-col">
                <p className="text-xs text-[#8c8d8e]">© 2026 Belle Montre Wallone, BMW. Tous droits réservés.</p>
                <div className="flex gap-6">
                    <a href="#legal" className="text-xs text-[#8c8d8e] transition-colors duration-200 hover:text-[#faf8f5]">Mentions Légales</a>
                    <a href="#privacy" className="text-xs text-[#8c8d8e] transition-colors duration-200 hover:text-[#faf8f5]">Confidentialité</a>
                </div>
            </div>
        </footer>
    );
}
