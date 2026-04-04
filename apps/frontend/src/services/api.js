const API_URL = import.meta.env.VITE_API_URL;

export const getWatches = async () => {
    try {
        const response = await fetch(`${API_URL}/watches`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur requête HTTP : ${response.status}`);
        }

        return await response.json();
    } catch (e) {
        console.error('Erreur lors de la récupération des montres par l\'API : ', error);
        throw error;
    }
}