import React, { useState } from "react";
import { uploadVideos } from "../services/videoService";

const VideoUpload = () => {
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [classid, setClassid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVideoChange = (e) => {
    setVideos(Array.from(e.target.files));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (videos.length !== images.length) {
      setMessage("Please upload the same number of videos and images.");
      return;
    }
    setUploading(true);
    setMessage("");

    try {
      await uploadVideos(videos, images, classid);
      setMessage("Upload successful!");
      setVideos([]);
      setImages([]);
      setClassid("");
    } catch (error) {
      setMessage("Error uploading files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload Videos</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Videos:</label>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoChange}
          />
        </div>
        <div>
          <label>Images:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <label>Class ID:</label>
          <input
            type="text"
            value={classid}
            onChange={(e) => setClassid(e.target.value)}
            placeholder="Class ID"
            required
          />
        </div>
        <div>
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VideoUpload;
