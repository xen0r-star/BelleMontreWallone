import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { reservationSeed } from "../data/watches";
import { getWatches } from '../services/api';

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
        return { label: "A venir chercher", className: "pill future" };
    }

    if (now > end) {
        return { label: "Dépasser", className: "pill late" };
    }

    return { label: "En cours", className: "pill current" };
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
    const [isLoading, setIsLoading] = useState(true);

    const reservations = reservationSeed;
    const [statusFilter, setStatusFilter] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

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
        if (!watches) return [];

        const waiting = allRows.filter((row) => row.status.className.includes("future")).length;
        const late = allRows.filter((row) => row.status.className.includes("late")).length;

        return {
            totalWatches: watches.length,
            waitingReservations: waiting,
            lateReturns: late
        };
    }, [allRows, watches]);

    return (
        <div className="page-root">
            <SiteHeader isAdmin />
            
            <main className="container reservations-page">
                <section className="kpi-grid">
                    <article className="kpi-card">
                        <p className="kpi-label">Montres</p>
                        <p className="kpi-value">{kpis.totalWatches}</p>
                    </article>
                    <article className="kpi-card">
                        <p className="kpi-label">Reservations en attente</p>
                        <p className="kpi-value">{kpis.waitingReservations}</p>
                    </article>
                    <article className="kpi-card">
                        <p className="kpi-label">Retours en retard</p>
                        <p className="kpi-value">{kpis.lateReturns}</p>
                    </article>
                </section>

                <section className="filters-card reservations-filters">
                    <h3>Filtres</h3>
                    <div className="filter-row">
                        <label>
                            Statut
                            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                                <option value="all">Tous</option>
                                <option value="future">En attente</option>
                                <option value="current">En cours</option>
                                <option value="late">En retard</option>
                            </select>
                        </label>
                        <label>
                            Du
                            <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
                        </label>
                        <label>
                            Au
                            <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
                        </label>
                    </div>
                </section>

                <div className="section-title-row">
                    <h2>Gestion des reservations</h2>
                    <p className="muted">{rows.length} reservation(s)</p>
                </div>

                <div className="table-wrap">
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
                            {rows.map((row) => (
                                <tr key={row.id}>
                                    <td>
                                        {formatDateFr(row.reservationDate)}
                                        <br />
                                        <span className="muted small">{row.reservationTime}</span>
                                    </td>
                                    <td>
                                        {row.durationDays} jour(s)
                                    </td>
                                    <td>
                                        {formatDateFr(row.returnDate)}
                                    </td>
                                    <td>
                                        <span className={row.status.className}>{row.status.label}</span>
                                    </td>
                                    <td>{row.lastName}</td>
                                    <td>{row.firstName}</td>
                                    <td>
                                        {row.watch ? (
                                            <Link to={`/montre/${row.watch.id}`}>{row.watch.model}</Link>
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
