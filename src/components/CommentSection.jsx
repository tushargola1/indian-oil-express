import React, { useState, useEffect, useRef } from "react";

export default function CommentSection() {
  const containerRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Ligia dos Santos",
      img: "https://i.ibb.co/MVJHGkC/g.webp",
      time: "3 d",
      text: "I finally fit into my old clothes again! Best feeling ever 😍",
      likes: 3,
      dislikes: 0,
      liked: false,
      disliked: false,
      replies: [
        {
          id: 2,
          name: "Marta Ribeiro",
          img: "https://i.ibb.co/frSP8QJ/d.webp",
          time: "2 d",
          text: "Does it work for guys too? 😅",
          likes: 2,
          dislikes: 0,
          liked: false,
          disliked: false,
          replies: [
            {
              id: 3,
              name: "Simone Silva",
              img: "https://i.ibb.co/JC5D5F7/e.webp",
              time: "1 d",
              text: "Yup, Marta! Works for anyone tryin to lose weight.",
              likes: 1,
              dislikes: 0,
              liked: false,
              disliked: false,
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: "Marcelo Essado",
      img: "https://i.ibb.co/LJx9SHT/h.webp",
      time: "2 d",
      text: "Makes all the difference!",
      likes: 4,
      dislikes: 0,
      liked: false,
      disliked: false,
      replies: [],
    },
  ]);

  const toggleLike = (id, isReply = false) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === id && !isReply) {
          return {
            ...comment,
            liked: !comment.liked,
            disliked: false,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            dislikes: comment.disliked ? comment.dislikes - 1 : comment.dislikes,
          };
        }

        if (isReply) {
          return {
            ...comment,
            replies: updateReply(comment.replies, id, (r) => ({
              ...r,
              liked: !r.liked,
              disliked: false,
              likes: r.liked ? r.likes - 1 : r.likes + 1,
              dislikes: r.disliked ? r.dislikes - 1 : r.dislikes,
            })),
          };
        }

        return comment;
      })
    );
  };

  const toggleDislike = (id, isReply = false) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === id && !isReply) {
          return {
            ...comment,
            disliked: !comment.disliked,
            liked: false,
            dislikes: comment.disliked ? comment.dislikes - 1 : comment.dislikes + 1,
            likes: comment.liked ? comment.likes - 1 : comment.likes,
          };
        }

        if (isReply) {
          return {
            ...comment,
            replies: updateReply(comment.replies, id, (r) => ({
              ...r,
              disliked: !r.disliked,
              liked: false,
              dislikes: r.disliked ? r.dislikes - 1 : r.dislikes + 1,
              likes: r.liked ? r.likes - 1 : r.likes,
            })),
          };
        }

        return comment;
      })
    );
  };

  const updateReply = (replies, id, updater) =>
    replies.map((reply) => {
      if (reply.id === id) return updater(reply);
      if (reply.replies) {
        return { ...reply, replies: updateReply(reply.replies, id, updater) };
      }
      return reply;
    });

  const handleReplyClick = (id) => {
    setReplyingTo(id);
    setReplyText("");
  };

  const handleReplySubmit = (id, isReply = false) => {
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(),
      name: "You",
      img: "https://i.ibb.co/2YkZVZD/user.png",
      time: "Just now",
      text: replyText.trim(),
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
      replies: [],
    };

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === id && !isReply) {
          return { ...comment, replies: [...comment.replies, newReply] };
        }

        if (isReply) {
          return {
            ...comment,
            replies: updateReply(comment.replies, id, (r) => ({
              ...r,
              replies: [...(r.replies || []), newReply],
            })),
          };
        }

        return comment;
      })
    );

    setReplyingTo(null);
    setReplyText("");
  };

  const renderReplies = (replies) =>
    replies.map((reply) => (
      <div className="af7" key={reply.id}>
        <div className="ag5">
          <img src={reply.img} width="56" height="56" alt={reply.name} />
          <div className="ac2">
            <div className="ac5">
              <div className="d-flex justify-content-between">
                <p className="ac4">{reply.name}</p>
                <p className="day-time">{reply.time}</p>
              </div>
              <p className="ac3">{reply.text}</p>
            </div>
            <div className="ac1">
              <u onClick={() => toggleLike(reply.id, true)} style={{ cursor: "pointer" }}>
                <i className={reply.liked ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"}></i> {reply.likes}
              </u>
              <u onClick={() => toggleDislike(reply.id, true)} style={{ cursor: "pointer" }}>
                <i className={reply.disliked ? "fa-solid fa-thumbs-down" : "fa-regular fa-thumbs-down"}></i> {reply.dislikes}
              </u>
              <u onClick={() => handleReplyClick(reply.id)} style={{ cursor: "pointer" }}>
                <i className="fa-regular fa-comment"></i> Reply
              </u>
            </div>

            {replyingTo === reply.id && (
              <div className="mb-4 add-remove-btn">
                <textarea
                  className="form-control mb-2 textarea-box"
                  rows="3"
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleReplySubmit(reply.id, true)}>
                  Submit
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setReplyingTo(null)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        {reply.replies && reply.replies.length > 0 && (
          <div className="af7 ms-5">{renderReplies(reply.replies)}</div>
        )}
      </div>
    ));

  useEffect(() => {
    const manageCommentHierarchy = () => {
      try {
        if (!containerRef.current) return;

        const containers = containerRef.current.querySelectorAll(".af9 .af7");

        containers.forEach((container) => {
          const existingLines = container.querySelectorAll(".ag6");
          existingLines.forEach((line) => line.remove());
        });

        containers.forEach((container) => {
          const relevantChildren = Array.from(container.children).filter(
            (child) =>
              !["ag6", "ag8", "ag9"].some((cls) =>
                child.classList.contains(cls)
              )
          );

          if (
            relevantChildren.length > 1 &&
            !container.parentElement.closest(".ag6")
          ) {
            let totalHeight = 0;
            const spacing = 4;
            for (let i = 0; i < relevantChildren.length - 1; i++) {
              totalHeight += relevantChildren[i].offsetHeight + spacing;
            }
            totalHeight -= spacing;

            const newVerticalLine = document.createElement("div");
            newVerticalLine.className = "ag6";
            newVerticalLine.style.height = `${totalHeight}px`;
            container.appendChild(newVerticalLine);

            relevantChildren.slice(1).forEach((child) => {
              if (!child.querySelector(".ag8")) {
                const bgLine = document.createElement("div");
                bgLine.className = "ag8";
                child.appendChild(bgLine);
              }
              if (!child.querySelector(".ag9")) {
                const fgLine = document.createElement("div");
                fgLine.className = "ag9";
                child.appendChild(fgLine);
              }
            });
          }
        });
      } catch (error) {
        console.error("Error adding comment hierarchy:", error);
      }
    };

    manageCommentHierarchy();
    window.addEventListener("resize", manageCommentHierarchy);
    return () => window.removeEventListener("resize", manageCommentHierarchy);
  }, [comments]);
  return (
    <section className="aa0" ref={containerRef}>
      <div className="ah2">
        <div className="ah1">
          <span>
            Comments (<span className="ag4">{comments.length}</span>)
          </span>
        </div>
        <div className="ah0">
          <div className="af9">
            {comments.map((comment) => (
              <div className="af7" key={comment.id}>
                <div className="ag5">
                  <img src={comment.img} width="56" height="56" alt={comment.name} />
                  <div className="ac2">
                    <div className="ac5">
                      <div className="d-flex justify-content-between">
                        <p className="ac4">{comment.name}</p>
                        <p className="day-time">{comment.time}</p>
                      </div>
                      <p className="ac3">{comment.text}</p>
                    </div>
                    <div className="ac1">
                      <u onClick={() => toggleLike(comment.id)} style={{ cursor: "pointer" }}>
                        <i className={comment.liked ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"}></i> {comment.likes}
                      </u>
                      <u onClick={() => toggleDislike(comment.id)} style={{ cursor: "pointer" }}>
                        <i className={comment.disliked ? "fa-solid fa-thumbs-down" : "fa-regular fa-thumbs-down"}></i> {comment.dislikes}
                      </u>
                      <u onClick={() => handleReplyClick(comment.id)} style={{ cursor: "pointer" }}>
                        <i className="fa-regular fa-comment"></i> Reply
                      </u>
                    </div>

                    {replyingTo === comment.id && (
                      <div className="mb-4 add-remove-btn">
                        <textarea
                          className="form-control mb-2 textarea-box"
                          rows="3"
                          placeholder="Write your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleReplySubmit(comment.id)}>
                          Submit
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setReplyingTo(null)}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {comment.replies && renderReplies(comment.replies)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
