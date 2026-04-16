const API_URL = import.meta.env.VITE_API_URL;

import { checkAPIStat } from "./fetchAPI";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function checkAuth(setUser, setVerification, setIsLoading) {
    setIsLoading(true);
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include'
    });
    if (response.status === 401) return setUser(null);
    if (!response.ok) throw new Error(`Erreur requête HTTP : ${response.status}`);

    const data  = await response.json();

    if (!data) {
        setIsLoading(false);
        return console.error("Erreur lors de l'authentification lors de la récupération des informations utilisateurs.");
    } else {
        setUser(data.user)
        setVerification(true);
    }
    setIsLoading(false);
}

export async function clientAuth(setMessage, setIsLoading, setVerification, setUser) {    
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
                "password": "$2y$13$TYjrxpTfrvq5/jYggPlPheahDSkWyx57Rz1adeF2JmT206pLFvBxm"
            })
        });
        
        if (!response.ok) {
            setVerification(false);
            await sleep(2000);
            setMessage("Vos identifiants sont incorrects. Veuillez-réessayer !")
            throw new Error(`Erreur requête HTTP : ${response.status}`);
        } else {
            setVerification(true);
            setMessage("Connexion validée. Bienvenue dans votre espace.")
        }
        const data  = await response.json();
        if (!data) {
            return console.error("Erreur lors de l'authentification lors de la récupération des informations utilisateur.");
        } else {
            setUser(data.user)
            setVerification(true);
        }
    } catch (e) {
        console.error("Erreur lors de la connexion :", e);
    } finally {
        setIsLoading(false);
    }
}

export async function clientLogout(setMessage, setIsLoading, setVerification, setUser) {
    setIsLoading(true);
    const result = await checkAPIStat();
    if(!result) {
        setIsLoading(false);
        return console.error("API pas disponible pour le frontend.");
    }
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            setVerification(false);
            await sleep(2000);
            setMessage("Impossible de vous déconnecter. Veuillez-réessayer !")
            throw new Error(`Erreur requête HTTP : ${response.status}`);
        } else {
            setVerification(true);
            setUser(null);
            setMessage("Déconnexion réussi. A bientôt chez BMW !")
        }
    } catch (e) {
        console.error("Erreur lors de la déconnexion :", e);
    } finally {
        setIsLoading(false);
    }
}

export async function clientAuthReg(setMessage, setIsLoading, setVerification, setUser) {    
    setIsLoading(true);
    const result = await checkAPIStat();
    if(!result) {
        setIsLoading(false);
        return console.error("API pas disponible pour le frontend.");
    }
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ // A finir
                "userName": "Test",
                "email": "Test@gmail.com",
                "password": "mdptest1234",
                "dateOfBirth": "01-01-2000"
            })
        });
        
        if (!response.ok) {
            setVerification(false);
            await sleep(2000);
            setMessage("Il est impossible de vous connecter. Veuillez-réessayer !")
            throw new Error(`Erreur requête HTTP : ${response.status}`);
        } else {
            setVerification(true);
            setMessage("Inscription validée. Bienvenue dans votre espace.")
        }
        const data  = await response.json();
        console.log(data);
        if (!data) {
            return console.error("Erreur lors de l'authentification lors de la récupération des informations utilisateur.");
        } else {
            setUser(data.user)
            setVerification(true);
        }
    } catch (e) {
        console.error("Erreur lors de la connexion :", e);
    } finally {
        setIsLoading(false);
    }
}