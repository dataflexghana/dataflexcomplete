
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, UserPlus, LogIn, TrendingUp, Users, Wallet, RefreshCw, Rocket, Award, CheckCircle, MessageSquare, ShieldCheck, Zap, ThumbsUpIcon, Heart } from 'lucide-react';
import { WelcomePopup } from '@/components/welcome-popup';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const popupDismissedThisSession = sessionStorage.getItem('welcomePopupDismissed_session');
    if (!popupDismissedThisSession) {
      const authUser = localStorage.getItem('authUser');
      if (!authUser) {
         const timer = setTimeout(() => setShowPopup(true), 2000);
         return () => clearTimeout(timer);
      }
    }
  }, []);

  const handlePopupDismiss = () => {
    sessionStorage.setItem('welcomePopupDismissed_session', 'true');
    setShowPopup(false);
  };

  const successStories = [
    {
      name: "Ama Serwaa",
      story: "DataFlex transformed my side hustle! The commissions are great, and ordering is so easy. I finally have a reliable income stream.",
      image: "/images/testimonial-1.jpg",
    },
    {
      name: "Kofi Mensah",
      story: "I was new to selling data, but DataFlex made it simple. The dashboard is user-friendly, and I love the dynamic pricing alerts!",
      image: "/images/testimonial-2.jpg",
    },
    {
      name: "Fatima Ibrahim",
      story: "The gig services are a game-changer! I can now offer logo design and CV writing to my clients, increasing my earnings significantly.",
      image: "/images/testimonial-3.jpg",
    },
    {
      name: "David Adjei",
      story: "Renewing my subscription is worth every cedi. The discounted bundles and performance bonuses keep me motivated. Highly recommend!",
      image: "/images/testimonial-4.jpg",
    },
    {
      name: "Esther Owusu",
      story: "I love how quickly orders are processed. My customers are always happy, and that means more business for me. The support is also fantastic.",
      image: "/images/testimonial-5.jpg",
    },
    {
      name: "Fatimah Mohammed",
      story: "From zero to hero! I started with no experience and now I'm a top agent. DataFlex provided the tools and support I needed to succeed.",
      image: "/images/testimonial-6.jpg",
    },
  ];


  return (
    <>
      {showPopup && <WelcomePopup onDismiss={handlePopupDismiss} />}

      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 md:py-24">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fill-rule='evenodd'%3E%3Cg%20fill='%23ffffff'%20fill-opacity='0.05'%3E%3Ccircle%20cx='30'%20cy='30'%20r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="hero-content text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                <Star className="w-4 h-4" />
                <span>Ghana's #1 Data Reseller Network</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold !leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">
                Become a DataFlex Agent Today
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Join thousands of successful agents earning daily by reselling data bundles & digital services across Ghana.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div className="stat-item">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-sm opacity-80">Active Agents</div>
                </div>
                <div className="stat-item">
                  <div className="text-3xl font-bold">₵50K+</div>
                  <div className="text-sm opacity-80">Monthly Earnings</div>
                </div>
                <div className="stat-item">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm opacity-80">Support</div>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md p-6 rounded-lg mb-8 border border-white/20">
                <div className="text-center mb-4">
                  <span className="block text-4xl font-bold">₵35</span>
                  <span className="block text-lg opacity-90">One-time Registration</span>
                  <span className="block text-sm opacity-80">Valid for 3 Months</span>
                </div>
                <p className="text-center text-sm opacity-80 flex items-center justify-center gap-1">
                  <RefreshCw className="w-4 h-4" /> Renewable based on performance
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" asChild className="bg-white text-primary hover:bg-slate-100 shadow-lg transform hover:scale-105 transition-transform">
                  <Link href="/register">
                    <UserPlus className="mr-2 h-5 w-5" /> Register as Agent
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-white text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm shadow-lg transform hover:scale-105 transition-transform">
                  <Link href="/login">
                    <LogIn className="mr-2 h-5 w-5" /> Agent Login
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hero-image relative hidden md:block">
              <div className="relative flex justify-center items-center">
                <div className="absolute top-[20%] -left-[10%] bg-white/90 text-slate-700 px-4 py-2 rounded-lg shadow-xl backdrop-blur-md flex items-center gap-2 text-sm font-semibold animate-float z-20">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Real-time Analytics</span>
                </div>
                <div className="absolute top-[60%] -right-[10%] bg-white/90 text-slate-700 px-4 py-2 rounded-lg shadow-xl backdrop-blur-md flex items-center gap-2 text-sm font-semibold animate-float animation-delay-1000 z-20">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span>Daily Earnings</span>
                </div>
                 <div className="absolute bottom-[20%] left-[10%] bg-white/90 text-slate-700 px-4 py-2 rounded-lg shadow-xl backdrop-blur-md flex items-center gap-2 text-sm font-semibold animate-float animation-delay-2000 z-20">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Growing Network</span>
                </div>
                <Image
                  src="/images/hero.jpg"
                  alt="DataFlex Ghana Mobile Data"
                  width={500}
                  height={450}
                  className="rounded-lg shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-slate-800">Why Join DataFlex?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Unlock unparalleled benefits and skyrocket your earnings as a DataFlex agent.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              { icon: Award, title: "High Commissions", description: "Earn competitive commissions on data bundles and exclusive gig services." },
              { icon: Zap, title: "Instant Activations", description: "Fast and reliable data bundle delivery to keep your customers happy." },
              { icon: TrendingUp, title: "Performance Bonuses", description: "Get rewarded for your hard work with monthly bonuses for top-performing agents." },
              { icon: Users, title: "Growing Community", description: "Join a network of successful agents and share insights and strategies." },
              { icon: ShieldCheck, title: "Secure Platform", description: "Reliable and secure platform to manage your orders and earnings." },
              { icon: MessageSquare, title: "Dedicated Support", description: "Our support team is always ready to assist you with any queries." },
              { icon: Heart, title: "Your Profit, Our Priority", description: "We're committed to your success. Sometimes, we offer services even at our loss to ensure you always have profitable opportunities." },
            ].map(benefit => (
              <Card key={benefit.title} className="shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardHeader className="items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full inline-block mb-3">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-slate-800">Simple Steps to Success</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Getting started with DataFlex is quick and easy. Follow these simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Register</h3>
              <p className="text-slate-600 text-sm">Sign up with a one-time fee of ₵35 for a 3-month renewable agent account.</p>
            </div>
            <div className="text-center p-6">
               <div className="flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Order & Sell</h3>
              <p className="text-slate-600 text-sm">Access discounted data bundles and digital gigs through your agent dashboard and sell to customers.</p>
            </div>
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Earn Commissions</h3>
              <p className="text-slate-600 text-sm">Earn commissions on every sale and gig. Withdraw your earnings easily.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="success-stories" className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-slate-800">Hear From Our Agents</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Real stories from agents thriving with DataFlex.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Image
                      src={story.image}
                      alt={story.name}
                      width={60}
                      height={60}
                      className="rounded-full mr-4 border-2 border-primary/50 object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">{story.name}</CardTitle>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm italic leading-relaxed">&quot;{story.story}&quot;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the DataFlex Agent Network</h2>
          <p className="text-lg opacity-90 mb-8">Start your journey to financial freedom today.</p>
          <Button size="lg" asChild className="bg-white text-primary hover:bg-slate-100">
            <Link href="/register">
              <RocketIcon className="mr-2 h-5 w-5" /> Start Registration
            </Link>
          </Button>
        </div>
      </section>

      <section id="bundles" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-800">Data Bundles & Digital Gigs</h2>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">Wholesale prices for DataFlex agents across all networks, plus a variety of digital services you can offer.</p>
           <div className="bg-slate-100 p-8 md:p-12 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-slate-700">Ready to Start Earning More?</h3>
            <p className="text-slate-600 mb-8">Join thousands of successful agents reselling these bundles and services for profit.</p>
            <Button size="lg" asChild>
              <Link href="/register">
                <RocketIcon className="mr-2 h-5 w-5" /> Become an Agent Today
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

// Define RocketIcon if it's not globally available or imported from lucide-react
// Ensure RocketIcon or Rocket is imported if it's from lucide-react
function RocketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.87 12.87 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}

      