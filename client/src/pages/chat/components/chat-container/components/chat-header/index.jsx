import { useState, useEffect, useRef } from "react";
import { RiCloseFill, RiMoreFill } from "react-icons/ri";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST } from "@/lib/constants";
import { getColor } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const userInfo = useAppStore();
  const { selectedChatData, closeChat, selectedChatType } = useAppStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const adImages = [
    
    "https://www.mmarchitecturalphotography.com/chicago-architectural-photographer/uploads/2016/01/clarendon-hills-luxury-home-interior.jpg",
    "https://cdn.decorilla.com/online-decorating/wp-content/uploads/2018/10/modern-interior-design-grey-living-room2.png",
    "https://wallup.net/wp-content/uploads/2019/09/977071-interior-design-room-furniture-architecture-house-condo-apartment.jpg",
    "https://wallup.net/wp-content/uploads/2019/09/977071-interior-design-room-furniture-architecture-house-condo-apartment.jpg",
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
    setShowSubmenu(false); // Close submenu if main menu is toggled
  };

  const handleSubmenuToggle = () => {
    setShowSubmenu((prevShowSubmenu) => !prevShowSubmenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        setShowSubmenu(false);
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

  const handleSubmenuItemClick = (option) => {
    alert(option); // Handle submenu options
    setShowMenu(false); // Close menu after selection
    setShowSubmenu(false); // Close submenu
  };

  const handleProfileClick = () => {
    if (selectedChatData && selectedChatData._id) {
      navigate(`/re-profile/${selectedChatData._id}`);
    } else {
      console.error("selectedChatData or selectedChatData._id is not defined.");
    }
  };

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-4 sm:px-20 bg-[#23239c]">
      <div className="flex items-center gap-2 sm:gap-5">
        <div className="flex gap-2 sm:gap-3 items-center">
          <div
            className="w-10 sm:w-12 h-10 sm:h-12 relative flex items-center justify-center cursor-pointer"
            onClick={handleProfileClick}
          >
            {selectedChatType === "contact" ? (
              <Avatar className="w-10 sm:w-12 h-10 sm:h-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                ) : (
                  <div
                    className={`uppercase w-10 sm:w-12 h-10 sm:h-12 text-base sm:text-lg border-[1px] ${getColor(
                      selectedChatData.color
                    )} flex items-center justify-center rounded-full`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName[0]
                      : selectedChatData.email[0]}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] py-2 px-4 sm:py-3 sm:px-5 rounded-full flex items-center justify-center">
                #
              </div>
            )}
          </div>
          <div className="text-sm sm:text-base">
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && selectedChatData.firstName
              ? selectedChatData.firstName
              : ""}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-5">
       

        <button
          className="text-neutral-300 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
          onClick={closeChat}
        >
          <RiCloseFill className="text-xl sm:text-3xl" />
        </button>
        <div className="relative" ref={menuRef}>
        
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white shadow-md rounded-md p-2 w-36 sm:w-40 text-gray-700 z-10">
              <button
                className="w-full text-left px-2 py-1 sm:px-3 sm:py-2 hover:bg-gray-100"
                onClick={handleSubmenuToggle}
              >
                Payment Release
              </button>
              {showSubmenu && (
                <div className="mt-1 bg-white shadow-md rounded-md p-2 w-36 sm:w-40 text-gray-700">
                  <button
                    className="w-full text-left px-2 py-1 sm:px-3 sm:py-2 hover:bg-gray-100"
                    onClick={() => handleSubmenuItemClick("Full Release")}
                  >
                    Full Release
                  </button>
                  <button
                    className="w-full text-left px-2 py-1 sm:px-3 sm:py-2 hover:bg-gray-100"
                    onClick={() => handleSubmenuItemClick("75% Release")}
                  >
                    75% Release
                  </button>
                  <button
                    className="w-full text-left px-2 py-1 sm:px-3 sm:py-2 hover:bg-gray-100"
                    onClick={() => handleSubmenuItemClick("50% Release")}
                  >
                    50% Release
                  </button>
                  <button
                    className="w-full text-left px-2 py-1 sm:px-3 sm:py-2 hover:bg-gray-100"
                    onClick={() => handleSubmenuItemClick("25% Release")}
                  >
                    25% Release
                  </button>
                </div>
              )}
              <button
                className="w-full text-left px-2 py-1 sm:px-3 sm:py-2 hover:bg-gray-100"
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
