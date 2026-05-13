const API_URL = import.meta.env.VITE_API_URL;

import { checkAPIStat } from "./fetchAPI";

export async function subscribeNewsletter(email, setStatus) {
    const result = await checkAPIStat();

    if (!result) {
        setStatus('error');
        return console.error("API pas disponible pour le frontend.");
    }

    try {
        const response = await fetch(`${API_URL}/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email })
        });

        if (response.status === 409) {
            setStatus('already');
            return;
        }

        if (!response.ok) {
            setStatus('error');
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        setStatus('success');
    } catch (e) {
        setStatus('error');
        console.error("Erreur lors de l'inscription à la newsletter :", e);
    }
}
