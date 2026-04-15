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
        <div className="page-root">
            <SiteHeader />

            <main className="container auth-layout">
                <section className="auth-card">
                    <p className="kicker">Espace Client</p>

                    <h1>Inscription</h1>
                    <p className="muted">
                        Crée ton compte pour accéder aux réservations et au suivi de ton espace.
                    </p>

                    <form className="form-grid" onSubmit={handleRegister}>
                        <label>
                            Nom
                            <input name="username" required placeholder="nom" />
                        </label>

                        <label>
                            Mot de passe
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="mot de passe"
                            />
                        </label>

                        <label>
                            Email
                            <input name="email" type="email" required placeholder="email" />
                        </label>

                        <label>
                            Date de naissance
                            <input name="birthDate" type="date" required />
                        </label>

                        <button className="btn" type="submit">
                            S'inscrire
                        </button>
                    </form>

                    <p className="auth-switch">
                        Deja un compte ? <Link to="/connexion">Connexion</Link>
                    </p>

                    {message && <p className={verif ? "success-msg" : "nsuccess-msg"}>{message}</p>}
                </section>
            </main>
            
            <SiteFooter />
        </div>
    );
}
