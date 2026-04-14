import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

// Place ton objet de styles Tailwind ici (ex: const style = { ... })
const style = {
    
};

const faqs = [
    {
        q: "Comment se déroule la réservation ?",
        a: "Nous confirmons votre demande sous 24h puis un conseiller vous accompagne jusqu'à la livraison."
    },
    {
        q: "Quels sont les délais de livraison ?",
        a: "En général entre 3 et 7 jours ouvres selon la disponibilité de la pièce."
    },
    {
        q: "Proposez-vous des rendez-vous privés ?",
        a: "Oui, en salon ou en visio-conférence, selon vos préférences."
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
                    <h1>Maison de Conseils Privés</h1>
                    <p className="muted help-intro">
                        Une équipe dédiée aux collectionneurs vous accompagne avec discrétion
                        pour le choix d'une pièce, la réservation et l'organisation de
                        rendez-vous confidentiels.
                    </p>
                </section>

                <section className="help-section-card">
                    <h2>Questions fréquentes</h2>
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
                            <input required placeholder="Prénom" />
                            <input required type="email" placeholder="Email" />
                            <input placeholder="Téléphone" />
                            <textarea required rows="4" placeholder="Votre message" />
                            <button className="btn" type="submit">Envoyer la demande</button>
                        </form>
                        
                    ) : (
                        <p className="success-msg">
                            Message envoyée. Notre équipe vous fera un retour rapidement.
                        </p>
                    )}
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
