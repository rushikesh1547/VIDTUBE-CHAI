import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log("BODY 👉", req.body);
  console.log("FILES 👉", req.files);

  const { fullname, email, username, password } = req.body;

  // validation
  if (
    [fullname, username, email, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // ---------- FIX 1: validate avatar upload ----------
  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar || !avatar.url) {
      throw new ApiError(500, "Avatar upload failed");
    }

    console.log("Uploaded avatar", avatar);
  } catch (error) {
    console.log("Error uploading avatar", error);
    throw new ApiError(500, "failed to upload Avatar");
  }

  // ---------- FIX 2: upload cover image ONLY if exists ----------
  let coverImage = null;

  if (coverLocalPath) {
    coverImage = await uploadOnCloudinary(coverLocalPath);

    if (!coverImage || !coverImage.url) {
      throw new ApiError(500, "Cover image upload failed");
    }
  }

 try {
     const user = await User.create({
       fullname,
       avatar: avatar.url,                 // ✅ now safe
       coverImage: coverImage?.url || "",
       email,
       password,
       username: username.toLowerCase(),
     });
   
     const createdUser = await User.findById(user._id).select(
       "-password -refreshToken"
     );
   
     if (!createdUser) {
       throw new ApiError(
         500,
         "Something went wrong while registering a user"
       );
     }
   
     return res
       .status(201)
       .json(new ApiResponse(200, createdUser, "User registered successfully"));
 } catch (error) {
    console.log("User creation failed");
    if (avatar) {
        await deleteFromCloudinary(avatar.public_id)
    }
    if (coverImage) {
        await deleteFromCloudinary(coverImage.public_id)
    }   
    throw new ApiError(
         500,
         "Something went wrong while registering a user and images were deleted"
       );    
 }
});

export { registerUser };
