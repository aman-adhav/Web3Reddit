import {useState, useEffect} from 'react';
import { ethers } from "ethers";
import abi from './utils/DecenReddit.json';
import Thread from "./Thread";

function ThreadModal(props) {

    const threadId = props.match.params.id;
    const [thread, setThread] = useState([]);
    const [isLoading, setLoading] = useState(true);

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
    }, [isLoading]);

    const renderThread = () => {
        if (isLoading){
            return (<></>);
        } else {
            return (
                <>
                    { thread && (
                        <Thread {...thread} clickable={false}/>
                    )}
                    
                </>
            )
        }
    }

    return (
        <div className="bg-crypdit_dark py-4 px-4">
            {renderThread()}
        </div>
    );
}

export default ThreadModal;