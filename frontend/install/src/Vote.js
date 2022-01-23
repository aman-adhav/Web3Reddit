import {useState} from 'react';
import { ethers } from "ethers";
import abi from './utils/DecenReddit.json';

function Vote(props) {

    let walletHolderVote = props.walletHolderVote;
    let votes = props.votes;
    const [walletHolderDirection, setWalletHolderDirection] = useState(walletHolderVote);
    const voteType = props.voteType;

    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const contractABI = abi.abi;

    async function handleVote(directionNum) {
        
        if (directionNum !== walletHolderDirection) {
            try {
                const { ethereum } = window;
          
                if (ethereum) {
                  const provider = new ethers.providers.Web3Provider(ethereum);
                  const signer = provider.getSigner();
                  const threadsContractFactory = new ethers.Contract(contractAddress, contractABI, signer);

                  if (voteType === "thread"){
                    const threadTxn = await threadsContractFactory.threadVote(props.threadId, directionNum);
                    console.log("Mining...", threadTxn.hash);
            
                    await threadTxn.wait();
                    console.log("Mined -- ", threadTxn.hash);
                  } else {
                    const threadTxn = await threadsContractFactory.postVote(props.threadId, props.postId, directionNum);
                    console.log("Mining...", threadTxn.hash);
            
                    await threadTxn.wait();
                    console.log("Mined -- ", threadTxn.hash);
                  }
                  
                  setWalletHolderDirection(walletHolderVote + directionNum);
                  votes = votes + directionNum;
          
                } else {
                  console.log("Ethereum object doesn't exist!");
                }
              } catch (error) {
                console.log(error);
            }
        }

      }
    

    function arrow(direction) {
        const directionNum = direction === 'up' ? 1 : -1;
        let classNames = 'inline-block h-5 relative top-1 ';
    
        if (directionNum === walletHolderDirection) {
          classNames += 'text-reddit_red';
        } else {
          classNames += 'text-reddit_text-darker hover:text-white';
        }
    
        if (direction === 'up') {
          return (
            <button onClick={() => handleVote(1)} className={classNames}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            </button>
          );
        } else {
          return (
            <button onClick={() => handleVote(-1)} className={classNames}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          );
        }
      }


    return (
        <div className={'inline-block mr-2'}>
            {arrow('up')}
            <div className={'inline-block'}>{votes}</div>
            {arrow('down')}
        </div>
    )
} 

export default Vote;