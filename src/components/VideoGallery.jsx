import { useState } from 'react';
import { VideoPlayer } from './VideoPlayer.jsx';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

export function VideoGallery({ videos, className = '' }) {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  if (!videos || videos.length === 0) {
    return null;
  }

  const currentVideo = videos[selectedVideoIndex];

  const handlePrevious = () => {
    setSelectedVideoIndex((prev) => (prev > 0 ? prev - 1 : videos.length - 1));
  };

  const handleNext = () => {
    setSelectedVideoIndex((prev) => (prev < videos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Video Player */}
      <div className="relative">
        <VideoPlayer 
          video={currentVideo} 
          className="aspect-video w-full"
        />
        
        {/* Navigation Arrows for Multiple Videos */}
        {videos.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Video Counter */}
        {videos.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {selectedVideoIndex + 1} / {videos.length}
          </div>
        )}
      </div>

      {/* Video Thumbnails */}
      {videos.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideoIndex(index)}
              className={`relative group aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
                index === selectedVideoIndex 
                  ? 'ring-2 ring-primary' 
                  : 'hover:ring-2 hover:ring-primary/50'
              }`}
            >
              <img
                src={video.preview}
                alt={video.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div className="absolute bottom-1 left-1 right-1">
                <span className="text-white text-xs font-medium bg-black/50 px-1 py-0.5 rounded line-clamp-1">
                  {video.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
