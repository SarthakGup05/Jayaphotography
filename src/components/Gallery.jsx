import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, Grid3X3, Heart, Eye } from 'lucide-react';

const GalleryShowcase = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isGridView, setIsGridView] = useState(false);

  const galleryItems = [
    {
      id: 1,
      category: 'baby',
      title: 'Sweet Dreams',
      image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=800&fit=crop&crop=faces',
      size: 'large',
      rotation: 'rotate-2',
      description: 'Peaceful slumber captured in studio'
    },
    {
      id: 2,
      category: 'maternity',
      title: 'Golden Glow',
      image: 'https://images.unsplash.com/photo-1555252584-931b94991b34?w=500&h=600&fit=crop&crop=center',
      size: 'medium',
      rotation: '-rotate-1',
      description: 'Expecting mother at sunset'
    },
    {
      id: 3,
      category: 'fashion',
      title: 'Urban Elegance',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop&crop=faces',
      size: 'small',
      rotation: 'rotate-3',
      description: 'City fashion portrait'
    },
    {
      id: 4,
      category: 'baby',
      title: 'Tiny Hands',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop&crop=faces',
      size: 'medium',
      rotation: '-rotate-2',
      description: 'Newborn detail shot'
    },
    {
      id: 5,
      category: 'maternity',
      title: 'Nature\'s Embrace',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=700&fit=crop&crop=center',
      size: 'large',
      rotation: 'rotate-1',
      description: 'Outdoor maternity session'
    },
    {
      id: 6,
      category: 'fashion',
      title: 'Vintage Vibes',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&crop=faces',
      size: 'small',
      rotation: '-rotate-3',
      description: 'Classic fashion photography'
    },
    {
      id: 7,
      category: 'baby',
      title: 'First Smile',
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&h=400&fit=crop&crop=faces',
      size: 'medium',
      rotation: 'rotate-2',
      description: 'Capturing precious moments'
    },
    {
      id: 8,
      category: 'maternity',
      title: 'Serene Moments',
      image: 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=400&h=500&fit=crop&crop=center',
      size: 'small',
      rotation: '-rotate-1',
      description: 'Peaceful pregnancy photography'
    },
    {
      id: 9,
      category: 'fashion',
      title: 'Modern Grace',
      image: 'https://images.unsplash.com/photo-1506629905607-0e2fb0899650?w=600&h=800&fit=crop&crop=faces',
      size: 'large',
      rotation: 'rotate-1',
      description: 'Contemporary fashion shoot'
    }
  ];

  const filters = [
    { key: 'all', label: 'All Photos', count: galleryItems.length },
    { key: 'baby', label: 'Baby', count: galleryItems.filter(item => item.category === 'baby').length },
    { key: 'maternity', label: 'Maternity', count: galleryItems.filter(item => item.category === 'maternity').length },
    { key: 'fashion', label: 'Fashion', count: galleryItems.filter(item => item.category === 'fashion').length }
  ];

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  const getSizeClasses = (size) => {
    if (isGridView) return 'col-span-1 row-span-1';
    
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2';
      case 'medium':
        return 'col-span-1 row-span-2';
      case 'small':
      default:
        return 'col-span-1 row-span-1';
    }
  };

  const getImageHeight = (size) => {
    if (isGridView) return 'h-64';
    
    switch (size) {
      case 'large':
        return 'h-96';
      case 'medium':
        return 'h-80';
      case 'small':
      default:
        return 'h-48';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Gallery Showcase
          </h2>
          <p className="text-white max-w-2xl mx-auto text-lg">
            Explore our collection of captured moments, each telling its own unique story.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>{filter.label}</span>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <button
            onClick={() => setIsGridView(!isGridView)}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isGridView ? 'Masonry View' : 'Grid View'}
            </span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className={`grid gap-6 ${
          isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px]'
        }`}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group ${getSizeClasses(item.size)}`}
            >
              <Card className={`h-full bg-white p-4 shadow-lg transform ${item.rotation} hover:rotate-0 transition-all duration-500 hover:shadow-xl cursor-pointer`}>
                <CardContent className="p-0 h-full relative">
                  <div className="relative overflow-hidden rounded-lg h-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`w-full ${getImageHeight(item.size)} object-cover transition-transform duration-500 group-hover:scale-110`}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex space-x-4">
                          <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {item.category}
                    </div>
                  </div>

                  {/* Photo Info */}
                  <div className="p-3 text-center">
                    <h4 className="font-medium text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-white">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Polaroid Style Bottom Section */}
        <div className="mt-16 flex justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg transform rotate-1 max-w-sm">
            <img
              src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop&crop=faces"
              alt="Featured moment"
              className="w-full h-48 object-cover rounded mb-4"
            />
            <div className="text-center">
              <p className="text-sm text-gray-700 mb-2">Every photo tells a story...</p>
              <p className="text-xs text-gray-500 handwriting transform -rotate-1">
                ~ Jaya Agnihotri Photography ~
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-sm tracking-wider transition-colors duration-300 rounded-sm">
            VIEW FULL PORTFOLIO
          </button>
        </div>
      </div>

      <style jsx>{`
        .handwriting {
          font-family: 'Courier New', monospace;
        }
      `}</style>
    </div>
  );
};

export default GalleryShowcase;