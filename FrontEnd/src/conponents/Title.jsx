import React from 'react'

const Title = ({ text1, text2 }) => {
    return (
        <div className='col-start-2 col-span-4'>
            <h1 className='text-[var(--blue-dark)]-3xl md:text-5xl font-bold '>{text1}</h1>
            <p className='py-4 md:w-2/4 mx-auto text-gray-500 text-lg'>{text2}</p>
        </div>
    )
}

export default Title
