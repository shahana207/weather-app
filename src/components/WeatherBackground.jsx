import React, { useState, useEffect } from "react";

import Thunderstorm from "../assets/Thunderstorm.gif";
import Rain from "../assets/Rain.gif";
import SnowDay from "../assets/Snow.gif";
import ClearDay from "../assets/ClearDay.gif";
import ClearNight from "../assets/ClearNight.gif";
import CloudsDay from "../assets/CloudsDay.gif";
import CloudsNight from "../assets/CloudsNight.gif";
import Haze from "../assets/Haze.gif";
import video from "../assets/video1.mp4";

const WeatherBackground = ({ condition }) => {
  const [currentBg, setCurrentBg] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const gifs = {
    Thunderstorm: Thunderstorm,
    Drizzle: Rain,
    Rain: Rain,
    Snow: SnowDay,
    Clear: { day: ClearDay, night: ClearNight },
    Clouds: { day: CloudsDay, night: CloudsNight },
    Mist: Haze,
    Smoke: Haze,
    Haze: Haze,
    Fog: Haze,
    default: video,
  };

  const getBackground = () => {
    if (!condition) return gifs.default;

    const asset = gifs[condition.main] || gifs.default;

    if (asset.day && asset.night) {
      return condition.isDay ? asset.day : asset.night;
    }

    return asset;
  };

  useEffect(() => {
    const newBg = getBackground();
    setIsLoaded(false);
    
    const timer = setTimeout(() => {
      setCurrentBg(newBg);
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [condition]);

  const background = currentBg || getBackground();

  // Dynamic gradient overlay based on weather condition
  const getGradientOverlay = () => {
    if (!condition) return "bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40";
    
    const gradients = {
      Thunderstorm: "bg-gradient-to-br from-gray-900/60 via-purple-900/50 to-blue-900/60",
      Rain: "bg-gradient-to-br from-blue-900/50 via-gray-800/40 to-blue-800/50",
      Drizzle: "bg-gradient-to-br from-blue-800/40 via-gray-700/30 to-blue-700/40",
      Snow: "bg-gradient-to-br from-blue-100/20 via-blue-200/15 to-white/20",
      Clear: condition.isDay 
        ? "bg-gradient-to-br from-blue-400/30 via-cyan-300/20 to-yellow-300/30"
        : "bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-blue-900/50",
      Clouds: condition.isDay
        ? "bg-gradient-to-br from-gray-400/40 via-blue-300/30 to-gray-500/40"
        : "bg-gradient-to-br from-gray-900/60 via-blue-900/50 to-gray-800/60",
      Mist: "bg-gradient-to-br from-gray-500/50 via-gray-400/40 to-blue-400/40",
      Smoke: "bg-gradient-to-br from-gray-600/50 via-gray-500/40 to-orange-900/40",
      Haze: "bg-gradient-to-br from-yellow-700/40 via-orange-600/30 to-gray-600/40",
      Fog: "bg-gradient-to-br from-gray-400/50 via-white/20 to-gray-500/50",
    };

    return gradients[condition.main] || gradients.Clear;
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Animated background */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {background === video ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover pointer-events-none"
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <img
            src={background}
            alt="weather-bg"
            className="w-full h-full object-cover pointer-events-none"
            style={{ 
              filter: 'brightness(0.8) contrast(1.1)',
              opacity: condition ? 0.35 : 0.5
            }}
          />
        )}
      </div>

      {/* Dynamic gradient overlay */}
      <div className={`absolute inset-0 ${getGradientOverlay()} transition-all duration-1000`} />
      
      {/* Subtle noise texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.015]" 
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        }}
      />

      {/* Animated particles for certain weather conditions */}
      {condition && ['Rain', 'Drizzle', 'Snow'].includes(condition.main) && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 bg-white/20 animate-fall`}
              style={{
                left: `${Math.random() * 100}%`,
                height: condition.main === 'Snow' ? '8px' : '20px',
                borderRadius: condition.main === 'Snow' ? '50%' : '0',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default WeatherBackground;