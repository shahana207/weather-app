import React, { useEffect, useState } from "react";
import WeatherBackground from "./components/WeatherBackground";
import {
  convertTemperature,
  getHumidityValue,
  getVisibilityValue,
  getWindDirection,
} from "./components/Helper";
import {
  HumidityIcon,
  SunriseIcon,
  VisibilityIcon,
  WindIcon,
} from "./components/Icons";

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [unit, setUnit] = useState("C");
  const [error, setError] = useState("");

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;



  useEffect(() => {
    if (city.trim().length >= 3 && !weather) {
      const timer = setTimeout(() => fetchSuggestion(city), 500);
      return () => clearTimeout(timer);
    }
    setSuggestion([]);
  }, [city, weather]);

  const fetchSuggestion = async (query) => {
    try {
      const res = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      res.ok ? setSuggestion(await res.json()) : setSuggestion([]);
    } catch {
      setSuggestion([]);
    }
  };

  const fetchWeatherData = async (url, name = "") => {
    setError("");
    setWeather(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "City not found");
      }
      const data = await response.json();
      setWeather(data);
      setCity(name || data.name);
      setSuggestion([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = () => {
    if (!city.trim()) {
      setError("Please enter a valid city name.");
      return;
    }

    fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getWeatherCondition = () =>
    weather && {
      main: weather.weather[0].main,
      isDay:
        Date.now() / 1000 > weather.sys.sunrise &&
        Date.now() / 1000 < weather.sys.sunset,
    };

  return (
    <div className="min-h-screen">
      <WeatherBackground condition={getWeatherCondition()} />

      {!weather ? (
        // SEARCH VIEW - Centered minimal design
        <div className="flex items-center justify-center p-6 min-h-screen">
          <div className="w-full max-w-2xl relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block mb-6">
                <div className="text-8xl mb-4">🌤️</div>
              </div>
              <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
                Weather
              </h1>
              <p className="text-white/60 text-lg">
                Check weather conditions anywhere in the world
              </p>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-3 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="pl-4">
                    <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter city name..."
                    className="flex-1 bg-transparent text-white text-lg placeholder-white/40 focus:outline-none py-3"
                  />
                  <button 
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Search
                  </button>
                </div>
              </div>

              {suggestion.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden z-20">
                  {suggestion.map((s) => (
                    <button
                      key={`${s.lat}-${s.lon}`}
                      type="button"
                      onClick={() =>
                        fetchWeatherData(
                          `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`,
                          `${s.name}, ${s.country}${s.state ? `, ${s.state}` : ""}`
                        )
                      }
                      className="w-full px-6 py-4 text-left hover:bg-white/20 transition-all duration-200 border-b border-white/10 last:border-b-0 flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <span className="text-white font-medium">{s.name}</span>
                        <span className="text-white/50 text-sm ml-2">
                          {s.country}{s.state && `, ${s.state}`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <div className="mt-4 bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-4 text-center">
                  <p className="text-red-200">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // WEATHER VIEW - Split screen design
        <div className="min-h-screen p-6 flex items-center justify-center">
          <div className="w-full max-w-6xl relative z-10">
            <div className="grid md:grid-cols-5 gap-6">
              
              {/* LEFT SIDE - Main Weather Info */}
              <div className="md:col-span-3 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-10">
                <button
                  onClick={() => {
                    setWeather(null);
                    setCity("");
                  }}
                  className="mb-8 flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">Back to search</span>
                </button>

                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-5xl font-bold text-white mb-2">{weather.name}</h2>
                    <p className="text-white/60 text-lg">{weather.sys.country}</p>
                  </div>
                  <button
                    onClick={() => setUnit((u) => (u === "C" ? "F" : "C"))}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2 rounded-xl font-semibold text-white transition-all duration-300"
                  >
                    °{unit}
                  </button>
                </div>

                <div className="flex items-center gap-8 mb-12">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    alt={weather.weather[0].description}
                    className="w-40 h-40 drop-shadow-2xl"
                  />
                  <div>
                    <div className="text-8xl font-bold text-white mb-2">
                      {convertTemperature(weather.main.temp, unit)}°
                    </div>
                    <p className="text-2xl text-white/80 capitalize mb-1">
                      {weather.weather[0].description}
                    </p>
                    <p className="text-white/50 text-lg">
                      Feels like {convertTemperature(weather.main.feels_like, unit)}°{unit}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-500/20 p-3 rounded-xl">
                        <HumidityIcon />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Humidity</p>
                        <p className="text-2xl font-bold text-white">{weather.main.humidity}%</p>
                      </div>
                    </div>
                    <p className="text-white/50 text-sm">{getHumidityValue(weather.main.humidity)}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-purple-500/20 p-3 rounded-xl">
                        <WindIcon />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Wind Speed</p>
                        <p className="text-2xl font-bold text-white">{weather.wind.speed} m/s</p>
                      </div>
                    </div>
                    <p className="text-white/50 text-sm">{getWindDirection(weather.wind.deg)}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-cyan-500/20 p-3 rounded-xl">
                        <VisibilityIcon />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Visibility</p>
                        <p className="text-2xl font-bold text-white">{getVisibilityValue(weather.visibility)}</p>
                      </div>
                    </div>
                    <p className="text-white/50 text-sm">Clear view</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-500/20 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Pressure</p>
                        <p className="text-2xl font-bold text-white">{weather.main.pressure} hPa</p>
                      </div>
                    </div>
                    <p className="text-white/50 text-sm">Standard pressure</p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - Additional Info */}
              <div className="md:col-span-2 space-y-6">
                {/* Sunrise & Sunset */}
                <div className="bg-gradient-to-br from-orange-500/20 to-pink-500/20 backdrop-blur-2xl rounded-3xl border border-orange-300/30 shadow-2xl p-8">
                  <h3 className="text-white/80 text-lg font-semibold mb-6">Sun & Moon</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-500/30 p-4 rounded-2xl">
                        <SunriseIcon />
                      </div>
                      <div className="flex-1">
                        <p className="text-white/60 text-sm mb-1">Sunrise</p>
                        <p className="text-3xl font-bold text-white">
                          {new Date(weather.sys.sunrise * 1000).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-white/10"></div>

                    <div className="flex items-center gap-4">
                      <div className="bg-orange-500/30 p-4 rounded-2xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white/60 text-sm mb-1">Sunset</p>
                        <p className="text-3xl font-bold text-white">
                          {new Date(weather.sys.sunset * 1000).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8">
                  <h3 className="text-white/80 text-lg font-semibold mb-6">Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-white/60">Min Temperature</span>
                      <span className="text-white font-semibold text-lg">
                        {convertTemperature(weather.main.temp_min, unit)}°{unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-white/60">Max Temperature</span>
                      <span className="text-white font-semibold text-lg">
                        {convertTemperature(weather.main.temp_max, unit)}°{unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-white/60">Cloudiness</span>
                      <span className="text-white font-semibold text-lg">{weather.clouds.all}%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;