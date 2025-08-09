import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

export function VideoPlayer({ video, autoPlay = false, className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Return null if no video data is available
  if (!video || !video.data?.max) {
    return null;
  }

  const handlePlayPause = () => {
    const videoElement = document.getElementById(`video-${video.id}`);
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    const videoElement = document.getElementById(`video-${video.id}`);
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    const videoElement = document.getElementById(`video-${video.id}`);
    if (videoElement && videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    }
  };

  const handleVideoClick = () => {
    handlePlayPause();
  };

  return (
    <div 
      className={`relative group bg-black rounded-lg overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        id={`video-${video.id}`}
        className="w-full h-full object-cover cursor-pointer"
        poster={video.preview}
        autoPlay={autoPlay}
        muted={isMuted}
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={video.data.max} type="video/mp4" />
        <source src={video.data["480"]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all duration-300 hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-primary transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
              
              <button
                onClick={handleMute}
                className="text-white hover:text-primary transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              
              <span className="text-white text-sm font-medium">
                {video.name}
              </span>
            </div>

            <button
              onClick={handleFullscreen}
              className="text-white hover:text-primary transition-colors"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-3">
            <Play className="h-6 w-6 text-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}
