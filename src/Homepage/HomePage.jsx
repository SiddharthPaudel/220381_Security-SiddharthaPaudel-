import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import MangaCards from "../MangaCard/MangaCards"
import Daily from '../components/Daily';
import UpcomingManga from '../components/UpComing'
import AboutUs from "../components/AboutUs";
import { Element } from "react-scroll";
const HomePage = () => {
  return (
    <>
      <HeroSection />
      <MangaCards />
      <Daily />
      <Element name="upcoming">
        <UpcomingManga />
      </Element>
        <Element name="aboutus">
        <AboutUs />
      </Element>
    </>
  );
};
export default HomePage;
