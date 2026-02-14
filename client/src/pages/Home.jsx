 import { Header } from "../components/Header";
import { Steps } from "../components/Steps";
import { Description } from "../components/Description"; 
import GenerateBtn from "../components/GenerateBtn";
import {Testimonials} from "../components/Testimonials";

const Home = () => {
  return (
    <div>
      <Header />
      <Steps/>
      <Description/> 
      <GenerateBtn/>
      <Testimonials/>
    </div>
  );
};

export default Home;
