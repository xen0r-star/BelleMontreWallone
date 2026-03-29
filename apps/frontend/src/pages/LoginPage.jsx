import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function LoginPage() {
    const [message, setMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        setMessage("Connexion validee. Bienvenue dans votre espace.");
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
                            Se connecter
                        </button>
                    </form>

                    <p className="auth-switch">
                        Pas encore de compte ? <Link to="/inscription">Inscription</Link>
                    </p>

                    {message && <p className="success-msg">{message}</p>}
                </section>
            </main>
            
            <SiteFooter />
        </div>
    );
}
