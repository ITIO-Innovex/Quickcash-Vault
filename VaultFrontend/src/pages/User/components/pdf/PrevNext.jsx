import React from "react";


function PrevNext({ pageNumber, allPages, changePage }) {
  
  //for go to previous page
  function previousPage() {
    changePage(-1);
  }
  //for go to next page
  function nextPage() {
    changePage(1);
  }

  return (
    <div className="flex items-center">
      <button
        className="op-btn op-btn-neutral op-btn-xs md:op-btn-sm font-semibold text-xs"
        disabled={pageNumber <= 1}
        onClick={previousPage}
      >
        <span className="block">
          <i className="fa-light fa-backward" aria-hidden="true"></i>
        </span>
      </button>
      <span className="text-xs text-base-content font-medium mx-2 2xl:text-[20px]">
        {pageNumber || 1} {("of")} {allPages?.totalPages || "--"}
      </span>
      <button
        className="op-btn op-btn-neutral op-btn-xs md:op-btn-sm font-semibold text-xs"
        disabled={pageNumber >= (allPages?.totalPages || 1)}
        onClick={nextPage}
      >
        <span className="block">
          <i className="fa-light fa-forward" aria-hidden="true"></i>
        </span>
      </button>
    </div>
  );
}

export default PrevNext;
