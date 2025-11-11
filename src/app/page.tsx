'use client';
import Container from "@/components/Container";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { convertMetersToKiloMeters } from "@/utils/convertMetersToKiloMeters";
import { convertMPerSecToKmPerHr } from "@/utils/convertMPerSecToKmPerHr";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import Head from "next/head";

// Root object type
export interface WeatherResponse {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
  city: City;
}

// Represents each forecast entry in "list"
export interface WeatherEntry {
  dt: number;
  main: MainWeather;
  weather: WeatherDetail[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
}

// Represents the "main" section
export interface MainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

// Represents each item in the "weather" array
export interface WeatherDetail {
  id: number;
  main: string;
  description: string;
  icon: string;
}

// Represents "clouds"
export interface Clouds {
  all: number;
}

// Represents "wind"
export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

// Represents "sys"
export interface Sys {
  pod: string;
}

// Represents "city"
export interface City {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

// Represents "coord"
export interface Coordinates {
  lat: number;
  lon: number;
}

// https://api.openweathermap.org/data/2.5/forecast?q=addis%20ababa&appid=ba73b0320fa0397e0a15c08563797e1a&cnt=56
export default function Home() {

  const API_KEY = process.env.WEATHER_API_KEY;
  const [place, setPlace] = useAtom(placeAtom)
  const [loading, ] = useAtom(loadingCityAtom)
  const { isPending, error, data, refetch } = useQuery<WeatherResponse>({
    queryKey: ['repoData'],
    queryFn: async () => {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${API_KEY}&cnt=56`)

      return data;
    }
  })

  useEffect(() => {
    refetch();
  }, [place, refetch])

  const firstDate = data?.list[0];

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  // Filtering data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      return entryDate === date;
    });
  });


  if (isPending) return <div className="flex flex-col items-center justify-center gap-4 bg-gray-100 min-h-screen">
    <p className="text-center mt-20 font-bold text-2xl animate-bounce">
      Loading...
    </p>
  </div>
  return (
    <>
    <Head>
        <title>{place ? `${place} Weather` : 'My Weather App'}</title>
      </Head>
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name} />
      {loading ? <SkeletonWeather/> : (<main className="px-3 max-w-7x1 mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today data */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p className="">{format(parseISO(firstDate?.dt_txt ?? ''), "EEEE")}, </p>
              <p className="">{format(parseISO(firstDate?.dt_txt ?? ''), "PP")}</p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              {/* temprature*/}
              <div className="flex flex-col px-4">
                <span className="text-5xl">{convertKelvinToCelsius(firstDate?.main.temp ?? 0)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>{convertKelvinToCelsius(firstDate?.main.feels_like ?? 0)}°
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinToCelsius(firstDate?.main.temp_min ?? 0)}°↓{' '}
                  </span>
                  <span>
                    {' '}
                    {convertKelvinToCelsius(firstDate?.main.temp_max ?? 0)}°↑
                  </span>
                </p>
              </div>
              {/* time and weather icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (
                  <div key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                    <p className="whitespace-nowrap">{format(parseISO(d.dt_txt), "h:mm a")}</p>
                    <WeatherIcon iconname={d.weather[0].icon} />
                    <p>{convertKelvinToCelsius(d.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            {/* left */}
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className=" capitalize text-center">
                {firstDate?.weather[0].description}{' '}
              </p>
              <WeatherIcon iconname={firstDate?.weather[0].icon ?? ''} />
            </Container>

            {/* right */}
            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails
                visability={`${convertMetersToKiloMeters(firstDate?.visibility ?? 0)}`}
                humidity={`${firstDate?.main.humidity ?? 0}%`}
                windSpeed={`${convertMPerSecToKmPerHr(firstDate?.wind.speed ?? 0)}`}
                airPressure={`${firstDate?.main.pressure ?? 0}hPa`}
                sunrise={format(new Date((data?.city.sunrise ?? 0) * 1000), "h:mm a")}
                sunset={format(new Date((data?.city.sunset ?? 0) * 1000), "h:mm a")}
              />
            </Container>
          </div>
        </section>
        {/* next few days forecast data */}
        <section className="flex w-full flex-col gap-4 ">
          <h2 className="text-2xl mb-4">Next Few Days</h2>
          {firstDataForEachDate.map((d, i) =>
          (
            <ForecastWeatherDetail key={i}
              description={d?.weather[0].description ?? ""}
              weatherIcon={d?.weather[0].icon ?? "01d"}
              date={d ? format(parseISO(d.dt_txt), "PP").split(',')[0] : ""}
              day={d ? format(parseISO(d.dt_txt), "EEEE") : ""}
              feels_like={d?.main.feels_like ?? 0}
              temp={d?.main.temp ?? 0}
              // temp_max={d?.main.temp_max ?? 0}
              // temp_min={d?.main.temp_min ?? 0}
              airPressure={`${d?.main.pressure} hPa `}
              humidity={`${d?.main.humidity}% `}
              sunrise={format(new Date((data?.city.sunrise ?? 0) * 1000), "h:mm a")}
              sunset={
                format(new Date((data?.city.sunset ?? 0) * 1000), "h:mm a")
              }
              visability={`${convertMetersToKiloMeters(d?.visibility ?? 10000)} `}
              windSpeed={`${convertMPerSecToKmPerHr(d?.wind.speed ?? 1.64)} `}
            />
          ))}
        </section>
      </main>)}
    </div>
    </>
  );
}

function SkeletonWeather() {
  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 animate-pulse">
      {/* Today Data */}
      <section className="space-y-4">
        <div className="space-y-2">
          {/* Date section */}
          <h2 className="flex gap-2 text-2xl items-end">
            <div className="h-6 w-24 bg-gray-300 rounded"></div>
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
          </h2>

          {/* Temperature and hourly forecast */}
          <div className="flex gap-10 px-6 items-center">
            {/* Temperature */}
            <div className="flex flex-col px-4 space-y-2">
              <div className="h-10 w-20 bg-gray-300 rounded"></div>
              <div className="h-4 w-28 bg-gray-300 rounded"></div>
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
            </div>

            {/* Hourly forecast icons */}
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <div className="h-3 w-10 bg-gray-300 rounded"></div>
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <div className="h-3 w-6 bg-gray-300 rounded"></div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Weather summary + details */}
        <div className="flex gap-4">
          {/* Left (Weather summary) */}
          <div className="w-fit justify-center flex flex-col px-4 items-center bg-gray-200 rounded-lg p-4">
            <div className="h-4 w-32 bg-gray-300 rounded mb-3"></div>
            <div className="h-14 w-14 bg-gray-300 rounded-full"></div>
          </div>

          {/* Right (Weather details) */}
          <div className="bg-yellow-200/60 px-6 gap-4 justify-between overflow-x-auto rounded-lg p-4 flex flex-wrap">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  <div className="h-4 w-10 bg-gray-300 rounded"></div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 7-day forecast */}
      <section className="flex w-full flex-col gap-4">
        <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 bg-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-16 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-4 w-8 bg-gray-300 rounded"></div>
                <div className="h-4 w-8 bg-gray-300 rounded"></div>
                <div className="h-4 w-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
      </section>
    </main>
  );
}

