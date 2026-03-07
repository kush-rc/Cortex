import HeroSection from '../components/HeroSection'
import './Home.css'

const Home = () => {
    return (
        <div className="home-page">
            {/* iPhone 16 Hero (Top) */}
            <HeroSection
                title="iPhone"
                subtitle="Say hello to the latest generation of iPhone."
                ctaText="Learn more"
                ctaLink="/iphone"
                secondaryText="Shop iPhone"
                secondaryLink="/iphone"
                theme="light"
                size="large"
                bgImage=`${import.meta.env.VITE_API_URL || ""}/static/product_images/apple_home/hero_iphone_family__fuz5j2v5xx6y_medium.jpg`
                imageStyle={{ width: '100%', height: '100%', objectPosition: 'center bottom' }}
            />

            {/* Watch Series 11 (Dark/Black) */}
            <HeroSection
                appleLogo={true}
                title="WATCH"
                titleLight="SERIES 11"
                subtitle="The ultimate way to watch your health."
                ctaText="Learn more"
                ctaLink="/watch"
                secondaryText="Buy"
                secondaryLink="/product/Apple%20Watch%20Series%2011"
                theme="light"
                size="large"
                bgImage=`${import.meta.env.VITE_API_URL || ""}/static/product_images/apple_home/hero_apple_watch_series_11__bdz1mml4dx6q_medium.jpg`
                imageStyle={{ width: '100%', height: '100%', objectPosition: 'center bottom' }}
            />
            {/* Note: Screenshot showed White BG for Series 11? Or Light gray. 
               User's screenshot: "WATCH SERIES 11" on White background with Gold/Black watch.
               So theme="light" is correct. */ }

            {/* Bento Grid */}
            <div className="bento-grid">
                {/* Watch Ultra 3 (Dark) */}
                <HeroSection
                    appleLogo={true}
                    title="WATCH"
                    titleLight="ULTRA 3"
                    subtitle="Personal beast."
                    ctaText="Learn more"
                    ctaLink="/watch"
                    secondaryText="Buy"
                    secondaryLink="/product/Apple%20Watch%20Ultra%203"
                    theme="dark"
                    size="medium"
                    bgImage=`${import.meta.env.VITE_API_URL || ""}/static/product_images/apple_home/promo_apple_watch_ultra3__bwvslhbxx99e_medium.jpg`
                    imageStyle={{ width: '100%', height: '100%', objectPosition: 'center bottom' }}
                />

                {/* iPad Air */}
                <HeroSection
                    title="iPad air"
                    subtitle="Now supercharged by the M3 chip."
                    ctaText="Learn more"
                    ctaLink="/ipad"
                    secondaryText="Buy"
                    secondaryLink="/product/iPad%20Air"
                    theme="light"
                    size="medium"
                    bgImage=`${import.meta.env.VITE_API_URL || ""}/static/product_images/apple_home/ipad_l.jpg`
                    imageStyle={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }}
                />

                {/* MacBook Pro 14 (Dark) */}
                <HeroSection
                    title="MacBook Pro 14”"
                    subtitle="Supercharged by M5."
                    ctaText="Learn more"
                    ctaLink="/mac"
                    secondaryText="Buy"
                    secondaryLink="/product/MacBook%20Pro%2014%22%20and%2016%22"
                    theme="dark"
                    size="medium"
                    bgImage=`${import.meta.env.VITE_API_URL || ""}/static/product_images/apple_home/promo_macbook_pro_m5__gnwzdhijhm6a_medium.jpg`
                    imageStyle={{ width: '100%', height: '100%', objectPosition: 'center bottom' }}
                />

                {/* AirPods Pro 3 */}
                <HeroSection
                    title="AirPods Pro 3"
                    subtitle="The world’s best in-ear Active Noise Cancellation."
                    ctaText="Learn more"
                    ctaLink="/airpods"
                    secondaryText="Buy"
                    secondaryLink="/product/AirPods%20Pro%203"
                    theme="light"
                    size="medium"
                    bgImage=`${import.meta.env.VITE_API_URL || ""}/static/product_images/apple_home/promo_airpodspro_3__f6xmza7bglei_medium.jpg`
                    imageStyle={{ width: '100%', height: '100%', objectPosition: 'center bottom' }}
                />
            </div>

        </div>
    )
}

export default Home
