import MetamaskLogo from './metamask-fox.svg';
import {useContext} from 'react';
import AuthModalContext from './AuthModalContext';
import ClickOutHandler from 'react-clickout-handler';
import AccountContext from './AccountContext';

function AuthModal() {

    const modalContext = useContext(AuthModalContext)
    const visibleClass = modalContext.show ? 'block' : 'hidden'; 

    const account = useContext(AccountContext);


    const connectWallet = async () => {
        try {
          const { ethereum } = window;
    
          if (!ethereum) {
            alert("Get MetaMask!");
            return;
          }
    
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    
          console.log("Connected", accounts[0]);

          account.setPublicKey(accounts[0]);

          modalContext.setShow(false);
          //setCurrentAccount(accounts[0]);
        } catch (error) {
          console.log(error)
        }
    }
    

    return (
        <div className={'w-screen h-screen absolute top-0 left-0 z-30 flex ' + visibleClass} style={{backgroundColor:'rgba(0,0,0,.6)'}}>
            <ClickOutHandler onClickOut={() => modalContext.setShow(false)}>
                <div className='border border-crypdit_dark-search_text w-1/2 sm:w-1/4 bg-crypdit_dark p-5 text-crypdit_text mx-4 self-center mx-auto rounded-md'>
                    <h1 className="text-2xl mb-3 text-center font-bold">Login with Metamask</h1>
                    <h1 className="text-center m-4">Please connect to the Rinkeby Test Network</h1>
                    <button className="w-full justify-center border border-gray-300 rounded-full flex px-3 hover:bg-gray-300 hover:text-black items-stretch text-sm font-bold h-8" style={{borderRadius:'.3rem'}} onClick={connectWallet}>
                        <img src={MetamaskLogo} alt="" className="w-8 h-8"/>
                        <div className="m-1">Log In</div>
                    </button>
                    <h5 className='text-center m-4'>To get test ETH use a <a href="https://faucets.chain.link/rinkeby" className='text-green-700'>verified faucet</a>.</h5>
                </div>
            </ClickOutHandler>
        </div>
    );
}

export default AuthModal;