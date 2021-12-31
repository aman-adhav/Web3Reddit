import Logo from './weddit-logo.png';
import {SearchIcon, ChevronDownIcon, UserIcon, LoginIcon, PlusIcon} from '@heroicons/react/outline';
import Avatar from './avatar.png';
import HeaderButton from './HeaderButton';
import {useState} from 'react';
import ClickOutHandler from 'react-clickout-handler';
function Header() {
    const [userDropdownVisbility, setUserDropdownVisbility] = useState('hidden')

    function toggleUserDropdown(){
      if (userDropdownVisbility === "hidden") {
        setUserDropdownVisbility('block');
      } else {
        setUserDropdownVisbility('hidden');
      }
    }
    return (
        <header className="w-full bg-crypdit_dark p-2">
        <div className="mx-4 flex relative">
          <img src={Logo} alt="" className="w-8 h-8 mr-4"/>
        
          <form action="" className="bg-crypdit_dark-search_text px-3 flex rounded-md border border-gray-700 mx-4 flex-grow">
            <SearchIcon className="text-gray-300 h-6 w-6 mt-1" />
            <input type="text" className="bg-crypdit_dark-search_text text-sm p-1 pl-2 pr-0 block focus:outline-none text-white" placeholder="Searching tldr" />
          </form>


          <div className='mx-2 hidden sm:block'>
            <HeaderButton outline className="mr-1">Log In</HeaderButton>
            <HeaderButton className="">Sign Up</HeaderButton>
          </div>
          <ClickOutHandler onClickOut={() => setUserDropdownVisbility("hidden")}>

            <button className='rounded-md flex ml-4 border border-gray-700' onClick={() => toggleUserDropdown() }>
              <UserIcon className="w-6 h-6 text-white text-gray-400 m-1"/>
              {/* <div className="w-8 h-8 bg-gray-600 rounded-md">
                <img src={Avatar} alt="" style={{filter: 'invert(100%)'}} className="block"/> 
                
              </div> */}
              <ChevronDownIcon className="text-gray-500 w-5 h-5 mt-2 ml-1" />
            </button>
          </ClickOutHandler>
          <div className={"absolute right-0 top-8 bg-crypdit_dark border border-gray-700 z-10 rounded-md overflow-hidden text-crypdit_text " + userDropdownVisbility}>
            <button className='block flex w-50 py-2 px-3 hover:bg-gray-300 hover:text-black text-sm'>
              <LoginIcon className='w-5 h-5 mr-2'/>
              Log In / Sign up
            </button>
          </div>
        </div>
      </header>
    );
}

export default Header;