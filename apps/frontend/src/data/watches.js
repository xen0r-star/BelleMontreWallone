export const reservationSeed = [
    {
        id: 1,
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@example.com",
        phone: "+33 6 12 34 56 78",
        reservationDate: "2026-03-25",
        reservationTime: "14:30",
        returnDate: "2026-04-02",
        watchId: "datograph-up-down",
    },
    {
        id: 2,
        firstName: "Marie",
        lastName: "Curie",
        email: "m.curie@example.com",
        phone: "",
        reservationDate: "2026-03-20",
        reservationTime: "09:15",
        returnDate: "2026-03-26",
        watchId: "fifty-fathoms",
    },
    {
        id: 3,
        firstName: "Albert",
        lastName: "Einstein",
        email: "albert.e@example.com",
        phone: "",
        reservationDate: "2026-04-04",
        reservationTime: "16:45",
        returnDate: "2026-04-09",
        watchId: "calatrava",
    },
];

export function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR"
    }).format(value);
}
