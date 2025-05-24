import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/lib/constants";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useSocket } from "@/contexts/SocketContext";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
    userInfo,
  } = useAppStore();

  const socket = useSocket();
  const [newMessages, setNewMessages] = useState({});

  const STORAGE_KEY = `unreadMessages-${userInfo?.id}`;

  // ✅ Load persisted unread state
  useEffect(() => {
    if (userInfo) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setNewMessages(parsed);
          console.log("📦 Loaded unread state from storage:", parsed);
        } catch (e) {
          console.error("❌ Failed to parse unread state:", e);
        }
      }
    }
  }, [userInfo]);

  // ✅ Save unread state whenever it changes
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    }
  }, [newMessages, userInfo]);

  // 🔁 Listen for new messages via socket
  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("📥 Received message via socket:", message);

      if (!isChannel && message.recipient._id === userInfo.id) {
        const contactId = message.sender._id;

        if (!selectedChatData || selectedChatData._id !== contactId) {
          setNewMessages((prev) => ({
            ...prev,
            [contactId]: true,
          }));
          console.log("🔴 Marked new message from:", contactId);
        }
      }
    };

    socket?.on("receiveMessage", handleNewMessage);
    return () => {
      socket?.off("receiveMessage", handleNewMessage);
    };
  }, [socket, selectedChatData, userInfo, isChannel]);

  // ✅ Click contact to open chat
  const handleClick = (contact) => {
    console.log("👆 Clicked contact:", contact._id);
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }

    setSelectedChatData(contact);
    setSelectedChatMessages([]);

    setNewMessages((prev) => {
      const updated = { ...prev };
      delete updated[contact._id];
      console.log("✅ Cleared red dot for:", contact._id);
      return updated;
    });
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer relative ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#23239c] hover:bg-[#3131b4]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-800">
            {/* Avatar */}
            {!isChannel ? (
              <Avatar className="h-10 w-10">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="rounded-full bg-cover h-full w-full"
                  />
                ) : null}
                <AvatarFallback
                  className={`uppercase ${
                    selectedChatData && selectedChatData._id === contact._id
                      ? "bg-[#ffffff22] border border-white/50"
                      : getColor(contact.color)
                  } h-10 w-10 flex items-center justify-center rounded-full`}
                >
                  {contact.firstName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full text-white">
                #
              </div>
            )}

            {/* Name and red dot */}
            <div className="flex items-center gap-2">
              <span className="text-black">
                {isChannel ? contact.name : contact.firstName}
              </span>
              {newMessages[contact._id] > 0 && (
                <div className="flex items-center ml-2">
                  <span
                    className="rounded-full bg-red-500 shadow-md"
                    style={{
                      height: 10,
                      width: 10,
                      animation: "pulse 2s infinite",
                      display: "inline-block",
                    }}
                  />
                  <span className="ml-1 text-xs font-semibold text-red-500 select-none">
                    {newMessages[contact._id]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
