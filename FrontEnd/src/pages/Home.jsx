import React from 'react'
import NewDrink from '../components/NewDrink'
import BestSeller from '../components/BestSeller'
import HeroSection from '../components/HeroSection'
import DessertAndDrinkSection from '../components/DessertAndDrinkSection'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
    return (
        <div className="space-y-16 md:space-y-24">
            <HeroSection />
            <DessertAndDrinkSection />
            <BestSeller />
            <NewDrink />
            <NewsletterBox />
        </div>
    )
}

export default Home
