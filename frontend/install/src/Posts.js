import { useState } from 'react';
import TimeAgo from 'timeago-react';
import PostForm from './PostForm';

function Posts(props) { 

    const posts = props.rootPosts;

    const [replyPostForm, setReplyPostForm] = useState(false);

    return (
        <div className={''}>
            {posts.map(post => (
                <div>
                    <div className="flex mb-2">
                        <div className={'bg-crypdit_text mr-2 w-10 h-10 rounded-full'}/>
                        <div className="leading-10 px-2 text-lg font-sans">{post.displayName}</div>
                        <TimeAgo className="leading-10 px-2 text-md font-sans" datetime={post.timestamp} />
                    </div>
                    <div className="border-l-2 border-crypdit_text-darker p-3 ml-4">
                        {post.message}
                        <div>
                            <button
                                onClick={() => setReplyPostForm(post.postId)} 
                                className="bg-crypdit_dark py-2 text-crypdit_text-darker border-none pl-0 pr-0" >
                                Reply
                            </button>
                            {post.postId === replyPostForm && (
                                <PostForm key={"post-" + post.postId} onCancel={event => setReplyPostForm(false)}/>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            

        </div>
    );
}

export default Posts;