import axios from "axios";

const API_URL = "http://13.215.46.117:81/api";

export const getVideos = (page = 1) => {
  return axios.get(`${API_URL}/videos?page=${page}`);
};

export const uploadVideos = (videos, images, classid) => {
  const formData = new FormData();
  videos.forEach((video) => formData.append("videos[]", video));
  images.forEach((image) => formData.append("images[]", image));
  formData.append("classid", classid);

  return axios.post(`${API_URL}/videos`, formData);
};

export const deleteVideos = (ids) => {
  return axios.delete(`${API_URL}/videos`, { data: { ids } });
};

export const updateClass = (id, classid) => {
  return axios.get(`${API_URL}/videos/${id}/class`, {
    params: { classid },
  });
};

//export const updateThumbnail = async (videoId, thumbnailUrl) => {
  export const updateThumbnail = async (thumb, file) => {
  
  const formData = new FormData();
  formData.append("thumbnail", file);
  formData.append("thumb", thumb);

  try {
    const response = await axios.post(
      `${API_URL}/videos/thumbnail`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error uploading thumbnail:", error);
    throw error;
  }
};

// New function for uploading thumbnail file
export const uploadThumbnail = async (videoId, file) => {
  const formData = new FormData();
  formData.append("id", videoId);
  formData.append("thumbnail", file);

  try {
    const response = await axios.post(`${API_URL}/videos/updateThumbnail`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading thumbnail:", error);
    throw error;
  }
};
