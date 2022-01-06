import ClickOutHandler from "react-clickout-handler";
import Textarea from "./Textarea";
import ThreadFormInput from "./ThreadFormInput";
import {useState, useContext, useEffect} from 'react';
import { ethers } from "ethers";
import abi from './utils/DecenReddit.json';
import {Redirect} from 'react-router-dom';

import ThreadFormModalContext from './ThreadFormModalContext';
import AuthModalContext from "./AuthModalContext";

function ThreadFormModal() {

    const modalContext = useContext(ThreadFormModalContext);
    const authModalContext = useContext(AuthModalContext);

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const contractABI = abi.abi;

    const [newThreadId, setNewThreadId] = useState('');
    
    const [clickOutState, setClickOutState] = useState(true);

    async function createThread() {
        try {
          const { ethereum } = window;
    
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const threadsContractFactory = new ethers.Contract(contractAddress, contractABI, signer);
            const threadTxn = await threadsContractFactory.createThread(message, title);
            console.log("Mining...", threadTxn.hash);
    
            await threadTxn.wait();
            console.log("Mined -- ", threadTxn.hash);

            modalContext.setShow(false);
    
          } else {
            console.log("Ethereum object doesn't exist!");
          }
        } catch (error) {
          console.log(error);

          if (error.code === "UNSUPPORTED_OPERATION"){
              authModalContext.setShow(true);
              setClickOutState(false);
          }    
        }
    }

    useEffect(() => {
        if (!authModalContext.show){
            setClickOutState(true);
        }
        let threadsContractFactory;
        const onNewThread = (threadId) => {
            setNewThreadId(threadId);
          };
      
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
        
            threadsContractFactory = new ethers.Contract(contractAddress, contractABI, signer);
            threadsContractFactory.on('NewThread', onNewThread);
        }
    
        return () => {
            if (threadsContractFactory) {
                threadsContractFactory.off('NewThread', onNewThread);
            }
        };

    }, [authModalContext.show])

    const visibleClass = modalContext.show ? "block" : 'hidden';
    
    if (newThreadId){
        return <Redirect to={"/threads/" + newThreadId} />
    } else {
        console.log("still the same");
    }

    return (
        <div className={'w-screen h-screen absolute top-0 left-0 z-20 flex ' + visibleClass} style={{backgroundColor:'rgba(0,0,0,.8)'}}>
            <ClickOutHandler enabled={clickOutState} onClickOut={() => modalContext.setShow(false)}>
                <div className='border border-crypdit_dark-search_text w-3/4 md:w-1/2 bg-crypdit_dark p-5 text-crypdit_text self-center mx-auto rounded-md'>
                    <h1 className="text-2xl mb-5">Create a post</h1>
                    <ThreadFormInput 
                        className={'w-full mb-3'} 
                        placeholder={'Title'} 
                        onChange={event => setTitle(event.target.value)}
                        value={title}/>
                    <Textarea 
                        className={'w-full mb-3'} 
                        placeholder={'Text (required)'} 
                        onChange={event => setMessage(event.target.value)}
                        value={message} />
                    <div className="text-right">
                        <button className="border border-gray-300 rounded-full px-3 text-sm font-bold text-gray-300 px-4 py-2 mr-3"
                            onClick={() => modalContext.setShow(false)}>
                            Cancel
                        </button>
                        <button 
                            onClick={() => createThread()}
                            className="border border-gray-300 rounded-full px-3 text-sm font-bold bg-gray-300 text-crypdit_dark px-4 py-2">
                            Post
                        </button>
                    </div>
                </div>
            </ClickOutHandler>
        </div>
            
    )
}

export default ThreadFormModal;