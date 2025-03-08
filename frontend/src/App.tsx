import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './context/AuthContext';
import { AUTH0_CONFIG } from './config';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VersionsPage from './pages/VersionsPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import RssFeed from './pages/RssFeed';

function App() {
  return (
    <Auth0Provider
      domain={AUTH0_CONFIG.domain}
      clientId={AUTH0_CONFIG.clientId}
      authorizationParams={{
        redirect_uri: AUTH0_CONFIG.redirectUri,
        audience: AUTH0_CONFIG.audience,
        scope: AUTH0_CONFIG.scope,
      }}
      cacheLocation={AUTH0_CONFIG.cacheLocation}
      useRefreshTokens={AUTH0_CONFIG.useRefreshTokens}
    >
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/versions" element={<VersionsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* RSS Feed Routes */}
            <Route path="/feed" element={<RssFeed />} />
            <Route path="/feed.xml" element={<RssFeed />} />
            <Route path="/rss" element={<RssFeed />} />
            <Route path="/rss.xml" element={<RssFeed />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Auth0Provider>
  );
}

export default App;
