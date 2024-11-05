import { useAppStore } from "@/store";
import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaGithub, FaTwitter } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST, LOGOUT_ROUTE } from "@/lib/constants";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import emailjs from 'emailjs-com';
import apiClient from "@/lib/api-client";

const About = () => {
  const { firstName } = useParams();
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [showAbout, setShowAbout] = useState(true);

  // Check if the page is accessed through a public link (if a firstName or ID is in the URL)
  const isNavigatingThroughLink = !!firstName || !userInfo?.profileSetup;

  useEffect(() => {
    if (userInfo?.profileSetup && userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const logout = async () => {
    if (userInfo) { // Only try to log out if the user is authenticated
      try {
        const response = await apiClient.post(
          LOGOUT_ROUTE,
          {},
          { withCredentials: true }
        );
        if (response.status === 200) {
          setUserInfo(undefined);
          navigate("/auth");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/auth"); // Just navigate to auth if not logged in
    }
  };

  const sendQuery = () => {
    const templateParams = {
      from_email: senderEmail,
      to_email: userInfo?.email,
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

  const handleShare = () => {
    const lastSixDigitsId = userInfo.id.slice(-6); // Get the last 6 digits of the ID
    const shareLink = `${window.location.origin}/${lastSixDigitsId}`; // Update the link
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        alert("Link copied to clipboard! You can share it with others.");
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
      });
  };

  return (
    <div className="bg-[#1b1c24] min-h-screen flex items-center justify-center flex-col gap-10">
      <div className="w-full md:w-[100vw] max-w-md flex flex-col gap-5 p-5 text-center">
        {/* Sign In button redirects to auth page for public access */}
        <button 
          onClick={logout}
          className="absolute top-4 right-4 bg-[#ff006e] text-white py-1 px-2 text-sm rounded hover:bg-[#e6005c]"
        >
          {userInfo ? "Logout" : "Sign In"}
        </button>

        {/* Back icon is displayed only if not navigating through link */}
        {!isNavigatingThroughLink && (
          <div>
            <IoArrowBack
              className="text-2xl mt-6 lg:text-4xl text-white text-opacity-90 cursor-pointer"
              onClick={() => navigate(-1)} // Navigate back in history
            />
          </div>
        )}

        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-5">
          <Avatar className="rounded-full overflow-hidden border-2 border-white cursor-pointer w-40 h-40">
            {image ? (
              <AvatarImage
                src={image}
                alt="profile"
                className="object-cover w-full h-full bg-black"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "path/to/default/image"; // Provide a default image path
                }}
              />
            ) : (
              <div className="uppercase h-32 w-32 md:w-48 md:h-48 text-5xl text-[#ff006e] border-[1px] border-[#ff006faa] flex items-center justify-center">
                {userInfo?.firstName[0]}{userInfo?.lastName[0]}
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
              {userInfo?.firstName} {userInfo?.lastName}
            </h2>
            <p>{userInfo?.aboutMe}</p>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="mt-4 py-2 px-4 bg-[#2f303b] hover:bg-[#ff006e] text-white rounded"
            >
              Share Profile
            </button>

            {/* Project Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              {userInfo?.project1 && (
                <button 
                  className="py-2 px-4 rounded bg-[#2f303b] text-white hover:bg-[#ff006e]"
                  onClick={() => window.open(userInfo.project1, "_blank")}
                >
                  Project 1
                </button>
              )}
              {userInfo?.project2 && (
                <button 
                  className="py-2 px-4 rounded bg-[#2f303b] text-white hover:bg-[#ff006e]"
                  onClick={() => window.open(userInfo.project2, "_blank")}
                >
                  Project 2
                </button>
              )}
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center gap-4 mt-5">
              {userInfo?.facebook && <a href={userInfo.facebook} target="_blank" className="text-2xl text-[#3b5998]"><FaFacebook /></a>}
              {userInfo?.instagram && <a href={userInfo.instagram} target="_blank" className="text-2xl text-[#E1306C]"><FaInstagram /></a>}
              {userInfo?.github && <a href={userInfo.github} target="_blank" className="text-2xl text-[#333]"><FaGithub /></a>}
              {userInfo?.twitter && <a href={userInfo.twitter} target="_blank" className="text-2xl text-[#1DA1F2]"><FaTwitter /></a>}
            </div>
          </div>
        ) : (
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

export default About;
