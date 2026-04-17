import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { clientContact } from "../hooks/contact";
import { sleep } from "../utils/sleep";

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
    const [message, setMessage] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const regex = /^\+?[0-9 .()\-]{7,20}$/;

    async function handleHelping(e) {
        setMessage('');
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        if (!data.surname || !data.name || !data.email || !data.tel || !data.message || !regex.test(data.tel)) {
            setIsSent(false);
            return setMessage('Merci de remplir tout les champs obligatoire correctement [*] !')
        }

        const payload = {
            surname: data.surname,
            name: data.name,
            email: data.email,
            tel: data.tel,
            message: data.message
        }
        
        await clientContact(setMessage, setIsLoading, setIsSent, payload);
        await sleep(2000);
        setMessage('Réinitialisation du formulaire en cours...');
        await sleep(1000);
        form.reset();
        setMessage('');
    }

    

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />

            <main className="mx-auto my-12 grid w-[min(1240px,calc(100%-5rem))] gap-8 max-[700px]:w-[calc(100%-1.5rem)]">
                <section className="grid gap-4 border border-[#ddd6cc] bg-linear-to-br from-[#f7f5f1] to-white p-[clamp(1.5rem,4vw,3rem)]">
                    <p className="m-0 text-[0.8rem] uppercase tracking-[0.12em] text-[#8c8d8e]">Accompagnement Signature</p>
                    <h1>Maison de Conseils Privés</h1>
                    <p className="max-w-z190 text-[1.03rem] leading-[1.65] text-[#8c8d8e]">
                        Une équipe dédiée aux collectionneurs vous accompagne avec discrétion
                        pour le choix d'une pièce, la réservation et l'organisation de
                        rendez-vous confidentiels.
                    </p>
                </section>

                <section className="border border-[#ddd6cc] bg-[color-mix(in_srgb,white_88%,#faf8f5)] p-[clamp(1.2rem,3vw,2rem)]">
                    <h2>Questions fréquentes</h2>
                    {faqs.map((faq) => (
                        <details key={faq.q} className="border-b border-[#ddd6cc] py-4">
                            <summary className="cursor-pointer text-[1.02rem] font-semibold">{faq.q}</summary>
                            <p className="mt-2 leading-[1.6] text-[color-mix(in_srgb,#1c1d21_80%,white)]">{faq.a}</p>
                        </details>
                    ))}
                </section>
                
                <section className="border border-[#ddd6cc] bg-[color-mix(in_srgb,white_88%,#faf8f5)] p-[clamp(1.2rem,3vw,2rem)]">
                    <h2 className="font-bold">Contactez-nous</h2>
                    <p className="text-gray-400 p-5">[*] : champ obligatoire (tous)</p>
                    <form className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1" onSubmit={handleHelping}>
                        <input required placeholder="[*] Nom" name="surname" className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" />
                        <input required placeholder="[*] Prénom" name="name" className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" />
                        <input required type="email" placeholder="[*] Email" name="email" className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" />
                        <input placeholder="[*] Téléphone" name="tel" className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" />
                        <textarea required rows="4" placeholder="[*] Votre message" name="message" className="col-span-2 w-full resize-none border border-[#ddd6cc] bg-white px-3 py-[0.65rem] max-[700px]:col-span-1" />
                        <button className="col-span-2 inline-flex w-fit cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black max-[700px]:col-span-1" type="submit">Envoyer la demande</button>
                    </form>
                    <br/>
                    {message && <p className={isSent ? "border border-[#7ca584] bg-[#edf9ef] p-3 text-[#275030]" : "border border-[#a57c7c] bg-[#f9eded] p-3 text-[#502727]"}>{message}</p>}
                </section>
            </main>
            
            <SiteFooter />
        </div>
    );
}
