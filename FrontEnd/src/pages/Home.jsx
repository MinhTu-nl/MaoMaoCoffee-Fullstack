import React from 'react'
import NewDrink from '../components/NewDrink'
import BestSeller from '../components/BestSeller'
import HeroSection from '../components/HeroSection'
import DessertAndDrinkSection from '../components/DessertAndDrinkSection'
import NewsletterBox from '../components/NewsletterBox'
import MarqueeStrip from '../components/MarqueeStrip'
import FeatureGrid from '../components/FeatureGrid'

const Home = () => {
    return (
        <div className="space-y-8 md:space-y-12">
            <HeroSection />
            <MarqueeStrip />
            <DessertAndDrinkSection />
            <BestSeller />
            <NewDrink />
            <NewsletterBox />
            <FeatureGrid />
        </div>
    )
}

export default Home
