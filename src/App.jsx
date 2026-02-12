import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Strengths from './components/Strengths';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Sakura from './components/Sakura';

export default function App() {
  return (
    <LanguageProvider>
      <Sakura />
      <Header />
      <Hero />
      <About />
      <Services />
      <Strengths />
      <Contact />
      <Footer />
      <ChatWidget />
    </LanguageProvider>
  );
}
