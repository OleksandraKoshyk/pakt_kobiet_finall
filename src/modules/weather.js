const API_KEY = '845d9154d359e6b7488cc65cfdaf25fa';
const NUM_DAYS = 4;

export async function fetchWeatherData(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=pl&units=metric&appid=${API_KEY}`);
  if (!response.ok) {
    displayCity('Nie udało się pobrać dannych z API pogodowego.')
    throw new Error('Nie udało się pobrać dannych z API pogodowego.');
  }
  const data = await response.json();
  console.log('response from fetch API:', data)
  return data;
}

export function processWeatherData(data) {
  if (!data || !data.list || !data.city) {
    throw new Error('Nieprawidłowa struktura danych z API pogodowego.');
  }

  const dailyData = [];
  const today = new Date().toISOString().split('T')[0];
  console.log('today from processWeatherData:', today);
  

  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const fullDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const time = date.toISOString().split('T')[1].split(':')[0];
    
    if (dailyData.length < NUM_DAYS) {
      if (!dailyData.some(d => d.fullDate === fullDate) &&
        (fullDate === today || (fullDate !== today && time === '09'))) {
        dailyData.push({
          fullDate: fullDate,
          date: formatDate(date),
          temperature: Math.round(item.main.temp),
          weather: item.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`, // URL do ikony pogody
          sunrise: convertUnixTime(data.city.sunrise, data.city.timezone),
          sunset: convertUnixTime(data.city.sunset, data.city.timezone)
        });
      }
    }
    });

  console.log('dailyData from processWeatherData:', dailyData);


  return dailyData;
}

function convertUnixTime(unixTime, timezone) {
  const date = new Date((unixTime + timezone) * 1000);
  return date.toUTCString().match(/\d{2}:\d{2}/)[0];
}

function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('pl-PL', options);
}