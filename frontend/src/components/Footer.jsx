import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-dark-700 bg-dark-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-black text-white text-sm">FS</span>
            <span className="font-bold text-lg text-white">FreeSiksha</span>
          </div>
          <p className="text-gray-400 text-sm max-w-xs">Empowering learners across India with quality education. Learn anything, anytime, for free.</p>
          <div className="flex gap-3 mt-4">
            {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-dark-700 flex items-center justify-center text-gray-400 hover:text-brand-400 hover:bg-dark-600 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Platform</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {[['/', 'Browse Courses'], ['/register', 'Become a Teacher']].map(([to, label]) => (
              <li key={label}><Link to={to} className="hover:text-brand-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
              <li key={item}><a href="#" className="hover:text-brand-400 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-dark-700 py-4 text-center text-xs text-gray-500">
        &copy; {year} FreeSiksha. All rights reserved.
      </div>
    </footer>
  );
}
