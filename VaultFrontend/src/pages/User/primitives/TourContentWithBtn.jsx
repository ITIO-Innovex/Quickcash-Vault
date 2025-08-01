import React, { useState } from "react";

export default function TourContentWithBtn({ message, isChecked, video }) {
  
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = () => {
    setIsCheck(!isCheck);
    if (isChecked) {
      isChecked(!isCheck);
    }
  };
  return (
    <div>
      <p className="p-1 md:p-0">{message}</p>
      {video && (
        <div className="flex items-center justify-center w-full md:h-[300px] my-[10px] border-[1.3px] border-gray-400 rounded-sm">
          <iframe
            className="w-full h-full"
            src={video}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )}
      <label className="flex items-center justify-center mt-3 mb-0">
        <input
          type="checkbox"
          className="op-checkbox op-checkbox-xs mr-1"
          checked={isCheck}
          onChange={handleCheck}
        />
        <span className="#787878 text-[12px]">{("tour-content")}</span>
      </label>
    </div>
  );
}
