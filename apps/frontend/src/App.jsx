import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import WatchDetailPage from "./pages/WatchDetailPage";
import HelpPage from "./pages/HelpPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminWatchPage from "./pages/AdminWatchPage";
import AdminReservationsPage from "./pages/AdminReservationsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState("fade-in");

    useEffect(() => {
        const isSamePath =
            location.pathname === displayLocation.pathname &&
            location.search === displayLocation.search;

        if (!isSamePath) {
            setTransitionStage("fade-out");
        }
    }, [location, displayLocation]);

    useEffect(() => {
        if (transitionStage !== "fade-out") {
            return;
        }

        const timeout = window.setTimeout(() => {
            setDisplayLocation(location);
            setTransitionStage("fade-in");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 210);

        return () => window.clearTimeout(timeout);
    }, [transitionStage, location]);

    return (
        <div
            className={`min-h-screen will-change-[opacity] transition-opacity duration-220 ${transitionStage === "fade-out" ? "opacity-0" : "opacity-100"}`}
        >
            <Routes location={displayLocation}>
                {/* Public & Auth */}
                <Route path="/" element={<HomePage />} />
                <Route path="/acceuil" element={<Navigate to="/" replace />} />
                <Route path="/connexion" element={<LoginPage />} />
                <Route path="/connection" element={<Navigate to="/connexion" replace />} />
                <Route path="/inscription" element={<RegisterPage />} />

                {/* Boutique */}
                <Route path="/collection" element={<CollectionPage />} />
                <Route path="/montre/:id" element={<WatchDetailPage />} />
                <Route path="/besoin-daide" element={<HelpPage />} />

                {/* Admin */}
                <Route path="/admin/gestion-montre" element={<AdminWatchPage />} />
                <Route path="/admin/reservations" element={<AdminReservationsPage />} />

                {/* Fallback */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    );
}
