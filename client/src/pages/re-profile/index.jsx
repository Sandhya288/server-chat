import { useAppStore } from "@/store";
import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaGithub, FaTwitter } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST, LOGOUT_ROUTE } from "@/lib/constants";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import emailjs from 'emailjs-com';
import apiClient from "@/lib/api-client";

const Profiless = () => {
  const { firstName } = useParams();
  const { _id } = useParams();
  const { selectedChatData, setSelectedChatData } = useAppStore();
 
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [showAbout, setShowAbout] = useState(true);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (_id) {
          const response = await apiClient.get(`/api/auth/userinfo/${_id}`);
          if (response.status === 200) {
            console.log("User data:", response.data); // Log the response data to verify it
            setSelectedChatData(response.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
  
    if (_id && !selectedChatData) {
      fetchUserData();
    }
  }, [_id, selectedChatData, setSelectedChatData]);
  

  // Check if the page is accessed through a public link (if a firstName or ID is in the URL)
 

  useEffect(() => {
    if (selectedChatData?.profileSetup && selectedChatData.image) {
      setImage(`${HOST}/${selectedChatData.image}`);
    }
  }, [selectedChatData]);

 

  const sendQuery = () => {
    const templateParams = {
      from_email: senderEmail,
      to_email: selectedChatData?.email,
      message: message,
    };

    emailjs
      .send("service_et62cap", "template_5yfdrdw", templateParams, "2VsnAhfuGdny4gP6m")
      .then(
        (response) => {
          console.log("Email successfully sent!", response);
          setMessage("");
          setSenderEmail("");
          setFile(null);
        },
        (error) => {
          console.error("Failed to send the email", error);
        }
      );
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  

  return (
    <div className="bg-[#1b1c24] min-h-screen flex items-center justify-center flex-col gap-10">
      <div className="w-full md:w-[100vw] max-w-md flex flex-col gap-5 p-5 text-center">
        {/* Sign In button redirects to auth page for public access */}
       

        {/* Back icon is displayed only if not navigating through link */}
       
          <div>
            <IoArrowBack
              className="text-2xl mt-6 lg:text-4xl text-white text-opacity-90 cursor-pointer"
              onClick={() => navigate(-1)} // Navigate back in history
            />
          </div>
        

        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-5">
          <Avatar className="rounded-full overflow-hidden border-2 border-white cursor-pointer w-40 h-40 flex items-center justify-center">
            {selectedChatData.image ? (
              <AvatarImage
              src={`${HOST}/${selectedChatData.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "path/to/default/image"; // Provide a default image path
                }}
              />
            ) : (
              <div className="uppercase flex items-center justify-center text-center bg-gray-100 text-5xl text-[#ff006e] border border-[#ff006faa] w-full h-full">
                {selectedChatData?.firstName[0]}{selectedChatData?.lastName[0]}
              </div>
            )}
          </Avatar>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-5">
          <button
            onClick={() => setShowAbout(true)}
            className={`py-2 px-4 rounded ${showAbout ? "bg-[#ff006e]" : "bg-[#2f303b]"} text-white`}
          >
            About Me
          </button>
          <button
            onClick={() => {
              setShowAbout(false);
              setSenderEmail("");
            }}
            className={`py-2 px-4 rounded ${!showAbout ? "bg-[#ff006e]" : "bg-[#2f303b]"} text-white`}
          >
            Query
          </button>
        </div>

        {/* Conditional Content */}
        {showAbout ? (
  <div className="text-white text-opacity-80 mb-4">
    <h2 className="text-xl font-bold mb-4">
      {selectedChatData?.firstName} {selectedChatData?.lastName}
    </h2>
    {/* Display About Me if available */}
    <p>{selectedChatData.aboutMe }</p>

    {/* Social Media Links */}
    <div className="flex justify-center gap-4 mt-5">
      {selectedChatData?.facebook && (
        <a href={selectedChatData.facebook} target="_blank" className="text-2xl text-[#3b5998]">
          <FaFacebook />
        </a>
      )}
      {selectedChatData?.instagram && (
        <a href={selectedChatData.instagram} target="_blank" className="text-2xl text-[#E1306C]">
          <FaInstagram />
        </a>
      )}
      {selectedChatData?.github && (
        <a href={selectedChatData.github} target="_blank" className="text-2xl text-[#333]">
          <FaGithub />
        </a>
      )}
      {selectedChatData?.twitter && (
        <a href={selectedChatData.twitter} target="_blank" className="text-2xl text-[#1DA1F2]">
          <FaTwitter />
        </a>
      )}
    </div>
  </div>
) : (
  // Query form as shown above
  <div className="mt-5">
    <input
      type="email"
      value={senderEmail}
      onChange={(e) => setSenderEmail(e.target.value)}
      placeholder="Your Email"
      className="p-2 w-full bg-[#2f303b] text-white mb-2"
    />
    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Enter your message"
      className="p-2 w-full h-20 bg-[#2f303b] text-white"
    />
    <button
      onClick={sendQuery}
      className="mt-4 w-full py-2 bg-[#ff006e] text-white rounded"
    >
      Send
    </button>
  </div>
)}

        
      </div>
    </div>
  );
};

export default Profiless;
