import React, { useEffect, useRef, useState, } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './Map.css';
import 'leaflet/dist/leaflet.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { CardHeader, CircularProgress, Collapse, IconButton } from '@mui/material';
import { geoCodeAPIKEY, weatherAPIKEY } from '../var';
import WeatherForeCastCard from '../weatherForcast/weatherForecast';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import Background from '../images/blue-sky-with-rainy-clouds.jpg';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { AgChartsReact } from 'ag-charts-react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '@mui/icons-material';

const defaultCenter = [38.9072, -77.0369];
const defaultZoom = 14;
const disneyLandLatLng = [33.8121, -117.9190];

const standardWeather = {
  temp:'',
  feelsLike: "",
  iconUrl:'',
  airSpeed: '',
  UV:'',
  country:'',
  localTime:'',
  humidity:'',
  condition:''
}

function MyMap(props) {
  const [coordinate, setCoordinate] = useState([22.5882834, 88.4734476])
  const [currentLocationName,setCurrentLocationName]= useState('selectFirst')
  const [matchedLocation,setMatchedLocation] = useState([])
  const [matchedCity, setMatchedCity] = useState('selectFirst');
  const [matchedCountry, setMatchedCountry] = useState('selectFirst');
  const [weatherDetails,setWeatherDetails]= useState(standardWeather);
  const [open, setOpen] = useState(false);
  const [dataOptions, setDataOptions] = useState([]);
  const load = open && dataOptions.length === 0;
  const [weatherForeCast,setWeatherForcast]=useState([])
  const [expanded, setExpanded] = useState(false);;
  const [chartOptions, setChartOptions] = useState({
    // Data: Data to be displayed in the chart
    data: [
        { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
        { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
        { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
        { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
        { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
        { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 },
    ],
    // Series: Defines which chart type and data to use
    series: [{ type: 'bar', xKey: 'month', yKey: 'iceCreamSales' }],
  });

//the below fetches options only when Autocomplete is open
  useEffect(() => {
    let active = true;

    if (!load) {
        return undefined;
    }

    (async () => {
        // await sleep(1e3);
        if (active) {
          // setOpData([...yourData]);
        }
    })();

    return () => {
        active = false;
    };
  }, [load]);

  useEffect(() => {
    if (!open) {
      setMatchedLocation([])
    }
 }, [open]);


 const handleExpandClick = () => {
  setExpanded(!expanded);
};

  const mapRef = useRef();
  function handleOnFlyTo(coord) {
    mapRef.current.flyTo(coord, 8, {
      duration: 2
    });
  }


  function delSleep(delay = 0) {
    return new Promise((resolve) => {
       setTimeout(resolve, delay);
    });
 }



const handleClick = () => {
  console.info('You clicked the Chip.');
};

const getData = (searchTerm) => {
  fetch(`https://geocode.maps.co/search?q=${searchTerm}&api_key=${geoCodeAPIKEY}`, {
   
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {

      const responseResults=[]
      myJson.map(item => {
        const cityNameIndex = item.display_name.indexOf(',');
        const cityName = item.display_name.slice(0,cityNameIndex);
        const countryIndex = item.display_name.lastIndexOf(',');
        const countryName = item.display_name.slice(countryIndex+2);

        responseResults.push({name: item.display_name,coordinate: [item.lat, item.lon], type: item.type, cityName: cityName, countryName: countryName})
      })
      setMatchedLocation(responseResults)
    });
};


const getWeatherDetails = (lat, lon) => {
  if(lat && lon){
    console.log('Lat:',lat, 'lon: ',lon)
    const locationQuery=lat+','+lon
      fetch(`http://api.weatherapi.com/v1/forecast.json?key=${weatherAPIKEY}&q=${locationQuery}&aqi=no&days=1&alerts=no`, {
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.log('Weather Details:',myJson)
      setWeatherForcast(myJson?.forecast?.forecastday[0]?.hour)
      setWeatherDetails({
        temp: myJson?.current?.temp_c,
        feelsLike:myJson?.current?.feelslike_c,
        UV:myJson?.current?.uv,
        humidity:myJson?.current?.humidity,
        condition:myJson?.current?.condition?.text,
        iconUrl:"https:"+myJson?.current?.condition?.icon,
        country:myJson?.location?.country,
        localTime:myJson?.location?.localtime,
        airSpeed:myJson?.current?.wind_kph
      })
  
    }).catch(error => {
      
        alert('Issue with API', error.message)
      
    }) 
  }
}

const onInputChange = ( value, reason) => {
  if (value) {
    getData(value);
  } else {
    setMatchedLocation([]);
  }
};

useState(()=>{
  const lat= coordinate[0];
  const lon = coordinate[1];
   
   setTimeout(() => {
   
   }, 200);
  

},[props, coordinate])


  const handleOnSearch = async (e) => {
    console.log(e.target.value)
    onInputChange(e.target.value)
  }

  const getBorderColor=(temp) =>{
    if(temp>35){
      return 'red'
    }else if(temp<20){
      return 'green'
    }
    else return 'black'
  }

  const handleOnSelect = (item) => {
    if(item && item.coordinate){
      console.log('LOCATION PLEASE',item)
      setCoordinate(item.coordinate)
      getWeatherDetails(item.coordinate[0],item.coordinate[1])
      setMatchedCity(item.cityName);
      setMatchedCountry(item.countryName);
      props.updateCoordinate(item.coordinate)
      props.updateCurrentCity(item.cityName)
      setCurrentLocationName(item.name)
      handleOnFlyTo(item.coordinate);

    }  
    
  }
  return (
    <div className="App">
      <MapContainer ref={mapRef} center={defaultCenter} zoom={defaultZoom}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
      </MapContainer>
      <div style={{display: 'flex', flexDirection: 'column', flex: 1,justifyContent:'center' ,  backgroundColor:"#F3EEEA",}}>
      <div className="sidebar" >
          <Autocomplete
           forcePopupIcon={false}
            sx={{ width: 300, backgroundColor:'white'}}
            open={open}
            onOpen={() => {
               setOpen(true);
            }}
            onClose={() => {
               setOpen(false);
            }}
            onInputChange={handleOnSearch}
         
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            loading={load}
            options={matchedLocation}
            onChange={(event, value) => handleOnSelect(value)}
            renderInput={(params) => ( //render the Textfield with the data options
               <TextField
                  {...params}
                  label="Search location"
                  InputProps={{
                     ...params.InputProps,
                     endAdornment: (
                        <div>
                           {load ? (
                              <CircularProgress color="primary" size={30} />
                           ) : null}
                           {params.InputProps.endAdornment}
                        </div>
                     ),
                  }}
               />
            )}
         />
         {currentLocationName != 'selectFirst' && (
            <Card sx={{ width: 400, padding:'10 px', marginTop:'30px', borderRadius:'10px', backgroundColor:'#EBE3D5', paddingBottom:'0px' }}>
            <CardHeader
            
            avatar={
              <IconButton>
                <img src={weatherDetails.iconUrl} alt="logo" />
              </IconButton>
            }
              title={<Typography >{matchedCity}</Typography>}
              subheader ={<Typography >{new Date().toDateString()}</Typography>}
            />
              <div style={{display:'flex', flexDirection:'row', justifyContent:'center',}}>
                <p style={{marginRight:"10px", }}> {weatherDetails.country}</p>
                <p style={{marginRight:"10px"}}> | </p>
                <p > {weatherDetails.localTime}</p>
              </div> 
              <Chip  label={`Condition : ${weatherDetails.condition}`} variant="outlined" onClick={handleClick} />        

            <CardContent>

            <Stack direction="row" spacing={1} justifyContent={'center'}>

            </Stack>
            <Stack direction="row" spacing={1} justifyContent={'center'} marginTop={"10px"}>
              <Chip  style={{color: getBorderColor(weatherDetails.temp) , borderColor: getBorderColor(weatherDetails.temp)}}  label={`Temparature : ${weatherDetails.temp}°C`} variant="outlined" onClick={handleClick} />
              <Chip   label={`Feels Like : ${weatherDetails.feelsLike}°C`} variant="outlined" onClick={handleClick} />
            </Stack>
            <Stack direction="row" spacing={1} justifyContent={'center'} marginTop={"10px"}>
              <Chip  label={`Humidity : ${weatherDetails.humidity} `} variant="outlined" onClick={handleClick} />
              <Chip   label={`Air Speed : ${weatherDetails.airSpeed} Km/h`} variant="outlined" onClick={handleClick} />
              <Chip   label={`UV Index : ${weatherDetails.UV}`} variant="outlined" onClick={handleClick} />

            </Stack>
                  
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites" onClick={() => {props.toggleDrawer('Weather')}}>
              <ExpandMoreIcon />
              <Typography>See More</Typography>
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
            </CardActions>
            </Card>
         )}
     
      </div>

      </div>
    </div>
  );
}

export default MyMap;
