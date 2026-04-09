const API_URL = import.meta.env.VITE_API_URL;

import { useEffect } from "react";

export function fetchWatches(setWatches, setIsLoading) {
   useEffect(() => {
        setIsLoading(true);
        
        const fetchWatches = async () => {
            try {
                const response = await fetch(`${API_URL}/watches`, {
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });
                if (!response.ok) throw new Error(`Erreur requête HTTP : ${response.status}`);
                const { data } = await response.json();
                if (data) {
                    setWatches(data);
                } else {
                    throw new Error(`Erreur requête HTTP : aucune data`);
                }
            } catch (e) {
                console.error("Erreur lors du chargement des données:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWatches();
    }, [])
}