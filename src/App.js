import React from 'react';
import './App.css';
import clear from './data/icons/clear.png';
import clear_night from './data/icons/clear night.png';
import partly_cloudy_day from './data/icons/partly cloudy.png';
import partly_cloudy_night from './data/icons/partly cloudy night.png';
import rainy from './data/icons/rainy.png';

const data = require('./data/weather.json')



class App extends React.Component {
  /*
    This function recieves input such as the year, month and day. It then scans the values length
    if values length is 1, it will at a 0 to the front. Example the value = 1 after the code is
    ran the value = 01. The function then returns the correct date format to match that of the
    json file.
  */
  convert = (year, month, day) => {
    if (month.length <= 1 && day.length <= 1) {
      month = 0 + month;
      day = 0 + day;
      
      return year + '-' + month + '-' + day;
    }
    else if (month.length <= 1) {
      month = 0 + month;
      return year + '-' + month + '-' + day;
    }
    else {
      day = 0 + day;
      return year + '-' + month + '-' + day;
    }
  }

  /*
    This function gets the current date. It then removes the '/' from the string and returns
    the values in an array. The data is then seperated into different vars and passed to the
    function 'convert()'. It then sets the state value 'current_date' to the string that is
    returned from the function 'convert()'. 
  */
  date = () => {
    let date = new Date();
    let current_date = date.toLocaleDateString('en-US');
    let list = current_date.split('/');
    let year = list[2];
    let month = list[0];
    let day = list[1];
    
    return this.convert(year, month, day)
  }

/*  
  This function is used in the instance that the time does not match that in the array.
  This function numbers in the time_select array by the current hour. It will then push
  the data to the difference array. As long as the current hour doesn't match any of
  the arrays values the while loop will continue looping. If the number doesn't exist
  the lowest difference will be added to the current hour until its' value matches
  any of the values with in th array time_select.
*/
  time = () => {
    let date = new Date();
    let hour = date.getHours()
    let time_select = [0, 3, 6, 9, 12, 15, 18, 21];
    let difference = [];

    while(time_select.includes(hour) === false) {
      time_select.forEach( num => {
        difference.push(num - hour)
      })

      difference.forEach( num => {
        if (num > 0 && num <= 2) {
          hour += num;
        }
      })
    }
    return parseInt(hour)
  }

  /*
    This function retrieves the current date and compares it with that which is in the json file.
    It then returns the appropriate info of the items which info is identicle to that of the 
    variables 'current_date' and 'current_time'.
  */
  day_forecast = () => {
    let list = data.list;
    let forecast = [];
    
    list.filter( item => {
      
      let current_date = this.date();
      let current_time = this.time();
      let find_date = item.dt_txt.substr(0, 10);
      let find_time = parseInt(item.dt_txt.substr(11, 2));
      
      if (current_date === find_date && current_time === find_time) {
        forecast.push(item);
      }
    })
    return forecast;
  }

  /*
    This function retrieves the dates after that of the current date. It will take the next 6
    days dates and fixed time of 12pm and return all data on those days.
  */
  week_forecast = () => {
    let list = data.list;
    let forecast = [];
    let count = 0;

    list.filter( item => {
      
      let current_date = this.date();
      let find_date = item.dt_txt.substr(0, 10);
      let find_time = parseInt(item.dt_txt.substr(11, 2));

      if (count !== 6 && find_date > current_date && find_time === 12) {
        forecast.push(item)
        count += 1;
      }
    })
    return forecast
  }

  constructor(props) {
    super(props);

    this.state = {
      day_forecast : this.day_forecast(),
      week_forecast: this.week_forecast(),
      icons : {
        '01d' : clear,
        '01n' : clear_night,
        '03d' : partly_cloudy_day,
        '03n' : partly_cloudy_night,
        '04d' : partly_cloudy_day, 
        '04n' : partly_cloudy_night,
        '10d' : rainy,
        '10n' : rainy
      }
    }
  }

  convert_degrees = (value) => {
    return ((value-32) /1.8).toFixed(0);
  }

  /*
    This function takes the data from the state about the current day and outputs the data
    in the correct order.
  */
  today_forecast = () => {
    let icon = this.state.day_forecast[0].weather[0].icon;
    let get = this.state.icons;
    return [
      <div className='present_day'>
        <h1>{data.city.name}<span> - Today</span></h1>
        <br/>
        <img src={get[icon]} alt='weather_icon'/>
        <br/>
        <p>
          <span id='max'>Max: </span>
          {this.convert_degrees(this.state.week_forecast[0].main.temp_max)} °C
          <br/>
          <span id='min'>Min: </span>
          {this.convert_degrees(this.state.week_forecast[0].main.temp_min)} °C
        </p>
        <p id='description'>{this.state.week_forecast[0].weather[0].description}</p>
        <p id='wind'>
          <span>Wind: </span>
          {(this.state.week_forecast[0].wind.speed).toFixed(0)} Knots          
        </p>
        <p id='humidity'>
          <span>Humidity: </span>
          {this.state.week_forecast[0].main.humidity}%
        </p>
      </div>
    ]
  }

  /*
    This function returns the rest of the weeks data, excluding the cuurrent day. The
    var 'day' returns a number ranging from 0 to 6, this is used along side the array
    'week_array' to return the actual day. For each item being displayed 1 would be 
    added to day 'day' in order to get the correct days names. If the value of 'day'
    exceed the value 6, its' value will be set to 0 again to repeat the days of the
    week again. 
  */
  rest_of_forecast = () => {
    let date = new Date();
    let day = date.getDay();
    let week_array = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let array = [];

    this.state.week_forecast.forEach(item => {
      let icon = item.weather[0].icon;
      let get = this.state.icons;
      
      array.push(
        <div className='next_day'>
          <h4>{ week_array[day] }</h4>
          <img src={ get[icon] } alt='weather_icon'/>
          <h5>{this.convert_degrees(item.main.temp_max) + '°C /' + this.convert_degrees(item.main.temp_min) + ' °C'}</h5>
        </div>
      )
      
      day += 1;
      if(day > 6 ) {
        day = 0;
      }
    })
    return array;
  }

  render() {
    return (
      <div className="App">
        <div className='widget_container'>
          {this.today_forecast()}
          {this.rest_of_forecast()}
        </div>
      </div>
    );
  }
}

export default App;