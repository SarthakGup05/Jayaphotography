import React, { useState } from 'react';
import { Camera, Heart, Baby, Sparkles, Phone, Mail, MapPin, User } from 'lucide-react';

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    service: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
    alert('Thank you for your inquiry! We\'ll get back to you soon.');
  };

  const services = [
    {
      title: "Maternity Photography",
      description: "Capture the beautiful journey of motherhood with elegant and timeless portraits",
      icon: <Heart className="w-8 h-8" />,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Baby Photography",
      description: "Preserve precious moments of your little one's early days with gentle, loving captures",
      icon: <Baby className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Fashion Photography",
      description: "Express your unique style and personality through stunning fashion portraits",
      icon: <Sparkles className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-500"
    }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-rose-200 mb-6">
            <Camera className="w-5 h-5 text-rose-500" />
            <span className="text-rose-600 font-medium">Professional Photography</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Capture Life's Most
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent"> Beautiful Moments</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your precious memories into timeless art with our professional photography services
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Services */}
          <div className="space-y-8">
            <div className="grid gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-rose-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className={`absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-r ${service.color} opacity-5 rounded-full group-hover:opacity-10 transition-opacity duration-500`}></div>
                </div>
              ))}
            </div>

            {/* Image placeholder */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Photography Session"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-lg font-semibold">Professional Photography</p>
                <p className="text-white/90">Creating memories that last forever</p>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="sticky top-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Get in Touch</h3>
                <p className="text-gray-600">Ready to create something beautiful together?</p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder-gray-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder-gray-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="city"
                      placeholder="Your City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <Camera className="absolute left-4 top-6 text-gray-400 w-5 h-5" />
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-gray-700 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select Photography Service</option>
                    <option value="maternity">Maternity Photography</option>
                    <option value="baby">Baby Photography</option>
                    <option value="fashion">Fashion Photography</option>
                    <option value="multiple">Multiple Services</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-xl hover:from-rose-600 hover:to-pink-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>BOOK YOUR SESSION</span>
                    <Camera className="w-5 h-5" />
                  </span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                  We'll respond within 24 hours to discuss your vision and schedule your session
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;