import {Route, Switch, useLocation} from "react-router-dom";
import Board from "./Board";
import ThreadModal from "./ThreadModal";
import ThreadPopupModal from "./ThreadPopupModal";

function RoutingSwitch() {
    let location = useLocation();
    
    let threadId = undefined;

    if (location.state && (location.state.threadId !== undefined || location.state.threadId !== null)) {
      location.pathname='/';
      threadId = location.state.threadId;
      console.log("changed to...", threadId);
    } 

    return (
        <div>
          {
            (threadId !== undefined) && (
              <div>
                <ThreadPopupModal id={threadId}/>
              </div>
          
            )
          }
              
          <Switch location={location}>
          
          <Route exact path="/" component={Board} />
          <Route exact path="/threads/:id" component={ThreadModal}/>
        </Switch>
        </div>
    )
}

export default RoutingSwitch;