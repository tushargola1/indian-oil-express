import React from "react";

const ShareTooltip = ({ userReactions = [] }) => {
  // Default empty array ensures map never fails
  const reactionIcons = {
    Like: "fa-thumbs-up",
    Love: "fa-heart",
    Wow: "fa-face-surprise",
    HaHa: "fa-face-laugh",
    Sad: "fa-face-sad-tear",
    Angry: "fa-face-angry",
  };

  return (
    <div className="tooltip-container">
      <div className="button-contentd">
        <i className="fa-regular fa-thumbs-up me-2"></i>

      </div>

      <div className="tooltip-content">
        <div className="social-icons">
          {userReactions.map((reaction) => {
            const iconClass = reaction.isReacted ? "fa-solid" : "fa-regular";
            const faClass = `${iconClass} ${reactionIcons[reaction.name]}`;

            return (
              <div key={reaction.id} className="social-icon">
                <i
                  className={faClass}
                  style={{
                    fontSize: "24px",
                    color: reaction.isReacted ? "#6e8efb" : "#555",
                  }}
                ></i>
                <div style={{ fontSize: "12px", marginTop: "4px" }}>
                  {reaction.total}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShareTooltip;
