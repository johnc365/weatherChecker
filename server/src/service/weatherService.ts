import axios from 'axios';

// Load environment variables
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;

if (!API_BASE_URL || !API_KEY) {
    throw new Error('API_BASE_URL and API_KEY must be defined in the environment variables.');
}

// TODO: Define an interface for the Coordinates object
interface Coordinates {
    lat: number;
    lon: number;
}

// TODO: Define a class for the Weather object
interface Weather {
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherDescription: string;
    icon: string;
}

// TODO: Complete the WeatherService class
class WeatherService {
    private baseURL: string;
    private apiKey: string;
    private cityName: string;

    constructor(baseURL: string, apiKey: string, cityName: string) {
        this.baseURL = baseURL;
        this.apiKey = apiKey;
        this.cityName = cityName;
    }

    // TODO: Create fetchLocationData method
    private async fetchLocationData(): Promise<any> {
        const query = this.buildGeocodeQuery();
        try {
            const response = await axios.get(query);
            return response.data;
        } catch (error) {
            console.error('Error fetching location data:', error);
            throw new Error('Failed to fetch location data');
        }
    }

    // TODO: Create destructureLocationData method
    private destructureLocationData(locationData: any): Coordinates {
        if (!locationData || locationData.length === 0) {
            throw new Error('City not found');
        }
        const { lat, lon } = locationData[0];
        return { lat, lon };
    }

    // TODO: Create buildGeocodeQuery method
    private buildGeocodeQuery(): string {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(this.cityName)}&limit=1&appid=${this.apiKey}`;
    }

    // TODO: Create buildWeatherQuery method
    private buildWeatherQuery(coordinates: Coordinates): string {
        return `${this.baseURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    }

    // TODO: Create fetchAndDestructureLocationData method
    private async fetchAndDestructureLocationData(): Promise<Coordinates> {
        const locationData = await this.fetchLocationData();
        return this.destructureLocationData(locationData);
    }

    // TODO: Create fetchWeatherData method
    private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
        const query = this.buildWeatherQuery(coordinates);
        try {
            const response = await axios.get(query);
            return response.data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw new Error('Failed to fetch weather data');
        }
    }

    // TODO: Build parseCurrentWeather method
    private parseCurrentWeather(response: any): Weather {
        const weather = response.list[0]; // Assuming current weather is the first item
        return {
            temperature: weather.main.temp,
            humidity: weather.main.humidity,
            windSpeed: weather.wind.speed,
            weatherDescription: weather.weather[0].description,
            icon: weather.weather[0].icon,
        };
    }

    // TODO: Complete buildForecastArray method
    private buildForecastArray(weatherData: any[]): Weather[] {
        return weatherData.map((entry: any) => ({
            temperature: entry.main.temp,
            humidity: entry.main.humidity,
            windSpeed: entry.wind.speed,
            weatherDescription: entry.weather[0].description,
            icon: entry.weather[0].icon,
        }));
    }

    // TODO: Complete getWeatherForCity method
    public async getWeatherForCity(): Promise<{ current: Weather; forecast: Weather[] }> {
        const coordinates = await this.fetchAndDestructureLocationData();
        const weatherData = await this.fetchWeatherData(coordinates);

        const currentWeather = this.parseCurrentWeather(weatherData);
        const forecast = this.buildForecastArray(weatherData.list);

        return { current: currentWeather, forecast };
    }
}

export default new WeatherService(API_BASE_URL, API_KEY, '');
