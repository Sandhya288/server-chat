import { useAppStore } from "@/store";
import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaGithub, FaTwitter } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "@/lib/constants";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import emailjs from 'emailjs-com';

const About = () => {
  const { firstName } = useParams();
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [showAbout, setShowAbout] = useState(true);

  useEffect(() => {
    if (userInfo.profileSetup) {
      if (userInfo.image) {
        setImage(`${HOST}/${userInfo.image}`);
      }
    }
  }, [userInfo]);

  const sendQuery = () => {
    const templateParams = {
      from_email: senderEmail,
      to_email: userInfo.email,
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

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      console.error("Please setup profile.");
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="bg-[#1b1c24] min-h-screen flex items-center justify-center flex-col gap-10">
      <div className="w-full md:w-[100vw] max-w-md flex flex-col gap-5 p-5 text-center">
        <button 
          onClick={handleSignIn} 
          className="absolute top-4 right-4 bg-[#ff006e] text-white py-1 px-2 text-sm rounded hover:bg-[#e6005c]"
        >
          Sign In
        </button>

        <div>
          <IoArrowBack
            className="text-4xl mt-6 lg:text-6xl text-white text-opacity-90 cursor-pointer"
            onClick={handleNavigate}
          />
        </div>

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
                  e.target.src = "path/to/default/image";
                }}
              />
            ) : (
              <div className="uppercase h-32 w-32 md:w-48 md:h-48 text-5xl text-[#ff006e] border-[1px] border-[#ff006faa] flex items-center justify-center">
                {userInfo.firstName[0]}{userInfo.lastName[0]}
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
            <h2 className="text-xl font-bold mb-4">{userInfo.firstName} {userInfo.lastName}</h2>
            <p>{userInfo.aboutMe}</p>

            {/* Project Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              {userInfo.project1 && (
                <button 
                  className="py-2 px-4 rounded bg-[#2f303b] text-white hover:bg-[#ff006e]"
                  onClick={() => window.open(userInfo.project1, "_blank")}
                >
                  Project 1
                </button>
              )}
              {userInfo.project2 && (
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
              {userInfo.facebook && <a href={userInfo.facebook} target="_blank" className="text-2xl text-[#3b5998]"><FaFacebook /></a>}
              {userInfo.instagram && <a href={userInfo.instagram} target="_blank" className="text-2xl text-[#E1306C]"><FaInstagram /></a>}
              {userInfo.github && <a href={userInfo.github} target="_blank" className="text-2xl text-[#333]"><FaGithub /></a>}
              {userInfo.twitter && <a href={userInfo.twitter} target="_blank" className="text-2xl text-[#1DA1F2]"><FaTwitter /></a>}
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
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-2 text-white"
            />
            <button
              onClick={sendQuery}
              className="mt-3 bg-[#ff006e] hover:bg-[#e6005c] text-white py-2 px-4 rounded"
            >
              Send Query
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
