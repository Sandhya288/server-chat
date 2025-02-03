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
    <div className="bg-[#e7e7ec] min-h-screen flex flex-col gap-10 p-5">
  <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
        <div>
          <IoArrowBack
            className="text-3xl lg:text-4xl text-black text-opacity-90 cursor-pointer"
            onClick={handleNavigate}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
             <div className="flex justify-center">
  <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
    {image ? (
      <AvatarImage
        src={image}
        alt="profile"
        className="object-cover w-full h-full bg-black"
      />
    ) : (
      <div
        className="uppercase h-32 w-32 md:w-48 md:h-48 text-5xl flex items-center justify-center bg-gray-300 text-[#ff006e]"
      >
        {firstName[0]}
        {lastName[0]}
      </div>
    )}
  </Avatar>
</div>
            
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
          <div className="grid grid-cols-3 gap-4 p-5 w-full">
  {/* Email */}
  <div className="col-span-3 text-black text-opacity-80">{email}</div>

  {/* First Name, Amount, Last Name */}
  <Input
    placeholder="First Name"
    type="text"
    className="rounded-lg p-3 bg-[#afafb4] border-none text-black w-full col-span-1"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
  />
 
  <Input
    placeholder="Email"
    type="text"
    className="rounded-lg p-3 bg-[#afafb4] border-none text-black w-full col-span-1"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
  />
   <Input
    placeholder="Amount"
    type="text"
    className="rounded-lg p-3 bg-[#afafb4] border-none text-black w-full col-span-1"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
  />

  {/* About Me */}
  <textarea
    placeholder="About Me"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black resize-none w-full col-span-3"
    value={aboutMe}
    onChange={(e) => setAboutMe(e.target.value)}
    style={{
      whiteSpace: "pre-wrap",
      overflow: "auto",
      height: "200px",
    }}
  />

  {/* Project URLs */}
  <Input
    placeholder="Project 1 URL"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black w-full col-span-3"
    value={project1}
    onChange={(e) => setproject1(e.target.value)}
  />
  <Input
    placeholder="Project 2 URL"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black w-full col-span-3"
    value={project2}
    onChange={(e) => setproject2(e.target.value)}
  />

  {/* Social URLs */}
  <Input
    placeholder="Facebook URL"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black w-full col-span-3"
    value={facebook}
    onChange={(e) => setFacebook(e.target.value)}
  />
  <Input
    placeholder="Instagram URL"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black w-full col-span-3"
    value={instagram}
    onChange={(e) => setInstagram(e.target.value)}
  />
  <Input
    placeholder="GitHub URL"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black w-full col-span-3"
    value={github}
    onChange={(e) => setGithub(e.target.value)}
  />
  <Input
    placeholder="Twitter URL"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black w-full col-span-3"
    value={twitter}
    onChange={(e) => setTwitter(e.target.value)}
  />

  {/* Bank Account Details */}
  <Input
    placeholder="Bank Account Holder Name"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black w-full col-span-3"
    value={bankaccountholder}
    onChange={(e) => setBankaccountholder(e.target.value)}
  />
  <Input
    placeholder="Bank Account Number"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black w-full col-span-3"
    value={accountno}
    onChange={(e) => setAccountno(e.target.value)}
  />
  <Input
    placeholder="IFSC Code"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black w-full col-span-3"
    value={ifscno}
    onChange={(e) => setIfscno(e.target.value)}
  />
  <Input
    placeholder="Bank Name"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black w-full col-span-3"
    value={bankname}
    onChange={(e) => setBankname(e.target.value)}
  />
  <Input
    placeholder="UPI ID"
    type="text"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black w-full col-span-3"
    value={upiid}
    onChange={(e) => setUpiid(e.target.value)}
  />

  {/* Terms and Conditions */}
  <textarea
    placeholder="Home"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black resize-none w-full col-span-3"
    value={home}
    onChange={(e) => setHome(e.target.value)}
    style={{
      whiteSpace: "pre-wrap",
      overflow: "auto",
      height: "150px",
    }}
  />
  <textarea
    placeholder="About"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black resize-none w-full col-span-3"
    value={about}
    onChange={(e) => setAbout(e.target.value)}
    style={{
      whiteSpace: "pre-wrap",
      overflow: "auto",
      height: "150px",
    }}
  />
  <textarea
    placeholder="Services"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black resize-none w-full col-span-3"
    value={services}
    onChange={(e) => setServices(e.target.value)}
    style={{
      whiteSpace: "pre-wrap",
      overflow: "auto",
      height: "150px",
    }}
  />
  <textarea
    placeholder="Features"
    className="rounded-lg p-4 bg-[#afafb4] border-none text-black resize-none w-full col-span-3"
    value={features}
    onChange={(e) => setFeatures(e.target.value)}
    style={{
      whiteSpace: "pre-wrap",
      overflow: "auto",
      height: "150px",
    }}
  />
</div>


</div>


        <div className="flex justify-end items-end w-full mt-auto">
  <Button
    onClick={saveChanges}
    className="bg-[#ff006e] hover:bg-[#e60068] transition-all duration-200 w-40"
  >
    Save Changes
  </Button>
</div>

      </div>
    </div>
  );
};

export default Profile;

