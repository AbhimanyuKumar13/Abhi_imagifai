 import { Header } from "../components/Header";
import { Steps } from "../components/Steps";
import { Description } from "../components/Description"; 
import GenerateBtn from "../components/GenerateBtn";

const Home = () => {
  return (
    <div>
      <Header />
      <Steps/>
      <Description/> 
      <GenerateBtn/>
    </div>
  );
};

export default Home;
