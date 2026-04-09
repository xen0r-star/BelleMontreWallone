import { useEffect } from "react";
import { getWatches } from '../api';

export function fetchWatches(setWatches, setIsLoading) {
   useEffect(() => {
        const fetchWatches = async () => {
            try {
                const response = await getWatches();
                if (response && response.data) {
                    setWatches(response.data);
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