

const CategoriesSidebar = () => {
  const categories = [
    "In Focus",
    "Spotlight",
    "News Buzz",
    "Achiever",
    "Fostering Values",
    "Community Connect",
    "Strengthening",
    "Strengthening Synergy",
    "Learning Pathways",
    "Meetings & Interactions",
    "Safety & Security",
    "News at a Glance",
  ];

  return (
    <>
      {/* Sidebar for XL and above */}
      <div className="d-none d-xl-block d-lg-block d-md-none categories-sidebar p-0 bg-white">
        <div className="p-3 fw-bold text-white sidebar-header">Categories</div>
        <ul className="list-unstyled m-0 mt-3">
          {categories.map((cat, idx) => (
            <li
              key={idx}
              className={`category-item ${
                idx === 0 ? "active-category" : ""
              }`}
              data-bs-dismiss="modal"
            >
              <i className="fa fa-chevron-right me-2 theme-dark-blue"></i> <span className="categoryText">{cat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Button for smaller screens */}
      <div className="d-xl-none  mb-3 d-lg-none d-md-flex d-flex justify-content-between">
        <div className="p-3 fw-bold text-white sidebar-header">Categories</div>
          <div>
<button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#categoriesModal"
        >
          <i className="bi bi-list me-2"></i> Menu
        </button>
          </div>
        
      </div>

      {/* Modal for smaller screens */}
      <div
        className="modal fade"
        id="categoriesModal"
        tabIndex="-1"
        aria-labelledby="categoriesModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="categoriesModalLabel">
                Categories
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-0">
              <ul className="list-unstyled m-0">
                {categories.map((cat, idx) => (
                  <li
                    key={idx}
                    className={`category-item ${
                      idx === 0 ? "active-category" : ""
                    }`}
                    data-bs-dismiss="modal"
                  >
                    <i className="bi bi-chevron-right me-2"></i> {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesSidebar;
