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
  Search,
  User,
  Heart,
  Star,
  Home,
  Image,
  Users,
  MessageSquare,
  Phone,
  Settings
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axiosinstance";
import { toast } from "react-hot-toast";

const Nav = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [photographyServices, setPhotographyServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

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
        { name: "About Jaya Agnihotri", href: "/about-jaya", description: "Learn about our photographer" },
        { name: "Studio Tour", href: "/studio", description: "Virtual tour of our facilities" },
      ],
    },
    { 
      name: "Gallery", 
      href: "/gallery", 
      icon: <Image className="w-4 h-4" /> 
    },
  ];

  // Enhanced search functionality
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await axiosInstance.get(`/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      // Fallback search results
      const fallbackResults = [
        { title: "Maternity Photography", type: "service", href: "/services/maternity" },
        { title: "Baby Photography", type: "service", href: "/services/baby" },
        { title: "Gallery", type: "page", href: "/gallery" },
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(fallbackResults);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Fetch photography services with enhanced error handling
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
          href: `/services/${service.slug}`,
          // featured: service.isFeatured,
          // duration: service.duration,
          // description: service.description,
          // price: service.startingPrice,
        }));
        
        setPhotographyServices(serviceItems);
        toast.success(`Loaded ${serviceItems.length} photography services`, { duration: 2000 });
      } catch (error) {
        console.error("Error fetching photography services:", error);
        toast.error("Using offline services menu");
        
        // Enhanced fallback services
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

  // Enhanced scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
      
      // Close dropdowns on scroll
      if (scrollPosition > 50) {
        setOpenDropdown(null);
        setSearchOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
      href: "/contact", 
      icon: <Phone className="w-4 h-4" /> 
    },
  ];

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

    return dropdown.map((item, itemIdx) => (
      <Link
        key={item.name}
        to={item.href}
        className="block px-4 py-3 text-gray-800 hover:bg-white/80 hover:text-black transition-all duration-200 relative group/item rounded-lg mx-2"
        style={{ animationDelay: `${itemIdx * 50}ms` }}
        onClick={() => setOpenDropdown(null)}
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
          <div className="flex flex-col items-end">
            {item.duration && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {item.duration}
              </span>
            )}
            {item.price && (
              <span className="text-xs text-green-600 font-semibold mt-1">
                From ${item.price}
              </span>
            )}
          </div>
        </div>
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-400 to-pink-400 transform scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300 origin-top rounded-r-full"></div>
      </Link>
    ));
  };

  // Enhanced search results rendering
  const renderSearchResults = () => {
    if (searchLoading) {
      return (
        <div className="px-4 py-3 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
          <span className="ml-2 text-sm text-gray-700">Searching...</span>
        </div>
      );
    }

    if (searchResults.length === 0 && searchQuery) {
      return (
        <div className="px-4 py-3 text-center">
          <p className="text-sm text-gray-600">No results found for "{searchQuery}"</p>
        </div>
      );
    }

    return searchResults.map((result, idx) => (
      <Link
        key={idx}
        to={result.href}
        className="block px-4 py-3 text-gray-800 hover:bg-white/80 transition-all duration-200 border-b border-gray-100 last:border-b-0"
        onClick={() => {
          setSearchOpen(false);
          setSearchQuery('');
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <div>
            <p className="font-medium">{result.title}</p>
            <p className="text-xs text-gray-600 capitalize">{result.type}</p>
          </div>
        </div>
      </Link>
    ));
  };

  // Get current page indicator
  const isCurrentPage = (href) => {
    return location.pathname === href;
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'shadow-xl border-b border-gray-300' 
          : 'shadow-lg border-b border-gray-200'
      }`}
      style={{ 
        backgroundColor: scrolled ? 'rgba(255, 225, 245, 0.95)' : '#FFE1F5',
        backdropFilter: scrolled ? 'blur(10px)' : 'none'
      }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Enhanced Logo */}
        <div className="text-2xl font-bold text-black flex items-center gap-2 group">
          <Link to="/" className="flex items-center">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/logo.png"
                alt="Photography Studio Logo"
                className="w-32 h-14 object-cover transition-transform duration-700 group-hover:scale-110"
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
                STUDIO
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
                ref={dropdownRef}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(idx)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-2 text-black hover:text-gray-800 font-medium transition-all duration-300 px-4 py-2 rounded-full hover:bg-white/60 focus:outline-none group relative overflow-hidden">
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
                    ? "opacity-100 translate-y-0 scale-100" 
                    : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                }`}>
                  {/* Enhanced services header */}
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
                  
                  {/* Enhanced view all services link */}
                  {link.name === "Photography" && !link.loading && (
                    <div className="border-t border-gray-200 mt-2 pt-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-b-2xl">
                      <Link
                        to="/services"
                        className="block px-4 py-3 text-purple-600 hover:text-purple-800 text-center font-medium transition-colors duration-200"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {/* <div className="flex items-center justify-center gap-2">
                          <Settings size={16} />
                          View All Services & Packages →
                        </div> */}
                      </Link>
                    </div>
                  )}
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

        {/* Enhanced Search and Social Icons */}
        <div className="hidden md:flex gap-2 ml-6 items-center">
          {/* Search */}
          {/* <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full text-black hover:text-gray-800 hover:bg-white/60 transition-all duration-300 transform hover:scale-110"
            >
              <Search size={20} />
            </button>
            
            {searchOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-3 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search services, gallery, packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-black bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {renderSearchResults()}
                </div>
              </div>
            )}
          </div> */}

          {/* Social Icons with enhanced hover effects */}
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
              className={`p-2 rounded-full text-gray-700 ${color} ${bg} transition-all duration-300 transform hover:scale-110 hover:shadow-lg relative group overflow-hidden`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <Icon size={20} className="relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </a>
          ))}
        </div>

        {/* Enhanced Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full text-black hover:text-gray-800 hover:bg-white/60 transition-all duration-300 focus:outline-none transform hover:scale-110 relative overflow-hidden group"
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
          <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-pink-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
        </button>
      </div>

      {/* Enhanced Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
        mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div 
          className="backdrop-blur-sm border-t border-gray-300 px-4 pb-6 pt-4 space-y-2"
          style={{ backgroundColor: 'rgba(255, 225, 245, 0.98)' }}
        >
          {/* Mobile Search */}
          {/* <div className={`mb-4 transform transition-all duration-500 ${
            mobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
          }`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-black bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white/90 border border-gray-300 rounded-xl overflow-hidden">
                {renderSearchResults()}
              </div>
            )}
          </div> */}

          {navLinks.map((link, idx) =>
            link.dropdown ? (
              <div key={link.name} className={`transform transition-all duration-500 ${
                mobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`} style={{ transitionDelay: `${idx * 100}ms` }}>
                <button
                  className="flex items-center w-full justify-between text-black hover:text-gray-800 font-medium px-4 py-3 rounded-xl hover:bg-white/60 focus:outline-none transition-all duration-300 group"
                  onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
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
                      <>
                        {link.dropdown.map((item, itemIdx) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block px-4 py-2 text-gray-800 hover:text-black transition-all duration-200 rounded-lg hover:bg-white/60 transform hover:translate-x-1"
                            style={{ transitionDelay: `${itemIdx * 50}ms` }}
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
                              <div className="flex flex-col items-end">
                                {item.duration && (
                                  <span className="text-xs text-gray-600">
                                    {item.duration}
                                  </span>
                                )}
                                {item.price && (
                                  <span className="text-xs text-green-600 font-semibold">
                                    ${item.price}
                                  </span>
                                )}
                              </div>
                            </div>
                            {item.description && (
                              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                            )}
                          </Link>
                        ))}
                        {/* {link.name === "Photography" && (
                          <Link
                            to="/services"
                            className="block px-4 py-2 text-purple-600 hover:bg-white/60 transition-all duration-200 rounded-lg text-sm font-medium"
                            onClick={() => setMobileOpen(false)}
                          >
                            View All Services →
                          </Link>
                        )} */}
                      </>
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
          
          {/* Enhanced Mobile Social Icons */}
          <div className={`flex gap-3 mt-6 px-4 justify-center transform transition-all duration-500 ${
            mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{ transitionDelay: '600ms' }}>
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
                className={`p-3 rounded-full text-gray-700 ${color} ${bg} transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

          {/* Mobile App Promotion */}
          {/* <div className={`mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl transform transition-all duration-500 ${
            mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{ transitionDelay: '700ms' }}>
            <div className="text-center">
              <h4 className="text-black font-semibold mb-2">Download Our App</h4>
              <p className="text-sm text-gray-700 mb-3">Book sessions and view galleries on the go</p>
              <div className="flex gap-2 justify-center">
                <button className="px-3 py-1 bg-black text-white text-xs rounded-full hover:bg-gray-800 transition-colors duration-200">
                  App Store
                </button>
                <button className="px-3 py-1 bg-black text-white text-xs rounded-full hover:bg-gray-800 transition-colors duration-200">
                  Play Store
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
