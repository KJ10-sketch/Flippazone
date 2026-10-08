import heroImg from "../../assets/rabbit-hero.webp";
import { Link } from "react-router-dom";
const Hero = () =>{
    return (
        <section className="relative">
            {/* <Home /> */}
            {/* for the image I should chage it but I have to keep the same size that will suit it to be the hero sectio pictures */}
            <img src={ heroImg } alt="flippazone image" className="w-full h-[400px] md:[600px] lg:h-[750px] object-cover" />
            {/* Div for the text anf shop now button */}
            <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center">
                <div className="text-center text-white p-6">
                    <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
                        Flippazone <br /> Ready
                    </h1>
                    {/* I need to update the text and customize the text using AI to make it more realistic */}
                    <p className="text-sm tracking-tighter md:text-lg mb-6">
                         Flip your phone you find us at your zone
                    </p>
                    
                    {/* this is the Shop now link component */}
                    <Link to="#" className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg"> 
                     Shop Now
                    </Link>
                </div>
            </div>
        </section >
    );
};
export default Hero;