import React from 'react'
import { FiSunrise, FiSunset } from 'react-icons/fi';
import { GiWhirlwind } from 'react-icons/gi';
import { IoMdSpeedometer } from 'react-icons/io';
import { LuDroplet, LuEye } from 'react-icons/lu';

export interface WeatherDetailsProps {
    visability: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

export default function WeatherDetails(props: WeatherDetailsProps) {

    const {
        visability = '25km',
        humidity = '84%',
        windSpeed = '10km/h',
        airPressure = '1012hPa',
        sunrise = '6:30 AM',
        sunset = '7:45 PM'
    } = props;
    return (
        <>
            <SingleWeatherDetail
                icon={<LuEye />}
                info='Visability'
                value={visability}
            />
            <SingleWeatherDetail
                icon={<LuDroplet /> }
                info='Humidity'
                value={humidity}
            />
            <SingleWeatherDetail
                icon={<GiWhirlwind />}
                info='Wind Speed'
                value={windSpeed}
            />
            <SingleWeatherDetail
                icon={<IoMdSpeedometer />}
                info='Air Pressure'
                value={airPressure}
            />
            <SingleWeatherDetail
                icon={<FiSunrise />}
                info='Sunrise'
                value={sunrise}
            />
            <SingleWeatherDetail
                icon={<FiSunset />}
                info='Sunset'
                value={sunset}
            />
        </>
    )
}

export interface SingleWeatherDerailProps {
    info: string;
    icon: React.ReactNode;
    value: string;
}

function SingleWeatherDetail(props: SingleWeatherDerailProps) {
    return (
        <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
            <p className='whitespace-nowrap'>{props.info}</p>
            <div className='text-3xl'>{props.icon}</div>
            <p>{props.value}</p>
        </div>
    )
} 
