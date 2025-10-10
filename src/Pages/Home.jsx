import NewsCards from '../components/NewsCards'
import CategoryCard from '../innerSections/CategoryCards'
import HomeBanner from '../innerSections/HomeBanner'
import LongCarousel from '../innerSections/LongCarousel'

const Home = () => {
  return (
    <>
        <HomeBanner/>
        <NewsCards/>
        {/* <LongCarousel/> */}

        <CategoryCard/>
    </>
  )
}

export default Home
