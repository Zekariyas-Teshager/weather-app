import React, { useState } from 'react'
import { FaCloudSunRain } from "react-icons/fa6";
import { MdLocationPin, MdOutlineMyLocation } from 'react-icons/md';
import SearchBox from './SearchBox';
import axios from 'axios';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from '@/app/atom';

type Props = { location?: string }
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

interface WeatherItem {
  name: string;
  id: number;
  sys: {
    country: string;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

interface WeatherApiResponse {
  list: WeatherItem[];
  count: number;
}

export default function Navbar({ location }: Props) {
    const [city, setCity] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [place, setPlace] = useAtom(placeAtom)
    const [_, setLoadingCity] = useAtom(loadingCityAtom)

    async function handleInputChange(value: string) {
        setCity(value);
        if (value.length >= 3) {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`);

                const suggestions = response.data.list?.map((item: WeatherItem) => item.name);
                setSuggestions(suggestions);
                setError(null); // Clear any previous errors
                setShowSuggestions(true);
            }
            catch (error) {
                setError('Error fetching city suggestions');
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }

    function handleSuggestionClick(suggestion: string) {
        setLoadingCity(true);
        setCity(suggestion);
        setShowSuggestions(false);
        setTimeout(() => {
            setLoadingCity(false);
            setShowSuggestions(false);
            setPlace(city)
        }, 500)
    }

    function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
        setLoadingCity(true);
        e.preventDefault();
        if (suggestions.length == 0) {
            setError('Location not found');
            setLoadingCity(false);
        } else {
            setError(null);
            setTimeout(() => {
                setLoadingCity(false);
                setShowSuggestions(false);
                setPlace(city)
            }, 500)
        }
    }

    function handleCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    setLoadingCity(true);
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
                    const cityName = response.data.name;
                    setPlace(cityName);
                    setCity(cityName);
                    setLoadingCity(false);
                } catch (error) {
                    setError('Error fetching current location');
                    setLoadingCity(false);
                }
            }, () => {
                setError('Error fetching current location');
                setLoadingCity(false);
            });
        }
    }


    return (
            <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white flex-col items-center justify-center w-full py-2 mb-4'>
                <div className='h-[80px]    w-full  flex    justify-between items-center    max-w-7xl px-3 mx-auto'>
                    <div className='flex items-center justify-center gap-2'>
                        <h2 className='text-gray-500 text-3xl'>Weather</h2>
                        <FaCloudSunRain className='text-3xl mt-1 text-yellow-300' />
                    </div>
                    {/*   */}
                    <section className='flex gap-2 items-center'>
                        <MdOutlineMyLocation
                            title="Your Current Location"
                            onClick={handleCurrentLocation}
                            className='text-2xl text-gray-400 hover:text-gray-900 cursor-pointer' />
                        <MdLocationPin className='text-3xl' />
                        <p className='text-slate-900/80 text-sm'>{location}</p>
                        <div className='relative hidden md:flex'>
                            {/* search bar*/}
                            <SearchBox
                                value={city}
                                onSubmit={handleSearchSubmit}
                                onChange={(e) => handleInputChange(e.target.value)}
                            />

                            <SuggestionBox
                                {
                                ...{
                                    showSuggestions,
                                    suggestions,
                                    handleSuggestionClick,
                                    error
                                }
                                }
                            />
                        </div>
                    </section>
                </div>
                <section className='flex w-full md:hidden justify-center items-center'>
                <div className='relative'>
                {/* search bar*/}
                <SearchBox
                    value={city}
                    onSubmit={handleSearchSubmit}
                    onChange={(e) => handleInputChange(e.target.value)}
                />

                <SuggestionBox
                    {
                    ...{
                        showSuggestions,
                        suggestions,
                        handleSuggestionClick,
                        error
                    }
                    }
                />
            </div>
            </section>
            </nav>
            

    )
}

function SuggestionBox({
    showSuggestions,
    suggestions,
    handleSuggestionClick,
    error
}: {
    showSuggestions: boolean;
    suggestions: string[];
    handleSuggestionClick: (suggestion: string) => void;
    error: string | null;
}) {
    return (
        <>
            {((showSuggestions && suggestions.length > 1) || error) && (
                <ul className='mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2'>
                    {error && suggestions.length < 1 && (
                        <li className='text-red-500 p-1'>{error}</li>
                    )}
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className='cursor-pointer p-1 rounded hover:bg-gray-200'>{suggestion}</li>
                    ))}
                </ul>
            )}
        </>
    )
}