import { useState, useEffect } from "react";
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, Thermometer, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // OpenWeatherMap API key - Get your free key at https://openweathermap.org/api
  const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key

  // Load last searched city from localStorage on component mount
  useEffect(() => {
    const savedCity = localStorage.getItem("lastSearchedCity");
    if (savedCity && API_KEY !== "YOUR_API_KEY_HERE") {
      fetchWeather(savedCity);
    }
  }, []);

  // Fetch weather data from OpenWeatherMap API
  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a city name",
        variant: "destructive",
      });
      return;
    }

    if (API_KEY === "YOUR_API_KEY_HERE") {
      toast({
        title: "API Key Required",
        description: "Please add your OpenWeatherMap API key in the code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      setWeatherData(data);
      
      // Save to localStorage
      localStorage.setItem("lastSearchedCity", cityName);
      
      toast({
        title: "Success",
        description: `Weather data loaded for ${data.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch weather data",
        variant: "destructive",
      });
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  // Get appropriate weather icon based on condition
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-24 h-24 text-yellow-500" />;
      case "rain":
      case "drizzle":
        return <CloudRain className="w-24 h-24 text-blue-500" />;
      case "snow":
        return <CloudSnow className="w-24 h-24 text-blue-200" />;
      default:
        return <Cloud className="w-24 h-24 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Weather Dashboard
          </h1>
          <p className="text-muted-foreground">
            Search for any city to get real-time weather information
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search City</CardTitle>
            <CardDescription>Enter a city name to get current weather data</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Weather Display Card */}
        {weatherData && (
          <Card className="backdrop-blur-sm bg-card/95">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">
                {weatherData.name}, {weatherData.sys.country}
              </CardTitle>
              <CardDescription className="text-lg capitalize">
                {weatherData.weather[0].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Main Weather Display */}
              <div className="flex flex-col items-center mb-8">
                <div className="mb-4">
                  {getWeatherIcon(weatherData.weather[0].main)}
                </div>
                <div className="text-6xl font-bold text-foreground mb-2">
                  {Math.round(weatherData.main.temp)}°C
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Thermometer className="w-4 h-4" />
                  <span>Feels like {Math.round(weatherData.main.feels_like)}°C</span>
                </div>
              </div>

              {/* Additional Weather Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-2">
                      <Droplets className="w-8 h-8 text-blue-500" />
                      <div className="text-2xl font-semibold">
                        {weatherData.main.humidity}%
                      </div>
                      <div className="text-sm text-muted-foreground">Humidity</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-2">
                      <Wind className="w-8 h-8 text-gray-500" />
                      <div className="text-2xl font-semibold">
                        {Math.round(weatherData.wind.speed * 3.6)} km/h
                      </div>
                      <div className="text-sm text-muted-foreground">Wind Speed</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Key Notice */}
        {API_KEY === "YOUR_API_KEY_HERE" && (
          <Card className="mt-8 border-yellow-500">
            <CardHeader>
              <CardTitle className="text-yellow-600 dark:text-yellow-400">
                API Key Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                To use this weather dashboard, you need a free API key from OpenWeatherMap:
              </p>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                <li>Visit <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openweathermap.org/api</a></li>
                <li>Sign up for a free account</li>
                <li>Get your API key</li>
                <li>Replace "YOUR_API_KEY_HERE" in the code with your actual key</li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
