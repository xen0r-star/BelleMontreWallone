const API_URL = import.meta.env.VITE_API_URL;

import { useEffect } from "react";
import { checkAPIStat } from "./fetchAPI";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function handleLogin() {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) throw new Error(`Erreur requête HTTP : ${response.status}`);

    const data  = await response.json();

    if (!data) {
        setIsLoading(false);
        return console.error("Erreur lors de l'authentification lors de la récupération des informations utilisateurs.");
    } else {
        console.log("Connexion réussi")
        // Finir le reste
    }
}

export async function clientAuth(setMessage, setIsLoading, setVerification) {    
    setIsLoading(true);
    const result = await checkAPIStat();
    if(!result) {
        setIsLoading(false);
        return console.error("API pas disponible pour le frontend.");
    }
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ // A finir
                "userName": "Dupont",
                "password": "hash1"
            })
        });
        
        if (!response.ok) {
            await sleep(5000);
            setVerification(false);
            setMessage("Vos identifiants sont incorrects. Veuillez-réessayer !")
            setIsLoading(false);
            throw new Error(`Erreur requête HTTP : ${response.status}`);
        }
        const data  = await response.json();
        if (!data) {
            return console.error("Erreur lors de l'authentification lors de la récupération des informations utilisateur.");
        } else {
            await handleLogin();
        }
    } catch (e) {
        console.error("Erreur lors de la connexion :", e);
    } finally {
        await sleep(5000);
        setVerification(true);
        setMessage("Connexion validée. Bienvenue dans votre espace.")
        setIsLoading(false);
    }
}