import { Button, TextInput } from "flowbite-react";
import { useAuth } from "../context/Auth";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../context/ToastContext";
import axios from "axios";
import Loader from "../components/Loader.component";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

const defaultProfile = "/temp/default.png";

const Profile = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [gender, setGender] = useState("male");
  const [phone, setPhone] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const fileRef = useRef(null);

  useEffect(() => {
    setProfileImage(user?.userImage || defaultProfile);
    setGender(user?.gender || "");
    setPhone(user?.phone || "");
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let imageUrl = profileImage;
      if (imageUrl && imageFile) {
        const formData = new FormData();
        formData.append("profileImage", imageFile);

        const res = await axios.post(
          `${BACKEND_URL}/api/v1/user/upload`,
          formData
        );
        imageUrl = res.data.imageUrl;
      }

      const profileData = {
        userId: user._id,
        userImage: imageUrl,
        gender,
        phone,
      };

      const profileResponse = await axios.put(
        `${BACKEND_URL}/api/v1/user/update`,
        profileData
      );
      console.log(profileResponse);
      setIsLoading(false);
      showToast(profileResponse.data.message, "success");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      showToast("Something went wrong", "error");
    }
  };

  const openFileDialog = () => {
    fileRef.current.click();
  };

  return (
    <>
      <h2 className="text-center pt-12 text-3xl text-gray-500 font-bold mb-8">
        Settings
      </h2>
      <form
        onSubmit={handleUpdateProfile}
        method="POST"
        className="flex flex-wrap gap-10 justify-center mt-10"
      >
        {isLoading && <Loader />}
        <div>
          <div className="flex flex-col justify-center items-center">
            <img
              src={profileImage}
              alt={profileImage}
              className="w-36 h-36 rounded-[50%]"
            />
            <input
              type="file"
              id="imageUpload"
              ref={fileRef}
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
            <Button color="gray" className="mt-2" onClick={openFileDialog}>
              Change Photo
            </Button>
          </div>
          <div className="p-5 border mt-8 rounded-xl shadow ">
            <p className="text-xl font-bold mb-4">Company Name</p>
            <TextInput
              id="companyName"
              placeholder=""
              type="text"
              value={user?.companyName.toUpperCase() || ""}
              readOnly
              required
              shadow
            />
          </div>
        </div>
        <div className="p-2 w-full max-w-md">
          <div className="border p-5 rounded-xl shadow">
            <p className="text-xl font-bold">Admin Name</p>
            <TextInput
              id="fullname"
              placeholder="fullname"
              type="text"
              className="mt-4"
              value={
                user?.adminName
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ") || ""
              }
              readOnly
              required
              shadow
            />
          </div>
          <div className="p-5 border mt-8 rounded-xl shadow">
            <p className="text-xl font-bold">Gender</p>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={gender === "male"}
                  id="male"
                  onChange={(e) => setGender(e.target.id)}
                />
                <label htmlFor="male">Male</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.id)}
                />
                <label htmlFor="female">Female</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="other"
                  checked={gender === "other"}
                  onChange={(e) => setGender(e.target.id)}
                />
                <label htmlFor="other">Other</label>
              </div>
            </div>
          </div>
          <div className="p-5 border mt-8 rounded-xl shadow ">
            <p className="text-xl font-bold mb-4">Email Address</p>
            <TextInput
              id="email"
              placeholder="youremail@email.com"
              type="email"
              value={user?.email || ""}
              readOnly
              required
              shadow
            />
          </div>
          <div className="p-5 border mt-8 rounded-xl shadow">
            <p className="text-xl mb-5 font-bold">Mobile Number</p>
            <TextInput
              id="phone"
              placeholder="+1234567890"
              type="number"
              value={phone || ""}
              onChange={(e) => setPhone(e.target.value)}
              pattern="^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$"
              title="Please enter a valid phone number format"
              required
              shadow
            />
          </div>
          <div className="flex gap-5">
            <Button
              color="green"
              type="submit"
              className="mt-10 mx-4 mb-20 lg:mx-0 lg:p-0"
            >
              Update Settings
            </Button>
            <Button color="red" className="mt-10 mx-4 mb-20 lg:mx-0 lg:p-0">
              Delete Account
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Profile;
