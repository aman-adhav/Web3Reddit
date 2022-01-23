import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import abi from './utils/DecenReddit.json';
import TimeAgo from 'timeago-react';
import PostForm from './PostForm';
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import Vote from './Vote';

function Posts(props) { 

    let pstIds = props.postIds;

    const threadId = props.threadId;

    const currLevel = props.currLevel;

    const [isLoading, setLoading] = useState(true);

    const [posts, setPosts] = useState([]);

    const [replyPostForm, setReplyPostForm] = useState(false);
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const contractABI = abi.abi;
    
    function convertArrayToIntArray(rawArray) {
        let intArray = [];
       
        rawArray.forEach(subPostId => {
            intArray.push(subPostId.toNumber());
        })
  
        return intArray;
      }


    function shortenAuthor(address) {
        return address.substring(0,6) + "..." + address.substring(37, 41);
    }
    

    async function getPosts () {
        try {
            const { ethereum } = window;
            
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
              //const signer = ethers.getDefaultProvider(process.env.REACT_APP_NETWORK);
              const threadsContractFactory = new ethers.Contract(contractAddress, contractABI, signer);
                
              let parsedPosts = [];

              for (const postId in pstIds) {
                let [post, walletVote] = await threadsContractFactory.getPost(threadId, pstIds[postId]);

                parsedPosts.push({
                  author: post.madeBy,
                  displayName: shortenAuthor(post.madeBy),
                  message: post.message,
                  timestamp: new Date(post.timestamp * 1000),
                  postId: post.postId.toNumber(),
                  votes: post.votes.toNumber(),
                  subPostIds: convertArrayToIntArray(post.subPosts),
                  walletHolderVote: walletVote.toNumber()
                })
              }
            
              setPosts(parsedPosts.slice().reverse());
              setLoading(false);
            } else {
              console.log("Ethereum object doesn't exist!");
            }
          } catch (error) {
            console.log(error)
          }
    }

    useEffect(() => {
        getPosts();
    }, [isLoading, pstIds]);

    return (
        <div className={'my-2 text-crypdit_text'}>
            {currLevel < 10 && (
                <div className={''}>
                    {posts.map(post => (
                        <div key={"post-" + post.postId} className={'mb-2'}>
                            <div className="flex mb-2">
                                <div className={'bg-crypdit_text mr-2 w-10 h-10 rounded-full'}/>
                                <div className="leading-10 px-2 text-lg font-sans">{post.displayName}</div>
                                <TimeAgo className="leading-10 px-2 text-md font-sans" datetime={post.timestamp} />
                            </div>
                             <div className="border-l-2 border-crypdit_text-darker p-3 pb-0" style={{marginLeft:'18px'}}>
                             <div className="pl-4 -mt-4">
                                <div>
                                 <ReactMarkdown remarkPlugins={[gfm]} children={post.message} />
                                </div>
                                    <Vote walletHolderVote={post.walletHolderVote} votes={post.votes} voteType={"post"} threadId={threadId} postId={post.postId}/>
                                    <button
                                        onClick={() => setReplyPostForm(post.postId)} 
                                        className="bg-crypdit_dark-search_form py-2 text-crypdit_text-darker border-none pl-0 pr-0" >
                                        Reply
                                    </button>
                                    {post.postId === replyPostForm && (
                                        <PostForm key={"post-" + post.postId} threadId={props.threadId} onSubmit={event => setLoading(true)} parentId={post.postId} onCancel={event => setReplyPostForm(false)}/>
                                    )}
                                
                                
                                {!!post && post.subPostIds.length > 0 && (
                                <Posts threadId={props.threadId} postIds={post.subPostIds} currLevel={currLevel+1}/>
                                )}
                                </div>
                            </div>
                        </div>
                    ))}
                    

                </div>
            )}
        </div>
    );
}

export default Posts;