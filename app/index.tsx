import * as Location from 'expo-location';
import {StatusBar} from 'expo-status-bar';
import {useState} from 'react';
import { Text, View,ActivityIndicator,Keyboard,StyleSheet,TextInput,TouchableOpacity } from "react-native";


interface WeatherData {
  cod:number | string;
  name:string,
  main:{
    temp:number;
    humidity:number;
  };
  wind:{
    speed:number;
  };
  sys:{
    sunrise:number;
    sunset:number;
  };
  timezone:number;
}

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHERMAP_API_KEY;
const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function Index() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")


  return (
    <View style={styles.container} >
     <StatusBar style='auto'/>
      <TextInput
      placeholder='Enter your City Name'
      value={city}
      onchangeText={setCity}
      style={styles.input}
      />
      <TouchableOpacity>
        <Text style={styles.button}  onPress={getWeatherByCity} >Get Weather</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.button} onPress={getWeatherByLocation} >Use Current Location</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size='large' color="#333"/>}
      
      {error? <Text style={styles.error}>{error}</Text> :null }


      



    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#f2f2f2',
    alignItems:'center',
    paddingTop:60
  },
  title:{
    fontSize:28,
    fontWeight:'bold',
    marginBottom:20,
  },
  input:{
    width:'85%',
    padding:12,
    borderRadius:8,
    alignItems:'center',
    marginBottom:10
  },
  locationButton:{
    backgroundColor:'#555'
  },
  buttonText:{
    color:'#fff',
    fontSize:16,
    fontWeight:'600'
  },
  card:{
    marginTop:20,
    width:'85%',
    backgroundColor:'#fff',
    borderRadius:12,
    padding:20,
    alignItems:"center"
  },
  city:{
    fontSize:20,
    fontWeight:'bold'
  },
  temp:{
    fontSize:48,
    fontWeight:'bold',
    marginVertical:10,
  },
  condition:{
    fontSize:18,
    color:'#555'
  },
  row:{
    marginTop:10,
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  error:{
    color:'red',
    marginTop:10,
  }
})