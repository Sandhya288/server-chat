import { IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaRupeeSign } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { useSocket } from "@/contexts/SocketContext";
import { MESSAGE_TYPES, UPLOAD_FILE } from "@/lib/constants";
import apiClient from "@/lib/api-client";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const {
    selectedChatData,
    userInfo,
    selectedChatType,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    purpose: "",
    timeDuration: "",
  });

  const socket = useSocket();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        senderFirstName: userInfo.firstName,
        recipientFirstName: selectedChatData.firstName,
        content: message,
        recipient: selectedChatData._id,
        messageType: MESSAGE_TYPES.TEXT,
        audioUrl: undefined,
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        senderFirstName: userInfo.firstName,
        recipientFirstName: selectedChatData.firstName,
        content: message,
        messageType: MESSAGE_TYPES.TEXT,
        audioUrl: undefined,
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          const fileData = {
            sender: userInfo.id,
            content: undefined,
            messageType: MESSAGE_TYPES.FILE,
            audioUrl: undefined,
            fileUrl: response.data.filePath,
            recipient: selectedChatType === "contact" ? selectedChatData._id : undefined,
            channelId: selectedChatType === "channel" ? selectedChatData._id : undefined,
          };
          socket.emit(
            selectedChatType === "contact" ? "sendMessage" : "send-channel-message",
            fileData
          );
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log({ error });
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handlePaymentClick = () => setPaymentFormOpen(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const { name, email, purpose, timeDuration } = formData;
    emailjs
      .send(
        "service_et62cap",
        "template_bwda0x8",
        { email, name, purpose, timeDuration },
        "2VsnAhfuGdny4gP6m"
      )
      .then((response) => {
        console.log("Email sent successfully!", response.status, response.text);
        window.location.href = "https://rzp.io/rzp/9jZBPGr";
        setPaymentFormOpen(false);
        setFormData({ name: "", email: "", purpose: "", timeDuration: "" });
      })
      .catch((error) => {
        console.log("Failed to send email:", error);
      });
  };

  const handletermsback =() =>{
    navigate("/termsback");
  }

  
  
    return (
      <div className="w-full px-2 md:px-4">
        <div className="h-[10vh] bg-[#b6b6c0] flex justify-center items-center px-2 gap-2 mb-5">
          <div className="flex-1 flex items-center bg-[#41424b] rounded-md p-2 md:p-3 pr-4">
            <input
              type="text"
              className="flex-1 p-2 bg-transparent text-xs md:text-sm rounded-md focus:outline-none"
              placeholder="Enter message"
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyDown}
            />
            <button className="mx-1 md:mx-2 text-neutral-300" onClick={handlePaymentClick}>
              <FaRupeeSign className="text-base md:text-lg" />
            </button>
            <button className="mx-1 md:mx-2 text-neutral-300" onClick={handleAttachmentClick}>
              <GrAttachment className="text-base md:text-lg" />
            </button>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
            <div className="relative">
  <button className="mx-2 text-neutral-300" onClick={() => setEmojiPickerOpen(true)}>
    <RiEmojiStickerLine className="text-lg md:text-xl" />
  </button>
  {emojiPickerOpen && (
    <div
      className="absolute bottom-12 right-0 z-10 flex justify-center"
      ref={emojiRef}
    >
      <div
        style={{
          width: '250px', // Decreased width for the emoji picker
          margin: '0 auto', // Center the picker
        }}
      >
        <EmojiPicker
          theme="dark"
          onEmojiClick={handleAddEmoji}
          autoFocusSearch={false}
        />
      </div>
    </div>
  )}
</div>
</div>

          <button
            className="bg-[#23239c] p-2 md:p-3 text-white rounded-md hover:bg-[#1a1a5f] transition-all duration-300"
            onClick={handleSendMessage}
          >
            <IoSend className="text-base md:text-lg" />
          </button>
        </div>
  
        {paymentFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e1f29] p-6 rounded-lg shadow-xl w-full max-w-xs md:max-w-sm relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                onClick={() => setPaymentFormOpen(false)}
              >
                <IoClose className="text-xl md:text-2xl" />
              </button>
              <h3 className="text-white text-base md:text-lg font-semibold mb-4 text-center border-b border-gray-600 pb-2">
                Payment Details
              </h3>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="block w-full p-2 md:p-3 bg-[#2e2f3a] text-white rounded-md focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="block w-full p-2 md:p-3 bg-[#2e2f3a] text-white rounded-md focus:outline-none"
                />
                <input
                  type="text"
                  name="purpose"
                  placeholder="Purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  className="block w-full p-2 md:p-3 bg-[#2e2f3a] text-white rounded-md focus:outline-none"
                />
                <input
                  type="text"
                  name="timeDuration"
                  placeholder="Duration"
                  value={formData.timeDuration}
                  onChange={handleInputChange}
                  required
                  className="block w-full p-2 md:p-3 bg-[#2e2f3a] text-white rounded-md focus:outline-none"
                />
                <h3
                  className="flex justify-center font-bold text-blue-800 cursor-pointer"
                  onClick={handletermsback}
                >
                  Terms and conditions
                </h3>
                <button
                  type="submit"
                  className="bg-blue-600 text-white w-full py-2 md:py-3 rounded-md hover:bg-blue-800 transition-all duration-300"
                >
                  Submit Payment
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default MessageBar;
  