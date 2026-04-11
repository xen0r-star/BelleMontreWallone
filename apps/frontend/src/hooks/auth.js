const API_URL = import.meta.env.VITE_API_URL;

import { useEffect } from "react";
import { checkAPIStat } from "./fetchAPI";

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