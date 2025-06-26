
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import PromoBanner from "@/components/PromoBanner";
import FeaturedProduct from "@/components/FeaturedProduct";
import CategorySection from "@/components/CategorySection";
import ReviewsSection from "@/components/ReviewsSection";
import BenefitsSection from "@/components/BenefitsSection";
import ParticleBackground from "@/components/ParticleBackground";
import SettingsModal from "@/components/SettingsModal";
import FeatureCards from "@/components/FeatureCards"; 

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white font-['Nunito']">
      <ParticleBackground />
      
      <Navigation 
        onSidebarToggle={() => setSidebarOpen(true)}
        onSettingsOpen={() => setSettingsOpen(true)}
      />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <main className="relative z-10">
        <div className="container mx-auto px-4 py-8 space-y-16">
          <PromoBanner />
          <FeaturedProduct />
          <FeatureCards />  
          <CategorySection />
          <ReviewsSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
