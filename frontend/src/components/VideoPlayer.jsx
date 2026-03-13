import { useRef, useState, useEffect } from 'react';
import { FiPlay, FiPause, FiMaximize, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { trackLectureProgress } from '../services/courseService';

export default function VideoPlayer({ lecture, courseId }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [tracked, setTracked] = useState(false);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    playing ? videoRef.current.pause() : videoRef.current.play();
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const ct = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(ct);
    // Track progress at 80%
    if (!tracked && ct / dur >= 0.8) {
      setTracked(true);
      trackLectureProgress({ lectureId: lecture?._id, courseId, completed: true }).catch(() => {});
    }
  };

  const handleSeek = (e) => {
    const bar = progressRef.current;
    if (!bar || !videoRef.current) return;
    const pct = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth;
    videoRef.current.currentTime = pct * duration;
  };

  useEffect(() => {
    setPlaying(false);
    setTracked(false);
    setCurrentTime(0);
    if (videoRef.current) videoRef.current.load();
  }, [lecture?._id]);

  const videoSrc = lecture?.videoUrl || lecture?.url || '';
  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative bg-black rounded-xl overflow-hidden group shadow-2xl">
      <video
        ref={videoRef}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
        muted={muted}
        src={videoSrc}
      >
        Your browser does not support video.
      </video>

      {/* Overlay play button */}
      {!playing && (
        <button onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
          <div className="w-16 h-16 rounded-full bg-brand-600/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <FiPlay className="w-7 h-7 text-white ml-1" />
          </div>
        </button>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
        {/* Progress bar */}
        <div ref={progressRef} onClick={handleSeek} className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 hover:h-2.5 transition-all">
          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="text-white hover:text-brand-400 transition-colors">
            {playing ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
          </button>
          <button onClick={() => setMuted(!muted)} className="text-white hover:text-brand-400 transition-colors">
            {muted ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
          </button>
          <span className="text-xs text-gray-300 ml-auto">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <button onClick={() => videoRef.current?.requestFullscreen()} className="text-white hover:text-brand-400 transition-colors">
            <FiMaximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
