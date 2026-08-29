import {
  Bookmark,
  Heart,
  ImageUp,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Send,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { userContext } from "../../context/User.context";

export default function PostCard({ postDetails, onDelete }) {
  const {
    id,
    body,
    likesCount,
    user,
    sharesCount,
    image,
    commentsCount,
    createdAt,
  } = postDetails;
  const { token } = useContext(userContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await axios.delete(
        `https://route-posts.routemisr.com/posts/${postDetails.id}`,
        { headers: { token } },
      );

      onDelete?.(postDetails.id);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Could not delete the post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function deletComment(commentId) {
    try {
      const option = {
        url: `https://route-posts.routemisr.com/posts/${id}/comments/${commentId}`,
        method: "DELETE",
        headers: {
          token,
        },
      };
      await axios.request(option);

      toast.success("تم حذف التعليق بنجاح");
      getComments();
    } catch (error) {
      console.log(error);
      toast.error("فشل حذف التعليق");
    }
  }

  function startEditComment(comment) {
    setEditingCommentId(comment._id);
    setNewComment(comment.content);
  }

  function cancelEdit() {
    setEditingCommentId(null);
    setNewComment("");
  }

  async function updateComment() {
    try {
      const option = {
        url: `https://route-posts.routemisr.com/posts/${id}/comments/${editingCommentId}`,
        method: "PUT",
        data: { content: newComment },
        headers: { token },
      };
      await axios.request(option);
      toast.success("تم تعديل التعليق بنجاح");
      cancelEdit();
      getComments();
    } catch (error) {
      console.log(error);
      toast.error("فشل تعديل التعليق");
    }
  }

  async function handleLikePost() {
    try {
      const option = {
        url: `https://route-posts.routemisr.com/posts/${id}/like`,
        method: "PUT",
        headers: { token },
      };
      await axios.request(option);
    } catch (error) {
      console.log(error);
    }
  }

  const toggleComments = () => {
    if (!showComments) {
      getComments();
    }
    setShowComments((prev) => !prev);
  };

  async function getComments() {
    try {
      const option = {
        url: `https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`,
        method: "GET",
        headers: {
          token,
        },
      };
      const { data } = await axios.request(option);
      if (data.success) {
        setComments(data.comments || data.data?.comments || []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function addComment() {
    if (!newComment.trim()) return;

    const formData = new FormData();
    formData.append("content", newComment);

    try {
      const { data } = await axios.post(
        `https://route-posts.routemisr.com/posts/${id}/comments`,
        formData,
        {
          headers: {
            token,
          },
        },
      );

      if (data.success) {
        setNewComment("");
        getComments();
        toast.success("Comment added!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add comment");
    }
  }

  function handleSubmitComment() {
    if (editingCommentId) {
      updateComment();
    } else {
      addComment();
    }
  }

  return (
    <article className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-start justify-between px-5 pb-4 pt-5">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={user?.photo}
            alt={`${user?.name} profile`}
            className="h-12 w-12 shrink-0 rounded-full border-2 border-slate-100 object-cover"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-slate-900">{user?.name}</h2>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                @{user?.username}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">
              {postDetails.createdAt} · Public
            </p>
          </div>
        </div>

        <details className="relative">
          <summary
            aria-label="Post options"
            className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 [&::-webkit-details-marker]:hidden"
          >
            <MoreHorizontal size={20} />
          </summary>

          <div className="absolute right-0 top-10 z-10 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Bookmark size={17} /> Bookmark post
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Pencil size={17} /> Update post
            </button>
            <div className="my-1 border-t border-slate-100" />
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
            >
              <Trash2 size={17} />
              {isDeleting ? "Deleting..." : "Delete post"}
            </button>
          </div>
        </details>
      </header>

      <div className="px-5 pb-5">
        <p className="text-lg leading-7 text-slate-800">{body}</p>
      </div>

      {image && (
        <img
          src={image}
          alt="Post attachment"
          className="max-h-130 w-full object-cover"
        />
      )}

      <div className="mx-5 flex items-center justify-between border-y border-slate-100 py-3 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white">
            <Heart size={12} fill="currentColor" />
          </span>
          {likesCount} likes
        </span>
        <span>
          {commentsCount} comments · {sharesCount} shares
        </span>
      </div>

      <footer className="grid grid-cols-4 gap-1 px-3 py-2 text-center text-sm font-medium text-slate-600">
        <span
          onClick={handleLikePost}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 transition hover:bg-slate-50"
        >
          <Heart size={17} /> Like
        </span>
        <span
          onClick={toggleComments}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 transition hover:bg-slate-50"
        >
          <MessageCircle size={17} /> Comment
        </span>
        <span className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 transition hover:bg-slate-50">
          <Share2 size={17} /> Share
        </span>
        <span className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 transition hover:bg-slate-50">
          <Bookmark size={17} /> Save
        </span>
      </footer>

      {showComments && (
        <div className="space-y-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-3">
                <img
                  src={comment.commentCreator?.photo || userInfo?.photo}
                  alt={comment.commentCreator?.name || "User"}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="rounded-2xl bg-slate-100 px-4 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-900">
                        {comment.commentCreator?.name}
                      </h4>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-[10px] text-slate-400">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                        <details className="relative">
                          <summary className="grid h-6 w-6 cursor-pointer list-none place-items-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 [&::-webkit-details-marker]:hidden">
                            <MoreHorizontal size={14} />
                          </summary>

                          <div className="absolute right-0 top-7 z-10 w-28 rounded-lg border border-slate-200 bg-white p-1 shadow-md">
                            <button
                              type="button"
                              onClick={() => startEditComment(comment)}
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                            >
                              <Pencil size={12} /> تعديل
                            </button>
                            <button
                              type="button"
                              onClick={() => deletComment(comment._id)}
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 size={12} /> حذف
                            </button>
                          </div>
                        </details>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-slate-700">
                      {comment.content}
                    </p>
                  </div>

                  <div className="mt-1 flex items-center gap-3 px-2 text-[11px] font-medium text-slate-500">
                    <button type="button" className="hover:text-slate-800">
                      Like
                    </button>
                    <button type="button" className="hover:text-slate-800">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="py-2 text-center text-xs text-slate-400">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3">
        <img
          src="https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
          alt="Your profile"
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 shadow-sm">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
            placeholder={
              editingCommentId ? "تعديل التعليق..." : "Write a comment..."
            }
            className="w-full bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />

          {editingCommentId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="p-1 text-slate-400 hover:text-rose-500"
              title="إلغاء التعديل"
            >
              <X size={16} />
            </button>
          )}

          <button
            onClick={handleSubmitComment}
            className="text-slate-400 hover:text-blue-500"
          >
            <Send size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
