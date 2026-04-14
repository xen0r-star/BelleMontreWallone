import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const style = {
    page: `min-h-screen bg-[#f4efe7] text-[#1c1d21]`,
    container: `max-w-[1440px] mx-auto px-6`,
    main: `py-10 md:py-14 flex justify-center`,
    card: `w-full max-w-[640px] rounded-[28px] border border-[#d8cdbd] bg-[#fffaf3] p-6 md:p-10 shadow-[0_18px_50px_rgba(28,29,33,0.06)]`,
    kicker: `text-[0.72rem] uppercase tracking-[0.2em] text-[#8c775f] mb-3`,
    title: `font-['Cormorant_Garamond',serif] text-[2.5rem] md:text-[3.4rem] leading-none text-[#1c1d21]`,
    muted: `mt-4 text-[0.95rem] leading-relaxed text-[#5f6672]`,
    form: `mt-8 grid gap-4`,
    label: `grid gap-2 text-[0.82rem] uppercase tracking-[0.12em] text-[#6f6b64]`,
    input: `h-12 rounded-full border border-[#d8cdbd] bg-white px-5 text-[0.95rem] text-[#1c1d21] placeholder:text-[#85909f] outline-none transition-colors focus:border-[#1c1d21]`,
    btn: `mt-2 inline-flex items-center justify-center rounded-full border border-[#1c1d21] bg-[#1c1d21] px-6 py-3 text-[0.78rem] uppercase tracking-[0.12em] font-semibold text-[#faf5ed] transition-colors duration-200 hover:bg-transparent hover:text-[#1c1d21]`,
    authSwitch: `mt-6 text-[0.9rem] text-[#5f6672]`,
    authLink: `font-semibold text-[#1c1d21] underline underline-offset-4 decoration-[#1c1d21]/40 hover:decoration-[#1c1d21]`,
    success: `mt-6 rounded-[22px] border border-[#c8d4c2] bg-[#eef5ea] px-5 py-4 text-[0.95rem] text-[#355044]`,
};

export default function RegisterPage() {
    const [message, setMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        setMessage("Inscription enregistree. Tu peux maintenant te connecter.");
    }

    return (
        <div className={style.page}>
            <SiteHeader />

            <main className={`${style.container} ${style.main}`}>
                <section className={style.card}>
                    <p className={style.kicker}>Espace Client</p>

                    <h1 className={style.title}>Inscription</h1>
                    <p className={style.muted}>
                        Cree ton compte pour acceder aux reservations et au suivi de ton espace.
                    </p>

                    <form className={style.form} onSubmit={handleSubmit}>
                        <label className={style.label}>
                            Username
                            <input className={style.input} name="username" required placeholder="username" />
                        </label>

                        <label className={style.label}>
                            Password
                            <input
                                className={style.input}
                                name="password"
                                type="password"
                                required
                                placeholder="password"
                            />
                        </label>

                        <label className={style.label}>
                            Email
                            <input className={style.input} name="email" type="email" required placeholder="email" />
                        </label>

                        <label className={style.label}>
                            Date de naissance
                            <input className={style.input} name="birthDate" type="date" required />
                        </label>

                        <button className={style.btn} type="submit">
                            S'inscrire
                        </button>
                    </form>

                    <p className={style.authSwitch}>
                        Deja un compte ? <Link to="/connexion" className={style.authLink}>Connexion</Link>
                    </p>

                    {message && <p className={style.success}>{message}</p>}
                </section>
            </main>
            
            <SiteFooter />
        </div>
    );
}
