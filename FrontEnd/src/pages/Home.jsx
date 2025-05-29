import React from 'react'
import NewDrink from '../components/NewDrink'
import BestSeller from '../components/BestSeller'
import HeroSection from '../components/HeroSection'

const Home = () => {
    return (
        <div>
            <HeroSection />
            <BestSeller />
            <NewDrink />
        </div>
    )
}

export default Home
