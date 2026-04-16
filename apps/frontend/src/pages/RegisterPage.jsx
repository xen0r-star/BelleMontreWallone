import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { clientAuthReg, clientLogout, checkAuth } from "../hooks/auth";


export default function RegisterPage() {
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const [verif, setVerif] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            await checkAuth(setUser, setVerif, setIsLoading);
        };
        checkUser();
    }, []);

     async function handleRegister(e) {
            setMessage('');
            e.preventDefault();
            // Data entrée à récupérer (UserName / Password)
            await clientAuthReg(setMessage, setIsLoading, setVerif, setUser);
        };
    
        async function handleLogout(e) {
            setMessage('');
            e.preventDefault();
            await clientLogout(setMessage, setIsLoading, setVerif, setUser);
        };

    if (isLoading) {
            return <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="my-8 grid place-items-center">
                    <section className="grid w-[min(560px,100%)] gap-3 border border-[#ddd6cc] bg-[color-mix(in_srgb,white_84%,#faf8f5)] p-5">
                        <p className="m-0 text-[0.8rem] uppercase tracking-[0.12em] text-[#8c8d8e]">Espace Client</p>
                        <h1>Inscription</h1>
                        Chargement en cours...
                    </section>
                </main>
                <SiteFooter />
            </div>
        }

    if (verif && user) {
            return <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="my-8 grid place-items-center">
                    <section className="grid w-[min(560px,100%)] gap-3 border border-[#ddd6cc] bg-[color-mix(in_srgb,white_84%,#faf8f5)] p-5">
                        <p className="m-0 text-[0.8rem] uppercase tracking-[0.12em] text-[#8c8d8e]">Espace Client</p>
                        <h1>Votre compte</h1>
                        <div className="text-[#8c8d8e]">
                            Bienvenue sur ton espace personnel {user.userName} !
                            <hr/>Informations du compte :<br/>Mail : {user.mail}<br/>Nom : {user.userName}<br/>Administrateur du site : {user.isAdmin ? "Oui" : "Non"}<hr/>
                        </div>
                        <button className="m-0 cursor-pointer border border-[#ddd6cc] bg-[#ff6c6c] px-4 py-2 text-sm text-[#1c1d21] hover:bg-[#ff4040]" onClick={handleLogout}>
                            Se déconnecter
                        </button>                    
                            
                        {message && <p className={verif ? "border border-[#7ca584] bg-[#edf9ef] p-3 text-[#275030]" : "border border-[#d16d6d] bg-[#ffc9c9] p-3 text-[#b22626]"}>{message}</p>}
                    </section>
                </main>
                <SiteFooter />
            </div>
        }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />

            <main className="my-8 grid place-items-center">
                <section className="grid w-[min(560px,100%)] gap-3 border border-[#ddd6cc] bg-[color-mix(in_srgb,white_84%,#faf8f5)] p-5">
                    <p className="m-0 text-[0.8rem] uppercase tracking-[0.12em] text-[#8c8d8e]">Espace Client</p>

                    <h1>Inscription</h1>
                    <p className="text-[#8c8d8e]">
                        Crée ton compte pour accéder aux réservations et au suivi de ton espace.
                    </p>

                    <form className="grid gap-3" onSubmit={handleRegister}>
                        <label className="grid gap-1 text-[0.88rem]">
                            Nom
                            <input name="username" required placeholder="nom" className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" />
                        </label>

                        <label className="grid gap-1 text-[0.88rem]">
                            Mot de passe
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="mot de passe"
                                className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]"
                            />
                        </label>

                        <label className="grid gap-1 text-[0.88rem]">
                            Email
                            <input name="email" type="email" required placeholder="email" className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" />
                        </label>

                        <label className="grid gap-1 text-[0.88rem]">
                            Date de naissance
                            <input name="birthDate" type="date" required className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" />
                        </label>

                        <button className="inline-flex w-fit cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black" type="submit">
                            S'inscrire
                        </button>
                    </form>

                    <p className="m-0 text-[0.9rem] text-[#8c8d8e]">
                        Deja un compte ? <Link to="/connexion" className="text-[#1c1d21] underline">Connexion</Link>
                    </p>

                    {message && <p className={verif ? "border border-[#7ca584] bg-[#edf9ef] p-3 text-[#275030]" : "border border-[#d16d6d] bg-[#ffc9c9] p-3 text-[#b22626]"}>{message}</p>}
                </section>
            </main>
            
            <SiteFooter />
        </div>
    );
}
