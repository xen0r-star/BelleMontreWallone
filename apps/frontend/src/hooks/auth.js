const API_URL = import.meta.env.VITE_API_URL;

import { useEffect } from "react";
import { checkAPIStat } from "./fetchAPI";

async function handleLogin(access_token) {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
            'X-API-KEY': `Bearer ${access_token}`,
            'Content-Type' : 'application/json'
        }
    });
    if (!response.ok) throw new Error(`Erreur requête HTTP : ${response.status}`);
    const data  = await response.json();
    console.log(data)
    if (!data) {
        setIsLoading(false);
        return console.error("Erreur lors de l'authentification lors de la récupération des informations utilisateurs.");
    } else {
        console.log("réussi")
    }
}

export async function clientAuth(setMessage, setIsLoading) {    
    useEffect(() => {
        setIsLoading(true);
        const clientAuth = async () => {
            const result = await checkAPIStat();
            if(!result) {
                setIsLoading(false);
                return console.error("API pas disponible pour le frontend.");
            }
            try {
                console.log("Try du auth");
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        "userName": "Dupont",
                        "password": "hash1"
                    })
                });
                if (!response.ok) throw new Error(`Erreur requête HTTP : ${response.status}`);
                const data  = await response.json();
                if (!data.refreshToken || !data.accessToken) {
                    setIsLoading(false);
                    return console.error("Erreur lors de l'authentification lors de la récupération des tokens.");
                } else {
                    const expiration = 60 * 15;
                    const expirationDay = 60 * 60 * 24 * 7;
                    document.cookie = `access_token=${data.accessToken};path=/; max-age=${expiration}; Secure; SameSite=Strict`;
                    document.cookie = `refresh_token=${data.refreshToken};path=/; max-age=${expirationDay}; Secure; SameSite=Strict`;
                    await handleLogin(data.accessToken);
                }
            } catch (e) {
                console.error("Erreur lors du chargement des données:", e);
            } finally {
                setIsLoading(false);
                setMessage("Connexion validee. Bienvenue dans votre espace.")
            }
        };
        clientAuth();
    }, [])
}