import { Routes, Route } from 'react-router-dom';
import ArtVerse from '@/screens/Home/ArtVerse';
import ArtworkView from '@/screens/Artwork/ArtworkView';
import SignIn from '@/screens/Authentication/SignIn';
import SignUp from '@/screens/Authentication/SignUp';
//import Favorites from './pages/User/Favorites';
import MainLayout from '@/screens/Layouts/MainLayout';
import AuthLayout from '@/screens/Layouts/AuthLayout';
import NotFoundPage from '@/screens/Layouts/NotFound';
import RedirectToNotFound from '@/utils/RedirectToNotFound';
import Profile from '@/screens/User/Profile';
import ProfileSettings from '@/screens/User/ProfileSettings';
import ArtworkStore from '@/screens/Artwork/NewArtwork';
import ArtworkEdit from '@/screens/Artwork/ArtworkEdit';
import Viewer from '@/screens/Artwork/Viewer';
import PrivateRoute from '@/utils/PrivateRoute';
import Chat from '@/screens/Chat/Chat';
import Favorites from '@/screens/Favorites/Favorites';
import SearchPage from '@/screens/Search/SearchPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Principal Layout */}
            <Route element={<MainLayout />}>
                {/* Public Routes */}
                <Route path="/" element={<ArtVerse />} />
                <Route path="/Artworks/View/:value" element={<ArtworkView />} />
                <Route path="/Viewer" element={<Viewer />} />
                <Route path="/Search" element={<SearchPage />} />

                {/* Private Routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/Profile/:value/:module" element={<Profile />} />
                    <Route path="/ProfileSettings/:value/:module" element={<ProfileSettings />} />
                    <Route path="/Favorites/:value/:module" element={<Favorites />} />
                    <Route path="/Chats/:value/:module" element={<Chat />} />

                    <Route path="/Artworks/New/:value/:module" element={<ArtworkStore />} />
                    <Route path="/Artworks/Edit/:value/:module" element={<ArtworkEdit />} />
                </Route>
            </Route>


            {/* Auth */}
            <Route element={<AuthLayout />}>
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/SignUp" element={<SignUp />} />
            </Route>

            {/* 404 */}
            <Route path="/NotFound" element={<NotFoundPage />} />
            <Route path="*" element={<RedirectToNotFound />} />
        </Routes>
    );
};

export default AppRoutes;
