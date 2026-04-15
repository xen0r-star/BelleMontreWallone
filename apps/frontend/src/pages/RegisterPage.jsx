import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { clientAuthReg, clientLogout, checkAuth } from "../hooks/auth";


const style = {
    page: `min-h-screen bg-[#f4efe7] text-[#1c1d21]`,
    container: `max-w-[1440px] mx-auto px-6`,
    main: `py-10 md:py-14 flex justify-center`,
    card: `w-full max-w-[640px] rounded-[28px] border border-[#d8cdbd] bg-[#fffaf3] p-6 md:p-10 shadow-[0_18px_50px_rgba(28,29,33,0.06)]`,
    kicker: `text-[0.72rem] uppercase tracking-[0.2em] text-[#8c775f] mb-3`,
    title: `font-['Cormorant_Garamond',serif] text-[2.5rem] md:text-[3.4rem] leading-none text-[#1c1d21]`,
    muted: `mt-4 text-[0.95rem] leading-relaxed text-[#5f6672]`,
    form: `mt-8 grid gap-4`,
    label: `grid gap-2 text-[0.82rem] uppercase tracking-[0.12em] text-[#6f6b64]`,
    input: `h-12 rounded-full border border-[#d8cdbd] bg-white px-5 text-[0.95rem] text-[#1c1d21] placeholder:text-[#85909f] outline-none transition-colors focus:border-[#1c1d21]`,
    btn: `mt-2 inline-flex items-center justify-center rounded-full border border-[#1c1d21] bg-[#1c1d21] px-6 py-3 text-[0.78rem] uppercase tracking-[0.12em] font-semibold text-[#faf5ed] transition-colors duration-200 hover:bg-transparent hover:text-[#1c1d21]`,
    authSwitch: `mt-6 text-[0.9rem] text-[#5f6672]`,
    authLink: `font-semibold text-[#1c1d21] underline underline-offset-4 decoration-[#1c1d21]/40 hover:decoration-[#1c1d21]`,
    success: `mt-6 rounded-[22px] border border-[#7ca584] bg-[#edf9ef] px-5 py-4 text-[0.95rem] text-[#275030]`,
    nsuccess: `mt-6 rounded-[22px] border border-[#d16d6d] bg-[#ffc9c9] px-5 py-4 text-[0.95rem] text-[#b22626]`,
};

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
            return <div className="page-root">
                <SiteHeader />
                <main className="container auth-layout">
                    <section className="auth-card">
                        <p className="kicker">Espace Client</p>
                        <h1>Inscription</h1>
                        Chargement en cours...
                    </section>
                </main>
                <SiteFooter />
            </div>
        }

    if (verif && user) {
            return <div className="page-root">
                <SiteHeader />
                <main className="container auth-layout">
                    <section className="auth-card">
                        <p className="kicker">Espace Client</p>
                        <h1>Votre compte</h1>
                        <div className="muted">
                            Bienvenue sur ton espace personnel {user.userName} !
                            <hr/>Informations du compte :<br/>Mail : {user.mail}<br/>Nom : {user.userName}<br/>Administrateur du site : {user.isAdmin ? "Oui" : "Non"}<hr/>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            Se déconnecter
                        </button>                    
                            
                        {message && <p className={verif ? "success-msg" : "nsuccess-msg"}>{message}</p>}
                    </section>
                </main>
                <SiteFooter />
            </div>
        }

    return (
        <div className={style.page}>
            <SiteHeader />

            <main className={`${style.container} ${style.main}`}>
                <section className={style.card}>
                    <p className={style.kicker}>Espace Client</p>
                      <h1 className={style.title}>Inscription</h1>
                    <p className={style.muted}>
                        Crée ton compte pour accéder aux réservations et au suivi de ton espace.
                    </p>

                    <form className={style.form} onSubmit={handleRegister}>
                        <label className={style.label}>
                            Nom
                            <input className={style.input} name="username" required placeholder="nom" />
                        </label>

                        <label className={style.label}>
                            Mot de passe
                            <input
                                className={style.input}
                                name="password"
                                type="password"
                                required
                                placeholder="mot de passe"
                            />
                        </label>

                        <label className={style.label}>
                            Email
                            <input className={style.input} name="email" type="email" required placeholder="email" />
                        </label>

                        <label className={style.label}>
                            Date de naissance
                            <input className={style.input} name="birthDate" type="date" required />
                        </label>

                        <button className={style.btn} type="submit">
                            S'inscrire
                        </button>
                    </form>

                    <p className={style.authSwitch}>
                        Deja un compte ? <Link to="/connexion" className={style.authLink}>Connexion</Link>
                    </p>

                    {message && <p className={verif ? "style.success" : "style.nsuccess"}>{message}</p>}
                </section>
            </main>
            
            <SiteFooter />
        </div>
    );
}
