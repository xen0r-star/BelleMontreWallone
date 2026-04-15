import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { clientAuth, clientLogout, checkAuth } from "../hooks/auth";

const style = {
    page: "min-h-screen bg-[radial-gradient(circle_at_top,#f6efe5_0%,#f0e8db_45%,#ece4d7_100%)] text-[#1c1d21]",
    container: "mx-auto flex min-h-[calc(100vh-260px)] w-full max-w-[1440px] items-center px-6 py-10 md:py-14",
    card: "w-full max-w-[560px] rounded-[28px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.92)] p-6 shadow-[0_18px_50px_rgba(28,29,33,0.08)] backdrop-blur-sm md:p-10",
    kicker: "text-[0.72rem] uppercase tracking-[0.2em] text-[#8c775f]",
    title: "mt-3 font-['Cormorant_Garamond',serif] text-[2.6rem] leading-none md:text-[3.7rem]",
    intro: "mt-4 max-w-[34ch] text-[0.96rem] leading-relaxed text-[#5f6672]",
    form: "mt-8 grid gap-4",
    label: "grid gap-2 text-[0.82rem] uppercase tracking-[0.12em] text-[#6f6b64]",
    input: "h-12 rounded-full border border-[#d8cdbd] bg-white px-5 text-[0.95rem] text-[#1c1d21] placeholder:text-[#85909f] outline-none transition-colors focus:border-[#1c1d21]",
    btn: "mt-2 inline-flex items-center justify-center rounded-full border border-[#1c1d21] bg-[#1c1d21] px-6 py-3 text-[0.78rem] uppercase tracking-[0.12em] font-semibold text-[#faf5ed] transition-colors duration-200 hover:bg-transparent hover:text-[#1c1d21]",
    authSwitch: "mt-6 text-[0.9rem] text-[#5f6672]",
    authLink: "font-semibold text-[#1c1d21] underline underline-offset-4 decoration-[#1c1d21]/40 hover:decoration-[#1c1d21]",
    success: "mt-6 rounded-[22px] border border-[#c8d4c2] bg-[#eef5ea] px-5 py-4 text-[0.95rem] text-[#355044]",
    error: "mt-6 rounded-[22px] border border-[#e1b9b9] bg-[#f8eded] px-5 py-4 text-[0.95rem] text-[#8f3737]",
};

export default function LoginPage() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
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
        // Data entrée à récupérer (UserName / Password)
        await clientAuth(setMessage, setIsLoading, setVerif, setUser);
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
                    <h1>Connexion</h1>
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
            <main className={style.container}>
                <section className={style.card}>
                    <p className={style.kicker}>Espace client</p>
                    <h1 className={style.title}>Connexion</h1>
                    <p className={style.intro}>
                        Renseigne ton identifiant pour acceder a ton espace personnel.
                    </p>

                    <form className={style.form} onSubmit={handleLogin}>
                        <label className={style.label}>
                            Username
                            <input
                                className={style.input}
                                name="username"
                                required
                                placeholder="username"
                                value={userName}
                                onChange={(event) => setUserName(event.target.value)}
                            />
                        </label>
                        <label className={style.label}>
                            Password
                            <input
                                className={style.input}
                                name="password"
                                type="password"
                                required
                                placeholder="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </label>
                        <button className={style.btn} type="submit">
                            {isLoading ? "Chargement..." : "Se connecter"}
                        </button>
                    </form>

                    <p className={style.authSwitch}>
                        Pas encore de compte ? <Link to="/inscription" className={style.authLink}>Inscription</Link>
                    </p>

                    {message && <p className={verif ? "style.success" : "style.error"}>{message}</p>}
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
