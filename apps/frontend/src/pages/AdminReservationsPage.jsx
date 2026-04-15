import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { fetchWatches, fetchReservations } from "../hooks/fetchAPI";

const style = {
    page: "min-h-screen bg-[radial-gradient(circle_at_top,#f6efe5_0%,#f0e8db_45%,#ece4d7_100%)] text-[#1c1d21]",
    container: "mx-auto w-full max-w-[1440px] px-6 py-8 lg:py-12",
    kpiGrid: "grid gap-4 md:grid-cols-3",
    kpiCard: "rounded-[24px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.92)] p-5 shadow-[0_16px_40px_rgba(28,29,33,0.05)]",
    kpiLabel: "text-[0.72rem] uppercase tracking-[0.16em] text-[#8c775f]",
    kpiValue: "mt-3 font-['Cormorant_Garamond',serif] text-[2.2rem] leading-none text-[#1c1d21]",
    filtersCard: "mt-4 rounded-[24px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.92)] p-5 shadow-[0_16px_40px_rgba(28,29,33,0.05)]",
    filtersTitle: "font-['Cormorant_Garamond',serif] text-[1.8rem] leading-none",
    filterRow: "mt-4 grid gap-4 md:grid-cols-3",
    filterLabel: "grid gap-2 text-[0.82rem] uppercase tracking-[0.12em] text-[#6f6b64]",
    select: "h-12 rounded-full border border-[#d8cdbd] bg-white px-4 text-[0.95rem] text-[#1c1d21] outline-none transition-colors focus:border-[#1c1d21]",
    input: "h-12 rounded-full border border-[#d8cdbd] bg-white px-4 text-[0.95rem] text-[#1c1d21] outline-none transition-colors focus:border-[#1c1d21]",
    sectionRow: "mt-6 flex items-end justify-between gap-4",
    sectionTitle: "font-['Cormorant_Garamond',serif] text-[1.9rem] leading-none",
    sectionMuted: "text-[0.92rem] text-[#5f6672]",
    tableWrap: "mt-4 overflow-x-auto rounded-[24px] border border-[#d8cdbd] bg-[rgba(255,250,243,0.92)] shadow-[0_16px_40px_rgba(28,29,33,0.05)]",
    table: "min-w-full border-collapse",
    th: "border-b border-[#e1d7c8] px-4 py-3 text-left text-[0.72rem] uppercase tracking-[0.12em] text-[#8c8d8e]",
    td: "border-b border-[#e1d7c8] px-4 py-4 align-top text-[0.95rem]",
    small: "text-[0.84rem] text-[#8c8d8e]",
    emptyBox: "mt-4 rounded-[24px] border border-dashed border-[#d8cdbd] bg-white px-5 py-8 text-center text-[#5f6672]",
    pill: "inline-flex items-center rounded-full border px-3 py-1 text-[0.72rem] uppercase tracking-[0.08em]",
    pillFuture: "border-[#f59e0b] bg-[#fef3c7] text-[#854d0e]",
    pillCurrent: "border-[#10b981] bg-[#d1fae5] text-[#065f46]",
    pillLate: "border-[#f43f5e] bg-[#ffe4e6] text-[#9f1239]",
};

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
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            setIsLoading(true);
            const [watchesData, reservationsData] = await Promise.all([
                fetchWatches(),
                fetchReservations()
            ]);

            if (isMounted) {
                setWatches(watchesData);
                setReservations(reservationsData);
                setIsLoading(false);
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    const allRows = useMemo(() => {
        if (!reservations || !watches) return [];
    
        return reservations.map((item) => ({
            ...item,
            watch: watches.find((watch) => String(watch.id ?? watch.watchId) === String(item.watchId)),
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
        if (!watches || !reservations) return [];

        const waiting = allRows.filter((row) => row.status.className.includes("future")).length;
        const late = allRows.filter((row) => row.status.className.includes("late")).length;

        return {
            totalWatches: watches.length,
            waitingReservations: waiting,
            lateReturns: late
        };
    }, [allRows, watches]);

    if (!watches || !reservations || isLoading) {
        return (
            <div className={style.page}>
                <SiteHeader isAdmin />
                <main className={style.container}>
                    <section className={style.kpiGrid}>
                        <article className={style.kpiCard}>
                            <p className={style.kpiLabel}>Montres</p>
                            <p className={style.kpiValue}>/</p>
                        </article>
                        <article className={style.kpiCard}>
                            <p className={style.kpiLabel}>Reservations en attente</p>
                            <p className={style.kpiValue}>/</p>
                        </article>
                        <article className={style.kpiCard}>
                            <p className={style.kpiLabel}>Retours en retard</p>
                            <p className={style.kpiValue}>/</p>
                        </article>
                    </section>
                    <section className={style.filtersCard}>
                        <h3 className={style.filtersTitle}>Filtres</h3>
                        <div className={style.filterRow}>
                            <label className={style.filterLabel}>
                                Statut
                                <select className={style.select} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                                    <option value="all">Tous</option>
                                    <option value="future">En attente</option>
                                    <option value="current">En cours</option>
                                    <option value="late">En retard</option>
                                </select>
                            </label>
                            <label className={style.filterLabel}>
                                Du
                                <input className={style.input} type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
                            </label>
                            <label className={style.filterLabel}>
                                Au
                                <input className={style.input} type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
                            </label>
                        </div>
                    </section>
                    <div className={style.sectionRow}>
                        <h2 className={style.sectionTitle}>Gestion des reservations</h2>
                        <p className={style.sectionMuted}>X reservation(s)</p>
                    </div>
                    <div className={style.tableWrap}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th className={style.th}>Date réservation</th>
                                    <th className={style.th}>Temps</th>
                                    <th className={style.th}>Date retour</th>
                                    <th className={style.th}>Statut</th>
                                    <th className={style.th}>Nom</th>
                                    <th className={style.th}>Prénom</th>
                                    <th className={style.th}>Modèle</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={style.td}>
                                        /
                                        <br />
                                        <span className={style.small}>/</span>
                                    </td>
                                    <td className={style.td}>
                                        / jour(s)
                                    </td>
                                    <td className={style.td}>
                                        /
                                    </td>
                                    <td className={style.td}>
                                        /
                                    </td>
                                    <td className={style.td}>/</td>
                                    <td className={style.td}>/</td>
                                    <td className={style.td}>
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
        <div className={style.page}>
            <SiteHeader isAdmin />
            
            <main className={style.container}>
                <section className={style.kpiGrid}>
                    <article className={style.kpiCard}>
                        <p className={style.kpiLabel}>Montres</p>
                        <p className={style.kpiValue}>{kpis.totalWatches}</p>
                    </article>
                    <article className={style.kpiCard}>
                        <p className={style.kpiLabel}>Reservations en attente</p>
                        <p className={style.kpiValue}>{kpis.waitingReservations}</p>
                    </article>
                    <article className={style.kpiCard}>
                        <p className={style.kpiLabel}>Retours en retard</p>
                        <p className={style.kpiValue}>{kpis.lateReturns}</p>
                    </article>
                </section>

                <section className={style.filtersCard}>
                    <h3 className={style.filtersTitle}>Filtres</h3>
                    <div className={style.filterRow}>
                        <label className={style.filterLabel}>
                            Statut
                            <select className={style.select} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                                <option value="all">Tous</option>
                                <option value="future">En attente</option>
                                <option value="current">En cours</option>
                                <option value="late">En retard</option>
                            </select>
                        </label>
                        <label className={style.filterLabel}>
                            Du
                            <input className={style.input} type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
                        </label>
                        <label className={style.filterLabel}>
                            Au
                            <input className={style.input} type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
                        </label>
                    </div>
                </section>

                <div className={style.sectionRow}>
                    <h2 className={style.sectionTitle}>Gestion des reservations</h2>
                    <p className={style.sectionMuted}>{rows.length} reservation(s)</p>
                </div>

                {rows.length === 0 ? (
                    <div className={style.emptyBox}>Aucune reservation pour le moment.</div>
                ) : (
                    <div className={style.tableWrap}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th className={style.th}>Date réservation</th>
                                    <th className={style.th}>Temps</th>
                                    <th className={style.th}>Date retour</th>
                                    <th className={style.th}>Statut</th>
                                    <th className={style.th}>Nom</th>
                                    <th className={style.th}>Prénom</th>
                                    <th className={style.th}>Modèle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.id}>
                                        <td className={style.td}>
                                            {formatDateFr(row.reservationDate)}
                                            <br />
                                            <span className={style.small}>{row.reservationTime}</span>
                                        </td>
                                        <td className={style.td}>
                                            {row.durationDays} jour(s)
                                        </td>
                                        <td className={style.td}>
                                            {formatDateFr(row.returnDate)}
                                        </td>
                                        <td className={style.td}>
                                            <span className={`${style.pill} ${row.status.className.includes("future") ? style.pillFuture : row.status.className.includes("current") ? style.pillCurrent : style.pillLate}`}>
                                                {row.status.label}
                                            </span>
                                        </td>
                                        <td className={style.td}>{row.lastName}</td>
                                        <td className={style.td}>{row.firstName}</td>
                                        <td className={style.td}>
                                            {row.watch ? (
                                                <Link to={`/montre/${row.watch.watchId ?? row.watch.id}`}>{row.watch.model}</Link>
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
