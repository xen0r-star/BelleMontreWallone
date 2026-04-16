const API_URL = import.meta.env.VITE_API_URL;

import { checkAPIStat } from "./fetchAPI";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function clientContact(setMessage, setIsLoading, setIsSent) {
    setIsLoading(true);
    const result = await checkAPIStat();
    if(!result) {
        setIsLoading(false);
        return console.error("API pas disponible pour le frontend.");
    }
    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ // A finir
                "surname": "Test",
                "name": "Test",
                "email": "Test@gmail.com",
                "tel": "+32 123 45 67 89",
                "message": "testmsg"
            })
        });
        if (!response.ok) {
            setIsSent(false);
            await sleep(2000);
            setMessage("Il est impossible de nous contacter. Veuillez-réessayer !")
            throw new Error(`Erreur requête HTTP : ${response.status}`);
        } else {
            setIsSent(true);
            setMessage("Message envoyée. Notre équipe vous fera un retour rapidement.")
        }
    } catch (e) {
        console.error("Erreur lors de l'envoie du message :", e);
    } finally {
        setIsLoading(false);
    }
}