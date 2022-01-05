import ThreadContent from "./ThreadContent";
import {useState, useEffect} from 'react';
import { ethers } from "ethers";
import abi from './utils/DecenReddit.json';
import ClickOutHandler from "react-clickout-handler";

function ThreadPopupModal(props) {

    const threadId = props.id;
    const [thread, setThread] = useState([]);
    const [isLoading, setLoading] = useState(true);
    
    const [visibleClass, setVisibleClass] = useState("hidden");

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
              setVisibleClass("block");
              props.onClickOut(true);
            } else {
              console.log("Ethereum object doesn't exist!");
            }
          } catch (error) {
            console.log(error)
          }
    }

    // const mockPost = async () => {
    //     try {
    //       const { ethereum } = window;
    
    //       if (ethereum) {
    //         const provider = new ethers.providers.Web3Provider(ethereum);
    //         const signer = provider.getSigner();
    //         const threadsContractFactory = new ethers.Contract(contractAddress, contractABI, signer);
    //         const message = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\nIt is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
    //         const threadTxn = await threadsContractFactory.createThread(message, "This title is super cool and I love it a lot so please click me quickly, sdjfsdijfosdijfosdifjosdifjsodijfsoidjf");
    //         console.log("Mining...", threadTxn.hash);
    
    //         await threadTxn.wait();
    //         console.log("Mined -- ", threadTxn.hash);
    
    //         let threads = await threadsContractFactory.getThreadIds();
    //         console.log("Retrieved all the waves in threads...", threads);
    
    //         const createPost = await threadsContractFactory.rootPost(0, "random");
    //         console.log("Mining...", createPost.hash);
    
    //         await createPost.wait();
    //         console.log("Mined -- ", createPost.hash);
    
    //         const getTotalPosts = await threadsContractFactory.totalPosts(0);
    //         console.log("Total number of posts", getTotalPosts);
    
    //         const getPost = await threadsContractFactory.getPost(0, getTotalPosts-1);
    //         console.log("Posts for thread...", getPost);
    
    //       } else {
    //         console.log("Ethereum object doesn't exist!");
    //       }
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }
    
    function close() {
        setThread({});
        setVisibleClass("hidden");
        props.onClickOut(false);
    }

    useEffect(() => {
        getThreadById();
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
        <div className={'w-screen h-screen fixed top-0  left-0 z-20 flex ' + visibleClass} style={{backgroundColor:'rgba(0,0,0,.6)'}}>
             <ClickOutHandler onClickOut={() => close()}>
                <div className='border my-4 border-crypdit_dark-search_text w-3/4 md:w-1/2 bg-crypdit_dark text-crypdit_text mx-4 self-center mx-auto p-4 rounded-md'>
                    <div className="block scrollbar-hide overflow-scroll" style={{maxHeight: "calc(100vh - 200px)"}}>
                        {renderThreadContent()}
                    </div>       
                </div>
            </ClickOutHandler>
        </div>
    )
}

export default ThreadPopupModal;