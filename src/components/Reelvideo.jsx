import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const videos = [
  {
    id: 1,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    bg: "https://i.ibb.co/nNggbhf5/joshua-earle-njz0-Tt-Rszo-unsplash.jpg",
  },
  {
    id: 2,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    bg: "https://i.ibb.co/jPhPjG6W/roxy-aln-A7-Fq-Nh-YQm-TA-unsplash.jpg",
  },
  {
    id: 3,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    bg: "https://i.ibb.co/dJgDPQDB/nils-limp-3-S7i7-T-Wtdg-unsplash.jpg",
  },
];

const VideoCarousel = () => {
  const [isPlaying, setIsPlaying] = useState({});
  const [isMuted, setIsMuted] = useState({});
  const videoRefs = useRef({});

  const togglePlay = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying((prev) => ({ ...prev, [id]: true }));
    } else {
      video.pause();
      setIsPlaying((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleMute = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted((prev) => ({ ...prev, [id]: video.muted }));
  };

  return (
    <section className="video-carousel relative w-full h-[80vh]">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          type: "progressbar",
          el: ".swiper-pagination",
        }}
        loop={true}
        speed={700}
        className="w-full h-full"
      >
        {videos.map((video) => (
          <SwiperSlide key={video.id}>
            <div
              className="relative w-full h-full flex items-center justify-center bg-cover bg-center"
              style={{ backgroundImage: `url(${video.bg})` }}
            >
              {/* Video */}
              <video
                ref={(el) => (videoRefs.current[video.id] = el)}
                src={video.src}
                className="w-[70%] h-[70%] object-cover rounded-xl shadow-lg"
                muted
                loop
                autoPlay
                playsInline
              />

              {/* Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                <button
                  onClick={() => togglePlay(video.id)}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition border border-white/30"
                >
                  {isPlaying[video.id] ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                  onClick={() => toggleMute(video.id)}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition border border-white/30"
                >
                  {isMuted[video.id] ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Progressbar */}
        <div className="slide-progress flex items-center justify-center gap-3 mt-4">
          <span>01</span>
          <div className="swiper-pagination w-40 h-[3px] bg-gray-500/30 rounded overflow-hidden"></div>
          <span>02</span>
        </div>

        {/* Small Navigation Buttons */}
        <div className="swiper-button-prev text-white text-sm px-3 py-1 bg-black/40 rounded-md cursor-pointer">
          Prev
        </div>
        <div className="swiper-button-next text-white text-sm px-3 py-1 bg-black/40 rounded-md cursor-pointer">
          Next
        </div>
      </Swiper>
    </section>
  );
};

export default VideoCarousel;
