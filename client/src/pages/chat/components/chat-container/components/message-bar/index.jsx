import { IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { useAppStore } from "@/store";
import { useSocket } from "@/contexts/SocketContext";
import { MESSAGE_TYPES, UPLOAD_FILE } from "@/lib/constants";
import apiClient from "@/lib/api-client";
import emailjs from 'emailjs-com';


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
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    purpose: '',
    timeDuration: ''
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
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission behavior
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
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: MESSAGE_TYPES.FILE,
              audioUrl: undefined,
              fileUrl: response.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: MESSAGE_TYPES.FILE,
              audioUrl: undefined,
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log({ error });
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePaymentClick = () => {
    setPaymentFormOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const { name, email, purpose, timeDuration } = formData;

    emailjs.send('service_et62cap', 'template_bwda0x8', { 
        email, 
        name, 
        purpose, 
        timeDuration 
    }, '2VsnAhfuGdny4gP6m')
      .then((response) => {
          console.log('Email sent successfully!', response.status, response.text);
          window.location.href = 'https://rzp.io/rzp/9jZBPGr';

          setPaymentFormOpen(false);
          setFormData({ name: '', email: '', purpose: '', timeDuration: '' }); // Reset form
      })
      .catch((error) => {
          console.log('Failed to send email:', error);
      });
  };

  return (
    <div>
      <div className="h-[10vh] bg-[#b6b6c0] flex justify-center items-center px-8 gap-6 mb-5">
        <div className="flex-1 flex bg-[#41424b] rounded-md items-center gap-5 pr-4">
          <input
            type="text"
            className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
            placeholder="Enter message"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown} // Add key down event listener
          />
          <button
            className="text-neutral-300 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
            onClick={handlePaymentClick}
          >
            <FaRupeeSign className="text-2xl" />
          </button>
          <button
            className="text-neutral-300 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
            onClick={handleAttachmentClick} // Trigger the file input click
          >
            <GrAttachment className="text-2xl" />
          </button>
          <input
            type="file"
            className="hidden" // Hide the file input element
            ref={fileInputRef}
            onChange={handleAttachmentChange} // Handle file selection
          />
          <div className="relative">
            <button
              className="text-neutral-300 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
              onClick={() => setEmojiPickerOpen(true)}
            >
              <RiEmojiStickerLine className="text-2xl " />
            </button>
            <div className="absolute bottom-16 right-0" ref={emojiRef}>
              <EmojiPicker
                theme="dark"
                open={emojiPickerOpen}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          </div>
        </div>
        <button
          className="bg-[#23239c] rounded-md flex items-center justify-center p-4 gap-2 focus:border-none focus:outline-none hover:bg-[#1a1a5f] focus:bg-[#1a1a60] transition-all duration-300"
          onClick={handleSendMessage}
        >
          <IoSend className="text-white text-2xl" />
        </button>
      </div>

      {/* Payment Form Pop-Up */}
     
{paymentFormOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-[#1e1f29] p-6 rounded-lg shadow-xl w-96 relative">
      <h3 className="text-white text-lg font-semibold mb-4 text-center border-b border-gray-600 pb-2">Payment Details</h3>
      
      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="block w-full p-3 bg-[#2e2f3a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="block w-full p-3 bg-[#2e2f3a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="amount"
          name="amount"
          value={userInfo.amount}
          disabled
          className="block w-full p-3 bg-[#2e2f3a] text-gray-400 rounded-md focus:outline-none cursor-not-allowed"
        />

        <input
          type="text"
          name="purpose"
          placeholder="Purpose"
          value={formData.purpose}
          onChange={handleInputChange}
          required
          className="block w-full p-3 bg-[#2e2f3a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          name="timeDuration"
          placeholder="Time Duration"
          value={formData.timeDuration}
          onChange={handleInputChange}
          required
          className="block w-full p-3 bg-[#2e2f3a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="w-full mr-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-semibold py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Proceed
          </button>
          <button
            type="button"
            onClick={() => setPaymentFormOpen(false)}
            className="w-full ml-2 text-red-500 font-semibold py-3 border border-red-500 rounded-md hover:bg-red-600 hover:text-white transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default MessageBar;
