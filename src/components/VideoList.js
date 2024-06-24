import React, { useEffect, useState } from "react";
import {
  getVideos,
  deleteVideos,
  updateClass,
  getAllVideos,
  updateThumbnail,
} from "../services/videoService";
import VideoModal from "./Modal/VideoModal";
import { PlayIcon } from "@heroicons/react/outline";
import Modal from "react-modal";

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
  const [allVideos, setAllVideos] = useState([]); // Store current page's videos
  const [videos, setVideos] = useState([]); // Store all videos
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [newClassid, setNewClassid] = useState({});
  const [videoPlayerUrl, setVideoPlayerUrl] = useState("");
  const [videoPlayerVisible, setVideoPlayerVisible] = useState(false);
  const [videoPlayerSize, setVideoPlayerSize] = useState({
    width: 640,
    height: 360,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [playing, setPlaying] = useState(false);
  const [newThumbnailFiles, setNewThumbnailFiles] = useState({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVideos(currentPage);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchAllVideos();
  }, []);

  const fetchAllVideos = async () => {
    try {
      const response = await getAllVideos();
      setVideos(response.data);
    
    } catch (error) {
      console.error("Error fetching all videos:", error);
      // Handle error as needed
    }
  };

  const fetchVideos = async (page) => {
    try {
      const response = await getVideos(page);
      const { data, total_pages } = response.data;

      if (page === 1) {
        setAllVideos(data);
      } else {
        setAllVideos((prevVideos) => [...prevVideos, ...data]);
      }

      setTotalPages(total_pages);
    } catch (error) {
      console.error(`Error fetching videos for page ${page}:`, error);
      // Handle error as needed
    }
  };

 // const filterVideos = () => {
 //   const normalizedSearch = searchQuery.toLowerCase().trim();
 //   return videos.filter((video) =>
 //     video.title.toLowerCase().includes(normalizedSearch)
 //   );
 // };
  const filterVideos = () => {
    //console.log(videos)
    if(searchQuery){
      return videos.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    else{
      return allVideos.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

    }
};

  const handleDelete = async () => {
    await deleteVideos(selectedVideos);
    setSelectedVideos([]);
    fetchVideos(currentPage);
  };

  const handleClassChange = async (id, classid) => {
    await updateClass(id, classid);
    fetchVideos(currentPage);
  };

  const handleNewClassidChange = (id, value) => {
    setNewClassid({
      ...newClassid,
      [id]: value,
    });
    setSelectedVideos((prevSelected) => {
      if (!prevSelected.includes(id)) {
        return [...prevSelected, id];
      }
      return prevSelected;
    });
  };

  const handleBatchClassChange = async () => {
    await Promise.all(
      selectedVideos.map((id) => updateClass(id, newClassid[id]))
    );
    fetchVideos(currentPage);
    setSuccessMessage("Class updated successfully.");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const toggleSelectAll = () => {
    if (selectedVideos.length === allVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(allVideos.map((video) => video.id));
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

  const handleThumbnailChange = async (thumb) => {
    const file = newThumbnailFiles[thumb];
    if (!file) {
      console.error("No file selected for thumbnail update.");
      return;
    }

    await updateThumbnail(thumb, file);
    fetchVideos(currentPage);
    setSuccessMessage("Cover page updated successfully.");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleThumbnailFileChange = (thumb, file) => {
    setNewThumbnailFiles({
      ...newThumbnailFiles,
      [thumb]: file,
    });
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredVideos = filterVideos();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">视频列表</h1>

      <div className="mb-4 flex justify-between">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
          disabled={selectedVideos.length === 0}
        >
          删除所选
        </button>
        <div className="flex items-center">
          <button
            onClick={handleBatchClassChange}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm mr-2 hover:bg-blue-600"
            disabled={
              selectedVideos.length === 0 || Object.keys(newClassid).length === 0
            }
          >
            更改所有类别
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
                d="M9 18a9 9 0 100-18 9 9 0 000 18zm0-2a7 7 0 110-14 7 7 0 010 14zM8 9a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      )}

      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索视频标题..."
          className="border border-gray-300 rounded p-2 w-[20%]"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400 absolute right-3 top-3 cursor-pointer"
          viewBox="0 0 20 20"
          fill="currentColor"
          onClick={() => setSearchQuery("")}
        >
          <path
            fillRule="evenodd"
            d="M9 18a9 9 0 100-18 9 9 0 000 18zm0-2a7 7 0 110-14 7 7 0 010 14zM8 9a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <table className="min-w-full bg-white border-gray-200 table-auto">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">
              <input
                type="checkbox"
                checked={selectedVideos.length === filteredVideos.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="py-2 px-4 border-b">标题</th>
            <th className="py-2 px-4 border-b">缩略图</th>
            <th className="py-2 px-4 border-b">视频</th>
            <th className="py-2 px-4 border-b">上传时间</th>
            <th className="py-2 px-4 border-b">班级名称</th>
          </tr>
        </thead>
        <tbody>
          {filteredVideos.map((video) => (
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
                  className="w-32 h-24 object-cover cursor-pointer"
                  onClick={() => openImageModal(video.thumb)}
                />
                <div>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleThumbnailFileChange(video.thumb, e.target.files[0])
                    }
                    className="border border-gray-300 rounded p-1 text-sm mt-2"
                  />
                  <button
                    onClick={() => handleThumbnailChange(video.thumb)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm mt-2 hover:bg-blue-600"
                  >
                    更改封面
                  </button>
                </div>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => playVideo(video.href)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2 hover:bg-green-600 flex items-center"
                >
                  <PlayIcon className="w-5 h-5 mr-1" /> 播放
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
                    选择类别
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
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded text-sm mr-2 hover:bg-gray-600 disabled:bg-gray-300"
        >
          上一页
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 disabled:bg-gray-300"
        >
          下一页
        </button>
      </div>

      {videoPlayerUrl && (
        <VideoModal
          url={videoPlayerUrl}
          onClose={stopVideo}
          size={videoPlayerSize}
          playing={playing}
          setPlaying={setPlaying}
        />
      )}

      <Modal
        isOpen={isImageModalOpen}
        onRequestClose={closeImageModal}
        contentLabel="Thumbnail Image"
        className="flex items-center justify-center"
      >
        <div className="bg-black p-4 rounded-lg shadow-lg">
          <img
            src={selectedImage}
            alt="thumbnail"
            className="max-w-[80%] max-h-[60%]"
          />
          <button
            onClick={closeImageModal}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm mt-2 hover:bg-red-600"
          >
            关闭
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default VideoList;
