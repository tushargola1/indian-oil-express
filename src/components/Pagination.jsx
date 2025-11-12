const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5;

  let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination-container d-flex align-items-center justify-content-center mt-4">
      {/* Left Arrow */}
      <button
        className="page-arrow"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fa-solid fa-chevron-left fs-6"></i>
      </button>

      {/* Show first page + dots if needed */}
      {startPage > 1 && (
        <>
          <button
            className={`page-number ${currentPage === 1 ? "active" : ""}`}
            onClick={() => handlePageClick(1)}
          >
            1
          </button>
          {startPage > 2 && <span className="mx-1">...</span>}
        </>
      )}

      {/* Visible page range */}
      {pages.map((page) => (
        <button
          key={page}
          className={`page-number ${page === currentPage ? "active" : ""}`}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ))}

      {/* Show last page + dots if needed */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="mx-1">...</span>}
          <button
            className={`page-number ${currentPage === totalPages ? "active" : ""}`}
            onClick={() => handlePageClick(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Right Arrow */}
      <button
        className="page-arrow"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="fa-solid fa-chevron-right fs-6"></i>
      </button>
    </div>
  );
};

export default Pagination;
