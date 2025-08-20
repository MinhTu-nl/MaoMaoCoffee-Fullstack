/*
 * Page: Home.jsx
 * Purpose: Trang chủ — banner, featured products, call-to-action.
 * Main behavior: Fetch data (banners, featured items), hiển thị các section, lazy-load images.
 * Inputs: API responses, optional query params.
 * Outputs: UI nhiều khu vực, dẫn tới chi tiết sản phẩm hoặc danh mục.
 * Edge cases: Data trống, lỗi fetch, performance trên mobile (lazy load).
 */

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
