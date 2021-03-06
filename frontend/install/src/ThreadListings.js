import { useEffect, useState } from "react";
import Thread from "./Thread";
import { ethers } from "ethers";
import abi from './utils/DecenReddit.json';

function ThreadListings() {

    const [threads, setThreads] = useState([]);
  
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const contractABI = abi.abi;

      function shortenAuthor(address) {
        return address.substring(0,6) + "..." + address.substring(37, 41);
      }

      async function retrieveThreads(threadsContractFactory, threadIds){
        let parsedThreads = [];
        for (const threadId in threadIds){
          let [thread, walletVote] = await threadsContractFactory.getThread(threadId);
          console.log(walletVote);
          // let water = await threadsContractFactory.getTempVotes(threadId);
          // console.log(water[0], "yesssss");

          parsedThreads.push({
            author: thread.madeBy,
            displayName: shortenAuthor(thread.madeBy),
            title: thread.title,
            message: thread.message,
            timestamp: new Date(thread.timestamp * 1000),
            threadId: thread.threadId.toNumber(),
            votes: thread.votes.toNumber(),
            walletHolderVote: walletVote.toNumber()
          })
        }

        return parsedThreads.slice().reverse(); //display threads in order of date of creation
        
      }
    
    
      const getThreads = async () => {
        try {
          const { ethereum } = window;
    
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const threadsContractFactory = new ethers.Contract(contractAddress, contractABI, signer);
            
            const threadIds = await threadsContractFactory.getThreadIds();
            console.log("ThreadIds...", threadIds);
            let parsedThreads = await retrieveThreads(threadsContractFactory, threadIds);
            
            setThreads(parsedThreads);
    
          } else {
            console.log("Ethereum object doesn't exist!");
          }
        } catch (error) {
          console.log(error)
        }
      }
    
      useEffect(() => {
        getThreads();
      }, [])

    return(
        <div className="bg-crypdit_dark px-6 min-h-screen">
          {threads.map(threadData => (
            <Thread key={threadData.threadId} {...threadData} clickable={true}/>
          ))}
        </div>
      );
}

export default ThreadListings;