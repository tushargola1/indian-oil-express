// ===================== HTTP & Utilities =====================
import { useMemo } from "react";

// ===================== Data Fetching =====================
import { useQuery } from "@tanstack/react-query";
import { 
  getWebPageCategories, 
  getXpressCategories 
} from "../components/ApiFunctions";

// ===================== UI Components =====================
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// ===================== Routing =====================
import { Link, useLocation } from "react-router-dom";

// --------------------------
// Component
// --------------------------
const CategoriesSidebar = ({ newsType, newsParentId }) => {
  const location = useLocation();

  // IMPORTANT: read clicked item from Router state
  const clickedId = location.state?.clickedId;

  // Final active category ID
  const activeCategoryId = clickedId || Number(newsParentId);

  const fetchCategories =
    newsType === "XpressNews" ? getXpressCategories : getWebPageCategories;

  const { data: sidebarData = [], isLoading } = useQuery({
    queryKey: ["sidebarData", newsType],
    queryFn: fetchCategories,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // ⚡ FIXED: category ordering always updates correctly
  const categoriesToDisplay = useMemo(() => {
    if (!sidebarData || sidebarData.length === 0) return [];

    let list = [...sidebarData];

    const index = list.findIndex((c) => c.id === activeCategoryId);

    if (index > -1) {
      const [active] = list.splice(index, 1);
      return [active, ...list];
    }

    return list;
  }, [sidebarData, activeCategoryId]);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="d-none d-xl-block d-lg-block d-md-none categories-sidebar p-0 bg-white">
        <div className="p-3 fw-bold text-white sidebar-header">Categories</div>

        <ul className="list-unstyled m-0 mt-3">
          {isLoading
            ? Array.from({ length: 5 }).map((_, idx) => (
              <li key={idx} className="mb-2">
                <Skeleton height={20} width="80%" />
              </li>
            ))
            : categoriesToDisplay.map((cat, idx) => (
              <li
                key={cat.id}
                className={`category-item ${idx === 0 ? "active-category" : ""}`}
              >
                <Link
                  to={`/news-listing/${cat.id}`}
                  state={{ type: newsType, clickedId: cat.id }}
                  className="d-flex align-items-center text-decoration-none"
                >
                  <i className="fa fa-chevron-right me-2 theme-dark-blue"></i>
                  <span className="categoryText">{cat.category}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>

      {/* Mobile Header */}
      <div className="d-xl-none mb-3 d-lg-none d-md-flex d-flex justify-content-between align-items-center">
        <div className="p-xl-3 p-lg-3 p-md-2 p-sm-2 p-1 fw-bold text-white sidebar-header col-md-6">
          <h3>Categories</h3>
        </div>
        <button
          type="button"
          className="col-md-6 text-end bg-transparent border-0"
          data-bs-toggle="modal"
          data-bs-target="#categoriesModal"
        >
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>

      {/* Mobile Modal */}
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
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body p-0">
              <ul className="list-unstyled m-0">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                    <li key={idx} className="mb-2">
                      <Skeleton height={20} width="80%" />
                    </li>
                  ))
                  : categoriesToDisplay.map((cat, idx) => (
                    <li
                      key={cat.id}
                      className={`category-item ${idx === 0 ? "active-category" : ""}`}
                    >
                      <Link
                        to={`/news-listing/${cat.id}`}
                        state={{ type: newsType, clickedId: cat.id }}
                        data-bs-dismiss="modal"
                        className="d-flex align-items-center text-decoration-none"
                      >
                        <i className="fa fa-chevron-right me-2 theme-dark-blue"></i>
                        <span className="categoryText">{cat.category}</span>
                      </Link>
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
