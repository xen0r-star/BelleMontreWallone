const API_URL = import.meta.env.VITE_API_URL;

import { useEffect } from "react";

export async function checkAPIStat() {
    try {
        const response = await fetch(`${API_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json'
            }
        });
        if (!response.ok) throw new Error(`Erreur requête HTTP : ${response.status}`);
        const data = await response.json();
        return (data.success === true && data.message === "API is healthy.") ? true : false;
    } catch (e) {
        console.error("Erreur lors du chargement des données:", e);
    }
}

export async function fetchWatches(setWatches, setIsLoading) {    
    useEffect(() => {
        setIsLoading(true);
        const fetchWatches = async () => {
            const result = await checkAPIStat();
            if(!result) {
                setIsLoading(false);
                return console.error("API pas disponible pour le frontend.");
            }
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

export async function fetchReservations(setReservations, setIsLoading) {    
    useEffect(() => {
        setIsLoading(true);
        const fetchReservations = async () => {
            const result = await checkAPIStat();
            if(!result) {
                setIsLoading(false);
                return console.error("API pas disponible pour le frontend.");
            }
            try {
                const response = await fetch(`${API_URL}/admin/reservations`, {
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });
                console.log(response.ok);
                if (!response.ok) throw new Error(`Erreur requête HTTP : ${response.status}`);
                const { data } = await response.json();
                console.log(data);
                if (data) {
                    setReservations(data);
                } else {
                    throw new Error(`Erreur requête HTTP : aucune data`);
                }
            } catch (e) {
                console.error("Erreur lors du chargement des données:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReservations();
    }, [])
}

export async function fetchWatchLocation(id, setLocation, setIsLoading) {
    setIsLoading(true);
    try {
        const response = await fetch(`${API_URL}/watches/${id}/location`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error(`Erreur requête HTTP : ${response.status}`);

        const { data } = await response.json();
        if (data) {
            setLocation(data);
        }
    }
    catch (e) {
        console.error("Erreur lors du chargement des disponibilités:", e);
    }
    finally {
        setIsLoading(false);
    }
           
}