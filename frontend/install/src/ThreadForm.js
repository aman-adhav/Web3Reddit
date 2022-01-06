import Avatar from './avatar.png';
import './style.css';
import {useContext} from "react";
import ThreadFormModalContext from './ThreadFormModalContext';

function ThreadForm() {
    const modalContext = useContext(ThreadFormModalContext);

    return (
        <div className="bg-crypdit_dark px-6 py-4 text-gray-400">

        <div className="border border-crypdit_border p-2 rounded-md flex bg-crypdit_post-form">
          <div className="rounded-full bg-gray-600 overflow-hidden w-10 h-10">
            <img src={Avatar} alt="" style={{filter:'invert(100%)'}} />
          </div>
          <form action="" className="flex-grow bg-crypdit_post-text border border-crypdit_border ml-4 mr-2 rounded-md">
            <input type="text"
              onFocus={event => {
                event.preventDefault();
                modalContext.setShow(true)
              }} 
              className="bg-crypdit_post-text p-2 px-3 text-sm block w-full rounded-md" placeholder="New post" />
          </form>
        </div>
      </div>
    );
}

export default ThreadForm;