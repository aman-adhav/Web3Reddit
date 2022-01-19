import Logo from './weddit-logo.png';
import {SearchIcon, ChevronDownIcon, ChatIcon, UserIcon, BellIcon, LoginIcon, PlusIcon} from '@heroicons/react/outline';
import Avatar from './avatar.png';
import {useState, useContext} from 'react';
import ClickOutHandler from 'react-clickout-handler';
import AuthModalContext from './AuthModalContext';
import AccountContext from './AccountContext';
import {Link} from "react-router-dom";

function Header() {
    const [userDropdownVisbility, setUserDropdownVisbility] = useState('hidden')

    function toggleUserDropdown(){
      if (userDropdownVisbility === "hidden") {
        setUserDropdownVisbility('block');
      } else {
        setUserDropdownVisbility('hidden');
      }
    }

    const authModal = useContext(AuthModalContext);

    const account = useContext(AccountContext);

    const shortAccountAdr = account.publicKey.substring(0,6) + "..." + account.publicKey.substring(37, 41);

    return (
        <header className="w-full bg-crypdit_dark p-2">
        <div className="mx-4 flex relative">
          <Link to="/">
            <img src={Logo} alt="" className="w-8 h-8 mr-4"/>
          </Link>
        
          <form action="" className="bg-crypdit_dark-search_text px-3 flex rounded-md border border-gray-700 mx-4 flex-grow">
            <SearchIcon className="text-gray-300 h-6 w-6 mt-1" />
            <input type="text" className="bg-crypdit_dark-search_text text-sm p-1 pl-2 pr-0 block focus:outline-none text-white" placeholder="Searching tldr" />
          </form>

          {account.publicKey && (
            <>
              <button className="px-2 py-1">
                <ChatIcon className="text-gray-400 w-6 h-6 mx-2" />
              </button>
              <button className="px-2 py-1">
                <BellIcon className="text-gray-400 w-6 h-6 mx-2" />
              </button>
              <button className="px-2 py-1">
                <PlusIcon className="text-gray-400 w-6 h-6 mx-2" />
              </button>
            </>
          )}

          {!account.publicKey && (
            <div className='mx-2 hidden sm:block'>
              <button 
                onClick={() => authModal.setShow(true)} 
                className="mr-1 h-8 border border-gray-300 rounded-full px-3 text-sm font-bold text-gray-300 hover:bg-gray-300 hover:text-black">
                Log In
              </button>
            </div>
          )}
          <ClickOutHandler onClickOut={() => setUserDropdownVisbility("hidden")}>
            <button className='rounded-md flex ml-4 border border-gray-700' onClick={() => toggleUserDropdown() }>
              {!account.publicKey && (
                <UserIcon className="w-6 h-6 text-white text-gray-400 m-1"/>
              )}
              {account.publicKey && (
                <div className="w-8 h-8 bg-gray-600 rounded-md">
                  <img src={Avatar} alt="" style={{filter: 'invert(100%)'}} className="block"/> 
                </div>
              )}
              
              <ChevronDownIcon className="text-gray-500 w-5 h-5 mt-2 ml-1" />
            </button>
            <div className={"absolute right-0 top-8 bg-crypdit_dark border border-gray-700 z-10 rounded-md overflow-hidden text-crypdit_text " + userDropdownVisbility}>
            {account.publicKey && (
              <span className="block w-50 py-2 px-3 text-sm">
                Hello, {shortAccountAdr}!
              </span>
            )}
            
            {!account.publicKey && (
              <button onClick={() => authModal.setShow(true)} className='block flex w-50 py-2 px-3 hover:bg-gray-300 hover:text-black text-sm'>
                <LoginIcon className='w-5 h-5 mr-2'/>
                Log In / Sign Up
              </button>
            )}
            </div>

            
          </ClickOutHandler>
        </div>
      </header>
    );
}

export default Header;