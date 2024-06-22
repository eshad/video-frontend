import React, { useEffect, useState } from "react";
import {
  getVideos,
  deleteVideos,
  updateClass,
  updateThumbnail,
} from "../services/videoService";

const classOptions = {
  1: "亚洲无码",
  2: "原创国产",
  3: "美女主播",
  4: "自拍偷拍",
  5: "制服诱惑",
  6: "卡通动漫",
  7: "换脸AI",
  8: "欧美精品",
  9: "同性恋区",
  14: "亚洲有码",
};

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [newClassid, setNewClassid] = useState({});
  const [newThumbnail, setNewThumbnail] = useState("");
  const [videoPlayerUrl, setVideoPlayerUrl] = useState("");
  const [videoPlayerVisible, setVideoPlayerVisible] = useState(false);
  const [videoPlayerSize, setVideoPlayerSize] = useState({
    width: 640,
    height: 360,
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchVideos();
  }, [page]);

  const fetchVideos = async () => {
    const response = await getVideos(page);
    setVideos(response.data.data);
  };

  const handleDelete = async () => {
    await deleteVideos(selectedVideos);
    setSelectedVideos([]);
    fetchVideos();
  };

  const handleClassChange = async (id, classid) => {
    await updateClass(id, classid);
    fetchVideos();
  };

  const handleNewClassidChange = (id, value) => {
    setNewClassid({
      ...newClassid,
      [id]: value,
    });
    // Automatically select the video when classid is changed
    setSelectedVideos((prevSelected) => {
      if (!prevSelected.includes(id)) {
        return [...prevSelected, id];
      }
      return prevSelected;
    });
  };

  const handleThumbnailChange = async (id) => {
    await updateThumbnail(id, newThumbnail);
    fetchVideos();
  };

  const handleBatchClassChange = async () => {
    await Promise.all(
      selectedVideos.map((id) => updateClass(id, newClassid[id])),
    );
    fetchVideos();
    setSuccessMessage("Class updated successfully.");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000); // Clear success message after 3 seconds
  };

  const toggleSelectAll = () => {
    if (selectedVideos.length === videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map((video) => video.id));
    }
  };

  const handleCheckboxChange = (id) => {
    if (selectedVideos.includes(id)) {
      setSelectedVideos(selectedVideos.filter((videoId) => videoId !== id));
      const updatedClassid = { ...newClassid };
      delete updatedClassid[id];
      setNewClassid(updatedClassid);
    } else {
      setSelectedVideos([...selectedVideos, id]);
    }
  };

  const playVideo = (url) => {
    setVideoPlayerUrl(url);
    setVideoPlayerVisible(true);
  };

  const stopVideo = () => {
    setVideoPlayerUrl("");
    setVideoPlayerVisible(false);
  };

  const handleResizeVideo = (width, height) => {
    setVideoPlayerSize({ width, height });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video List</h1>

      {videoPlayerVisible && (
        <div className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
          <iframe
            src={videoPlayerUrl}
            width={videoPlayerSize.width}
            height={videoPlayerSize.height}
            frameBorder="0"
            allowFullScreen
            title="Video Player"
          ></iframe>
          <div className="flex justify-end p-2">
            <button
              onClick={() => stopVideo()}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
            >
              Close Video
            </button>
            {videoPlayerUrl && (
              <div className="ml-2">
                <button
                  onClick={() => handleResizeVideo(640, 360)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Resize
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-4 flex justify-between">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
          disabled={selectedVideos.length === 0}
        >
          Delete Selected
        </button>
        <div className="flex items-center">
          <button
            onClick={handleBatchClassChange}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm mr-2 hover:bg-blue-600"
            disabled={
              selectedVideos.length === 0 ||
              Object.keys(newClassid).length === 0
            }
          >
            Change All Class
          </button>
        </div>
      </div>

      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {successMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              className="fill-current h-6 w-6 text-green-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              onClick={() => setSuccessMessage("")}
            >
              <title>Close</title>
              <path
                fillRule="evenodd"
                d="M2.293 2.293a1 1 0 011.414 0L10 8.586l6.293-6.293a1 1 0 111.414 1.414L11.414 10l6.293 6.293a1 1 0 01-1.414 1.414L10 11.414l-6.293 6.293a1 1 0 01-1.414-1.414L8.586 10 2.293 3.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-200 table-auto">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">
              <input
                type="checkbox"
                checked={selectedVideos.length === videos.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Thumbnail</th>
            <th className="py-2 px-4 border-b">Video</th>
            <th className="py-2 px-4 border-b">Upload Time</th>
            <th className="py-2 px-4 border-b">Class ID</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                <input
                  type="checkbox"
                  checked={selectedVideos.includes(video.id)}
                  onChange={() => handleCheckboxChange(video.id)}
                />
              </td>
              <td className="py-2 px-4 border-b">{video.title}</td>
              <td className="py-2 px-4 border-b">
                <img
                  src={`${video.thumb}`}
                  alt="thumbnail"
                  className="w-24 h-16 object-cover"
                />
                <div>
                  <input
                    type="text"
                    value={newThumbnail}
                    onChange={(e) => setNewThumbnail(e.target.value)}
                    placeholder="New Thumbnail URL"
                    className="border border-gray-300 rounded p-1 text-sm mt-2"
                  />
                  <button
                    onClick={() => handleThumbnailChange(video.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm mt-2 hover:bg-blue-600"
                  >
                    Change Thumbnail
                  </button>
                </div>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => playVideo(video.href)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2 hover:bg-green-600"
                >
                  Play
                </button>
                <button
                  onClick={stopVideo}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                  Stop
                </button>
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(video.addtime).toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b">
                <select
                  value={newClassid[video.id] || video.classid || ""}
                  onChange={(e) =>
                    handleNewClassidChange(video.id, e.target.value)
                  }
                  className="border border-gray-300 rounded p-1 text-sm"
                >
                  <option value="" disabled>
                    Select Class
                  </option>
                  {Object.entries(classOptions).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded text-sm mr-2 hover:bg-gray-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VideoList;