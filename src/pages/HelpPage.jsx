import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const faqs = [
  {
    q: "Comment se deroule la reservation ?",
    a: "Nous confirmons votre demande sous 24h puis un conseiller vous accompagne jusqu'a la livraison."
  },
  {
    q: "Quels sont les delais de livraison ?",
    a: "En general entre 3 et 7 jours ouvres selon la disponibilite de la piece."
  },
  {
    q: "Proposez-vous des rendez-vous prives ?",
    a: "Oui, en salon ou en visio, selon vos preferences."
  }
];

export default function HelpPage() {
  const [isSent, setIsSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setIsSent(true);
  }

  return (
    <div className="page-root">
      <SiteHeader />
      <main className="container help-layout">
        <section className="help-hero">
          <p className="kicker">Accompagnement Signature</p>
          <h1>Maison de Conseils Prives</h1>
          <p className="muted help-intro">
            Une equipe dediee aux collectionneurs vous accompagne avec discretion
            pour le choix d'une piece, la reservation et l'organisation de
            rendez-vous confidentiels.
          </p>
        </section>

        <section className="help-section-card">
          <h2>Questions frequentes</h2>
          {faqs.map((faq) => (
            <details key={faq.q} className="faq-item">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </section>

        <section className="help-section-card">
          <h2>Contactez-nous</h2>
          {!isSent ? (
            <form className="form-grid help-form" onSubmit={handleSubmit}>
              <input required placeholder="Nom" />
              <input required placeholder="Prenom" />
              <input required type="email" placeholder="Email" />
              <input placeholder="Telephone" />
              <textarea required rows="4" placeholder="Votre message" />
              <button className="btn" type="submit">Envoyer la demande</button>
            </form>
          ) : (
            <p className="success-msg">
              Message envoye. Notre equipe te repond rapidement.
            </p>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
