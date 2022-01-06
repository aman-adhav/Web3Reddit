import { useEffect, useState } from "react";
import {Route, Switch, useLocation, useHistory} from "react-router-dom";
import Board from "./Board";
import ThreadModal from "./ThreadModal";
import ThreadPopupModal from "./ThreadPopupModal";

function RoutingSwitch() {
    let location = useLocation();
    let history = useHistory();
    let threadId = null;

    const [threadOpen, setThreadOpen] = useState(false);

    if (location.state && (location.state.threadId !== null)) {
      location.pathname='/';
      threadId = location.state.threadId;
    }

    useEffect(()=> {
      if (!threadOpen){
        history.push('/');
      }
    }, [threadOpen])

    return (
        <div>
          {
            (threadId !== null) && (
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