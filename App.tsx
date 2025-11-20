import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ArrowRight, ChevronDown, Check, 
  Zap, BarChart3, MessageSquare, 
  Clock, Shield, Mail, Phone, MapPin,
  Linkedin, Twitter, Instagram, ChevronUp, Sun, Moon,
  TrendingUp, ArrowUpRight
} from 'lucide-react';

// --- Types & Interfaces ---
interface NavItem {
  label: string;
  href: string;
}

interface Service {
  title: string;
  description: string;
  features: string[];
  cta: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
  deliverable: string;
}

interface Stat {
  value: string;
  label: string;
}

// --- Custom Logo Component ---
const WebnexaLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M50 10C35 10 25 20 25 35C25 45 32 50 40 55C32 60 25 65 25 75C25 90 35 100 50 100C65 100 75 90 75 75C75 65 68 60 60 55C68 50 75 45 75 35C75 20 65 10 50 10ZM50 25C58 25 60 30 60 35C60 40 55 43 50 45C45 43 40 40 40 35C40 30 42 25 50 25ZM50 75C42 75 40 70 40 65C40 60 45 57 50 55C55 57 60 60 60 65C60 70 58 75 50 75Z" />
    <path d="M20 35C20 15 35 0 50 0C65 0 80 15 80 35C80 42 77 48 72 52C77 56 80 62 80 69C80 89 65 104 50 104C35 104 20 89 20 69C20 62 23 56 28 52C23 48 20 42 20 35ZM35 35C35 28 42 20 50 20C58 20 65 28 65 35C65 40 62 44 58 47C62 50 65 54 65 59C65 66 58 74 50 74C42 74 35 66 35 59C35 54 38 50 42 47C38 44 35 40 35 35Z" fill="currentColor" fillOpacity="0.2"/>
  </svg>
);

// --- Reusable UI Components ---

const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  onClick?: () => void;
  icon?: React.ElementType;
}> = ({ children, variant = 'primary', className = '', onClick, icon: Icon }) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed tracking-tight text-sm";
  
  const variants = {
    // High contrast black/white for premium agency feel
    primary: "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
    outline: "border-2 border-slate-200 text-slate-900 hover:border-slate-950 dark:border-slate-800 dark:text-white dark:hover:border-white bg-transparent",
    ghost: "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
      {Icon && <Icon className="ml-2 w-4 h-4" />}
    </button>
  );
};

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Theme Context ---
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
         setTheme('dark');
         document.documentElement.classList.add('dark');
      } else {
         setTheme('light');
         document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return { theme, toggleTheme };
};

// --- Components ---

const Container = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
  <div className={`max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 ${className}`}>
    {children}
  </div>
);

const AnnouncementBar = () => (
  <div className="bg-slate-950 dark:bg-white text-white dark:text-black text-xs font-bold py-3 px-4 text-center tracking-wide uppercase">
    <span className="inline-flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
      Accepting 3 Enterprise Clients for Q4 — <span className="underline decoration-1 underline-offset-4 cursor-pointer hover:text-slate-300 dark:hover:text-slate-600">Apply Now</span>
    </span>
  </div>
);

const Header = ({ toggleTheme, theme }: { toggleTheme: () => void, theme: 'light' | 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Work', href: '#cases' },
    { label: 'Why Us', href: '#why-us' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 py-4' : 'bg-transparent py-8'}`}>
      <Container>
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 z-50 group">
            <WebnexaLogo className="w-8 h-8 text-slate-950 dark:text-white transition-transform group-hover:rotate-180 duration-700" />
            <span className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">WEBNEXA</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors">
                {item.label}
              </a>
            ))}
            
            <div className="flex items-center gap-6 pl-8 border-l border-slate-200 dark:border-slate-800">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Button variant="primary" className="px-6 py-3 h-auto text-xs uppercase tracking-wider" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Get Started
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={toggleTheme} className="text-slate-900 dark:text-white">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="text-slate-900 dark:text-white z-50" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Nav Overlay */}
          <div className={`fixed inset-0 bg-white dark:bg-black z-40 flex flex-col items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
             <div className="flex flex-col gap-8 text-center">
              {navItems.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href} 
                  className="text-4xl font-bold tracking-tighter text-slate-900 dark:text-white hover:text-slate-500"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button className="mt-8" onClick={() => { setIsOpen(false); document.getElementById('contact')?.scrollIntoView(); }}>
                Start Project
              </Button>
             </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-40 pb-20 overflow-hidden">
      <Container className="relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7">
            <FadeIn delay={100}>
              <div className="inline-flex items-center gap-3 mb-10">
                 <span className="w-12 h-[2px] bg-slate-950 dark:bg-white"></span>
                 <span className="text-sm font-bold tracking-widest uppercase text-slate-950 dark:text-white">AI Automation Agency</span>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <h1 className="text-[5rem] md:text-[7rem] leading-[0.9] font-extrabold tracking-tighter mb-10 text-slate-950 dark:text-white">
                Plan.<br/>
                Manage.<br/>
                <span className="text-blue-600 dark:text-blue-500">Scale.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={300}>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-xl leading-relaxed font-medium">
                We build custom AI infrastructures that automate your busywork and capture leads 24/7.
              </p>
            </FadeIn>

            <FadeIn delay={400} className="flex flex-wrap gap-4">
              <Button icon={ArrowRight} onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Start Scaling
              </Button>
              <Button variant="outline" onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}>
                View Work
              </Button>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="mt-24 flex items-center gap-4 text-sm font-bold text-slate-500 dark:text-slate-500">
                <span className="tracking-widest uppercase text-xs">Trusted By</span>
                <div className="h-px w-8 bg-slate-300 dark:bg-slate-700"></div>
                <div className="flex gap-8 opacity-60 grayscale hover:grayscale-0 transition-all items-center">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Google</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Airbnb</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Uber</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Spotify</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Visual Element - Right Aligned on Desktop */}
          <div className="hidden lg:block lg:col-span-5 relative h-[700px] w-full">
             <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800">
                {/* Abstract Geometric Shapes */}
                <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl"></div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8">
                    {/* Main dashboard abstraction */}
                    <div className="bg-white dark:bg-black border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl p-6 mb-6 animate-float">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-slate-950 dark:text-white" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</div>
                                    <div className="text-lg font-bold text-slate-950 dark:text-white">$124,500</div>
                                </div>
                            </div>
                            <span className="text-green-500 text-sm font-bold bg-green-500/10 px-2 py-1 rounded">+32.4%</span>
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full w-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full w-2/3"></div>
                        </div>
                    </div>

                    {/* Secondary floater */}
                    <div className="bg-white dark:bg-black border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl p-4 max-w-[200px] ml-auto animate-float" style={{ animationDelay: '1.5s' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                <Check className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-500">Leads Qualified</div>
                                <div className="text-base font-bold text-slate-950 dark:text-white">842</div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </Container>
      
      {/* Clean Scroll Indicator */}
      <div className="hidden lg:block absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-slate-400">
        <div className="w-[1px] h-16 bg-gradient-to-b from-slate-200 to-slate-400 dark:from-slate-800 dark:to-slate-600"></div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats: Stat[] = [
    { value: "87%", label: "Faster Response" },
    { value: "3.2x", label: "More Leads" },
    { value: "24/7", label: "Automated Ops" },
    { value: "100%", label: "Data Accuracy" }
  ];

  return (
    <section className="py-24 border-y border-slate-100 dark:border-slate-900 bg-white dark:bg-black">
       <Container>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
           {stats.map((stat, idx) => (
             <FadeIn key={idx} delay={idx * 100} className="flex flex-col justify-center">
               <div className="text-6xl lg:text-7xl font-extrabold text-slate-950 dark:text-white mb-3 tracking-tighter">{stat.value}</div>
               <div className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-500 pl-1 border-l-2 border-blue-500 pl-4">{stat.label}</div>
             </FadeIn>
           ))}
         </div>
       </Container>
    </section>
  );
};

const Services = () => {
  const services: Service[] = [
    {
      title: "AI Lead Acquisition",
      description: "Autonomous agents that capture, qualify, and nurture leads across all channels instantly.",
      features: ["Multi-channel capture", "Instant qualification", "Automated booking"],
      cta: "Scale Acquisition"
    },
    {
      title: "Workflow Automation",
      description: "Connect your entire tech stack. We automate data flow between CRM, Email, and Slack.",
      features: ["API Integrations", "Document processing", "Error-free data entry"],
      cta: "Automate Operations"
    },
    {
      title: "Predictive Intelligence",
      description: "Use AI to predict churn, forecast sales, and identify your highest value prospects.",
      features: ["Churn prediction", "Sales forecasting", "Customer scoring"],
      cta: "Get Insights"
    }
  ];

  return (
    <section id="services" className="py-32 bg-slate-50 dark:bg-slate-950/50">
      <Container>
        <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
                <FadeIn>
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block">Our Expertise</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-950 dark:text-white tracking-tight leading-tight">
                        Intelligent systems for <span className="text-slate-400">exponential growth.</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg font-medium">
                        We don't just offer tools; we architect entire ecosystems that run your business on autopilot.
                    </p>
                    <Button variant="outline" onClick={() => document.getElementById('contact')?.scrollIntoView()}>
                        Explore All Services
                    </Button>
                </FadeIn>
            </div>

            <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
                {services.map((service, idx) => (
                    <FadeIn key={idx} delay={idx * 150} className={`${idx === 2 ? 'md:col-span-2' : ''}`}>
                        <div className="group p-8 md:p-10 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 hover:border-slate-950 dark:hover:border-white transition-colors duration-500 h-full flex flex-col justify-between rounded-xl">
                            <div>
                                <div className="mb-8 w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                    {idx === 0 && <TrendingUp className="w-6 h-6 text-slate-950 dark:text-white" />}
                                    {idx === 1 && <Zap className="w-6 h-6 text-slate-950 dark:text-white" />}
                                    {idx === 2 && <BarChart3 className="w-6 h-6 text-slate-950 dark:text-white" />}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-950 dark:text-white tracking-tight">{service.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">{service.description}</p>
                            </div>
                            <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-900">
                                <ul className="space-y-2">
                                    {service.features.slice(0, 2).map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                        <div className="w-1 h-1 rounded-full bg-blue-500"></div> {feature}
                                    </li>
                                    ))}
                                </ul>
                                <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </div>
      </Container>
    </section>
  );
};

const Process = () => {
  const steps: ProcessStep[] = [
    { 
      step: "01", 
      title: "Audit & Strategy", 
      description: "We deep-dive into your workflows to find high-impact automation opportunities.",
      deliverable: "Strategic Roadmap"
    },
    { 
      step: "02", 
      title: "Build & Integrate", 
      description: "Our engineers develop custom agents and connect your tech stack.",
      deliverable: "Custom AI Infrastructure"
    },
    { 
      step: "03", 
      title: "Launch & Scale", 
      description: "We deploy, train your team, and continuously optimize for maximum ROI.",
      deliverable: "Optimization & Growth"
    }
  ];

  return (
    <section id="process" className="py-32 bg-white dark:bg-black text-slate-950 dark:text-white">
      <Container>
        <div className="grid lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-6">
             <FadeIn>
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
                    From chaos to clarity in <span className="text-slate-400">30 days.</span>
                </h2>
             </FadeIn>
          </div>
          <div className="lg:col-span-6 flex items-end">
             <FadeIn delay={100}>
                <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-lg leading-relaxed">
                    A streamlined, transparent process designed to deploy your systems quickly without disrupting operations.
                </p>
             </FadeIn>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800">
          {steps.map((step, idx) => (
            <FadeIn key={idx} delay={idx * 100}>
              <div className="group py-16 border-b border-slate-200 dark:border-slate-800 grid md:grid-cols-12 gap-8 items-start transition-all hover:bg-slate-50 dark:hover:bg-slate-900/30 px-6 -mx-6 rounded-2xl">
                <div className="md:col-span-1 text-sm font-bold text-slate-300 dark:text-slate-700 tracking-widest font-mono">/{step.step}</div>
                <div className="md:col-span-4">
                  <h3 className="text-3xl font-bold tracking-tight group-hover:translate-x-2 transition-transform duration-300">{step.title}</h3>
                </div>
                <div className="md:col-span-4">
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-lg">{step.description}</p>
                </div>
                <div className="md:col-span-3 text-right flex md:justify-end items-center">
                   <span className="inline-block px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider bg-white dark:bg-black">{step.deliverable}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
};

const CaseStudies = () => {
  return (
    <section id="cases" className="py-32 bg-slate-950 text-white relative overflow-hidden">
      <Container className="relative z-10">
        <FadeIn>
           <div className="flex items-end justify-between mb-20 border-b border-white/10 pb-10">
             <div className="max-w-2xl">
                 <span className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-4 block">Selected Work</span>
                 <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Proven Results</h2>
             </div>
             <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black hidden md:flex">View All Cases</Button>
           </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
           {/* Case 1 */}
           <FadeIn delay={0}>
             <div className="group cursor-pointer block">
               <div className="aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden mb-8 relative border border-white/10 group-hover:border-white/30 transition-colors">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                 <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-5xl md:text-7xl font-bold text-white/20 group-hover:text-white transition-colors duration-500">+313%</div>
                 </div>
               </div>
               <div className="flex items-center justify-between mb-4">
                   <h3 className="text-3xl font-bold">Luxury Estate Group</h3>
                   <span className="px-3 py-1 border border-white/20 rounded-full text-xs uppercase tracking-wider text-slate-400">Real Estate</span>
               </div>
               <p className="text-slate-400 text-lg leading-relaxed mb-6">Automated lead qualification & SMS nurturing system resulting in $147k additional revenue.</p>
               <div className="h-px bg-white/10 w-full group-hover:bg-white/50 transition-colors"></div>
             </div>
           </FadeIn>

           {/* Case 2 */}
           <FadeIn delay={200}>
             <div className="group cursor-pointer block">
               <div className="aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden mb-8 relative border border-white/10 group-hover:border-white/30 transition-colors">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                 <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-5xl md:text-7xl font-bold text-white/20 group-hover:text-white transition-colors duration-500">40hrs</div>
                 </div>
               </div>
               <div className="flex items-center justify-between mb-4">
                   <h3 className="text-3xl font-bold">Nordic Style</h3>
                   <span className="px-3 py-1 border border-white/20 rounded-full text-xs uppercase tracking-wider text-slate-400">E-Commerce</span>
               </div>
               <p className="text-slate-400 text-lg leading-relaxed mb-6">AI customer support agent & order tracking automation saving a full work week per team member.</p>
               <div className="h-px bg-white/10 w-full group-hover:bg-white/50 transition-colors"></div>
             </div>
           </FadeIn>
        </div>
      </Container>
    </section>
  );
};

const CTA = () => {
  return (
    <section id="contact" className="py-32 bg-slate-50 dark:bg-black">
      <Container>
        <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
                <FadeIn>
                    <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 text-slate-950 dark:text-white leading-[0.9]">
                        Ready to <br/>
                        <span className="text-slate-400">automate?</span>
                    </h2>
                    <p className="text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl font-medium">
                        Book a free 30-minute strategy call. We'll audit your workflow and find your hidden revenue.
                    </p>
                    <div className="flex flex-wrap items-center gap-8">
                        <Button className="h-16 px-10 text-lg shadow-2xl hover:scale-105 transition-transform">
                            Book Strategy Call
                        </Button>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white dark:border-black"></div>
                                <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white dark:border-black"></div>
                                <div className="w-10 h-10 rounded-full bg-slate-400 border-2 border-white dark:border-black"></div>
                            </div>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">3 Spots Left for Q4</span>
                        </div>
                    </div>
                </FadeIn>
            </div>
            <div className="hidden lg:block lg:col-span-4">
                 <FadeIn delay={200} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-400 uppercase">Contact Direct</div>
                            <div className="text-lg font-bold">hello@webnexa.ai</div>
                        </div>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mb-6"></div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <Check className="w-4 h-4 text-green-500" /> Free Automation Audit
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <Check className="w-4 h-4 text-green-500" /> No Commitment Required
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <Check className="w-4 h-4 text-green-500" /> ROI Roadmap Included
                        </div>
                    </div>
                 </FadeIn>
            </div>
        </div>
      </Container>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black border-t border-slate-100 dark:border-slate-900 py-24">
      <Container>
        <div className="grid lg:grid-cols-4 gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-1">
             <a href="#" className="flex items-center gap-2 mb-8">
              <WebnexaLogo className="w-8 h-8 text-slate-950 dark:text-white" />
              <span className="text-xl font-extrabold tracking-tighter text-slate-950 dark:text-white">WEBNEXA</span>
            </a>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              Building the intelligent infrastructures of tomorrow for forward-thinking businesses.
            </p>
            <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                    <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                    <Twitter className="w-4 h-4" />
                </a>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-6">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Company</span>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold transition-colors">Work</a>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold transition-colors">Services</a>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold transition-colors">Process</a>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold transition-colors">About</a>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Services</span>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold transition-colors">Lead Acquisition</a>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold transition-colors">Automation</a>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold transition-colors">Intelligence</a>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Legal</span>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        
        <div className="mt-24 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <p>&copy; 2025 Webnexa AI. All rights reserved.</p>
          <p>San Francisco, CA</p>
        </div>
      </Container>
    </footer>
  );
};

// --- Main App ---

const App = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col bg-white dark:bg-black text-slate-900 dark:text-white transition-colors duration-500">
      <AnnouncementBar />
      <Header toggleTheme={toggleTheme} theme={theme} />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <Services />
        <Process />
        <CaseStudies />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;