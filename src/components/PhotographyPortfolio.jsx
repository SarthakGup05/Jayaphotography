import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PhotographyPortfolio = () => {
  const portfolioItems = [
    {
      id: 1,
      title: "Sweet Dreams",
      category: "BABY",
      image:
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&crop=faces",
      className: "col-span-1 row-span-1",
    },
    {
      id: 2,
      title: "Tiny Hands",
      category: "BABY",
      image:
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop&crop=faces",
      className: "col-span-1 row-span-2",
    },
    {
      id: 3,
      title: "New Beginnings",
      category: "BABY",
      image:
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop&crop=faces",
      className: "col-span-1 row-span-1",
    },
    {
      id: 4,
      title: "Expecting Joy",
      category: "MATERNITY",
      image:
        "https://media.istockphoto.com/id/1539148997/photo/happy-indian-pregnant-woman-playing-with-baby-shoes-or-booties-on-tummy-at-home-concept-of.jpg?s=1024x1024&w=is&k=20&c=uMnQr11otNDlUxcMTssA4DUYGPozdqLKx8xlq7sNuB4=",
      className: "col-span-1 row-span-2",
    },
    {
      id: 5,
      title: "Beautiful Glow",
      category: "MATERNITY",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=center",
      className: "col-span-1 row-span-1",
    },
    {
      id: 6,
      title: "Elegant Lines",
      category: "FASHION",
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop&crop=faces",
      className: "col-span-1 row-span-1",
    },
    {
      id: 7,
      title: "Urban Style",
      category: "FASHION",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&crop=faces",
      className: "col-span-1 row-span-1",
    },
    {
      id: 8,
      title: "Golden Hour Portrait",
      category: "FASHION",
      image:
        "https://images.unsplash.com/photo-1571513800374-df1bbe650e56?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
      className: "col-span-1 row-span-1",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
            We're Gleam a small and enthusiastic
            <br />
            photography studio based in New York
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            We specialize in capturing life's most precious moments - from the
            tender first days of a newborn's life to the radiant glow of
            expectant mothers, and the bold expressions of fashion. Every
            photograph tells a unique story of beauty, love, and artistry.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {portfolioItems.map((item) => (
            <Card
              key={item.id}
              className={`${item.className} group cursor-pointer border-0 shadow-none overflow-hidden bg-white hover:shadow-lg transition-all duration-300`}
            >
              <CardContent className="p-0 h-full relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 z-10" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-light mb-1">{item.title}</h3>
                  <p className="text-sm tracking-wider opacity-80">
                    {item.category}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-sm tracking-wider transition-colors duration-300">
            VIEW ALL WORK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotographyPortfolio;
