import TimeAgo from 'timeago-react';
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

function ThreadContent(threadData) {
    return (
        <div className="block">
        <h5 className="text-crypdit_text-darker text-sm mb-1">Posted by a/{threadData.displayName} <TimeAgo datetime={threadData.timestamp} /></h5>
            <h2 className="text-2xl mb-3"><ReactMarkdown remarkPlugins={[gfm]} children={threadData.title}/></h2>
              <div className='text-sm leading-6'>
                <ReactMarkdown plugins={[gfm]} children={threadData.message} />
                </div>
        </div>      
      )
}

export default ThreadContent;