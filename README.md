# Weather App (Next.js)

This repository contains a weather application built with Next.js that uses the OpenWeather API to fetch weather data. The app provides current weather and forecasts for upcoming dates.

## Live
Live deployment: [https://weather-app-zeki.netlify.app/]()

## Features
- Fetches current weather and upcoming forecasts from the OpenWeather API
- Fetches weather data for the user's current location (via browser geolocation) or for a city entered in the search bar
- Built with Next.js

## Local setup
1. Clone the repo:
```bash
git clone <repo-url>
cd <repo-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Configure your OpenWeather API key:
- Create a file named `.env.local` in the project root:
```bash
touch .env.local
```
- Add your key, for example:
```bash
# .env.local
WEATHER_API_KEY=your_api_key_here
```
Or write it directly from the shell:
```bash
echo "WEATHER_API_KEY=your_api_key_here" > .env.local
```

4. Run the app:
- Development:
```bash
npm run dev
```
- Production (build then start):
```bash
npm run build && npm run start
```

---