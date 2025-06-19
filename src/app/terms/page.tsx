
"use client";

import HomeHeader from '@/components/home-header';
import HomeFooter from '@/components/home-footer';
import { Button } from '@/components/ui/button';
import { FileText, Info, Lock, Clock, Box, Calendar, Wrench, LineChart, UserCog, BadgeInfo, Gift, CheckCircle2, ThumbsUp, Ban, X, AlertTriangle, Gavel, ListChecks, Smartphone, XCircle, Headset, Receipt, Phone, CreditCard, Contact, Heart, Mail } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="font-inter bg-slate-50 text-slate-800">
      <HomeHeader />
      <main className="mt-16 md:mt-20">
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <FileText className="w-8 h-8" /> Agent Terms & Conditions
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6 max-w-2xl mx-auto">
              By using our platform or registering as an agent, you accept and agree to all the terms outlined below.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: July 2024</span>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-slate-50">
          <div className="container mx-auto px-4 space-y-12">

            {/* General Terms */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-700 flex items-center gap-2 border-b pb-2">
                <Info className="w-6 h-6 text-primary" /> General Terms
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Lock, title: "No Refunds", text: "Double-check all phone numbers and payment amounts before submitting. All sales are final." },
                  { icon: Clock, title: "Order Processing Time", text: "Most orders process in 1–30 minutes. During network congestion, allow up to 3 hours." },
                  { icon: Box, title: "Data Validity", text: "All bundles are valid for 3 months and roll over with the next purchase. No data goes to waste." },
                  { icon: Calendar, title: "Weekend Availability", text: "We operate 7 days a week, including Saturdays and Sundays." },
                  { icon: Wrench, title: "Bonus Services", text: "Enjoy discounts on 54+ IT and digital services — including web design, CV writing, and software setup." },
                ].map(item => (
                  <div key={item.title} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <item.icon className="w-10 h-10 text-primary mb-3" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.text}</p>
                  </div>
                ))}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-md text-yellow-800">
                  <LineChart className="w-10 h-10 text-yellow-600 mb-3" />
                  <h3 className="text-lg font-semibold mb-1">Price Volatility Warning</h3>
                  <p className="text-sm">Our prices are not fixed. For example, a ₵6 MTN bundle can drop to ₵4 within 24 hours and stay low for over a week. Stay active to benefit from price dips.</p>
                </div>
              </div>
            </div>

            {/* Agent Rules */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-700 flex items-center gap-2 border-b pb-2">
                <UserCog className="w-6 h-6 text-primary" /> Agent Rules & Guidelines
              </h2>
              <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-lg shadow-lg text-center">
                <BadgeInfo className="w-12 h-12 mx-auto mb-2" />
                <h3 className="text-xl font-bold">Registration Fee: ₵35</h3>
                <p className="text-sm opacity-90">Valid for 3 months. Renewable based on performance and activity.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2"><Gift className="w-5 h-5 text-green-500" /> Reseller Benefits</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                  {["Discounted bundles", "Referral commissions", "Bulk discounts", "Dashboard access", "Analytics & order tracking", "Monthly performance bonuses"].map(benefit => (
                    <li key={benefit} className="flex items-center gap-2 bg-slate-100 p-2 rounded"><CheckCircle2 className="w-4 h-4 text-green-500" /> {benefit}</li>
                  ))}
                </ul>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2"><ThumbsUp className="w-5 h-5 text-green-500" /> Allowed Promotion Channels</h3>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {["WhatsApp groups", "Close friends", "Family", "Trusted associates"].map(channel => (
                      <li key={channel} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> {channel}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2"><Ban className="w-5 h-5 text-red-500" /> Strictly Forbidden Promotion Channels</h3>
                   <ul className="space-y-1 text-sm text-slate-700">
                    {["TikTok", "Facebook", "Instagram", "LinkedIn", "Twitter", "Any form of public advertising"].map(channel => (
                      <li key={channel} className="flex items-center gap-2"><X className="w-4 h-4 text-red-500" /> {channel}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md text-red-800">
                <AlertTriangle className="w-10 h-10 text-red-600 mb-3" />
                <h3 className="text-lg font-semibold mb-1">Violation Consequences</h3>
                <p className="text-sm mb-2">If you're reported or discovered promoting on public platforms:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>You will be banned permanently</li>
                  <li>You will lose access to all agent tools</li>
                  <li>No refunds will be given</li>
                </ul>
                <p className="text-sm mt-2 italic">We monitor and act on all reports.</p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-md text-yellow-800 flex items-start gap-3">
                <Gavel className="w-8 h-8 text-yellow-600 mt-1 flex-shrink-0" />
                <p className="text-sm"><strong>Never use our brand name</strong> to create groups, marketing schemes, or personal offers. This will result in legal action.</p>
              </div>
            </div>
            
            {/* Usage Rules */}
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-700 flex items-center gap-2 border-b pb-2">
                    <ListChecks className="w-6 h-6 text-primary" /> Important Usage Rules
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <ol className="list-decimal list-inside space-y-3 text-slate-700 text-sm">
                        {[
                            "Join our official WhatsApp group for updates.",
                            "Do not advertise our platform publicly.",
                            "Do not contact MTN, AirtelTigo, or Telecel for bundle disputes. We are a separate reseller service.",
                            "Do not use SIMs with borrowed airtime/data — bundles may auto-expire.",
                            "Once a bundle is sent, it cannot be cancelled or corrected.",
                            "Only refer friends using our official website.",
                            "Always notify us when bundles are delivered — this helps improve delivery tracking.",
                            "Delivery may take longer during peak traffic — please be patient."
                        ].map((rule, index) => (
                           <li key={index} className="pl-2">{rule}</li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Unsupported SIMs */}
             <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-2xl font-semibold text-slate-700 flex items-center gap-2">
                        <Smartphone className="w-6 h-6 text-primary" /> Unsupported SIM Types
                    </h2>
                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">NO REFUNDS</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md">
                    {[
                        "Agent SIMs", "Merchant SIMs", "EVD SIMs", "TurboNet/Broadband SIMs",
                        "Blacklisted or Roaming SIMs", "Corporate/Group SIMs", "Wrong/Invalid Numbers", "Cross-network numbers"
                    ].map(simType => (
                        <div key={simType} className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded border-l-2 border-red-500 text-sm">
                            <XCircle className="w-4 h-4 flex-shrink-0" /> <span>{simType}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reporting Process */}
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-700 flex items-center gap-2 border-b pb-2">
                    <Headset className="w-6 h-6 text-primary" /> Reporting Process for Delayed Orders
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-slate-600 mb-4 text-sm">If your order is delayed beyond 3 hours, please send the following via WhatsApp to <strong className="text-primary">0240000000</strong> (Example Number):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {[
                            {icon: UserCog, label: "Agent Code"}, {icon: Receipt, label: "Order Number"},
                            {icon: Phone, label: "Beneficiary Number"}, {icon: CreditCard, label: "Transaction ID"}
                        ].map(info => (
                            <div key={info.label} className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded border-l-2 border-blue-500 text-sm">
                                <info.icon className="w-4 h-4 flex-shrink-0" /> <span>{info.label}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-green-600 font-semibold text-center text-sm">Our support team will assist you promptly.</p>
                </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-6">
                 <h2 className="text-2xl font-semibold text-slate-700 flex items-center gap-2 border-b pb-2">
                    <Contact className="w-6 h-6 text-primary" /> Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded">
                        <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <strong className="block text-slate-700">Email</strong>
                            <p className="text-sm text-slate-600">sales.dataflex@gmail.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded">
                        <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <strong className="block text-slate-700">Phone/WhatsApp</strong>
                            <p className="text-sm text-slate-600">+233 24 279 9990</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thank You Section */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 md:p-12 rounded-xl text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
                    <Heart className="w-7 h-7" /> Thank You for Choosing DataFlex Ghana
                </h2>
                <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">
                    We aim to provide affordable, fast, and reliable digital services across Ghana.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <Button size="lg" asChild className="bg-white text-green-600 hover:bg-slate-100 shadow-lg">
                        <Link href="/home">Get Started</Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="border-white text-white hover:bg-white/10 backdrop-blur-sm shadow-lg">
                        <Link href="/home#bundles">View Bundles</Link>
                    </Button>
                </div>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}

    