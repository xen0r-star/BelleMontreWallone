import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { clientAuth, clientLogout, checkAuth } from "../hooks/auth";

export default function LoginPage() {
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
    
    
    async function handleLogin(e) {
        setMessage('');
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!data.username || !data.password) {
            setVerif(false);
            return setMessage('Des identifiants sont manquants. Merci de réessayer !')
        }

        const payload = {
            userName: data.username,
            password: data.password
        }
        
        await clientAuth(setMessage, setIsLoading, setVerif, setUser, payload);
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
                    <h1>Connexion</h1>
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
                    <div className="text-red-800 font-bold">
                        ⚠️ Attention, par mesure de sécurité après 15 minutes vous serait déconnecter de votre compte (RECONNEXION NECESSAIRE) ⚠️
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
                    <h1>Connexion</h1>
                    <p className="text-[#8c8d8e]">
                        Renseigne ton identifiant pour acceder a ton espace personnel.
                    </p>
                    <form className="grid gap-3" onSubmit={handleLogin}>
                        <label className="grid gap-1 text-[0.88rem]">
                            Username
                            <input name="username" required placeholder="username" className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" />
                        </label>
                        <label className="grid gap-1 text-[0.88rem]">
                            Password
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="password"
                                className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]"
                            />
                        </label>
                        <button className="inline-flex w-fit cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black" type="submit">
                            {isLoading ? "Chargement..." : "Se connecter"}
                        </button>
                    </form>
                    <p className="m-0 text-[0.9rem] text-[#8c8d8e]">
                        Pas encore de compte ? <Link to="/inscription" className="text-[#1c1d21] underline">Inscription</Link>
                    </p>
                    {message && <p className={verif ? "border border-[#7ca584] bg-[#edf9ef] p-3 text-[#275030]" : "border border-[#a57c7c] bg-[#f9eded] p-3 text-[#502727]"}>{message}</p>}
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
