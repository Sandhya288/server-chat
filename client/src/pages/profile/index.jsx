import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFLE_ROUTE,
} from "@/lib/constants";
import { useState, useRef, useEffect } from "react";
import { FaPlus, FaTrash, FaFacebook, FaInstagram, FaGithub, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IoArrowBack } from "react-icons/io5";
import { colors } from "@/lib/utils"; // Ensure this imports the colors array

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [github, setGithub] = useState("");
  const [email, setEmail] = useState("");
  const [twitter, setTwitter] = useState("");
  const [amount, setAmount] = useState(0);
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(0); // Default to the first color

  const[bankaccountholder , setBankaccountholder] = useState("");
  const[accountno , setAccountno] = useState("");
  const[ifscno , setIfscno] = useState("");
  const[bankname , setBankname] = useState("");
  const[upiid , setUpiid] = useState("");

  const [project1, setproject1] = useState("");
  const [project2, setproject2] = useState("");

  const [home, setHome] = useState("");
  const [about, setAbout] = useState("");
  const [services, setServices] = useState("");
  const [features, setFeatures] = useState("");

  /*
                    bankaccountholder,
                    accountno,
                    ifscno,
                    bankname,
                    upiid,




  */ 

                    const [selectedLink, setSelectedLink] = useState('');

                    // State variable for the search input
                    const [searchTerm, setSearchTerm] = useState('');
                  
                    // State variable to control dropdown visibility
                    const [isOpen, setIsOpen] = useState(false);
                  
                    // Define the links and their names
                    const links = [
                      { name: 'Doctors', url: 'https://www.google.com' },
                      { name: 'Sales persons', url: 'https://www.facebook.com' },
                      { name: 'Engineers', url: 'https://www.twitter.com' },
                      { name: 'Developers', url: 'https://www.linkedin.com' },
                      { name: 'Astroligists', url: 'https://www.github.com' },
                    ];
                  
                    // Function to handle link selection
                    const handleLinkChange = (url) => {
                      setSelectedLink(url);
                      setSearchTerm(''); // Clear the search term when a link is selected
                      setIsOpen(false); // Close the dropdown when a link is selected
                    };
                  
                    // Function to filter links based on the search term
                    const filteredLinks = searchTerm
                      ? links.filter(link =>
                          link.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                      : links; // Show all links if there's no search term
                  
                    // Function to toggle dropdown visibility
                    const toggleDropdown = () => {
                      setIsOpen(!isOpen);
                    };


  useEffect(() => {
    // Populate user info if available
    if (userInfo.profileSetup) {
      setEmail(userInfo.email || "");
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setAboutMe(userInfo.aboutMe || "");
      setAmount(userInfo.amount || 0) // Fetch from userInfo
      setFacebook(userInfo.facebook || ""); // Fetch from userInfo
      setInstagram(userInfo.instagram || ""); // Fetch from userInfo
      setGithub(userInfo.github || ""); // Fetch from userInfo
      setTwitter(userInfo.twitter || ""); // Fetch from userInfo
      setSelectedColor(userInfo.color || 0);

      setBankaccountholder(userInfo.bankaccountholder|| ""); // Fetch from userInfo
      setAccountno(userInfo.accountno || ""); // Fetch from userInfo
      setIfscno(userInfo.ifscno|| ""); // Fetch from userInfo
      setBankname(userInfo.bankname|| ""); // Fetch from userInfo
      setUpiid(userInfo.upiid|| "");

      setproject1(userInfo.project1|| "");
      setproject2(userInfo.project2|| "");

      setHome(userInfo.home|| "");
      setAbout(userInfo.about|| "");
      setServices(userInfo.services|| "");
      setFeatures(userInfo.features|| "");

    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is Required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFLE_ROUTE,
          {
            firstName,
            lastName,
            aboutMe,
            amount,
            facebook,
            instagram,
            github,
            twitter,
            color: selectedColor,
            bankaccountholder,
                    accountno,
                    ifscno,
                    bankname,
                    upiid,

                    project1,
                    project2,
                    home,about,services,features,
          },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile Updated Successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image });
        toast.success("Image updated successfully.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image Removed Successfully.");
        setImage(undefined);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile.");
    }
  };

 

  return (
    <div className="bg-[#e7e7ec] min-h-screen flex items-center justify-center flex-col gap-10">
      <div className="w-full md:w-[80vw] max-w-md flex flex-col gap-5 p-5">
        <div>
          <IoArrowBack
            className="text-4xl lg:text-6xl text-black text-opacity-90 cursor-pointer"
            onClick={handleNavigate}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl ${colors[selectedColor]} text-[#ff006e] border-[1px] border-[#ff006faa] flex items-center justify-center`}
                >
                  {firstName[0]}
                  {lastName[0]}
                </div>
              )}
            </Avatar>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            {hovered && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 flex gap-2">
                <Button
                  onClick={handleFileInputClick}
                  className="bg-[#ff006e] hover:bg-[#e60068] transition-all duration-200"
                >
                  <FaPlus className="mr-2" /> Add Image
                </Button>
                <Button
                  onClick={handleDeleteImage}
                  className="bg-[#ff006e] hover:bg-[#e60068] transition-all duration-200"
                >
                  <FaTrash className="mr-2" /> Remove Image
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-5">
            <div className="text-black text-opacity-80">{email}</div>
            <Input
              placeholder="First Name"
              type="text"
              className="rounded-lg p-3 bg-[#afafb4] border-none flex-1 text-black"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              type="text"
              className="rounded-lg p-3 bg-[#afafb4] border-none flex-1 text-black"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
             <Input
              placeholder="Amount"
              type="text"
              className="rounded-lg p-3 bg-[#afafb4] border-none flex-1 text-black"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <textarea
  placeholder="About Me"
  className="rounded-lg p-4 bg-[#afafb4] border-none text-black resize-none"
  value={aboutMe}
  onChange={(e) => setAboutMe(e.target.value)}
  style={{
    whiteSpace: "pre-wrap",   // Preserve white space and wrap lines
    overflow: "auto",         // Add scroll if the content overflows
    width: "100%",            // Set to 100% to fill available container width
    height: "200px",          // Adjust height as needed
  }}
/>

<Input
            placeholder="Project 1 URL"
            type="text"
            className="rounded-lg p-4 bg-[#afafb4] border-none flex-1 text-black"
            value={project1}
            onChange={(e) => setproject1(e.target.value)}
          />

<Input
            placeholder=" Project 2 URL"
            type="text"
            className="rounded-lg p-4 bg-[#afafb4] border-none flex-1 text-black"
            value={project2}
            onChange={(e) => setproject2(e.target.value)}
          />

          </div>
        </div>

        <div className="flex flex-col gap-4">
      <h2 htmlFor="link-search" className="text-black">
        BUSSINESS CONNECT:
      </h2>
      
      <div>
        <button
          onClick={toggleDropdown}
          className="rounded-lg p-3 bg-[#afafb4] text-black mb-2 w-full text-left"
        >
          {selectedLink ? selectedLink : 'Connect Now'}
        </button>

        {isOpen && (
          <div className="relative">
            <input
              type="text"
              id="link-search"
              placeholder="Search..."
              value={searchTerm}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg p-3 bg-[#afafb4] border-none text-black mb-2 w-full"
            />
            {filteredLinks.length > 0 ? (
              <ul className="absolute bg-[#afafb4] rounded-lg z-10 w-full max-h-40 overflow-y-auto">
                {filteredLinks.map(link => (
                  <li
                    key={link.name}
                    className="p-2 hover:bg-gray-700 cursor-pointer text-black" // Set text color to white
                    onClick={() => handleLinkChange(link.url)}
                  >
                    {link.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black">No links found.</p>
            )}
          </div>
        )}
      </div>

      {selectedLink && (
        <div className="mt-4">
          <a href={selectedLink} target="_blank" rel="noopener noreferrer" className="text-blue-400">
            Go to {selectedLink}
          </a>
        </div>
      )}
    </div>


        <div className="flex items-center w-full">
          <Input
            placeholder="Facebook URL"
            type="text"
            className="rounded-lg p-4 bg-[#afafb4] border-none flex-1 text-black"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
          {facebook && <FaFacebook className="text-2xl ml-2 text-[#3b5998]" />}
        </div>
        <div className="flex items-center w-full">
          <Input
            placeholder="Instagram URL"
            type="text"
            className="rounded-lg p-4 bg-[#afafb4] border-none flex-1 text-black"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
          {instagram && <FaInstagram className="text-2xl ml-2 text text-[#E1306C]" />}
        </div>
        <div className="flex items-center w-full">
          <Input
            placeholder="GitHub URL"
            type="text"
            className="rounded-lg p-4 bg-[#afafb4] border-none flex-1 text-black"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
          {github && <FaGithub className="text-2xl ml-2 text-[#333]" />}
        </div>
        <div className="flex items-center w-full">
          <Input
            placeholder="Twitter URL"
            type="text"
            className="rounded-lg p-4 bg-[#afafb4] border-none flex-1 text-black"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
          {twitter && <FaWhatsapp className="text-2xl ml-2 text-[#1DA1F2]" />}
        </div>

        <h2 className=" flex  text-black mt-3"> ADD ACCOUNT: </h2>

<div className="flex items-center w-full">
  <Input
    placeholder="Bank Account Holder Name"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none flex-1 text-black"
    value={bankaccountholder}
    onChange={(e) => setBankaccountholder(e.target.value)}
  />
</div>

<div className="flex items-center w-full">
  <Input
    placeholder="Bank Account Number"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none flex-1 text-black"
    value={accountno}
    onChange={(e) => setAccountno(e.target.value)}
  />
</div>

<div className="flex items-center w-full">
  <Input
    placeholder="IFSC Code"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none flex-1 text-black"
    value={ifscno}
    onChange={(e) => setIfscno(e.target.value)}
  />
</div>

<div className="flex items-center w-full">
  <Input
    placeholder="Bank Name"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none flex-1 text-black"
    value={bankname}
    onChange={(e) => setBankname(e.target.value)}
  />
</div>

<h4 className=" flex justify-center items-center text-black"> OR </h4>

<div className="flex items-center w-full">
  <Input
    placeholder="UPI ID"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none flex-1 text-black"
    value={upiid}
    onChange={(e) => setUpiid(e.target.value)}
  />
</div>

<h2 className=" flex  text-black mt-3"> Terms and Conditions</h2>

<div className="flex items-center w-full">
<textarea
  placeholder="Home"
  className="rounded-lg p-4 bg-[#afafb4] border-none text-black resize-none"
  value={home}
  onChange={(e) => setHome(e.target.value)}
  style={{
    whiteSpace: "pre-wrap",   // Preserve white space and wrap lines
    overflow: "auto",         // Add scroll if the content overflows
    width: "100%",            // Set to 100% to fill available container width
    height: "150px",          // Adjust height as needed
  }}
/>
</div>

<div className="flex items-center w-full">
<textarea
  placeholder="About"
  className="rounded-lg p-4 bg-[#afafb4] border-none text-black resize-none"
  value={about}
  onChange={(e) => setAbout(e.target.value)}
  style={{
    whiteSpace: "pre-wrap",   // Preserve white space and wrap lines
    overflow: "auto",         // Add scroll if the content overflows
    width: "100%",            // Set to 100% to fill available container width
    height: "150px",          // Adjust height as needed
  }}
/>
</div>

<div className="flex items-center w-full">
<textarea
  placeholder="Services"
  className="rounded-lg p-4 bg-[#afafb4] border-none text-black resize-none"
  value={services}
  onChange={(e) => setServices(e.target.value)}
  style={{
    whiteSpace: "pre-wrap",   // Preserve white space and wrap lines
    overflow: "auto",         // Add scroll if the content overflows
    width: "100%",            // Set to 100% to fill available container width
    height: "150px",          // Adjust height as needed
  }}
/>
</div>

<div className="flex items-center w-full">
<textarea
  placeholder="Features"
  className="rounded-lg p-4 bg-[#afafb4] border-none text-black resize-none"
  value={features}
  onChange={(e) => setFeatures(e.target.value)}
  style={{
    whiteSpace: "pre-wrap",   // Preserve white space and wrap lines
    overflow: "auto",         // Add scroll if the content overflows
    width: "100%",            // Set to 100% to fill available container width
    height: "150px",          // Adjust height as needed
  }}
/>
</div>



        <Button
          onClick={saveChanges}
          className="bg-[#ff006e] hover:bg-[#e60068] transition-all duration-200"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;

