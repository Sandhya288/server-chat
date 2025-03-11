import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { useAppStore } from "@/store";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/lib/constants";
import apiClient from "@/lib/api-client";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import { ScrollArea } from "@/components/ui/scroll-area";

const NewDM = () => {
  const [searchedContacts, setsearchedContacts] = useState([]);
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const { setSelectedChatType, setSelectedChatData } = useAppStore();

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setsearchedContacts(response.data.contacts);
        }
      } else setsearchedContacts([]);
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setsearchedContacts([]);
  };

  const handleRequestContact = async (contact) => {
    try {
      const response = await apiClient.post(
        `${HOST}/api/send-request`, // Correct backend route
        { recipientId: contact._id }, // Send the recipientId correctly
        { 
          withCredentials: true, // Ensure cookies are sent if needed
          headers: { 'Content-Type': 'application/json' } // Send content type as JSON
        }
      );
      if (response.status === 200) {
        alert(`Request sent to ${contact.firstName}`);
      }
    } catch (error) {
      console.error("Failed to send request:", error);
      alert("Failed to send request. Please try again.");
    }
  };
  
  

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className=" text-neutral-800 font-light text-opacity-90 text-sm hover:text-neutral-700 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[300px] flex flex-col">
          <DialogDescription className="hidden">
            Please select a contact
          </DialogDescription>
          <DialogHeader>
            <DialogTitle>Select a contact</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  className="flex gap-3 items-center cursor-pointer"
                  key={contact.id}
                  onClick={() => selectNewContact(contact)}
                >
                  <div className="w-12 h-12 relative">
                    <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="object-cover w-full h-full bg-black rounded-full"
                        />
                      ) : (
                        <div
                          className={`uppercase w-12 h-12 text-lg border-[1px] ${getColor(
                            contact.color
                          )} flex items-center justify-center rounded-full`}
                        >
                          {contact.firstName
                            ? contact.firstName.charAt(0)
                            : contact.email.charAt(0)}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span>{contact.firstName}</span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                  {/* Add Request Button */}
                  <button
                    className="text-blue-500 hover:underline text-sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents triggering selectNewContact
                      handleRequestContact(contact);
                    }}
                  >
                    Request
                  </button>
                </div>
              ))}

              {searchedContacts.length <= 0 && (
                <div className="flex-1 md:flex mt-5 flex-col justify-center items-center hidden duration-1000 transition-all">
                  <Lottie
                    isClickToPauseDisabled={true}
                    options={animationDefaultOptions}
                    height={100}
                    width={100}
                  />
                  <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-1000 text-center">
                    <h3 className="poppins-medium">
                      Hi
                      <span className="text-purple-500">!</span> Search new
                      <span className="text-purple-500"> Contact. </span>
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
