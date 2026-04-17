const API_URL = import.meta.env.VITE_API_URL;

import { checkAPIStat } from "./fetchAPI";
import { sleep } from "../utils/sleep";

export async function clientReservation(setMessage, setIsLoading, setIsSent, setUser, payload) {
    setIsLoading(true);
    const result = await checkAPIStat();
    
    if(!result) {
        setIsLoading(false);
        return console.error("API pas disponible pour le frontend.");
    }

    try {
        if (!payload || !payload.watchId || !payload.returnDate) throw new Error(`Erreur lors de la réception des données.`);
        const response = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });
        if (response.status === 403) {
            setIsSent(false);
            await sleep(2000);
            return setMessage('Il est impossible d\'effectuer la réservation. Vous avez déjà une réservation en cours !')
        }
        
        if (!response.ok) {
            setIsSent(false);
            await sleep(2000);
            setMessage('Il est impossible d\'effectuer la réservation. Veuillez-réessayer !')
            throw new Error(`Erreur requête HTTP : ${response.status}`);
        } else {
            setIsSent(true);
            setMessage('Réservation effectuer. Notre équipe vous fera un retour rapidement concernant les accomptes de paiement et la livraison du produit par mail.')
        }
    } catch (e) {
        console.error("Erreur lors de la réservation de la montre :", e);
    } finally {
        setIsLoading(false);
    }
}