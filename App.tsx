import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ArrowRight, ChevronDown, Check, Star, 
  Zap, BarChart3, Bot, Cpu, Rocket, MessageSquare, 
  Clock, Shield, Globe, Play, Mail, Phone, MapPin,
  Linkedin, Twitter, Instagram, ChevronUp
} from 'lucide-react';

// --- Types & Interfaces ---
interface NavItem {
  label: string;
  href: string;
}

interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// --- Reusable UI Components ---

const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  onClick?: () => void;
  icon?: React.ElementType;
}> = ({ children, variant = 'primary', className = '', onClick, icon: Icon }) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white shadow-lg shadow-primary-500/20",
    secondary: "bg-white text-dark-900 hover:bg-slate-200",
    outline: "border border-slate-700 text-slate-300 hover:border-primary-500 hover:text-white bg-transparent",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5"
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

// Scroll Animation Hook
const useOnScreen = (ref: React.RefObject<HTMLElement>, rootMargin = "0px") => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if(entry.isIntersecting) {
           setIntersecting(true);
           observer.unobserve(entry.target);
        }
      },
      { rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return isIntersecting;
};

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string; direction?: 'up' | 'left' | 'right' }> = ({ children, delay = 0, className = "", direction = 'up' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref, "-50px");
  
  const translateClass = {
    up: 'translate-y-10',
    left: '-translate-x-10',
    right: 'translate-x-10'
  }[direction];

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className} ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${translateClass}`}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Sections ---

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Case Studies', href: '#cases' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-900/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 z-50">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Webnexa<span className="text-primary-500">AI</span></span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              {item.label}
            </a>
          ))}
          <Button variant="primary" className="px-5 py-2 h-auto text-sm" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Get Free Consultation
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-300 z-50" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Nav Overlay */}
        <div className={`fixed inset-0 bg-dark-900/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
           <div className="flex flex-col gap-8 text-center">
            {navItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                className="text-2xl font-medium text-slate-300 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button onClick={() => { setIsOpen(false); document.getElementById('contact')?.scrollIntoView(); }}>
              Book Strategy Call
            </Button>
           </div>
        </div>
      </div>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-dark-900 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[120px] opacity-50 animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-600/10 rounded-full blur-[100px] opacity-30" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <FadeIn delay={100}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-primary-400 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Accepting New Enterprise Partners for Q4
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Scale Your Business with <br />
            <span className="gradient-text">Intelligent Automation</span>
          </h1>
        </FadeIn>

        <FadeIn delay={300}>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            We build custom AI ecosystems that automate your workflows, acquire qualified leads, and reclaim 20+ hours of your week. No complex onboarding, just results.
          </p>
        </FadeIn>

        <FadeIn delay={400} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button icon={ArrowRight} onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Book Strategy Call
          </Button>
          <Button variant="outline" onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}>
            View Our Work
          </Button>
        </FadeIn>
        
        <FadeIn delay={600}>
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center">
             <p className="text-slate-500 text-sm mb-4">Trusted by innovative companies</p>
             <div className="flex -space-x-2 mb-2">
               {[1, 2, 3, 4].map((i) => (
                 <img key={i} src={`https://picsum.photos/40/40?random=${i}`} alt="User" className="w-8 h-8 rounded-full border-2 border-dark-900" />
               ))}
               <div className="w-8 h-8 rounded-full border-2 border-dark-900 bg-slate-800 flex items-center justify-center text-[10px] text-white">
                 +100
               </div>
             </div>
          </div>
        </FadeIn>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
};

const SocialProof = () => {
  const techs = ["OpenAI", "Anthropic", "Midjourney", "Make.com", "Zapier", "HubSpot", "Salesforce", "Stripe"];
  
  return (
    <div className="bg-dark-900 border-y border-white/5 py-10 overflow-hidden">
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
          {[...techs, ...techs, ...techs].map((tech, i) => (
            <span key={i} className="text-2xl font-bold text-slate-700 hover:text-slate-500 transition-colors cursor-default uppercase tracking-wider">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatsCounter = () => {
  const stats: Stat[] = [
    { value: "80%", label: "Time Saved" },
    { value: "3x", label: "Lead Generation" },
    { value: "24/7", label: "Support Uptime" },
    { value: "40%", label: "Cost Reduction" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
      {stats.map((stat, idx) => (
        <div key={idx} className="text-center p-4 glass-panel rounded-xl">
          <div className="text-4xl font-bold text-white mb-2 gradient-text">{stat.value}</div>
          <div className="text-sm text-slate-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

const ProblemSolution = () => {
  return (
    <section id="about" className="py-24 bg-dark-800 relative overflow-hidden">
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[100px]" />
       <div className="container mx-auto px-4 md:px-6">
         <div className="grid md:grid-cols-2 gap-16 items-center">
           <FadeIn direction="left">
             <div className="space-y-8">
               <h2 className="text-3xl md:text-4xl font-bold">The Challenge: <br/><span className="text-slate-400">Operational Bottle-necks</span></h2>
               <div className="space-y-4">
                 {[
                   "Repetitive tasks eating up 40% of employee time",
                   "Inconsistent lead follow-up losing potential revenue",
                   "Customer support limited to business hours",
                   "Disconnected systems creating data silos"
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                     <X className="text-red-400 shrink-0 w-5 h-5" />
                     <span className="text-slate-300">{item}</span>
                   </div>
                 ))}
               </div>
             </div>
           </FadeIn>

           <FadeIn direction="right">
             <div className="space-y-8">
               <h2 className="text-3xl md:text-4xl font-bold">The Solution: <br/><span className="gradient-text">Automated Ecosystems</span></h2>
               <div className="space-y-4">
                 {[
                   "Intelligent agents handling repetitive workflows",
                   "Instant, personalized lead nurturing 24/7",
                   "AI Chatbots resolving 80% of queries instantly",
                   "Seamless integration across your entire tech stack"
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-green-500/5 border border-green-500/10">
                     <Check className="text-green-400 shrink-0 w-5 h-5" />
                     <span className="text-slate-300">{item}</span>
                   </div>
                 ))}
               </div>
             </div>
           </FadeIn>
         </div>
         
         <FadeIn delay={200} className="mt-16">
            <StatsCounter />
         </FadeIn>
       </div>
    </section>
  );
};

const Services = () => {
  const services: Service[] = [
    {
      icon: Bot,
      title: "AI Customer Acquisition",
      description: "Automated outreach and lead qualification systems that fill your calendar with qualified prospects while you sleep."
    },
    {
      icon: Cpu,
      title: "Business Automation",
      description: "End-to-end workflow automation using Make.com and custom scripts to eliminate manual data entry and connecting your apps."
    },
    {
      icon: MessageSquare,
      title: "Smart Chatbots",
      description: "Custom-trained LLM chatbots that understand your business context, handle support tickets, and book appointments."
    },
    {
      icon: BarChart3,
      title: "Predictive Analytics",
      description: "Leverage your data to predict trends, optimize marketing spend, and make data-driven decisions with AI analysis."
    }
  ];

  return (
    <section id="services" className="py-24 bg-dark-900 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Expertise</h2>
          <p className="text-slate-400 text-lg">We don't just offer tools; we build complete systems tailored to your operational needs.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <FadeIn key={idx} delay={idx * 100}>
              <div className="group p-8 rounded-2xl glass-panel hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 border border-white/5 h-full flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-grow">{service.description}</p>
                <div className="mt-6 flex items-center text-primary-400 text-sm font-medium cursor-pointer group-hover:translate-x-2 transition-transform">
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const steps: ProcessStep[] = [
    { step: "01", title: "Discovery & Audit", description: "We analyze your current workflows, identify bottlenecks, and map out the highest ROI opportunities for automation." },
    { step: "02", title: "Strategy Design", description: "Our engineers design a custom AI architecture tailored to your specific goals, tools, and scalability requirements." },
    { step: "03", title: "Build & Integrate", description: "We develop, train, and integrate the AI systems into your existing infrastructure with minimal disruption." },
    { step: "04", title: "Optimize & Scale", description: "Continuous monitoring and refinement to ensure the system evolves with your business and maximizes performance." }
  ];

  return (
    <section id="process" className="py-24 bg-dark-800 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-bold mb-6">How We Work</h2>
           <p className="text-slate-400">From chaos to clarity in four simple steps.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary-500/50 to-transparent"></div>

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, idx) => (
              <FadeIn key={idx} delay={idx * 100} direction={idx % 2 === 0 ? 'right' : 'left'}>
                <div className={`relative flex flex-col md:flex-row gap-8 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Dot */}
                  <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-dark-900 border-4 border-primary-500 z-10 shadow-[0_0_20px_rgba(14,165,233,0.5)]"></div>
                  
                  {/* Content */}
                  <div className={`md:w-1/2 pl-12 md:pl-0 ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                    <span className="text-6xl font-bold text-white/5 absolute -top-8 select-none z-0">{step.step}</span>
                    <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{step.title}</h3>
                    <p className="text-slate-400 relative z-10">{step.description}</p>
                  </div>
                  <div className="md:w-1/2"></div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CaseStudies = () => {
  const cases = [
    {
      industry: "Real Estate Agency",
      metric: "300% Increase",
      desc: "in qualified lead bookings via AI SMS agents.",
      bg: "bg-blue-900/20"
    },
    {
      industry: "E-commerce Brand",
      metric: "40hrs/week Saved",
      desc: "by automating inventory management and customer support.",
      bg: "bg-purple-900/20"
    },
    {
      industry: "SaaS Startup",
      metric: "25% Churn Reduction",
      desc: "through predictive analytics and automated retention flows.",
      bg: "bg-emerald-900/20"
    }
  ];

  return (
    <section id="cases" className="py-24 bg-dark-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Real Results</h2>
            <p className="text-slate-400">See how we're transforming businesses across industries.</p>
          </div>
          <Button variant="outline">View All Case Studies</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 150}>
              <div className="glass-panel rounded-2xl p-8 h-full flex flex-col hover:border-primary-500/30 transition-colors">
                <div className={`inline-block px-3 py-1 rounded text-xs font-medium tracking-wider uppercase mb-6 w-max border border-white/10 bg-white/5`}>
                  {item.industry}
                </div>
                <div className="text-4xl font-bold text-white mb-2">{item.metric}</div>
                <p className="text-slate-400 mb-8">{item.desc}</p>
                <div className="mt-auto pt-6 border-t border-white/5">
                  <button className="text-sm font-semibold text-white flex items-center hover:text-primary-400 transition-colors">
                    Read Case Study <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How long does it take to implement an AI system?",
      answer: "Typical implementation timelines range from 2-4 weeks depending on complexity. We start with a quick-win pilot to demonstrate ROI within the first 14 days."
    },
    {
      question: "Do I need technical knowledge to manage this?",
      answer: "Not at all. We build 'human-in-the-loop' systems designed for non-technical operators. We provide full training and ongoing maintenance support."
    },
    {
      question: "Is my business data secure?",
      answer: "Security is our priority. We use enterprise-grade encryption and ensure our AI integrations comply with GDPR and SOC2 standards. We never use your private data to train public models."
    },
    {
      question: "What is the pricing structure?",
      answer: "We operate on a hybrid model: a one-time implementation fee for the system build, followed by a monthly maintenance retainer to ensure peak performance."
    }
  ];

  return (
    <section className="py-24 bg-dark-800">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-white/5 bg-white/[0.02] rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-white">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`px-6 text-slate-400 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setEmail("");
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-primary-900/20"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 md:p-16 text-center border border-primary-500/30 shadow-[0_0_50px_rgba(14,165,233,0.1)]">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Scale?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Stop wasting time on manual tasks. Schedule your free strategy call to see how we can automate your growth.
          </p>
          
          {!submitted ? (
             <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
               <form className="w-full flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
                 <input 
                   type="email" 
                   required
                   placeholder="Enter your work email" 
                   className="flex-grow px-6 py-4 rounded-lg bg-dark-900 border border-slate-700 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
                 <Button className="w-full sm:w-auto whitespace-nowrap">
                   Get Started
                 </Button>
               </form>
             </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-lg inline-flex items-center gap-2">
              <Check className="w-5 h-5" /> Thanks! We'll be in touch shortly.
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-primary-500" /> No commitment required</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-primary-500" /> Free 30-min Audit</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
             <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-primary-600 flex items-center justify-center">
                <Bot className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">Webnexa<span className="text-primary-500">AI</span></span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering businesses with next-generation AI automation and scaling infrastructure.
            </p>
            <div className="flex gap-4 mt-6">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary-500 hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-primary-400 transition-colors">AI Chatbots</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Lead Generation</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Workflow Automation</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Data Analytics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@webnexa.ai</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (555) 000-0000</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> San Francisco, CA</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Webnexa AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App Component ---

const App = () => {
  // Initial Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-dark-900 min-h-screen text-slate-50 font-sans selection:bg-primary-500 selection:text-white">
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <ProblemSolution />
        <Services />
        <Process />
        <CaseStudies />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      
      {/* Scroll to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-500 transition-all z-40 opacity-50 hover:opacity-100 hidden md:block"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default App;