import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { clientContact } from "../hooks/auth";

const style = {
    page: "min-h-screen bg-[#f4efe7] text-[#1c1d21]",
    container: "max-w-[1440px] mx-auto px-6 py-10 md:py-14 grid gap-8 lg:gap-10",
    hero: "rounded-[30px] border border-[#d8cdbd] bg-[linear-gradient(135deg,#fffaf3_0%,#f4ede2_100%)] p-6 md:p-10 shadow-[0_18px_50px_rgba(28,29,33,0.06)]",
    kicker: "text-[0.72rem] uppercase tracking-[0.2em] text-[#8c775f] mb-3",
    title: "font-['Cormorant_Garamond',serif] text-[2.5rem] md:text-[4rem] leading-none text-[#1c1d21] max-w-[12ch]",
    intro: "mt-5 max-w-[68ch] text-[0.98rem] md:text-[1.05rem] leading-relaxed text-[#5f6672]",
    card: "rounded-[28px] border border-[#d8cdbd] bg-[#fffaf3] p-6 md:p-8 shadow-[0_18px_50px_rgba(28,29,33,0.05)]",
    sectionTitle: "font-['Cormorant_Garamond',serif] text-[1.8rem] md:text-[2.2rem] text-[#1c1d21] mb-6",
    faqItem: "group rounded-[22px] border border-[#e1d7c8] bg-[#f7f2ea] px-5 py-4 transition-colors open:bg-white",
    summary: "cursor-pointer list-none text-[0.98rem] font-medium text-[#1c1d21] flex items-center justify-between gap-4",
    faqText: "pt-4 text-[0.95rem] leading-relaxed text-[#5f6672]",
    form: "grid gap-4",
    input: "h-12 rounded-full border border-[#d8cdbd] bg-white px-5 text-[0.95rem] text-[#1c1d21] placeholder:text-[#85909f] outline-none transition-colors focus:border-[#1c1d21]",
    textarea: "min-h-[140px] rounded-[22px] border border-[#d8cdbd] bg-white px-5 py-4 text-[0.95rem] text-[#1c1d21] placeholder:text-[#85909f] outline-none transition-colors focus:border-[#1c1d21]",
    btn: "inline-flex items-center justify-center rounded-full border border-[#1c1d21] bg-[#1c1d21] px-6 py-3 text-[0.78rem] uppercase tracking-[0.12em] font-semibold text-[#faf5ed] transition-colors duration-200 hover:bg-transparent hover:text-[#1c1d21]",
    success: "rounded-[22px] border border-[#c8d4c2] bg-[#eef5ea] px-5 py-4 text-[0.95rem] text-[#355044]",
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
        <div className={style.page}>
            <SiteHeader />

            <main className={style.container}>
                <section className={style.hero}>
                    <p className={style.kicker}>Accompagnement Signature</p>
                    <h1 className={style.title}>Maison de Conseils Privés</h1>
                    <p className={style.intro}>
                        Une équipe dédiée aux collectionneurs vous accompagne avec discrétion
                        pour le choix d'une pièce, la réservation et l'organisation de
                        rendez-vous confidentiels.
                    </p>
                </section>

                <section className={style.card}>
                    <h2 className={style.sectionTitle}>Questions fréquentes</h2>
                    {faqs.map((faq) => (
                        <details key={faq.q} className={style.faqItem}>
                            <summary className={style.summary}>{faq.q}</summary>
                            <p className={style.faqText}>{faq.a}</p>
                        </details>
                    ))}
                </section>

                <section className={style.card}>
                    <h2 className={style.sectionTitle}>Contactez-nous</h2>
                    {!isSent ? (
                        <form className={style.form} onSubmit={handleSubmit}>
                            <input className={style.input} required placeholder="Nom" />
                            <input className={style.input} required placeholder="Prénom" />
                            <input className={style.input} required type="email" placeholder="Email" />
                            <input className={style.input} placeholder="Téléphone" />
                            <textarea className={style.textarea} required rows="4" placeholder="Votre message" />
                            <button className={style.btn} type="submit">Envoyer la demande</button>
                        </form>
                        
                    ) : (
                        <p className={style.success}>
                            Message envoyée. Notre équipe vous fera un retour rapidement.
                        </p>
                    )}
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
