// ===================== React =====================
import React, { useState, useEffect, useRef } from "react";

// ===================== HTTP & Utilities =====================
import axios from "axios";
import Cookies from "js-cookie";
import { apiBaseUrl } from "../Helper";


export default function CommentSection({ comments: apiComments, newsId }) {
  const containerRef = useRef(null);
  const topReplyBoxRef = useRef(null);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [visibleReplies, setVisibleReplies] = useState({});

  const [replyTargetId, setReplyTargetId] = useState(null);

  // 🔥 Normalize API Response
  const normalizeComments = (items) =>
    items.map((c) => ({
      id: c.id,
      name: c.userName ?? c.name ?? "User",
      img: c.profileImage
        ? `/uploads/${c.profileImage}`
        : "https://i.ibb.co/2YkZVZD/user.png",
      time: c.commentDate,
      text: c.comment,
      replies:
        c.children && c.children.length > 0
          ? normalizeComments(c.children)
          : [],
    }));

  useEffect(() => {
    if (apiComments?.length) {
      setComments(normalizeComments(apiComments));
    }
  }, [apiComments]);

  // =============================
  //          ADD MAIN COMMENT
  // =============================
  const handleAddComment = async () => {
    // alert("Adding main comment...");
    if (!newCommentText.trim()) return;
    setLoading(true);

    try {
      const body = {
        xpressNewsId: newsId,
        comment: newCommentText.trim(),
        ipAddress: "::1",
        action: "Add",
      };

      const res = await axios.post(
        apiBaseUrl("XpressNews/ManageComment"),
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      const newComment = normalizeComments([res.data.data])[0];
      setComments((prev) => [...prev, newComment]);
      setNewCommentText("");
    } catch (err) {
      console.error("Add comment error:", err);
    }

    setLoading(false);
  };

  // =============================
  //          REPLY / EDIT
  // =============================
  const handleReplySubmit = async () => {
    if (!replyText.trim() || !replyingTo) return;
    setLoading(true);

    try {
      const body = {
        xpressNewsId: newsId,
        comment: replyText.trim(),
        parentId: replyingTo, // 🔥 ALWAYS level-1
        ipAddress: "::1",
        action: isEditing ? "Edit" : "Add",
        id: isEditing ? replyTargetId : undefined,
      };

      const res = await axios.post(
        apiBaseUrl("XpressNews/ManageComment"),
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      const newReply = normalizeComments([res.data.data])[0];

      // 🔥 Insert reply ONLY under level-1 parent
      const addReplyToLevel1 = (items) =>
        items.map((c) => {
          if (c.id === replyingTo) {
            return { ...c, replies: [...c.replies, newReply] };
          }
          return { ...c, replies: addReplyToLevel1(c.replies) };
        });

      setComments((prev) => addReplyToLevel1(prev));

      setReplyText("");
      setReplyingTo(null);
      setReplyTargetId(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Reply error:", err);
    }

    setLoading(false);
  };


  // =============================
  //          DELETE COMMENT
  // =============================
  const handleDeleteComment = async (id, text = "") => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    setLoading(true);
    // alert("Deleting comment...");
    try {
      const body = {
        Id: id,
        comment: text, // can be empty if you want
        ipAddress: "::1",
        action: "Delete",
      };

      await axios.post(apiBaseUrl("XpressNews/ManageComment"), body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      // Remove from UI
      const removeComment = (items) =>
        items
          .filter((c) => c.id !== id)
          .map((c) => ({ ...c, replies: removeComment(c.replies) }));

      setComments((prev) => removeComment(prev));
    } catch (err) {
      console.error("Delete comment error:", err);
    }

    setLoading(false);
  };

  // =============================
  //          SHOW REPLIES
  // =============================
  // const renderReplies = (replies, level = 1, parentId) => {
  //   if (level > 2) return null; 
  //   const visibleCount = visibleReplies[parentId] || 2;
  //   const visibleList = replies.slice(0, visibleCount);
  //   const hasMore = visibleCount < replies.length;

  //   return (
  //     // ui function to render sub replies worked
  //     <>
  //       {visibleList.map((reply) => (
  //         <li className={`clearfix reply-level-${level}`} key={reply.id}>
  //           <div className="reply-box">
  //             <div className="d-flex gap-2">
  //               <div className="circle-user-comment">
  //                 <i className="fa-solid fa-user"></i>
  //               </div>
  //               <div className="post-comments w-100">
  //                 <div className="d-flex justify-content-between flex-wrap gy-2 align-items-center">
  //                   <p className="fw-bold mb-1">{reply.name}</p>
  //                   <small className="text-muted">{reply.time}</small>
  //                 </div>

  //                 <p>{reply.text}</p>

  //                 <div className="my-3">
  //                   <button
  //                     className="btn btn-sm "
  //                     onClick={() => {
  //                       setReplyingTo(reply.id);
  //                       setReplyText("");
  //                       setIsEditing(false);
  //                     }}
  //                   >
  //                     <i className="fa-solid fa-comment-dots text-success" ></i>
  //                   </button>
  //                   <button
  //                     className="btn btn-sm"
  //                     onClick={() => {
  //                       setReplyingTo(reply.id);
  //                       setReplyText(reply.text);
  //                       setIsEditing(true);
  //                     }}
  //                   >
  //                     <i className="fa-solid fa-pen-to-square text-warning"></i>

  //                   </button>
  //                   <button
  //                     className="btn btn-sm "
  //                     onClick={() => handleDeleteComment(reply.id, reply.text)}
  //                   >
  //                     <i className="fa-solid fa-trash text-danger"></i>
  //                   </button>
  //                 </div>
  //               </div>
  //             </div>

  //             {reply.replies.length > 0 && (
  //               <ul className="comments ps-0">
  //                 {renderReplies(
  //                   reply.replies,
  //                   level === 1 ? 2 : 2, 
  //                   reply.id
  //                 )}
  //               </ul>
  //             )}
  //           </div>
  //         </li>
  //       ))}

  //       {hasMore && (
  //         <span
  //           className="show-more-btn"
  //           onClick={() =>
  //             setVisibleReplies((prev) => ({
  //               ...prev,
  //               [parentId]: (prev[parentId] || 2) + 6,
  //             }))
  //           }
  //         >
  //           Show more replies ({replies.length - visibleCount})
  //         </span>
  //       )}
  //     </>
  //   );
  // };

  const renderReplies = (replies, level = 1, parentId) => {
    if (level > 2) return null; // 🔒 stop deeper levels

    const visibleCount = visibleReplies[parentId] || 2;
    const visibleList = replies.slice(0, visibleCount);
    const hasMore = visibleCount < replies.length;

    return (
      <>
        {visibleList.map((reply) => (
          <li className={`clearfix reply-level-${level}`} key={reply.id}>
            <div className="reply-box">
              <div className="d-flex gap-2">
                <div className="circle-user-comment">
                  <i className="fa-solid fa-user"></i>
                </div>

                <div className="post-comments w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="fw-bold mb-1">{reply.name}</p>
                    <small className="text-muted">{reply.time}</small>
                  </div>

                  <p>{reply.text}</p>

                  {/* ACTION BUTTONS */}
                  <div className="my-3">

                    {/* ✅ Reply button only till level 1 */}
                    {/* {level < 2 && ( */}
                    {level <= 2 && (
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          const level1ParentId = level === 1 ? reply.id : parentId;
                          setReplyingTo(level1ParentId);
                          setReplyTargetId(reply.id);
                          setReplyText("");
                          setIsEditing(false);
                          setTimeout(() => {
                            topReplyBoxRef.current?.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }}
                      >
                        <i className="fa-solid fa-comment-dots text-success"></i>
                      </button>
                    )}
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        setReplyingTo(parentId);      // ✅ level-1 parent
                        setReplyTargetId(reply.id);   // edit THIS reply
                        setReplyText(reply.text);
                        setIsEditing(true);
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square text-warning"></i>
                    </button>
                    <button
                      className="btn btn-sm "
                      onClick={() =>
                        handleDeleteComment(reply.id, reply.text)
                      }
                    >
                      <i className="fa-solid fa-trash text-danger"></i>
                    </button>
                    {/* <button
                      className="btn btn-sm"
                      onClick={() => {
                        const level1ParentId = level === 1 ? reply.id : parentId;
                        setReplyingTo(level1ParentId);   
                        setReplyTargetId(reply.id);      
                        setReplyText("");
                        setIsEditing(false);
                        setTimeout(() => {
                          topReplyBoxRef.current?.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                    >
                      <i className="fa-solid fa-comment-dots text-success"></i>
                    </button> */}

                  </div>
                </div>
              </div>

              {/* ✅ Render children ONLY when level === 1 */}
              {level === 1 && reply.replies?.length > 0 && (
                <ul className="comments ps-0">
                  {renderReplies(reply.replies, 2, reply.id)}
                </ul>
              )}
            </div>
          </li>
        ))}

        {hasMore && (
          <span
            className="show-more-btn"
            onClick={() =>
              setVisibleReplies((prev) => ({
                ...prev,
                [parentId]: (prev[parentId] || 2) + 6,
              }))
            }
          >
            Show more replies ({replies.length - visibleCount})
          </span>
        )}
      </>
    );
  };


  // =============================
  //               UI
  // =============================
  return (
    <section className="aa0" ref={containerRef}>
      <div className="ah2">
        <div className="ah1">
          <span>
            Comments (<span className="ag4">{comments.length}</span>)
          </span>
        </div>

        {/* ADD MAIN COMMENT BOX */}
        {/* ADD MAIN COMMENT BOX */}
        {!replyingTo && (
          // alert("Showing reply box..."),
          <div className="mb-4 mt-2">
            <textarea
              className="form-control mb-2"
              rows="3"
              placeholder="Write a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
            <button
              className="btn dark-blue-bg-color text-white submit-btn rounded-0"
              disabled={loading}
              onClick={handleAddComment}
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        )}

        {/* TOP REPLY / EDIT BOX */}
        <div ref={topReplyBoxRef} className="mt-2">
          {replyingTo && (

            <div className="mb-3 p-2 border rounded bg-light">
              <p className="fw-bold mb-1">
                {isEditing
                  ? `Editing Comment #${replyingTo}`
                  : `Replying to Comment #${replyingTo}`}
              </p>
              <textarea
                className="form-control mb-2"
                rows="3"
                value={replyText}
                placeholder="Write your reply..."
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button
                className="btn dark-blue-bg-color text-white submit-btn btn-sm me-2 rounded-0"
                onClick={handleReplySubmit}
                disabled={loading}
              >
                {loading ? "Posting..." : "Submit"}
              </button>
              <button
                className="btn btn-secondary btn-sm rounded-0"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* COMMENT LIST */}
        <ul className="comments ps-0">
          {comments.map((comment) => (
            <li className="clearfix" key={comment.id}>
              <div className="comment-box">
                <div className="d-flex gap-2">
                  <div className="circle-user-comment z-4">
                    <i className="fa-solid fa-user text-white"></i>
                  </div>

                  <div className="post-comments w-100">
                    <div className="d-flex justify-content-between flex-wrap gy-2 align-items-center">
                      <p className="fw-bold mb-1">{comment.name}</p>
                      <small className="text-muted">{comment.time}</small>
                    </div>

                    <p>{comment.text}</p>

                    <div className="my-3">
                      <button
                        className="btn btn-sm  "
                        onClick={() => {
                          setReplyingTo(comment.id);
                          setReplyText("");
                          setIsEditing(false);
                        }}
                      >
                        <i className="fa-solid fa-comment-dots text-success"></i>
                      </button>
                      <button
                        className="btn btn-sm "
                        onClick={() => {
                          setReplyingTo(comment.id);
                          setReplyText(comment.text);
                          setIsEditing(true);
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square text-warning"></i>
                      </button>
                      <button
                        className="btn btn-sm "
                        onClick={() =>
                          handleDeleteComment(comment.id, comment.text)
                        }
                      >
                        <i className="fa-solid fa-trash text-danger"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {comment.replies.length > 0 && (
                  <ul className="comments ps-0">
                    {renderReplies(comment.replies, 1, comment.id)}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
