import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";

interface WeatherData {
  cod: number | string;
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  timezone: number;
}

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHERMAP_API_KEY;
const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function Index() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatTime = (timestamp: number, timezone: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toUTCString().slice(17, 22);
  };

  const getWeatherByCity = async () => {
    if (!city) return;

    Keyboard.dismiss();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "City not found");
        setWeather(null);
        return;
      }

      setWeather(data);
    } catch (err) {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  const getWeatherByLocation = async () => {
    setLoading(true);
    setError("");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `${API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      if (!response.ok) {
        setError("Unable to fetch location weather");
        return;
      }

      setWeather(data);
      setCity(data.name);
    } catch (err) {
      setError("Unable to get location weather");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>Weather</Text>

      <TextInput
        placeholder='Enter city name'
        value={city}
        onChangeText={setCity}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.primaryButton} onPress={getWeatherByCity}>
        <Text style={styles.buttonText}>Get Weather</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={getWeatherByLocation}
      >
        <Text style={styles.buttonText}>Use Current Location</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {weather && (
        <View style={styles.card}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.temp}>{weather.main.temp}°C</Text>
          <Text style={styles.condition}>
            {weather.weather[0].description}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Humidity: {weather.main.humidity}%</Text>
            <Text style={styles.infoText}>Wind: {weather.wind.speed} m/s</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              Sunrise: {formatTime(weather.sys.sunrise, weather.timezone)}
            </Text>
            <Text style={styles.infoText}>
              Sunset: {formatTime(weather.sys.sunset, weather.timezone)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3f9',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 16
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1e272e',
    marginBottom: 20
  },

  input: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    fontSize: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  },

  primaryButton: {
    width: '100%',
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3
  },

  secondaryButton: {
    width: '100%',
    backgroundColor: '#3742fa',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },

  card: {
    marginTop: 28,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingVertical: 30,
    paddingHorizontal: 22,
    alignItems: "center",
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },

  city: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e272e'
  },

  temp: {
    fontSize: 64,
    fontWeight: 'bold',
    marginVertical: 6,
    color: '#1e272e'
  },

  condition: {
    fontSize: 18,
    color: '#57606f',
    marginBottom: 14,
    textTransform: 'capitalize'
  },

  infoRow: {
    marginTop: 14,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f2f6',
    padding: 12,
    borderRadius: 12
  },

  infoText: {
    fontSize: 14,
    color: '#2f3542'
  },

  error: {
    color: '#ff4757',
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500'
  }
});

