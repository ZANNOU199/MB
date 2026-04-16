/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Residences from "./components/Residences";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Location from "./components/Location";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import GalleryPage from "./pages/GalleryPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ReviewsPage from "./pages/ReviewsPage";
import ScrollToTop from "./components/ScrollToTop";
import { fetchSiteSettings } from "./services/siteSettings";
import { useSiteSettings } from "./hooks/useSiteSettings";

import DynamicResidences from "./components/DynamicResidences";

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <DynamicResidences />
        <Gallery />
        <Services />
        <Location />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const siteSettings = useSiteSettings();

  useEffect(() => {
    void fetchSiteSettings();
  }, []);

  useEffect(() => {
    if (!siteSettings?.theme) return;

    const root = document.documentElement;
    root.style.setProperty("--primary", siteSettings.theme.primary);
    root.style.setProperty("--secondary", siteSettings.theme.secondary);
    root.style.setProperty("--surface", siteSettings.theme.surface);
    root.style.setProperty("--on-surface", siteSettings.theme.onSurface);
    root.style.setProperty("--surface-variant", siteSettings.theme.surfaceVariant);
    root.style.setProperty("--on-surface-variant", siteSettings.theme.onSurfaceVariant);
  }, [siteSettings?.theme]);

  useEffect(() => {
    if (!siteSettings?.seo) return;
    document.title = siteSettings.seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", siteSettings.seo.description);
  }, [siteSettings?.seo]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-on-surface selection:bg-primary/30">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:slug" element={<HomePage />} />
          <Route path="/galerie" element={<GalleryPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/avis" element={<ReviewsPage />} />
          <Route path="/appartements/:slug" element={import("./pages/AppartementPage").then(m => <m.default />)} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

