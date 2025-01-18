import React from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi"; // Importing the back arrow icon from Heroicons

const TermsAndConditions = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <HiArrowLeft className="mr-2" /> {/* Arrow icon */}
          <span className="text-lg font-semibold">Back</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Terms and Conditions</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Home</h2>
        <p className="text-gray-600">
          The Home section provides an overview of our website and the primary features available to users. This is where you can find the latest updates and navigate to other parts of the site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">About</h2>
        <p className="text-gray-600">
          The About section includes information about our company, our mission, and the values we uphold. Here, you’ll learn more about our background and what drives us to provide quality service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Services</h2>
        <p className="text-gray-600">
          In the Services section, you can explore the various offerings available to our users. We strive to offer services that meet your needs and exceed your expectations. Detailed descriptions and options can be found here.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Features</h2>
        <p className="text-gray-600">
          The Features section highlights the unique functionalities our platform provides. From user-friendly design to cutting-edge tools, this section explains what sets our services apart.
        </p>
      </section>

      <p className="text-gray-500 italic text-center mb-6">@All Rights Reserved 2024</p>

    </div>
  );
};

export default TermsAndConditions;
