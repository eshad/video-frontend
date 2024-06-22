import React from "react";

const VideoModal = ({ url, onClose, size, onResize, playing, setPlaying }) => {
  const handleResize = (width, height) => {
    onResize(width, height);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div
        className="relative rounded-lg overflow-hidden"
        style={{ width: size.width, height: size.height }}
      >
        <button
          className="absolute top-0 right-0 m-2 p-2 text-white bg-gray-800 rounded-full hover:bg-gray-600"
          onClick={() => {
            setPlaying(false); // Close modal and stop video
            onClose();
          }}
        >
          X
        </button>
        {playing ? (
          <video
            controls
            autoPlay
            className="w-full h-full"
            src={url}
            //style={{ filter: "blur(8px)" }}
          />
        ) : (
          <div className="flex justify-center items-center w-full h-full bg-black text-white">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
              onClick={() => setPlaying(true)}
            >
              Play Video
            </button>
          </div>
        )}
        <div className="absolute bottom-0 right-0 m-2 p-2 bg-gray-800 text-white rounded">
          <button
            className="mr-2 px-2 py-1 rounded bg-blue-500 hover:bg-blue-600"
            onClick={() => handleResize(640, 360)}
          >
            Small
          </button>
          <button
            className="mr-2 px-2 py-1 rounded bg-blue-500 hover:bg-blue-600"
            onClick={() => handleResize(1280, 720)}
          >
            Medium
          </button>
          <button
            className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-600"
            onClick={() => handleResize(1920, 1080)}
          >
            Large
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
