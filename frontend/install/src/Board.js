import ThreadForm from "./ThreadForm";
import Subheader from "./Subheader";
import ThreadListings from "./ThreadListings";

function Board() {
    return (
        <div>
            <Subheader /> 
            <ThreadForm />
            <ThreadListings />
        </div>
    )
}

export default Board;