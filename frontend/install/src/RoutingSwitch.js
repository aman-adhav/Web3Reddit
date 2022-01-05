import { useEffect, useState } from "react";
import {Route, Switch, useLocation} from "react-router-dom";
import Board from "./Board";
import ThreadModal from "./ThreadModal";
import ThreadPopupModal from "./ThreadPopupModal";

function RoutingSwitch() {
    let location = useLocation();
    
    let threadId = null;

    const [threadOpen, setThreadOpen] = useState(false);

    if (location.state && (location.state.threadId !== undefined || location.state.threadId !== null)) {
      location.pathname='/';
      //if (threadOpen){
        threadId = location.state.threadId;
      // } else {
      //   location.state.threadId = null;
      // }
    }

    useEffect(()=> {
      console.log(threadOpen);
      // if (!threadOpen){
      //   threadId = null;
      // }
    }, [threadOpen])

    return (
        <div>
          {
            (threadId !== undefined) && (
              <div>
                <ThreadPopupModal id={threadId} onClickOut={(val) => setThreadOpen(val)}/>
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