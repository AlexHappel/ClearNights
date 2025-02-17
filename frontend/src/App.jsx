import React, { useState, useEffect } from 'react';

function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    // Check if Geolocation is available
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    // Request user's location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Adjust the URL if necessary
          const res = await fetch(`/weather?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          if (!res.ok) {
            setError(data.error || 'Error fetching weather data.');
          } else {
            setWeather(data);
          }
        } catch (err) {
          console.error('Fetch error:', err);
          setError('Error fetching weather data.');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/weather?${encodeURIComponent(locationInput)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error fetching weather data.');
      } else { 
        setWeather(data);
        setShowModal(false);
        setError('');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error fetching weather data.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : weather ? (
        <div className="p-6 bg-white rounded shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">
            Weather for {weather.data.name}
          </h1>
          <p className="mb-2">
            Temperature: <strong>{weather.data.main.temp}°C</strong>
          </p>
          <p className="mb-2">
            Cloud Coverage: <strong>{weather.data.clouds.all}%</strong>
          </p>
          <p className={weather.clearNight ? "text-green-600" : "text-gray-600"}>
            {weather.clearNight ? 'Clear Night!' : 'Not Clear Tonight'}
          </p>
        </div>
      ) : (
        <p>No weather data available.</p>
      )}

      {/*Button to manually enter location */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
        Enter City Name
        </button>

        {/* Modal for manual location */}
        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded shadow-md">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-0 right-0 m-4"
                >
                &times;
              </button>
              <form onSubmit={handleSubmit}>
                <label htmlFor="locationInput" className="block">
                  Enter a city or zip code:
                </label>
                <input
                  id="locationInput"
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full border border-gray-400 rounded p-1"
                  />
                <button
                  type="submit"
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                  Get Weather
                </button>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}

export default App;
