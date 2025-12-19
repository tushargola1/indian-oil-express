import { useReducer } from "react";
import { reactionUrl } from "../Helper";

const ShareTooltip = ({ userReactions = [], onReactionClick }) => {

  return (
    <div className="tooltip-container">
      <div className="button-contentd d-flex align-items-center justify-content-center">
        {
          userReactions.slice(0, 1).map((item, index) => {

            const imgSrc = `${reactionUrl}${item.name}.png`;

            return (
              // <i className="fa-regular fa-thumbs-up me-2 orange-color"></i>
              <img
                src={imgSrc}
                alt={item.name}
                style={{
                  width: "20px",
                  height: "20px",
                  // filter: reaction.isReacted ? "none" : "grayscale(60%)",
                  // opacity: reaction.isReacted ? 1 : 0.7,
                }}
              />
            )
          })
        }
      </div>

      <div className="tooltip-content">
        <div className="social-icons">
          {userReactions.map((reaction) => {
            // Build image directly from API name
            const imgSrc = `${reactionUrl}${reaction.name}.png`;

            return (
              <div
                key={reaction.id}
                className={`social-icon ${reaction.isReacted ? "active" : ""}`}
                onClick={() => onReactionClick?.(reaction.id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={imgSrc}
                  alt={reaction.name}
                  style={{
                    width: "28px",
                    height: "28px",
                    // filter: reaction.isReacted ? "none" : "grayscale(60%)",
                    // opacity: reaction.isReacted ? 1 : 0.7,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShareTooltip;
