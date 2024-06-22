import axios from "axios";

const API_URL = "http://video.api/api";

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
export const updateThumbnail = async (videoId, thumbnailUrl) => {
  try {
    const response = await axios.put(`${API_URL}/videos/${videoId}/thumbnail`, {
      thumbnailUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating video thumbnail:", error);
    throw error;
  }
};
