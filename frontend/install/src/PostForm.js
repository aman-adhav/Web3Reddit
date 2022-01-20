import {useContext, useState} from 'react';
import AccountContext from './AccountContext';
import Textarea from './Textarea';
import { ethers } from "ethers";
import abi from './utils/DecenReddit.json';
import AuthModalContext from "./AuthModalContext";

function PostForm(props) {

   const threadId = props.threadId;
   const accountProps = useContext(AccountContext);
   const [postMessage, setPostMessage] = useState('');

   const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
   const contractABI = abi.abi;

   const authModalContext = useContext(AuthModalContext);
   
   function shortAccountAdr() {
        return accountProps.publicKey.substring(0,6) + "..." + accountProps.publicKey.substring(37, 41);
   }

   async function createPost(e) {
       e.preventDefault();
        try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const threadsContractFactory = new ethers.Contract(contractAddress, contractABI, signer);
          let threadTxn;
          if (props.rootPost){
            threadTxn = await threadsContractFactory.rootPost(threadId, postMessage);
          } else if (props.parentId >= 0) {
            threadTxn = await threadsContractFactory.subPost(threadId, postMessage, props.parentId);
          }

          console.log("Mining...", threadTxn.hash);
  
          await threadTxn.wait();
          console.log("Mined -- ", threadTxn.hash);

          console.log("Post created!")
          setPostMessage('');
          if (props.rootPost){
            props.onSubmit();
          } else {
            props.onCancel();
            props.onSubmit();
          }
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);

        if (error.code === "UNSUPPORTED_OPERATION"){
            authModalContext.setShow(true);
        }    
      }
   }

   function handleCancel() {
       if (props.onCancel) {
           return (
            <button 
                onClick={event => props.onCancel()}
                className="p-2 mr-2 border border-gray-300 rounded-full px-3 text-sm font-bold text-gray-300">
                   Cancel 
            </button>
           );
       } else{
           return <></>;
       }
   }


    return (
       <div>
           {accountProps.publicKey && (
               <>
                { !!props.author && (
                    <div className="mb-2">
                            Post as a/{shortAccountAdr()}
                        </div>
                )}
                <form onSubmit={e => createPost(e)}>
                        <Textarea className="w-full mb-3"
                            onChange={event => setPostMessage(event.target.value)}
                            value={postMessage}
                            placeholder={'Your comment. You can use markdown here. (No support for text formatting yet)'}/>
                        <div className="text-right" >
                            {handleCancel()}
                            <button
                                className="border border-gray-300 rounded-full px-3 text-sm font-bold bg-gray-300 text-crypdit_dark px-4 py-2 p-2">
                                Comment
                            </button>
                        </div>
                    </form>
               </>
               
           )}

           {!accountProps.publicKey && (
                <div>
                    Sign in
                </div>
           )}
           
        </div>
    );
}

export default PostForm;