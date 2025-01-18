import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const Termsback = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="bg-[#1b1c24] min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl p-6 bg-[#ffffff] rounded-lg shadow-lg text-black">
        
        {/* Back Arrow Icon */}
        <div className="mb-6">
          <IoArrowBack
            className="text-3xl cursor-pointer text-black text-opacity-80 hover:text-opacity-100 transition"
            onClick={() => navigate(-1)}
          />
        </div>

        {/* Page Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-center text-black mb-8">
          Terms and Conditions
        </h1>

        {/* Sections */}
        <div className="space-y-8 text-black  text-opacity-90">
          <section>
            <h4 className="text-xl font-semibold mb-2">Home</h4>
            <p className="text-base text-black">{userInfo?.home || "The Home section provides an overview of our website and the primary features available to users."}</p>
          </section>

          <section>
            <h4 className="text-xl font-semibold mb-2">About</h4>
            <p className="text-base text-black">{userInfo?.about || "The About section includes information about our company, our mission, and our values."}</p>
          </section>

          <section>
            <h4 className="text-xl font-semibold mb-2">Services</h4>
            <p className="text-base text-black">{userInfo?.services || "In the Services section, you can explore the various offerings available to our users."}</p>
          </section>

          <section>
            <h4 className="text-xl font-semibold mb-2">Features</h4>
            <p className="text-base text-black">{userInfo?.features || "The Features section highlights the unique functionalities our platform provides."}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Termsback;
