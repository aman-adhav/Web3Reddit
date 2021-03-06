import ThreadContent from "./ThreadContent";
import {useState, useEffect} from 'react';
import { ethers } from "ethers";
import abi from './utils/DecenReddit.json';
import ClickOutHandler from "react-clickout-handler";
import PostForm from "./PostForm";
import Posts from "./Posts";
import ThreadVote from "./ThreadVote";

function ThreadPopupModal(props) {

    const threadId = props.id;
    const [thread, setThread] = useState([]);
    const [isLoading, setLoading] = useState(true);
    
    const [visibleClass, setVisibleClass] = useState("hidden");

    const [rootPostIds, setRootPostIds] = useState([]);
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const contractABI = abi.abi;

    function shortenAuthor(address) {
        return address.substring(0,6) + "..." + address.substring(37, 41);
    }

    function parseThreadData(threadData, walletVote){
        return ({
            author: threadData.madeBy,
            displayName: shortenAuthor(threadData.madeBy),
            title: threadData.title,
            message: threadData.message,
            timestamp: new Date(threadData.timestamp * 1000),
            threadId: threadData.threadId,
            votes: threadData.votes.toNumber(),
            walletHolderVote: walletVote.toNumber(),
          })
    }

    const getThreadById = async () => {
        try {
            const { ethereum } = window;
            
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
              //const signer = ethers.getDefaultProvider(process.env.REACT_APP_NETWORK);
              const threadsContractFactory = new ethers.Contract(contractAddress, contractABI, signer);
              
              const [threadData, walletHolderVote] = await threadsContractFactory.getThread(threadId);
              
              setThread(parseThreadData(threadData, walletHolderVote));
            } else {
              console.log("Ethereum object doesn't exist!");
            }
          } catch (error) {
            console.log(error)
          }
    }

    const getRootPostIds = async () => {
        try {
            const { ethereum } = window;
            
            if (ethereum) {
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              //const signer = ethers.getDefaultProvider(process.env.REACT_APP_NETWORK);
              const threadsContractFactory = new ethers.Contract(contractAddress, contractABI, signer);
              
              const parsedRootPostIds = await threadsContractFactory.rootPostIds(threadId)
              
              setRootPostIds(parsedRootPostIds);

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
        getRootPostIds();
        console.log("useEffect was performed")
    }, [isLoading, props.id]);

    const renderThreadContent = () => {
        if (isLoading){
            return (<></>);
        } else {
            return (
                <>
                    { thread && (
                        <div className="flex relative">
                         <ThreadVote walletHolderVote={thread.walletHolderVote} votes={thread.votes} voteType={"thread"} threadId={thread.threadId}/>
                         <ThreadContent {...thread}/>
                       </div>
                    )}
                    
                </>
            )
        }
    }
    
    return (
        <div className={'w-screen h-screen fixed top-0  left-0 z-20 flex ' + visibleClass} style={{backgroundColor:'rgba(0,0,0,.9)'}}>
             <ClickOutHandler onClickOut={() => close()}>
                <div className='border my-4 border-crypdit_dark-search_text w-3/4 md:w-1/2 bg-crypdit_dark-search_form text-crypdit_text mx-4 self-center mx-auto p-4 rounded-md'>
                    <div className="block scrollbar-hide overflow-scroll" style={{maxHeight: "calc(100vh - 200px)"}}>
                        {renderThreadContent()}

                        {!!thread && thread.threadId >= 0 && (
                            <>
                                <hr className="border-crypdit_border my-4" />
                                <PostForm author key={"thread-"+thread.threadId} onSubmit={event => setLoading(true)} threadId={thread.threadId} rootPost/>
                                <hr className="border-crypdit_border my-4" />
                                <Posts threadId={thread.threadId} postIds={rootPostIds} currLevel={0} />
                            </>
                        )}
                        
                    </div>       
                </div>
            </ClickOutHandler>
        </div>
    )
}

export default ThreadPopupModal;