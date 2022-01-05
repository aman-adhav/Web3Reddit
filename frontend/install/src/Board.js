import PostForm from "./PostForm";
import Subheader from "./Subheader";
import ThreadListings from "./ThreadListings";

function Board() {
    return (
        <div>
            <Subheader /> 
            <PostForm />
            <ThreadListings />
        </div>
    )
}

export default Board;