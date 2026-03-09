import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ServerWakeupBanner from './components/ServerWakeupBanner';

// Lazy loading pages for better performance
import Home from './pages/Home';
import Login from './pages/Login';
const Search = lazy(() => import('./pages/Search'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const Signup = lazy(() => import('./pages/Signup'));
const Favorites = lazy(() => import('./pages/Favorites'));
const History = lazy(() => import('./pages/History'));
const Movies = lazy(() => import('./pages/Movies'));
const TVShows = lazy(() => import('./pages/TVShows'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const MoviesManager = lazy(() => import('./pages/admin/MoviesManager'));
const UsersManager = lazy(() => import('./pages/admin/UsersManager'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const DashboardOverview = lazy(() => import('./pages/admin/DashboardOverview'));

// Loading Screen for Suspense
const LoadingScreen = () => (
    <div className="h-screen w-full flex items-center justify-center bg-netflix-dark text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
    </div>
);

function App() {
    return (
        <div className="min-h-screen bg-netflix-dark text-white font-sans selection:bg-netflix-red selection:text-white pb-10">
            <ScrollToTop />
            <Navbar />
            <ServerWakeupBanner />
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/tv" element={<TVShows />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/movie/:id" element={<MovieDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Routes (User) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/history" element={<History />} />
                    </Route>

                    {/* Protected Routes (Admin) */}
                    <Route element={<ProtectedRoute requireAdmin={true} />}>
                        <Route path="/admin" element={<AdminDashboard />}>
                            <Route index element={<DashboardOverview />} />
                            <Route path="movies" element={<MoviesManager />} />
                            <Route path="users" element={<UsersManager />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>
                    </Route>

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
            <Footer />
        </div>
    );
}

export default App;
