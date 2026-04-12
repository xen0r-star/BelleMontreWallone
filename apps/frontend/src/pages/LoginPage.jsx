import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { clientAuth } from "../hooks/auth";

export default function LoginPage() {
    const [message, setMessage] = useState("");
    const [verification, setVerification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Data entrée à récupérer
        // A finir

        await clientAuth(setMessage, setIsLoading, setVerification);
    };

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

                    <form className="form-grid" onSubmit={handleSubmit}>
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

                    {message && <p className={verification ? "success-msg" : "nsuccess-msg"}>{message}</p>}
                </section>
            </main>
            
            <SiteFooter />
        </div>
    );
}
