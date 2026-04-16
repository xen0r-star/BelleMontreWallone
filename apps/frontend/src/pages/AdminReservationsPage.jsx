import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { fetchWatches, fetchReservations } from "../hooks/fetchAPI";
        
function toDateTime(date, time) {
    return new Date(`${date}T${time}:00`);
}

function formatDateFr(dateIso) {
    const date = new Date(`${dateIso}T00:00:00`);
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(date);
}

function computeStatus(reservationDate, reservationTime, returnDate) {
    const now = new Date();
    const start = toDateTime(reservationDate, reservationTime);
    const end = new Date(`${returnDate}T23:59:59`);

    if (now < start) {
        return { label: "A venir chercher", className: "inline-block whitespace-nowrap border border-[#ddd6cc] bg-[#fef3c7] px-2 py-1 text-[0.72rem] uppercase text-[#854d0e]" };
    }

    if (now > end) {
        return { label: "Dépasser", className: "inline-block whitespace-nowrap border border-[#ddd6cc] bg-[#ffe4e6] px-2 py-1 text-[0.72rem] uppercase text-[#9f1239]" };
    }

    return { label: "En cours", className: "inline-block whitespace-nowrap border border-[#ddd6cc] bg-[#d1fae5] px-2 py-1 text-[0.72rem] uppercase text-[#065f46]" };
}

function computeDurationDays(reservationDate, returnDate) {
    const start = new Date(`${reservationDate}T00:00:00`);
    const end = new Date(`${returnDate}T00:00:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays + 1);
}

export default function AdminReservationsPage() {
    const [watches, setWatches] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    fetchWatches(setWatches, setIsLoading);
    fetchReservations(setReservations, setIsLoading);

    const allRows = useMemo(() => {
        if (!reservations || !watches) return [];
    
        return reservations.map((item) => ({
            ...item,
            watch: watches.find((watch) => watch.id === item.watchId),
            status: computeStatus(item.reservationDate, item.reservationTime, item.returnDate),
            durationDays: computeDurationDays(item.reservationDate, item.returnDate)
        }));
    }, [reservations, watches]);

    const rows = useMemo(() => {
        return allRows.filter((row) => {
            const statusOk =
                statusFilter === "all" ||
                (statusFilter === "current" && row.status.className.includes("current")) ||
                (statusFilter === "future" && row.status.className.includes("future")) ||
                (statusFilter === "late" && row.status.className.includes("late"));

            const fromOk = !fromDate || row.reservationDate >= fromDate;
            const toOk = !toDate || row.reservationDate <= toDate;

            return statusOk && fromOk && toOk;
        });
    }, [allRows, statusFilter, fromDate, toDate]);

    const kpis = useMemo(() => {
        if (!watches || reservations) return [];

        const waiting = allRows.filter((row) => row.status.className.includes("future")).length;
        const late = allRows.filter((row) => row.status.className.includes("late")).length;

        return {
            totalWatches: watches.length,
            waitingReservations: waiting,
            lateReturns: late
        };
    }, [allRows, watches]);

    if (!watches || watches.length === 0 || !reservations || reservations.length === 0 || isLoading) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader isAdmin />
                <main className="mx-auto my-8 w-[min(1380px,calc(100%-5rem))] max-[700px]:w-[calc(100%-1.5rem)]">
                    <section className="mb-4 grid grid-cols-3 gap-3 max-[1024px]:grid-cols-1">
                        <article className="border border-[#ddd6cc] bg-white p-4">
                            <p className="m-0 text-[0.74rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Montres</p>
                            <p className="m-0 mt-2 font-serif text-[1.8rem]">/</p>
                        </article>
                        <article className="border border-[#ddd6cc] bg-white p-4">
                            <p className="m-0 text-[0.74rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Reservations en attente</p>
                            <p className="m-0 mt-2 font-serif text-[1.8rem]">/</p>
                        </article>
                        <article className="border border-[#ddd6cc] bg-white p-4">
                            <p className="m-0 text-[0.74rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Retours en retard</p>
                            <p className="m-0 mt-2 font-serif text-[1.8rem]">/</p>
                        </article>
                    </section>
                    <section className="mb-4 border border-[#ddd6cc] bg-[color-mix(in_srgb,white_85%,#faf8f5)] p-4">
                        <h3>Filtres</h3>
                        <div className="grid grid-cols-3 gap-3 max-[1024px]:grid-cols-1">
                            <label className="grid gap-1 text-[0.85rem]">
                                Statut
                                <select className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                                    <option value="all">Tous</option>
                                    <option value="future">En attente</option>
                                    <option value="current">En cours</option>
                                    <option value="late">En retard</option>
                                </select>
                            </label>
                            <label className="grid gap-1 text-[0.85rem]">
                                Du
                                <input className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
                            </label>
                            <label className="grid gap-1 text-[0.85rem]">
                                Au
                                <input className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
                            </label>
                        </div>
                    </section>
                    <div className="mb-4 flex items-baseline justify-between gap-3 max-[700px]:flex-col max-[700px]:items-start">
                        <h2>Gestion des reservations</h2>
                        <p className="text-[#8c8d8e]">X reservation(s)</p>
                    </div>
                    <div className="overflow-x-auto border border-[#ddd6cc] bg-white">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date réservation</th>
                                    <th>Temps</th>
                                    <th>Date retour</th>
                                    <th>Statut</th>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>Modèle</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        /
                                        <br />
                                        <span className="text-[0.83rem] text-[#8c8d8e]">/</span>
                                    </td>
                                    <td>
                                        / jour(s)
                                    </td>
                                    <td>
                                        /
                                    </td>
                                    <td>
                                        /
                                    </td>
                                    <td>/</td>
                                    <td>/</td>
                                    <td>
                                        "N/A"
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
                <SiteFooter />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader isAdmin />
            
            <main className="mx-auto my-8 w-[min(1380px,calc(100%-5rem))] max-[700px]:w-[calc(100%-1.5rem)]">
                <section className="mb-4 grid grid-cols-3 gap-3 max-[1024px]:grid-cols-1">
                    <article className="border border-[#ddd6cc] bg-white p-4">
                        <p className="m-0 text-[0.74rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Montres</p>
                        <p className="m-0 mt-2 font-serif text-[1.8rem]">{kpis.totalWatches}</p>
                    </article>
                    <article className="border border-[#ddd6cc] bg-white p-4">
                        <p className="m-0 text-[0.74rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Reservations en attente</p>
                        <p className="m-0 mt-2 font-serif text-[1.8rem]">{kpis.waitingReservations}</p>
                    </article>
                    <article className="border border-[#ddd6cc] bg-white p-4">
                        <p className="m-0 text-[0.74rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Retours en retard</p>
                        <p className="m-0 mt-2 font-serif text-[1.8rem]">{kpis.lateReturns}</p>
                    </article>
                </section>

                <section className="mb-4 border border-[#ddd6cc] bg-[color-mix(in_srgb,white_85%,#faf8f5)] p-4">
                    <h3>Filtres</h3>
                    <div className="grid grid-cols-3 gap-3 max-[1024px]:grid-cols-1">
                        <label className="grid gap-1 text-[0.85rem]">
                            Statut
                            <select className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                                <option value="all">Tous</option>
                                <option value="future">En attente</option>
                                <option value="current">En cours</option>
                                <option value="late">En retard</option>
                            </select>
                        </label>
                        <label className="grid gap-1 text-[0.85rem]">
                            Du
                            <input className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
                        </label>
                        <label className="grid gap-1 text-[0.85rem]">
                            Au
                            <input className="w-full border border-[#ddd6cc] bg-white px-3 py-[0.65rem]" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
                        </label>
                    </div>
                </section>

                <div className="mb-4 flex items-baseline justify-between gap-3 max-[700px]:flex-col max-[700px]:items-start">
                    <h2>Gestion des reservations</h2>
                    <p className="text-[#8c8d8e]">{rows.length} reservation(s)</p>
                </div>

                {rows.length === 0 ? (
                    <div className="border border-dashed border-[#ddd6cc] p-4 text-[#8c8d8e]">Aucune reservation pour le moment.</div>
                ) : (
                    <div className="overflow-x-auto border border-[#ddd6cc] bg-white">
                        <table className="w-full border-collapse bg-white">
                            <thead>
                                <tr>
                                    <th className="border-b border-[#ddd6cc] p-3 text-left text-[0.75rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Date réservation</th>
                                    <th className="border-b border-[#ddd6cc] p-3 text-left text-[0.75rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Temps</th>
                                    <th className="border-b border-[#ddd6cc] p-3 text-left text-[0.75rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Date retour</th>
                                    <th className="border-b border-[#ddd6cc] p-3 text-left text-[0.75rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Statut</th>
                                    <th className="border-b border-[#ddd6cc] p-3 text-left text-[0.75rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Nom</th>
                                    <th className="border-b border-[#ddd6cc] p-3 text-left text-[0.75rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Prénom</th>
                                    <th className="border-b border-[#ddd6cc] p-3 text-left text-[0.75rem] uppercase tracking-[0.08em] text-[#8c8d8e]">Modèle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.id}>
                                        <td className="border-b border-[#ddd6cc] p-3 align-top">
                                            {formatDateFr(row.reservationDate)}
                                            <br />
                                            <span className="text-[0.83rem] text-[#8c8d8e]">{row.reservationTime}</span>
                                        </td>
                                        <td className="border-b border-[#ddd6cc] p-3 align-top">
                                            {row.durationDays} jour(s)
                                        </td>
                                        <td className="border-b border-[#ddd6cc] p-3 align-top">
                                            {formatDateFr(row.returnDate)}
                                        </td>
                                        <td className="border-b border-[#ddd6cc] p-3 align-top">
                                            <span className={row.status.className}>{row.status.label}</span>
                                        </td>
                                        <td className="border-b border-[#ddd6cc] p-3 align-top">{row.lastName}</td>
                                        <td className="border-b border-[#ddd6cc] p-3 align-top">{row.firstName}</td>
                                        <td className="border-b border-[#ddd6cc] p-3 align-top">
                                            {row.watch ? (
                                                <Link to={`/montre/${row.watch.id}`} className="underline">{row.watch.model}</Link>
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <SiteFooter />
        </div>
    );
}
