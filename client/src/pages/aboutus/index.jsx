import { useAppStore } from "@/store";
import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaGithub, FaTwitter, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST, LOGOUT_ROUTE } from "@/lib/constants";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import emailjs from 'emailjs-com';
import apiClient from "@/lib/api-client";

const About = () => {
  const { firstName } = useParams();
  const { id } = useParams();
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [showAbout, setShowAbout] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (id) {
          const response = await apiClient.get(`/api/auth/userinfo/${id}`);
          if (response.status === 200) {
            setUserInfo(response.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    if (id && !userInfo) {
      fetchUserData();
    }
  }, [id, userInfo, setUserInfo]);

  const isNavigatingThroughLink = !!firstName || !userInfo?.profileSetup;

  useEffect(() => {
    if (userInfo?.profileSetup && userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const logout = async () => {
    navigate("/chat");
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

  const handleShare = (platform) => {
    const shareLink = `${window.location.origin}/${id}`;
    
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        let url = "";

        if (platform === "whatsapp") {
          url = `https://wa.me/?text=${encodeURIComponent(shareLink)}`;
        } else if (platform === "gmail") {
          url = `mailto:?subject=Check%20out%20this%20profile&body=${encodeURIComponent(shareLink)}`;
        }

        window.open(url, "_blank");
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
      });
  };

  return (
    <div className="bg-[#1b1c24] min-h-screen flex items-center justify-center flex-col gap-10">
      <div className="w-full md:w-[100vw] max-w-md flex flex-col gap-5 p-5 text-center">
       

       

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
                {userInfo?.firstName[0]}{userInfo?.lastName[0]}
              </div>
            )}
          </Avatar>
        </div>

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

        {showAbout ? (
          <div className="text-white text-opacity-80 mb-4">
            <h2 className="text-xl font-bold mb-4">
              {userInfo?.firstName} 
            </h2>
            <p>{userInfo?.aboutMe}</p>

            <div className="relative mt-4">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="py-2 px-4 bg-[#2f303b] hover:bg-[#ff006e] text-white rounded w-[70px] "
              >
                Share Profile
              </button>
              {showShareOptions && (
                <div className="absolute top-0 right-0 mt-10 flex gap-4 bg-[#2f303b] p-3 rounded shadow-lg z-10">
                  <FaWhatsapp
                    onClick={() => handleShare("whatsapp")}
                    className="text-green-500 text-2xl cursor-pointer"
                  />
                  <FaEnvelope
                    onClick={() => handleShare("gmail")}
                    className="text-red-500 text-2xl cursor-pointer"
                  />
                </div>
              )}
            </div>
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
