import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { formatPrice } from "../data/watches";
import { fetchWatches, fetchWatchLocation } from "../hooks/fetchAPI";
import { checkAuth } from "../hooks/auth";
import { clientReservation } from "../hooks/reservations";
import { sleep } from "../utils/sleep";

function ImageWithSkeleton({ src, alt, className }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative w-full h-135 ${className || ""}`}>
            {!isLoaded && <div className="absolute inset-0 animate-pulse bg-linear-to-r from-[#ece7df] via-[#f7f4ef] to-[#ece7df]" aria-hidden="true" />}
            <img
                src={src}
                alt={alt}
                className="block h-full w-full object-contain p-24"
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
}

export default function WatchDetailPage() {
    const [watches, setWatches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);
    const [sent, setSent] = useState(false);
    const { id } = useParams();

    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [location, setLocation] = useState(null);
    const[isLocLoading, setIsLocLoading] = useState(false);
    
    useEffect(() => {
        const checkUser = async () => {
            await checkAuth(setUser, setIsSent, setIsLoading);
        };
        checkUser();
    }, []);

    useEffect(() => {
        if(isModal2Open && id) {
            fetchWatchLocation(id, setLocation, setIsLocLoading);
        }
    }, [isModal2Open, id]);

    fetchWatches(setWatches, setIsLoading);
    if (!watches || watches.length === 0 || isLoading) {
        return (<div className="flex min-h-screen flex-col">
            <SiteHeader />
            
            <main className="mx-auto my-8 grid w-[min(1380px,calc(100%-5rem))] grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 max-[1024px]:grid-cols-1 max-[700px]:w-[calc(100%-1.5rem)]">
                <p>Chargement de la montre...</p>
            </main>
            <SiteFooter />
        </div>);
    }

    const watch = watches.find(item => Number(item.watchId) === Number(id));
    
    if (!watch) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="mx-auto my-8 grid w-[min(1240px,calc(100%-5rem))] justify-items-start gap-4 border border-[#ddd6cc] bg-[color-mix(in_srgb,white_85%,#faf8f5)] p-6 max-[700px]:w-[calc(100%-1.5rem)]">
                    <h1>Montre introuvable</h1>
                    <Link to="/collection" className="inline-flex w-fit cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black">
                        Retour a la collection
                    </Link>
                </main>
                <SiteFooter />
            </div>
        );
    }


    async function handleReservation(e) {
        setMessage('');
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!data.date || !id) {
            setSent(false);
            return setMessage('Des identifiants sont manquants. Merci de réessayer !')
        }

        const payload = {
            watchId: parseInt(id, 10),
            returnDate: data.date
        };
        
        await clientReservation(setMessage, setIsLoading, setIsSent, setUser, payload);
        await sleep(4000);
        setMessage('Réinitialisation du formulaire en cours...');
        await sleep(1000);
        form.reset();
        setMessage('');
    }

    if (!user) {
        return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            
            <main className="mx-auto my-8 ml-6.25 mr-6.25 grid w-[min(1380px,calc(100%-5rem))] grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 max-[1024px]:grid-cols-1 max-[700px]:w-[calc(100%-1.5rem)]">
                <section>
                    <ImageWithSkeleton
                        src={watch.imageUrl}
                        alt={watch.model}
                        className="h-135 border-2 border-[#ddd6cc] bg-[#eaeaea] max-[700px]:h-90"
                    />
                </section>

                <section className="mr-6.25 grid content-start gap-4">
                    <p className="m-0 text-[0.8rem] uppercase tracking-[0.12em] text-[#8c8d8e]">{watch.brand || "/"}</p>

                    <h1 className="text-3xl font-bold font-['Cormorant Garamond']">{watch.model}</h1>
                    <div className="text-[1.2rem]">Prix de vente : {formatPrice(watch.retailPrice)}<hr/>Prix conseillé : {formatPrice(watch.marketPrice)}</div>
                    <p className="text-[#8c8d8e]">{watch.watchDesc ? ("Description : " + watch.watchDesc) : "Aucune description trouvé."}</p>

                    <ul className="m-0 list-none border-t border-[#ddd6cc] p-0">
                        <li className="flex justify-between border-b border-[#ddd6cc] py-2 text-[0.95rem]">
                            <span>Mouvement</span>
                            <span>{watch.movement || "/"}</span>
                        </li>
                        <li className="flex justify-between border-b border-[#ddd6cc] py-2 text-[0.95rem]">
                            <span>Diamètre</span>
                            <span>{watch.diameter + "mm" || "/"}</span>
                        </li>
                        <li className="flex justify-between border-b border-[#ddd6cc] py-2 text-[0.95rem]">
                            <span>Matériel</span>
                            <span>{watch.materials || "/"}</span>
                        </li>
                        <li className="flex justify-between border-b border-[#ddd6cc] py-2 text-[0.95rem]">
                            <span>Étanchéité</span>
                            <span>{watch.watertightness || "/"}</span>
                        </li>
                    </ul>
                    {<button type="button" className="inline-flex w-fit cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black">
                        Demander une réservation [/]
                    </button>}
                    <div className="text-red-700 font-bold">
                        ⚠️ Attention : Les réservations sont réserver à nos membres. Pour réserver, veuillez vous connecter ! ⚠️
                    </div>
                </section>
            </main>


            <SiteFooter />
        </div>
    );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            
            <main className="mx-auto my-8 ml-6.25 mr-6.25 grid w-[min(1380px,calc(100%-5rem))] grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 max-[1024px]:grid-cols-1 max-[700px]:w-[calc(100%-1.5rem)]">
                <section>
                    <ImageWithSkeleton
                        src={watch.imageUrl}
                        alt={watch.model}
                        className="h-135 border-2 border-[#ddd6cc] bg-[#eaeaea] max-[700px]:h-90"
                    />
                </section>

                <section className="mr-6.25 grid content-start gap-4">
                    <p className="m-0 text-[0.8rem] uppercase tracking-[0.12em] text-[#8c8d8e]">{watch.brand || "/"}</p>

                    <h1 className="text-3xl font-bold font-['Cormorant Garamond']">{watch.model}</h1>
                    <div className="text-[1.2rem]">Prix de vente : {formatPrice(watch.retailPrice)}<hr/>Prix conseillé : {formatPrice(watch.marketPrice)}</div>
                    <p className="text-[#8c8d8e]">{watch.watchDesc ? ("Description : " + watch.watchDesc) : "Aucune description trouvé."}</p>

                    <ul className="m-0 list-none border-t border-[#ddd6cc] p-0">
                        <li className="flex justify-between border-b border-[#ddd6cc] py-2 text-[0.95rem]">
                            <span>Mouvement</span>
                            <span>{watch.movement || "/"}</span>
                        </li>
                        <li className="flex justify-between border-b border-[#ddd6cc] py-2 text-[0.95rem]">
                            <span>Diamètre</span>
                            <span>{watch.diameter + "mm" || "/"}</span>
                        </li>
                        <li className="flex justify-between border-b border-[#ddd6cc] py-2 text-[0.95rem]">
                            <span>Matériel</span>
                            <span>{watch.materials || "/"}</span>
                        </li>
                        <li className="flex justify-between border-b border-[#ddd6cc] py-2 text-[0.95rem]">
                            <span>Étanchéité</span>
                            <span>{watch.watertightness || "/"}</span>
                        </li>
                    </ul>
                    {<button type="button" className="inline-flex w-fit cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black" onClick={() => setIsModalOpen(true)}>
                        Demander une réservation
                    </button>}
                    {<button type="button" className="inline-flex w-fit cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black" onClick={() => setIsModal2Open(true)}>
                        Disponibilités
                    </button>}
                    
                </section>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 z-99 grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true">
                    <div className="w-full max-w-190 border border-[#ddd6cc] bg-white p-[clamp(1rem,3vw,2rem)]">
                        <button
                            type="button"
                            className="float-right cursor-pointer border-none bg-transparent text-[#8c8d8e]"
                            onClick={() => {
                                setIsModalOpen(false);
                                setSent(false);
                            }}
                        >
                            Fermer
                        </button>

                        <h2>Réservation - {watch.model}</h2>
                        <form className="grid gap-3" onSubmit={handleReservation}>
                            Durée de réservation souhaitée :
                            <input required type="date" name="date" min={new Date().toISOString().split('T')[0]} max={'2030-01-01'} className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" />
                            <button className="inline-flex w-fit cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black" type="submit">Envoyer</button>
                        </form>
                        <br/>
                        {message && <p className={isSent ? "border border-[#7ca584] bg-[#edf9ef] p-3 text-[#275030]" : "border border-[#a57c7c] bg-[#f9eded] p-3 text-[#502727]"}>{message}</p>}


                    </div>
                </div>
            )}

            {isModal2Open && (
                <div className="fixed inset-0 z-99 grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true">
                    <div className="w-full max-w-190 border border-[#ddd6cc] bg-white p-[clamp(1rem,3vw,2rem)]">
                        <button
                            type="button"
                            className="float-right cursor-pointer border-none bg-transparent text-[#8c8d8e] hover:text-black"
                            onClick={() => {
                                setIsModal2Open(false);
                            }}
                        >
                            Fermer
                        </button>

                        <h2 className="text-2xl font-['Cormorant_Garamond'] mb-6">Disponibilités - {watch.model}</h2>
                        {isLocLoading ? (
                            <p className="animate-pulse py-4 italic text-[#8c8d8e]">Recherche des stocks en magasin...</p>
                        ) : location ? (
                            <div className="grid gap-3 border-t border-[#ddd6cc] pt-4">
                                <div className="flex justify-between border-b border-[#eee] py-2 text-[0.95rem]">
                                    <span className="font-bold">Ville</span>
                                    <span>{location.cityName}</span>
                                </div>
                                <div className="flex justify-between border-b border-[#eee] py-2 text-[0.95rem]">
                                    <span className="font-bold">Magasin</span>
                                    <span>{location.storeName}</span>
                                </div>
                                <div className="flex justify-between border-b border-[#eee] py-2 text-[0.95rem]">
                                    <span className="font-bold">Armoire</span>
                                    <span>{location.cabinetName}</span>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button 
                                        className="inline-flex cursor-pointer border border-[#141823] bg-[#141823] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#faf8f5] hover:bg-black"
                                        onClick={() => {
                                            setIsModal2Open(false);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Réserver cette pièce
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-red-600">Aucune information de stock disponible pour cette montre.</p>
                        )}
                    </div>
                </div>
            )}
            <SiteFooter />
        </div>
    );
}
