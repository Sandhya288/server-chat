import { HOST } from "@/lib/constants";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState, useEffect } from "react";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useAppStore();
  
  const [newMessages, setNewMessages] = useState({});

  useEffect(() => {
    const handleNewMessage = (contactId) => {
      setNewMessages((prev) => ({ ...prev, [contactId]: true }));
    };

    // Assume some event listener for new messages
    // Replace with actual event logic
    // Example: socket.on("newMessage", handleNewMessage);

    return () => {
      // Cleanup event listener
      // Example: socket.off("newMessage", handleNewMessage);
    };
  }, []);

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
    setNewMessages((prev) => ({ ...prev, [contact._id]: false }));
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer relative ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#23239c] hover:bg-[#3131b4]"
              : "hover:bg-[#f1f1f111] "
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-800">
            {!isChannel && (
              <Avatar className="h-10 w-10">
                {contact.image && (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="rounded-full bg-cover h-full w-full"
                  />
                )}

                <AvatarFallback
                  className={`uppercase ${
                    selectedChatData && selectedChatData._id === contact._id
                      ? "bg-[#ffffff22] border border-white/50"
                      : getColor(contact.color)
                  } h-10 w-10 flex items-center justify-center rounded-full`}
                >
                  {contact.firstName.split("").shift()}
                </AvatarFallback>
              </Avatar>
            )}
            {isChannel && (
              <div
                className={`bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full`}
              >
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>{`${contact.firstName} ${contact.lastName}`}</span>
            )}
          </div>
          {newMessages[contact._id] && (
            <span className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              New
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactList;
