import React, { useState, useEffect, useRef } from "react";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  ChevronDown, 
  Menu, 
  X, 
  Camera, 
  Loader2,
  User,
  Star,
  Home,
  Image,
  Phone,
  PhoneCall  // Replace MessageCircle with PhoneCall for WhatsApp
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../lib/axiosinstance";
import { toast } from "react-hot-toast";

const Nav = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [photographyServices, setPhotographyServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  
  const location = useLocation();
  const dropdownRefs = useRef([]);

  // Static nav links with icons
  const staticNavLinks = [
    { 
      name: "Home", 
      href: "/", 
      icon: <Home className="w-4 h-4" /> 
    },
    {
      name: "About",
      icon: <User className="w-4 h-4" />,
      dropdown: [
        { 
          name: "About Us", 
          href: "/about-us", 
          description: "Learn about our photographer" 
        },
      ],
    },
    { 
      name: "Gallery", 
      href: "/gallery", 
      icon: <Image className="w-4 h-4" /> 
    },
  ];

  // Fetch photography services
  useEffect(() => {
    const fetchPhotographyServices = async () => {
      try {
        setServicesLoading(true);
        const response = await axiosInstance.get("/services/get-services", {
          params: {
            isActive: 'true',
            sortBy: 'sortOrder',
            sortOrder: 'asc'
          }
        });
        
        const serviceItems = response.data.map(service => ({
          name: service.title,
          href: `/service/${service.slug}`,
        }));
        
        setPhotographyServices(serviceItems);
      } catch (error) {
        console.error("Error fetching photography services:", error);
        
        setPhotographyServices([
          { 
            name: "Baby Photography", 
            href: "/services/baby-photography",
            description: "Precious moments with your little one",
            featured: true
          },
          { 
            name: "Maternity Photography", 
            href: "/services/maternity-photography",
            description: "Beautiful pregnancy journey capture"
          },
          { 
            name: "Fashion Photography", 
            href: "/services/fashion-photography",
            description: "Professional fashion and portrait sessions"
          },
          { 
            name: "Family Photography", 
            href: "/services/family-photography",
            description: "Capturing family bonds and memories"
          },
        ]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchPhotographyServices();
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
      
      if (scrollPosition > 50) {
        setOpenDropdown(null);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedInside = false;
      dropdownRefs.current.forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          clickedInside = true;
        }
      });
      
      if (!clickedInside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Combine static links with dynamic photography services
  const navLinks = [
    ...staticNavLinks,
    {
      name: "Photography",
      icon: <Camera className="w-4 h-4" />,
      dropdown: photographyServices,
      loading: servicesLoading
    },
    { 
      name: "Packages", 
      href: "/packages", 
      icon: <Star className="w-4 h-4" /> 
    },
    { 
      name: "Contact Us", 
      href: "/contact-us", 
      icon: <Phone className="w-4 h-4" /> 
    },
  ];

  // Dropdown toggle function
  const toggleDropdown = (index, event) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Enhanced dropdown rendering
  const renderDropdownItems = (dropdown, loading = false) => {
    if (loading) {
      return (
        <div className="px-4 py-3 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
          <span className="ml-2 text-sm text-gray-700">Loading services...</span>
        </div>
      );
    }

    if (!dropdown || dropdown.length === 0) {
      return (
        <div className="px-4 py-3 text-center">
          <p className="text-sm text-gray-600">No items available</p>
        </div>
      );
    }

    return dropdown.map((item, itemIdx) => (
      <Link
        key={item.name}
        to={item.href}
        className="block px-4 py-3 text-gray-800 hover:bg-white/80 hover:text-black transition-all duration-200 relative group/item rounded-lg mx-2"
        onClick={() => {
          setOpenDropdown(null);
          setMobileOpen(false);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="relative z-10 flex items-center gap-2 font-medium">
              {item.featured && (
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
              {item.name}
            </span>
            {item.description && (
              <span className="text-xs text-gray-600 mt-1">{item.description}</span>
            )}
          </div>
        </div>
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-400 to-pink-400 transform scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300 origin-top rounded-r-full"></div>
      </Link>
    ));
  };

  // Updated social media links with PhoneCall for WhatsApp
  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://www.facebook.com/jayaagnihotriphotography/", 
      color: "hover:text-blue-600", 
      bg: "hover:bg-blue-100",
      label: "Facebook"
    },
    { 
      icon: Instagram, 
      href: "https://www.instagram.com/jayaagnihotriphotography/", 
      color: "hover:text-pink-600", 
      bg: "hover:bg-pink-100",
      label: "Instagram" 
    },
    { 
      icon: PhoneCall, // Using PhoneCall instead of MessageCircle for WhatsApp
      href: "https://wa.me/919335391320",
      color: "hover:text-green-600", 
      bg: "hover:bg-green-100",
      label: "WhatsApp"
    },
  ];

  // Get current page indicator
  const isCurrentPage = (href) => {
    return location.pathname === href;
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'shadow-xl border-b border-purple-200' 
          : 'shadow-lg border-b border-purple-100'
      }`}
      style={{ 
        backgroundColor: scrolled ? '#f3e6fa' : '#F0E7E5',
        backdropFilter: scrolled ? 'blur(10px)' : 'none'
      }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-black flex items-center gap-2 group">
          <Link to="/" className="flex items-center">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/logo.png"
                alt="Photography Studio Logo"
                className="w-38 h-14 object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div 
                className="w-32 h-14 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg items-center justify-center text-white font-bold text-sm hidden"
                style={{ display: 'none' }}
              >
                <Camera className="w-6 h-6 mr-2" />
                Jaya Photography
              </div>
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
                ref={el => dropdownRefs.current[idx] = el}
                className="relative"
              >
                <button 
                  className="flex items-center gap-2 text-black hover:text-gray-800 font-medium transition-all duration-300 px-4 py-2 rounded-full hover:bg-white/60 focus:outline-none group relative overflow-hidden"
                  onClick={(e) => toggleDropdown(idx, e)}
                  type="button"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {link.icon}
                    {link.name}
                    {link.loading && <Loader2 className="w-3 h-3 animate-spin" />}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`relative z-10 transition-transform duration-300 ${
                      openDropdown === idx ? 'rotate-180' : ''
                    }`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-pink-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
                </button>
                
                <div className={`absolute left-0 mt-2 min-w-[300px] bg-white/95 backdrop-blur-sm border border-gray-300 rounded-2xl shadow-2xl py-2 transition-all duration-300 transform ${
                  openDropdown === idx 
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                    : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                }`}>
                  {link.name === "Photography" && !link.loading && link.dropdown.length > 0 && (
                    <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
                      <span className="text-sm text-black flex items-center gap-2 font-semibold">
                        <Camera size={16} />
                        {link.dropdown.length} Professional Services Available
                      </span>
                      <p className="text-xs text-gray-700 mt-1">Capture your special moments with our expert team</p>
                    </div>
                  )}
                  
                  {renderDropdownItems(link.dropdown, link.loading)}
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-2 text-black hover:text-gray-800 font-medium transition-all duration-300 px-4 py-2 rounded-full hover:bg-white/60 relative group overflow-hidden ${
                  isCurrentPage(link.href) ? 'bg-white/80 shadow-sm' : ''
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {link.icon}
                  {link.name}
                </span>
                {isCurrentPage(link.href) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-purple-400 rounded-full"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-pink-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
              </Link>
            )
          )}
        </div>

        {/* Social Icons with WhatsApp */}
        <div className="hidden md:flex gap-2 ml-6 items-center">
          {socialLinks.map(({ icon: Icon, href, color, bg, label }, idx) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full text-gray-700 ${color} ${bg} transition-all duration-300 transform hover:scale-110 hover:shadow-lg relative group overflow-hidden`}
              style={{ animationDelay: `${idx * 100}ms` }}
              title={label}
            >
              <Icon size={20} className="relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full text-black hover:text-gray-800 hover:bg-white/60 transition-all duration-300 focus:outline-none transform hover:scale-110 relative overflow-hidden group"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          type="button"
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
          <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-pink-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
        mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div 
          className="backdrop-blur-sm border-t border-purple-200 px-4 pb-6 pt-4 space-y-2"
          style={{ backgroundColor: 'rgba(243, 230, 250, 0.98)' }}
        >
          {navLinks.map((link, idx) =>
            link.dropdown ? (
              <div key={link.name} className={`transform transition-all duration-500 ${
                mobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`} style={{ transitionDelay: `${idx * 100}ms` }}>
                <button
                  className="flex items-center w-full justify-between text-black hover:text-gray-800 font-medium px-4 py-3 rounded-xl hover:bg-white/60 focus:outline-none transition-all duration-300 group"
                  onClick={(e) => toggleDropdown(idx, e)}
                  type="button"
                >
                  <span className="flex items-center gap-2">
                    {link.icon}
                    {link.name}
                    {link.loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openDropdown === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  openDropdown === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="pl-6 border-l-2 border-purple-300 mt-2 space-y-1">
                    {link.loading ? (
                      <div className="px-4 py-2 flex items-center">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-400 mr-2" />
                        <span className="text-sm text-gray-700">Loading...</span>
                      </div>
                    ) : (
                      link.dropdown?.map((item, itemIdx) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-4 py-2 text-gray-800 hover:text-black transition-all duration-200 rounded-lg hover:bg-white/60 transform hover:translate-x-1"
                          onClick={() => {
                            setMobileOpen(false);
                            setOpenDropdown(null);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              {item.featured && (
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              )}
                              {item.name}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                          )}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-2 text-black hover:text-gray-800 font-medium px-4 py-3 rounded-xl hover:bg-white/60 transition-all duration-300 transform ${
                  mobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                } ${isCurrentPage(link.href) ? 'bg-white/80' : ''}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
                onClick={() => setMobileOpen(false)}
              >
                {link.icon}
                {link.name}
                {isCurrentPage(link.href) && (
                  <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full"></div>
                )}
              </Link>
            )
          )}
          
          {/* Mobile Social Icons with WhatsApp */}
          <div className={`flex gap-3 mt-6 px-4 justify-center transform transition-all duration-500 ${
            mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{ transitionDelay: '600ms' }}>
            {socialLinks.map(({ icon: Icon, href, color, bg, label }, idx) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full text-gray-700 ${color} ${bg} transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                style={{ animationDelay: `${idx * 100}ms` }}
                title={label}
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
