import { useState, useEffect, useRef } from "react";
import { RiCloseFill, RiMoreFill } from "react-icons/ri";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST } from "@/lib/constants";
import { getColor } from "@/lib/utils";

const ChatHeader = () => {
  const { selectedChatData, closeChat, selectedChatType } = useAppStore();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const adImages = [
    "https://cdn.pixabay.com/photo/2023/02/07/17/49/supercar-7774683_640.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBBz9-k7YwpZD3fwr65EU4bK03ubXl4OQBeNuAae6O6OLJ5gEuC51vP7VOn-qzi9hesWU&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9236P_HRkzJgkAzP46MT5li7699Uz5EYg-qqhTrfa2nHj-_qdZ_ghgGx_S_vmTjHNoP0&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWp0S0nYnDNvuO6jxcLVFLMZaQa1HqbHMrjvkmF-u9jxzWBDZGfJMAMzu34MeKF3VEGxs&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6_QN2R8-WrCfiK1uey3AdJON0FBlPVnhaPrKYutDqn7zny3cs3wNtjyvDn0BaA4USWv8&usqp=CAU",
  ];

  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) =>
        prevIndex === adImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [adImages.length]);

  const handleMenuToggle = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  // Close menu on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = (action) => {
    alert(action); // Replace with actual action
    setShowMenu(false); // Close menu after selection
  };

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 bg-[#23239c]">
      <div className="flex gap-5 items-center">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative flex items-center justify-center">
            {selectedChatType === "contact" ? (
              <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                ) : (
                  <div
                    className={`uppercase w-12 h-12 text-lg border-[1px] ${getColor(
                      selectedChatData.color
                    )} flex items-center justify-center rounded-full`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div
                className={`bg-[#ffffff22] py-3 px-5 flex items-center justify-center rounded-full`}
              >
                #
              </div>
            )}
          </div>
          <div>
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && selectedChatData.firstName
              ? selectedChatData.firstName
              : ""}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-5 ml-4">
        <div className="w-40 h-11 relative">
          <img
            src={adImages[currentAdIndex]}
            alt="Advertisement"
            className="w-full h-full object-cover rounded items-center"
          />
        </div>
        {/* Three-dot menu button */}
        
        <button
          className="text-neutral-300 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
          onClick={closeChat}
        >
          <RiCloseFill className="text-3xl" />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            onClick={handleMenuToggle}
            className="text-neutral-300 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
          >
            <RiMoreFill className="text-2xl" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white shadow-md rounded-md p-2 w-40 text-gray-700">
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={() => handleMenuItemClick("Payment Release")}
              >
                Payment Release
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={() => handleMenuItemClick("Payment Hold")}
              >
                Payment Hold
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
