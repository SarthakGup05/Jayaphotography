import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, MapPin, Camera, Quote } from "lucide-react";

const FeaturedStories = () => {
  const [activeStory, setActiveStory] = useState(0);

  const stories = [
    {
      id: 1,
      title: "Little Arjun's First Smile",
      category: "Newborn Story",
      date: "March 15, 2024",
      location: "Lucknow Studio",
      mainImage:
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop&crop=faces",
      story:
        "When Priya and Rohit brought little Arjun to the studio, he was just 10 days old. The magic happened when we captured his first genuine smile during the session. His tiny fingers wrapped around his father's thumb, and his mother's eyes filled with tears of joy. These are the moments that make photography so special - capturing pure, unfiltered love.",
      quote:
        "Jaya captured our baby's first smile so beautifully. Every time we look at these photos, we're transported back to that perfect moment.",
      author: "Priya & Rohit",
      tags: ["newborn", "family", "studio", "love"],
      heartColor: "text-pink-500",
    },
    {
      id: 2,
      title: "Expecting Miracles",
      category: "Maternity Journey",
      date: "February 20, 2024",
      location: "Gomti Riverfront",
      mainImage:
        "https://media.istockphoto.com/id/1539148997/photo/happy-indian-pregnant-woman-playing-with-baby-shoes-or-booties-on-tummy-at-home-concept-of.jpg?s=1024x1024&w=is&k=20&c=uMnQr11otNDlUxcMTssA4DUYGPozdqLKx8xlq7sNuB4=",
      story:
        "Sneha's maternity session was planned around the golden hour at Gomti Riverfront. At 7 months pregnant, she glowed with anticipation. We captured her gentle touches to her belly, the way she looked at her husband with complete trust, and the serene moments by the water. Nature provided the perfect backdrop for this beautiful chapter of their love story.",
      quote:
        "The photos from my maternity shoot are absolutely magical. Jaya knew exactly how to make me feel comfortable and beautiful.",
      author: "Sneha Agarwal",
      tags: ["maternity", "outdoor", "golden hour", "nature"],
      heartColor: "text-amber-500",
    },
    {
      id: 3,
      title: "Fashion Forward",
      category: "Style Story",
      date: "January 10, 2024",
      location: "Heritage Mansion",
      mainImage:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop&crop=faces",
      story:
        "Kavya's fashion shoot was inspired by vintage elegance. We chose a heritage mansion in old Lucknow for its timeless architecture. The interplay of light and shadow, the texture of old walls, and Kavya's natural grace created something truly special. Each frame tells a story of confidence, beauty, and artistic expression.",
      quote:
        "Working with Jaya was like working with a friend who happens to be incredibly talented. She brought out the best in me.",
      author: "Kavya Sharma",
      tags: ["fashion", "vintage", "heritage", "artistic"],
      heartColor: "text-purple-500",
    },
  ];

  const currentStory = stories[activeStory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            Featured Stories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Every photograph tells a story. Here are some of our favorite
            moments and the stories behind them.
          </p>
        </div>

        {/* Story Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-4 bg-white rounded-full p-2 shadow-lg">
            {stories.map((story, index) => (
              <button
                key={story.id}
                onClick={() => setActiveStory(index)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeStory === index
                    ? "bg-gray-900 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {story.category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Story Content */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <Heart
                  className={`w-6 h-6 ${currentStory.heartColor} fill-current`}
                />
                <h3 className="text-2xl font-light text-gray-900">
                  {currentStory.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{currentStory.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{currentStory.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>{currentStory.category}</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 font-light">
                {currentStory.story}
              </p>

              {/* Quote */}
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-900">
                <Quote className="w-6 h-6 text-gray-400 mb-3" />
                <blockquote className="text-gray-800 italic mb-3">
                  "{currentStory.quote}"
                </blockquote>
                <cite className="text-sm text-gray-600 font-medium">
                  - {currentStory.author}
                </cite>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {currentStory.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <img
                src={currentStory.mainImage}
                alt={currentStory.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="p-4 text-center">
                <h4 className="font-medium text-gray-900 mb-2">
                  {currentStory.title}
                </h4>
                <p className="text-sm text-gray-600">{currentStory.location}</p>
                <p className="text-xs text-gray-500 mt-2 handwriting">
                  Captured with ❤️
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Story Thumbnails */}
        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <Card
              key={story.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                activeStory === index ? "ring-2 ring-gray-900" : ""
              }`}
              onClick={() => setActiveStory(index)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={story.mainImage}
                    alt={story.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                    {story.category}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {story.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {story.story.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{story.date}</span>
                    <Heart
                      className={`w-4 h-4 ${story.heartColor} fill-current`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <style jsx>{`
        .handwriting {
          font-family: "Courier New", monospace;
          transform: rotate(-2deg);
        }
      `}</style>
    </div>
  );
};

export default FeaturedStories;
