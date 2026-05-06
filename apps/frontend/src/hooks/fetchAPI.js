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

export function fetchWatches(setWatches, setPagination, setIsLoading, page, filters) {
    const { brand, materials, movement, diameter, minRetailPrice, maxRetailPrice } = filters;
    useEffect(() => {
        setIsLoading(true);
        const load = async () => {
            const healthy = await checkAPIStat();
            if (!healthy) {
                setIsLoading(false);
                return console.error("API pas disponible pour le frontend.");
            }
            try {
                const params = new URLSearchParams({ page: String(page) });
                if (brand) params.set('brand', brand);
                if (materials) params.set('materials', materials);
                if (movement) params.set('movement', movement);
                if (diameter) params.set('diameter', diameter);
                if (minRetailPrice) params.set('minRetailPrice', minRetailPrice);
                if (maxRetailPrice) params.set('maxRetailPrice', maxRetailPrice);

                const response = await fetch(`${API_URL}/watches?${params}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error(`Erreur requête HTTP : ${response.status}`);
                const json = await response.json();
                if (json.data) {
                    setWatches(json.data);
                    setPagination(json.pagination);
                } else {
                    throw new Error('Erreur requête HTTP : aucune data');
                }
            } catch (e) {
                console.error("Erreur lors du chargement des données:", e);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [page, brand, materials, movement, diameter, minRetailPrice, maxRetailPrice]);
}

export function fetchWatchFilters(setFilterOptions) {
    useEffect(() => {
        const load = async () => {
            try {
                const response = await fetch(`${API_URL}/watches/filter`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) return;
                const data = await response.json();
                setFilterOptions(data);
            } catch (e) {
                console.error("Erreur lors du chargement des filtres:", e);
            }
        };
        load();
    }, []);
}

export function fetchReservations(setReservations, setIsLoading) {
    useEffect(() => {
        setIsLoading(true);
        const load = async () => {
            const healthy = await checkAPIStat();
            if (!healthy) {
                setIsLoading(false);
                return console.error("API pas disponible pour le frontend.");
            }
            try {
                const response = await fetch(`${API_URL}/admin/reservations`, {
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    credentials: 'include'
                });
                if (!response.ok) throw new Error(`Erreur requête HTTP : ${response.status}`);
                const { data } = await response.json();
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
        load();
    }, [])
}

export async function toggleWatchActif(watchId, isActif) {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${API_URL}/admin/watches/${watchId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ isActif: Boolean(isActif) })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        return json.data ?? null;
    } catch (e) {
        console.error("Erreur toggle isActif:", e);
        return null;
    }
}

export async function updateAdminWatchAPI(watchId, fields) {
    try {
        const response = await fetch(`${API_URL}/admin/watches/${watchId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(fields)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        return json.data ?? null;
    } catch (e) {
        console.error("Erreur updateAdminWatch:", e);
        return null;
    }
}

export async function createAdminWatchAPI(fields) {
    try {
        const response = await fetch(`${API_URL}/admin/watches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(fields)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        return json.data ?? null;
    } catch (e) {
        console.error("Erreur createAdminWatch:", e);
        return null;
    }
}

export async function deleteAdminWatchAPI(watchId) {
    try {
        const response = await fetch(`${API_URL}/admin/watches/${watchId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return true;
    } catch (e) {
        console.error("Erreur deleteAdminWatch:", e);
        return false;
    }
}

export async function fetchWatchLocation(id, setLocation, setIsLoading) {
    setIsLoading(true);
    try {
        const response = await fetch(`${API_URL}/watches/${id}`, {
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
