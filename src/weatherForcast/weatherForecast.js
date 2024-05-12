import { weatherAPIKEY } from '../var';
import './weatherForecast.css';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { AgChartsReact } from 'ag-charts-react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import Background from '../images/blue-sky-with-rainy-clouds.jpg';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));
  


function WeatherForeCastCard(props){
    const [expanded, setExpanded] = useState(false);
    const [weatherForeCast,setWeatherForcast]=useState([])
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
 
    const handleClick = () => {
      console.info('You clicked the Chip.');
    };

    function convert(t) {
      const index = t.indexOf(' ');
      const hr = t.slice(index+1)
      console.log(t,'HRRRR',hr)
      return hr 
    }

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
    var lat= props.coordinate[0];
    var lon = props.coordinate[1];

    console.log('FINAL', lat,lon)
    useState(()=>{
       lat= props.coordinate[0];
       lon = props.coordinate[1];
        const getWeatherDetails = () => {
            if(lat && lon){
              console.log('Lat:',lat, 'lon: ',lon)
              const locationQuery=lat+','+lon
              fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherAPIKEY}&q=${locationQuery}&aqi=no&days=1&alerts=no`, {
              })
              .then(function (response) {
                return response.json();
              })
              .then(function (myJson) {
               
                setWeatherForcast(myJson.forecast.forecastday[0].hour.map( obj => {
                  return {...obj, time_epoch: convert(obj.time)}
                }))
                console.log('Weather Details:',weatherForeCast)
              }).catch(error => {
                  alert('Issue with API', error.message)
                
              }) 
            }
        }
        getWeatherDetails();

    },[props, lat,lon])

    return(
      <div style={{ background: `url(${Background})`, height:"100vh",   backgroundPosition: "center",backgroundSize: "cover", backgroundRepeat:'no-repeat'}}>
        <div className="bg-text" style={{height: '80vh'}}>
        <AgChartsReact
                options={{
                    data:weatherForeCast,
                    series: [{
                        xKey: 'time_epoch',
                        yKey: 'temp_c',
                    },
                    {
                      xKey:'time_epoch',
                      yKey:'humidity'
                    }
                  ]
                }}
            />
      </div>
      <div>
      <IconButton style={{ }} onClick={() => {props.toggleDrawer('Location')}}>
            <EditLocationIcon style={{ color: "white" }}></EditLocationIcon>
            <Typography sx={{color:'white'}}>Change Location</Typography>
          </IconButton>
          
      </div>
      </div>
   
    )
}
export default WeatherForeCastCard; 