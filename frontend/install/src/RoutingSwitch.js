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

    if (location.state && location.state.threadId) {
      location.pathname = '/';
      if (threadOpen) {
        threadId = location.state.threadId;
      } else {
        location.state.threadId = null;
      }
  
    }

    function closeModal(val){
      if (!val) {
        history.push('/');
      }
      setThreadOpen(val);
    }

    useEffect(() => {
      setThreadOpen(true);
    }, [threadId]);
  
    useEffect(() => {
      threadId = null;
    }, [threadOpen]);

    return (
        <div>
          {
            (threadId !== null) && (
              <div>
                <ThreadPopupModal id={threadId} onClickOut={(val) => closeModal(val)}/>
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