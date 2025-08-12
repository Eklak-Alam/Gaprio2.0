import CompetitorAnalysis from "@/components/CompetitorAnalysis";
import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import MarketLandscape from "@/components/MarketLandscape";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import TeamLeadership from "@/components/TeamLeadership";
import USPsSection from "@/components/USPsSection";

export default function Home() {
  return (
    <div className="relative bg-gray-900 text-white overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Sections */}
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <USPsSection />
      <MarketLandscape />
      <CompetitorAnalysis />
      <TeamLeadership />
      <ContactSection />
    </div>
  );
}
