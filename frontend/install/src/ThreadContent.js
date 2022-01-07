import TimeAgo from 'timeago-react';

function ThreadContent(threadData) {
    return (
        <>
        <h5 className="text-crypdit_text-darker text-sm mb-1">Posted by a/{threadData.displayName} <TimeAgo datetime={threadData.timestamp?.toString()} /></h5>
            <h2 className="text-2xl mb-3">{threadData.title}</h2>
              <div className='text-sm leading-6'>
                {threadData.message}
              </div>
        </>      
      )
}

export default ThreadContent;