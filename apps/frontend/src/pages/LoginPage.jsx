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
            await checkAuth(setUser, setVerif);
        };
        checkUser();
    }, []);
    
    
    const handleLogin = async (e) => {
        setMessage('');
        e.preventDefault();
        // Data entrée à récupérer (UserName / Password)
        await clientAuth(setMessage, setIsLoading, setVerif, setUser);
    };

    const handleLogout = async (e) => {
        setMessage('');
        e.preventDefault();
        await clientLogout(setMessage, setIsLoading, setVerif, setUser);
    };

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
                    <h1>Connexion</h1>
                    <p className="muted">
                        Renseigne ton identifiant pour acceder a ton espace personnel.
                    </p>
                    <form className="form-grid" onSubmit={handleLogin}>
                        <label>
                            Username
                            <input name="username" required placeholder="username" />
                        </label>
                        <label>
                            Password
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="password"
                            />
                        </label>
                        <button className="btn" type="submit">
                            {isLoading ? "Chargement..." : "Se connecter"}
                        </button>
                    </form>
                    <p className="auth-switch">
                        Pas encore de compte ? <Link to="/inscription">Inscription</Link>
                    </p>
                    {message && <p className={verif ? "success-msg" : "nsuccess-msg"}>{message}</p>}
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
