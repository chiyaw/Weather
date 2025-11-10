import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'

const Weather = () => {

  const inputRef = useRef()
  const dropdownRef = useRef()
  const[weatherData, setWeatherData] = useState(false);
  const[citySuggestions, setCitySuggestions] = useState([]);
  const[showDropdown, setShowDropdown] = useState(false);
  const[selectedIndex, setSelectedIndex] = useState(-1);
  const[searchQuery, setSearchQuery] = useState("");

  const allIcons= {
    "01d" : clear_icon,
    "01n" : clear_icon,
    "02d" : cloud_icon,
    "02n" : cloud_icon,
    "03d" : cloud_icon,
    "03n" : cloud_icon,
    "04d" : drizzle_icon,
    "04n" : drizzle_icon,
    "09d" : rain_icon,
    "09n" : rain_icon,
    "010d" : rain_icon,
    "010n" : rain_icon,
    "013d" : snow_icon,
    "013n" : snow_icon,
  }

  // Fetch city suggestions
  const fetchCitySuggestions = async (query) => {
    if(query.trim().length < 2) {
      setCitySuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      // Handle Prayagraj/Allahabad alias
      const searchQuery = query.trim().toLowerCase();
      let searchTerms = [query];
      
      if (searchQuery.includes('prayagraj')) {
        searchTerms.push(query.replace(/prayagraj/gi, 'Allahabad'));
      } else if (searchQuery.includes('allahabad')) {
        searchTerms.push(query.replace(/allahabad/gi, 'Prayagraj'));
      }

      // Fetch results for all search terms
      const allCities = [];
      for (const term of searchTerms) {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${term}&limit=5&appid=${import.meta.env.VITE_APP_ID}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Filter to only include cities (not states or countries)
        const cities = data.filter(item => item.name).map(item => ({
          name: item.name,
          state: item.state || '',
          country: item.country,
          lat: item.lat,
          lon: item.lon
        }));
        
        allCities.push(...cities);
      }

      // Remove duplicates based on coordinates
      const uniqueCities = allCities.reduce((acc, city) => {
        const key = `${city.lat.toFixed(2)}-${city.lon.toFixed(2)}`;
        if (!acc.some(c => `${c.lat.toFixed(2)}-${c.lon.toFixed(2)}` === key)) {
          acc.push(city);
        }
        return acc;
      }, []);

      // Sort cities: Indian cities first, then by name
      const sortedCities = uniqueCities.sort((a, b) => {
        // Prioritize Indian cities
        if (a.country === 'IN' && b.country !== 'IN') return -1;
        if (a.country !== 'IN' && b.country === 'IN') return 1;
        
        // If both are Indian or both are not Indian, sort alphabetically
        return a.name.localeCompare(b.name);
      });

      // Limit to 5 results
      const limitedCities = sortedCities.slice(0, 5);
      
      setCitySuggestions(limitedCities);
      setShowDropdown(limitedCities.length > 0);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setCitySuggestions([]);
    }
  };

  const search = async (city) => {
    if(city === ""){
      alert("Enter City Name");
      return;
    }
    try {
      // Handle Prayagraj/Allahabad alias - try both names
      let searchCity = city;
      const cityLower = city.trim().toLowerCase();
      
      if (cityLower.includes('prayagraj')) {
        searchCity = city.replace(/prayagraj/gi, 'Allahabad');
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

      const response = await fetch(url);
      const data = await response.json();

      if(!response.ok){
        // If Allahabad didn't work, try with original Prayagraj
        if (cityLower.includes('allahabad')) {
          const prayagrajUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.replace(/allahabad/gi, 'Prayagraj')}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
          const prayagrajResponse = await fetch(prayagrajUrl);
          const prayagrajData = await prayagrajResponse.json();
          
          if(prayagrajResponse.ok) {
            const icon = allIcons[prayagrajData.weather[0].icon] || clear_icon
            setWeatherData({
              humidity: prayagrajData.main.humidity,
              windSpeed: prayagrajData.wind.speed,
              temprature: Math.floor(prayagrajData.main.temp),
              location: prayagrajData.name,
              icon: icon
            })
            setShowDropdown(false);
            setCitySuggestions([]);
            return;
          }
        }
        
        alert(data.message);
        return;
      }

      console.log(data);
      const icon = allIcons[data.weather[0].icon] || clear_icon
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temprature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
      })
      
      // Close dropdown after search
      setShowDropdown(false);
      setCitySuggestions([]);
    } catch (error) {
        setWeatherData(false);
        console.error("Error in fetching weather data")
    }
  }

  useEffect(() => {
    search("Delhi");
  },[])

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedIndex(-1);
    fetchCitySuggestions(value);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (!showDropdown) {
      if (event.key === 'Enter') {
        search(searchQuery);
      }
      return;
    }

    switch(event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < citySuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < citySuggestions.length) {
          selectCity(citySuggestions[selectedIndex]);
        } else {
          search(searchQuery);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle city selection
  const selectCity = (city) => {
    const cityName = city.name;
    setSearchQuery(cityName);
    inputRef.current.value = cityName;
    search(cityName);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle input focus
  const handleInputFocus = () => {
    if (searchQuery.trim().length >= 2 && citySuggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className='weather'>
          <div className='search-bar'>
            <div className='search-input-container'>
              <input 
                ref={inputRef} 
                type='text' 
                placeholder='Search for a city...'
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                autoComplete="off"
              />
              {showDropdown && citySuggestions.length > 0 && (
                <div className='dropdown' ref={dropdownRef}>
                  {citySuggestions.map((city, index) => (
                    <div
                      key={`${city.name}-${city.country}-${index}`}
                      className={`dropdown-item ${index === selectedIndex ? 'selected' : ''}`}
                      onClick={() => selectCity(city)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className='city-name'>{city.name}</div>
                      <div className='city-info'>
                        {city.state && <span>{city.state}, </span>}
                        <span>{city.country}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <img src={search_icon} alt='Search' onClick={()=>search(searchQuery)}/>
          </div>
          {weatherData?<>
            <img src={weatherData.icon} alt="Weather icon" className='weather-icon'/>
          <p className='temprature'>{weatherData.temprature}°C</p>
          <p className='location'>{weatherData.location}</p>
          <div className="weather-data">
          <div className="col">
              <img src={humidity_icon} alt="Humidity"/>
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind speed"/>
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
          </>:<></>}
      </div>
  )
}

export default Weather
