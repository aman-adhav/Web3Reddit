import {useState, useEffect} from 'react';
import { ethers } from "ethers";
import abi from './utils/DecenReddit.json';
import Thread from "./Thread";
import PostForm from './PostForm';
import Posts from './Posts';

function ThreadModal(props) {

    const threadId = props.match.params.id;
    const [thread, setThread] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const contractABI = abi.abi;
    const [rootPostIds, setRootPostIds] = useState([]);

    function shortenAuthor(address) {
        return address.substring(0,6) + "..." + address.substring(37, 41);
    }

    function parseThreadData(threadData, walletVote){
        console.log(threadData, walletVote);
        return ({
            author: threadData.madeBy,
            displayName: shortenAuthor(threadData.madeBy),
            title: threadData.title,
            message: threadData.message,
            timestamp: new Date(threadData.timestamp * 1000),
            threadId: threadData.threadId.toNumber(),
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
              setLoading(false);
      
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
            } else {
              console.log("Ethereum object doesn't exist!");
            }
          } catch (error) {
            console.log(error)
          }
    }

    useEffect(() => {
        getThreadById();
        getRootPostIds();
    }, [isLoading]);

    const renderThread = () => {
        if (isLoading){
            return (<></>);
        } else {
            return (
                <>
                    {!!thread && (
                        <Thread {...thread} clickable={false}/>
                    )}
                    
                    {!!thread && (
                            <>
                                <hr className="border-crypdit_border my-4" />
                                <PostForm author key={"thread-"+thread.threadId} onSubmit={event => setLoading(true)} threadId={thread.threadId} rootPost/>
                                <hr className="border-crypdit_border my-4" />
                                <Posts threadId={thread.threadId} postIds={rootPostIds} currLevel={0} />
                            </>
                    )}
                    
                </>
            )
        }
    }

    return (
        <div className="bg-crypdit_dark py-4 px-6 min-h-screen">
            <div className="bg-crypdit_dark-search_form p-3 rounded-md">
                {renderThread()}
            </div>
        </div>
    );
}

export default ThreadModal;