import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../context/User.context";
import axios from "axios";
import PostCard from "../../components/PostCard/PostCard";
import { RefreshCw } from "lucide-react";
import PostForm from "../../components/PostForm/PostForm";

export default function Home() {
  const { token } = useContext(userContext);
  const [posts, setPosts] = useState(null);
  console.log(token);

  async function getAllPosts() {
    const option = {
      url: "https://route-posts.routemisr.com/posts",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.request(option);
    console.log(data.data.posts[0]);

    if (data.success) {
      setPosts(data.data.posts);
    }
    console.log(data);
  }
  useEffect(() => {
    getAllPosts();
  }, []);

  function removePost(postId) {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId),
    );
  }

  return (
    <div className="mx-auto ml-60 max-w-3xl space-y-5 p-5 sm:p-5 lg:ml-60">
      <PostForm />
      {posts ? (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard key={post.id} postDetails={post} onDelete={removePost} />
          ))}{" "}
        </div>
      ) : (
        <h2 className="min-h-auto text-blue-800">
          loding
          <span>
            <RefreshCw className="animate-spin" />
          </span>
        </h2>
      )}
    </div>
  );
}
