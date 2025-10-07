import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import axiosInstance from "../lib/axiosinstance"; 
import toast from "react-hot-toast";
import Modal from "../Layout/modal";
import ContactForm from "../components/form";
import { Camera, Check, X, Loader2, Star, Sparkles, Crown } from "lucide-react";

const Packages = () => {
  const headingRef = useRef();
  const cardsRef = useRef();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchPackages = async () => {
    try {
      const res = await axiosInstance.get("/packages/get-packages");
      setPackages(res.data || []);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to load packages. Please try again.";
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

 useEffect(() => {
  if (!loading) {
    (async () => {
      try {
        const gsapModule = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        const gsap = gsapModule.default;
        gsap.registerPlugin(ScrollTrigger);

        if (headingRef.current) {
          gsap.fromTo(
            headingRef.current,
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
          );
        }

        if (cardsRef.current) {
          gsap.fromTo(
            cardsRef.current.children,
            { opacity: 0, y: 40, rotateY: -15 },
            {
              opacity: 1,
              y: 0,
              rotateY: 0,
              duration: 0.8,
              stagger: 0.2,
              delay: 0.3,
              ease: "power3.out",
            }
          );
        }
      } catch (error) {
        console.warn("GSAP failed to load:", error);
      }
    })();
  }
}, [loading]);


  const handleBookingSubmit = async (formData, packageData) => {
    try {
      const bookingData = {
        ...formData,
        packageId: packageData.id,
        packageTitle: packageData.title,
        packagePrice: packageData.price,
        bookingType: "package_booking"
      };

      const response = await axiosInstance.post("/enquiries/create-enquiry", bookingData);
      
      toast.success(`Booking request for "${packageData.title}" sent successfully! We'll contact you soon.`);
      
      console.log("Booking response:", response.data);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit booking. Please try again.";
      toast.error(errorMessage);
      console.error("Booking error:", error);
    }
  };

  // Get all unique inclusions
  const allInclusions = Array.from(
    new Set(packages.flatMap((pkg) => pkg.inclusions || []))
  );

  // Package card icons
  const getPackageIcon = (index) => {
    const icons = [
      <Camera className="w-12 h-12" />,
      <Crown className="w-12 h-12" />,
      <Sparkles className="w-12 h-12" />,
      <Star className="w-12 h-12" />
    ];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f3e6fa] to-[#F0E7E5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="text-lg font-medium text-gray-700">Loading packages...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f3e6fa] to-[#F0E7E5] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="p-4 bg-white rounded-full shadow-md inline-block mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-700">{fetchError}</p>
          <button
            onClick={fetchPackages}
            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e6fa] via-white to-[#F0E7E5] py-16 px-4 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-pink-200/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-200/8 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced Header */}
      <div ref={headingRef} className="max-w-6xl mx-auto text-center mb-16 mt-16 relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-100 mb-8 shadow-lg">
          {/* <Camera className="w-5 h-5 text-purple-600" /> */}
          <span className="text-sm font-semibold text-gray-700 tracking-wide">Photography Packages</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Choose Your Perfect 
          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent"> Package</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Compare our photography packages and select the one that best captures your vision and fits your budget perfectly.
        </p>
      </div>

      {/* Enhanced Package Cards */}
      <div ref={cardsRef} className="max-w-7xl mx-auto relative z-10 mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 transform perspective-1000 hover:scale-105 hover:-translate-y-4 overflow-hidden"
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* Enhanced Popular Badge */}
              {idx === 1 && (
                <div className="absolute -top-2 -right-2 z-20">
                  <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl animate-bounce">
                    <div className="flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      <span>POPULAR</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Animated Background Shapes */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-blue-300/15 to-purple-300/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 delay-200"></div>

              {/* Enhanced Icon */}
              {/* <div className="text-center mb-8 relative z-10">
                <div className="inline-flex p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-purple-150 rounded-full shadow-lg mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500">
                  <div className="text-purple-600 group-hover:text-pink-600 transition-colors duration-300">
                    {getPackageIcon(idx)}
                  </div>
                </div>
              </div> */}

              {/* Enhanced Content */}
              <div className="text-center relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 group-hover:text-purple-700 transition-colors duration-300">
                  {pkg.title}
                </h3>
                
                {/* Enhanced Price Display */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <span className="text-2xl md:text-3xl font-bold text-white">{pkg.price}</span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-8 group-hover:text-gray-700 transition-colors duration-300">
                  {pkg.description}
                </p>

                {/* Features Preview */}
                <div className="mb-8">
                  <div className="flex flex-wrap justify-center gap-2">
                    {pkg.inclusions?.slice(0, 3).map((inclusion, i) => (
                      <div key={i} className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full border border-purple-200">
                        {inclusion}
                      </div>
                    ))}
                    {pkg.inclusions?.length > 3 && (
                      <div className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full border border-gray-200">
                        +{pkg.inclusions.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Book Button */}
                <Modal
                  trigger={
                    <Button className={` cursor-pointer w-full py-4 font-bold text-lg rounded-2xl transition-all duration-500 transform group-hover:scale-105 shadow-lg hover:shadow-2xl ${
                      idx === 1 
                        ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white' 
                        : 'bg-white border-2 border-purple-300 text-purple-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>Book {pkg.title}</span>
                      <Sparkles className="w-4 h-4" />
                    </span>
                  </Button>
                  }
                  title={
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">📸</span>
                      <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Book "{pkg.title}"
                        </span>
                        <div className="text-sm text-gray-600 font-normal">
                          Starting at {pkg.price}
                        </div>
                      </div>
                    </div>
                  }
                  description={`Ready to capture beautiful moments? Fill in your details below and we'll create something amazing together with our ${pkg.title} package.`}
                  className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto"
                >
                  {({ close }) => (
                    <ContactForm
                      initialData={{
                        serviceType: pkg.slug || pkg.title?.toLowerCase().replace(/\s+/g, "-"),
                        message: `Hello! I'm interested in booking the "${pkg.title}" package (${pkg.price}). Please let me know about availability and next steps.`
                      }}
                      submitButtonText={`Book ${pkg.title}`}
                      onSubmit={async (formData) => {
                        await handleBookingSubmit(formData, pkg);
                        close();
                      }}
                      className="max-w-none"
                    />
                  )}
                </Modal>

                {/* Floating Elements */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                  <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-30 transition-opacity duration-700 delay-200">
                  <Star className="w-5 h-5 text-pink-400 animate-pulse" />
                </div>
              </div>

              {/* Enhanced Bottom Gradient */}
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Comparison Table */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Detailed <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Comparison</span>
            </h3>
            <p className="text-gray-600">Compare all features across our packages</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-700 bg-gray-50 rounded-l-xl">Feature</th>
                  {packages.map((pkg, idx) => (
                    <th key={idx} className={`text-center py-4 px-4 font-bold ${idx === 1 ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700' : 'bg-gray-50 text-gray-700'} ${idx === packages.length - 1 ? 'rounded-r-xl' : ''}`}>
                      {pkg.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors duration-200">
                  <td className="py-4 px-4 font-semibold text-gray-600">Price</td>
                  {packages.map((pkg, idx) => (
                    <td key={idx} className="text-center py-4 px-4">
                      <span className={`font-bold text-lg ${idx === 1 ? 'text-purple-600' : 'text-gray-800'}`}>
                        {pkg.price}
                      </span>
                    </td>
                  ))}
                </tr>
                {allInclusions.map((inclusion, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-purple-50/20 transition-colors duration-200">
                    <td className="py-4 px-4 text-gray-600">{inclusion}</td>
                    {packages.map((pkg, idx) => (
                      <td key={idx} className="text-center py-4 px-4">
                        {pkg.inclusions?.includes(inclusion) ? (
                          <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                            <X className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
