import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function RegisterPage() {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("Inscription enregistree. Tu peux maintenant te connecter.");
  }

  return (
    <div className="page-root">
      <SiteHeader />
      <main className="container auth-layout">
        <section className="auth-card">
          <p className="kicker">Espace Client</p>
          <h1>Inscription</h1>
          <p className="muted">
            Cree ton compte pour acceder aux reservations et au suivi de ton espace.
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

          {message && <p className="success-msg">{message}</p>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
