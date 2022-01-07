import ThreadContent from "./ThreadContent";
import {useState, useEffect} from 'react';
import { ethers } from "ethers";
import abi from './utils/DecenReddit.json';
import ClickOutHandler from "react-clickout-handler";
import PostForm from "./PostForm";
import Posts from "./Posts";

function ThreadPopupModal(props) {

    const threadId = props.id;
    const [thread, setThread] = useState([]);
    const [isLoading, setLoading] = useState(true);
    
    const [visibleClass, setVisibleClass] = useState("hidden");

    const [rootPosts, setRootPosts] = useState([]);
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const contractABI = abi.abi;

    function shortenAuthor(address) {
        return address.substring(0,6) + "..." + address.substring(37, 41);
    }

    function parseThreadData(threadData){
        return ({
            author: threadData.madeBy,
            displayName: shortenAuthor(threadData.madeBy),
            title: threadData.title,
            message: threadData.message,
            timestamp: new Date(threadData.timestamp * 1000),
            threadId: threadData.threadId,
            likes: threadData.likes
          })
    }

    const getThreadById = async () => {
        try {
            const { ethereum } = window;
            
            if (ethereum) {
              const signer = ethers.getDefaultProvider(process.env.REACT_APP_NETWORK);
              const threadsContractFactory = new ethers.Contract(contractAddress, contractABI, signer);
              
              const threadData = await threadsContractFactory.getThread(threadId);
              
              setThread(parseThreadData(threadData));
            } else {
              console.log("Ethereum object doesn't exist!");
            }
          } catch (error) {
            console.log(error)
          }
    }

    async function retrieveRootPosts(threadsContractFactory, rootPostIds){
        let parsedRootPosts = [];
        for (const rootPostId in rootPostIds) {
          let rootPost = await threadsContractFactory.getPost(threadId, rootPostId);
          
          parsedRootPosts.push({
            author: rootPost.madeBy,
            displayName: shortenAuthor(rootPost.madeBy),
            message: rootPost.message,
            timestamp: new Date(rootPost.timestamp * 1000),
            postId: rootPost.postId.toNumber(),
            likes: rootPost.likes
          })
        }
        
        return parsedRootPosts.slice().reverse(); //display threads in order of date of creation
        
      }
    

    const getRootPosts = async () => {
        try {
            const { ethereum } = window;
            
            if (ethereum) {
              const signer = ethers.getDefaultProvider(process.env.REACT_APP_NETWORK);
              const threadsContractFactory = new ethers.Contract(contractAddress, contractABI, signer);
              
              const rootPostIds = await threadsContractFactory.rootPostIds(threadId)
                
              let parsedRootPosts = await retrieveRootPosts(threadsContractFactory, rootPostIds);
              
              setRootPosts(parsedRootPosts);
              setLoading(false);
              setVisibleClass("block");
              props.onClickOut(true);
            } else {
              console.log("Ethereum object doesn't exist!");
            }
          } catch (error) {
            console.log(error)
          }
    }
    
    function close() {
        setThread({});
        setVisibleClass("hidden");
        props.onClickOut(false);
    }

    useEffect(() => {
        getThreadById();
        getRootPosts()
    }, [isLoading, props.id]);

    const renderThreadContent = () => {
        if (isLoading){
            return (<></>);
        } else {
            return (
                <>
                    { thread && (
                        <ThreadContent {...thread}/>
                    )}
                    
                </>
            )
        }
    }
    
    return (
        <div className={'w-screen h-screen fixed top-0  left-0 z-20 flex ' + visibleClass} style={{backgroundColor:'rgba(0,0,0,.9)'}}>
             <ClickOutHandler onClickOut={() => close()}>
                <div className='border my-4 border-crypdit_dark-search_text w-3/4 md:w-1/2 bg-crypdit_dark text-crypdit_text mx-4 self-center mx-auto p-4 rounded-md'>
                    <div className="block scrollbar-hide overflow-scroll" style={{maxHeight: "calc(100vh - 200px)"}}>
                        {renderThreadContent()}

                        {!!thread && !!thread.threadId && (
                            <>
                                <hr className="border-crypdit_border my-4" />
                                <PostForm author key={"thread-"+thread.threadId} threadId={thread.threadId}/>
                                <hr className="border-crypdit_border my-4" />
                                <Posts threadId={thread.threadId} rootPosts={rootPosts}/>
                            </>
                        )}
                        
                    </div>       
                </div>
            </ClickOutHandler>
        </div>
    )
}

export default ThreadPopupModal;