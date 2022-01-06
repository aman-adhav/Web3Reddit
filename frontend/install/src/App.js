import './style.css';
import AuthModal from './AuthModal';
import Header from "./Header";
import {useState, useEffect} from 'react';
import AuthModalContext from './AuthModalContext';
import AccountContext from './AccountContext';

import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import Board from './Board';
import ThreadModal from './ThreadModal';
import RoutingSwitch from './RoutingSwitch';
import ThreadFormModal from './ThreadFormModal';
import ThreadFormModalContext from './ThreadFormModalContext';

function App() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showThreadFormModal, setShoWThreadFormModal] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }   

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  return (
    <AuthModalContext.Provider value={{show:showAuthModal, setShow: setShowAuthModal}}>
      <ThreadFormModalContext.Provider value={{show:showThreadFormModal, setShow: setShoWThreadFormModal}}>
      <AccountContext.Provider value={{publicKey: currentAccount, setPublicKey: setCurrentAccount}}>
      <Router>
        <Header />
        <AuthModal/>
        <ThreadFormModal />
        <RoutingSwitch />
      </Router> 

      </AccountContext.Provider>
      </ThreadFormModalContext.Provider>
    </AuthModalContext.Provider>
  );
}

export default App;
