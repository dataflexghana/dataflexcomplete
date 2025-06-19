
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MessageCircle, Clock } from 'lucide-react'; // Using MessageCircle for WhatsApp

export default function HomeFooter() {
  return (
    <footer className="bg-slate-800 text-slate-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="footer-section">
            <div className="mb-4">
              <Link href="/home" className="flex items-center gap-2">
                 <div className="logo-icon w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                    <Image src="/images/logo.png" alt="DataFlex Logo" width={30} height={30} className="rounded"/>
                </div>
              </Link>
            </div>
            <p className="text-sm leading-relaxed">
              Ghana's premier data bundle provider offering affordable bundles for MTN, AirtelTigo, and Telecel networks.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="text-lg font-semibold text-white mb-4">For Agents</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-white transition-colors text-sm">Terms & Conditions</Link></li>
              {/* Add more agent links if needed */}
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://wa.me/233242799990" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" /> WhatsApp Support
                </a>
              </li>
              <li>
                <a href="mailto:sales.dataflex@gmail.com" className="hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Email Support
                </a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>sales.dataflex@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary flex-shrink-0" /> 
                <span>+233 24 279 9990</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span>24/7 Support Available</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-slate-400">&copy; {new Date().getFullYear()} DataFlex Ghana. All rights reserved.</p>
            <div className="flex gap-4 items-center">
              <Link href="/terms" className="hover:text-white transition-colors text-slate-400">Terms & Conditions</Link>
              <span className="text-slate-600">|</span>
              <a href="https://wa.me/233242799990" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-slate-400">Support</a>
              <span className="text-slate-600">|</span>
              <Link href="/login?role=admin" className="text-red-400 hover:text-red-300 transition-colors">Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

