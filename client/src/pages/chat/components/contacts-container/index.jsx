import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { FaHome } from "react-icons/fa"; // Import dashboard icon from react-icons
import ContactList from "@/components/common/contact-list";
import Logo from "@/components/common/logo";
import ProfileInfo from "./components/profile-info";
import apiClient from "@/lib/api-client";
import { GET_CONTACTS_WITH_MESSAGES_ROUTE, GET_USER_CHANNELS, GET_USERINFO_ROUTE } from "@/lib/constants"; // Ensure GET_USERINFO_ROUTE is imported
import { useAppStore } from "@/store";
import NewDM from "./components/new-dm/new-dm";
import CreateChannel from "./components/create-channel/create-channel";

const ContactsContainer = () => {
  const navigate = useNavigate();
  const userInfo = useAppStore((state) => state.userInfo); // Ensure you are accessing userInfo correctly from the store

  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
    setUserInfo // Assuming you have a method to set user info in the store
  } = useAppStore();

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await apiClient.get(GET_USERINFO_ROUTE, { withCredentials: true });
      console.log("User Info from API:", response.data); // Log API response for debugging
      if (response.data.user) {
        setUserInfo(response.data.user); // Set user info in the store
      }
    };
    fetchUserInfo();
  }, [setUserInfo]);

  // Fetch contacts with messages
  useEffect(() => {
    const getContactsWithMessages = async () => {
      const response = await apiClient.get(GET_CONTACTS_WITH_MESSAGES_ROUTE, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    };
    getContactsWithMessages();
  }, [setDirectMessagesContacts]);

  // Fetch user channels
  useEffect(() => {
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS, {
        withCredentials: true,
      });
      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    };
    getChannels();
  }, [setChannels]);

  const handleDashboardClick = () => {
    if (userInfo && userInfo.firstName) {
      navigate(`/about/${userInfo.firstName}`); // Navigate to the About page with the first name
    } else {
      console.error("User info or first name is not available."); // Add error handling
    }
  };

  return (
    <div className="relative w-full md:w-[40vw] lg:w-[35vw] xl:w-[27vw] h-screen bg-[#e7e7ec] border-r-2 border-[#2f303b] flex flex-col">
      {/* Dashboard Icon at the top right corner */}
      <div className="absolute top-5 right-5 cursor-pointer text-black hover:text-black" onClick={handleDashboardClick}>
        <FaHome size={24} /> {/* Adjust the icon size as needed */}
      </div>

      {/* Scrollable content for contacts and channels */}
      <div className="flex-grow overflow-y-auto">
        <div className="pt-3">
          <Logo />
        </div>
        <div className="my-5">
          <div className="flex items-center justify-between pr-10">
            <Title text="Direct Messages" />
            <NewDM />
          </div>
          <div className="overflow-y-auto max-h-[35vh] scrollbar-hidden">
            <ContactList contacts={directMessagesContacts} />
          </div>
        </div>
        <div className="my-5">
          <div className="flex items-center justify-between pr-10">
            <Title text="Channels" />
            <CreateChannel />
          </div>
          <div className="overflow-y-auto max-h-[35vh] scrollbar-hidden pb-16">
            <ContactList contacts={channels} isChannel />
          </div>
        </div>
      </div>

      {/* Fixed profile info at the bottom */}
      <div className="flex-shrink-0">
        <ProfileInfo />
      </div>
    </div>
  );
};

export default ContactsContainer;

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-black pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
