import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import MyMap from '../Map/map';
import WeatherForeCastCard from '../weatherForcast/weatherForecast';

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const [currentNavigation, setCurrentNavigation] = React.useState('Location')
  const [coordinate, setCoordinate]=React.useState([0,0])
  const [curretCity, setCurrentCity] = React.useState('selectFirst')

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const changeNavigation = (path) =>{
    if(path === 'Weather'){
        setCurrentNavigation('Weather')
    }else{
        setCurrentNavigation('Location')
    }
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Select Location', 'See Weather'].map((text, index) => (
          <ListItem key={text} disablePadding onClick={(event)=>{if(text === 'Select Location'){setCurrentNavigation('Location')} else{setCurrentNavigation('Weather')}}}>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ?   <EditLocationIcon /> : <CloudQueueIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
        {/* <div style={{display: 'flex', marginBottom:'-35px', justifyContent:'flex-end'}}>
            <Button  onClick={toggleDrawer(true)}>Open drawer</Button>
        </div> */}
        
        {currentNavigation === 'Location' ? <MyMap toggleDrawer={changeNavigation} updateCoordinate={setCoordinate} updateCurrentCity={setCurrentCity}></MyMap> : 
            <WeatherForeCastCard 
                coordinate={coordinate}
                currentCity={curretCity} 
                toggleDrawer={changeNavigation}>
            </WeatherForeCastCard>}
        <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
            {DrawerList}
        </Drawer>
    </div>
  );
}
