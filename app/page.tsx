import {
  Header,
  Hero,
  About,
  Challenge,
  Services,
  Methodology,
  WhyUs,
  Founder,
  FAQ,
  Clients,
  Contact,
  Footer,
} from "@/components/landing";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Challenge />
      <Services />
      <Methodology />
      <WhyUs />
      <Founder />
      <FAQ />
      <Clients />
      <Contact />
      <Footer />
    </main>
  );
}
