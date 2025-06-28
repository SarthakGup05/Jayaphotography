import React, { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, Linkedin, ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "About",
    dropdown: [
      // { name: "About Company", href: "/about-company" },
      { name: "About Jaya Agnihotri", href: "/about-jaya" },
    ],
  },
  {
    name: "Photography",
    dropdown: [
      { name: "Baby Photography", href: "/baby-photography" },
      { name: "Maternity Photography", href: "/maternity-photography" },
      { name: "Fashion Photography", href: "/fashion-photography" },
    ],
  },
  { name: "Packages", href: "/packages" },
  { name: "Contact Us", href: "/contact" },
];

const Nav = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-rose-200/50' 
        : 'bg-gradient-to-r from-rose-50 to-pink-50 shadow-lg border-b border-rose-300/30'
    }`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-slate-800 flex items-center gap-2 group">
          <Link to="/" className="flex items-center">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-32 h-14 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </Link>
        </div>
        

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-1 items-center">
          {navLinks.map((link, idx) =>
            link.dropdown ? (
              <div
                key={link.name}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(idx)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 text-slate-700 hover:text-rose-600 font-medium transition-all duration-300 px-4 py-2 rounded-full hover:bg-rose-100/70 focus:outline-none group relative overflow-hidden">
                  <span className="relative z-10">{link.name}</span>
                  <ChevronDown 
                    size={16} 
                    className={`relative z-10 transition-transform duration-300 ${
                      openDropdown === idx ? 'rotate-180' : ''
                    }`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></div>
                </button>
                
                <div className={`absolute left-0 mt-2 min-w-[200px] bg-white/95 backdrop-blur-sm border border-rose-200 rounded-2xl shadow-2xl py-2 transition-all duration-300 transform ${
                  openDropdown === idx 
                    ? "opacity-100 translate-y-0 scale-100" 
                    : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                }`}>
                  {link.dropdown.map((item, itemIdx) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-4 py-3 text-slate-700 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 transition-all duration-200 relative group/item"
                      style={{ animationDelay: `${itemIdx * 50}ms` }}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-rose-400 to-pink-400 transform scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300 origin-top"></div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="text-slate-700 hover:text-rose-600 font-medium transition-all duration-300 px-4 py-2 rounded-full hover:bg-rose-100/70 relative group overflow-hidden"
              >
                <span className="relative z-10">{link.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></div>
              </Link>
            )
          )}
        </div>

        {/* Social Icons */}
        <div className="hidden md:flex gap-2 ml-6">
          {[
            { icon: Facebook, href: "https://facebook.com", color: "hover:text-blue-600", bg: "hover:bg-blue-100" },
            { icon: Twitter, href: "https://twitter.com", color: "hover:text-sky-500", bg: "hover:bg-sky-100" },
            { icon: Instagram, href: "https://instagram.com", color: "hover:text-pink-600", bg: "hover:bg-pink-100" },
            { icon: Linkedin, href: "https://linkedin.com", color: "hover:text-blue-700", bg: "hover:bg-blue-100" },
          ].map(({ icon: Icon, href, color, bg }, idx) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full text-slate-600 ${color} ${bg} transition-all duration-300 transform hover:scale-110 hover:shadow-lg relative group overflow-hidden`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <Icon size={20} className="relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full text-slate-700 hover:text-rose-600 hover:bg-rose-100 transition-all duration-300 focus:outline-none transform hover:scale-110"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6">
            <Menu 
              size={24} 
              className={`absolute inset-0 transition-all duration-300 ${
                mobileOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
              }`} 
            />
            <X 
              size={24} 
              className={`absolute inset-0 transition-all duration-300 ${
                mobileOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
              }`} 
            />
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
        mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-gradient-to-br from-white/95 to-rose-50/95 backdrop-blur-sm border-t border-rose-200/50 px-4 pb-6 pt-4 space-y-2">
          {navLinks.map((link, idx) =>
            link.dropdown ? (
              <div key={link.name} className={`transform transition-all duration-500 ${
                mobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`} style={{ transitionDelay: `${idx * 100}ms` }}>
                <button
                  className="flex items-center w-full justify-between text-slate-700 hover:text-rose-600 font-medium px-4 py-3 rounded-xl hover:bg-rose-100/50 focus:outline-none transition-all duration-300 group"
                  onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                >
                  <span>{link.name}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openDropdown === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  openDropdown === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="pl-6 border-l-2 border-gradient-to-b from-rose-300 to-pink-300 mt-2 space-y-1">
                    {link.dropdown.map((item, itemIdx) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-4 py-2 text-slate-600 hover:text-rose-600 transition-all duration-200 rounded-lg hover:bg-rose-50/50 transform hover:translate-x-1"
                        style={{ transitionDelay: `${itemIdx * 50}ms` }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={`block text-slate-700 hover:text-rose-600 font-medium px-4 py-3 rounded-xl hover:bg-rose-100/50 transition-all duration-300 transform ${
                  mobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {link.name}
              </Link>
            )
          )}
          
          {/* Mobile Social Icons */}
          <div className={`flex gap-3 mt-6 px-4 transform transition-all duration-500 ${
            mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{ transitionDelay: '400ms' }}>
            {[
              { icon: Facebook, href: "https://facebook.com", color: "hover:text-blue-600", bg: "hover:bg-blue-100" },
              { icon: Twitter, href: "https://twitter.com", color: "hover:text-sky-500", bg: "hover:bg-sky-100" },
              { icon: Instagram, href: "https://instagram.com", color: "hover:text-pink-600", bg: "hover:bg-pink-100" },
              { icon: Linkedin, href: "https://linkedin.com", color: "hover:text-blue-700", bg: "hover:bg-blue-100" },
            ].map(({ icon: Icon, href, color, bg }, idx) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full text-slate-600 ${color} ${bg} transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;