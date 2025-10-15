import { cn } from '@/utils/cn';
import React from 'react'
import { FaSearch } from 'react-icons/fa'

type Props = {
    className?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

export default function SearchBox(props: Props) {
    return (
        <form
            onSubmit={props.onSubmit}
            className= { cn('flex relative items-center justify-center h-10', props.className)}
        >
            <input
                onChange={props.onChange}
                value={props.value}
                type="text" placeholder='Search location...' className='h-full w-[230px] rounded-l-md border border-gray-300 px-4  py-2 focus:outline-none focus:border-blue-500'
            />
            <button className='px-4 py-[9px] bg-blue-500 text-white rounded-r-md focus:outline-none hover:bg-blue-600 h-full cursor-pointer'>
                <FaSearch />
            </button>
        </form>
    )
}