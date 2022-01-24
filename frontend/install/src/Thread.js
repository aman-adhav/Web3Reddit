import {Link} from "react-router-dom";
import ThreadContent from "./ThreadContent";
import ThreadVote from "./ThreadVote";


function Thread(threadData) {

    const threadId = threadData.threadId;
    const threadUrl = "/threads/"+threadId;
    
    const threadLinkClass = () => {
      const linkClassName = "block border border-crypdit_border bg-crypdit_post-form p-2 rounded-md"
      if (threadData.clickable){
        return (
          <Link to={{pathname: threadUrl, state: {threadId: threadId}}} className={linkClassName + " hover:border-crypdit_text cursor-pointer"}>
            <div className="flex relative">
              <ThreadVote walletHolderVote={threadData.walletHolderVote} votes={threadData.votes} voteType={"thread"} threadId={threadId}/>
              <ThreadContent {...threadData} />
            </div>
          </Link>
        );
      } else {
        return (
          <div className="block border border-none bg-crypdit_post-form rounded-md">
            <div className="flex relative">
              <ThreadVote walletHolderVote={threadData.walletHolderVote} votes={threadData.votes} voteType={"thread"} threadId={threadId}/>
              <ThreadContent {...threadData} />
            </div>
          </div>
        );
      }
    }

    return (
        <div className='text-crypdit_text pb-4'>
          {threadLinkClass()}
        </div>
    );
}

export default Thread;