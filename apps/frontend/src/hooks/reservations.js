const API_URL = import.meta.env.VITE_API_URL;

import { checkAPIStat } from "./fetchAPI";
import { sleep } from "../utils/sleep";

export async function clientReservation(setMessage, setIsLoading, setIsSent, payload) {
    setIsLoading(true);
    const result = await checkAPIStat();
    
    if(!result) {
        setIsLoading(false);
        return console.error("API pas disponible pour le frontend.");
    }

    try {
        if (!payload || !payload.surname || !payload.name || !payload.email || !payload.tel || !payload.message) throw new Error(`Erreur lors de la réception des données.`);
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            setIsSent(false);
            await sleep(2000);
            setMessage('Il est impossible de nous contacter. Veuillez-réessayer !')
            throw new Error(`Erreur requête HTTP : ${response.status}`);
        } else {
            setIsSent(true);
            setMessage('Message envoyée. Notre équipe vous fera un retour rapidement.')
        }
    } catch (e) {
        console.error("Erreur lors de l'envoie du message :", e);
    } finally {
        setIsLoading(false);
    }
}