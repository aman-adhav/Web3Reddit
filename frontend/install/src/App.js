import './style.css';
import Logo from './reddit-logo.png';
import {ChatIcon, BellIcon, PlusIcon, SearchIcon} from '@heroicons/react/outline';

function App() {
  return (
    <div>
      <header className="flex w-full bg-reddit_dark p-2">
        <div className="mx-4">
          <img src={Logo} className="w-8 n-8 bg-reddit_dark"/>
        </div>
        <form action="" className='bg-reddit_dark-search_text p-1 px-3 mx-5 flex rounded-md border border-gray-700 mx-4 flex-grow'>
          <SearchIcon className="text-gray-300 h-6 w-6 mt-1"/>
          <input type="text" className="bg-reddit_dark-search_text text-sm p-1 pl-2 pr-0 block focus:outline-none text-white" placeholder="Search functionality tbd"/>
        </form>

        <button className="px-2 py-1">
          <ChatIcon className="text-white w-6 h-6 m-1 mx-2" />
        </button>

        <button className="px-2 py-1">
          <BellIcon className="text-white w-6 h-6 m-1 mx-2" />
        </button>

        <button className="px-2 py-1">
          <PlusIcon className="text-white w-6 h-6 m-1 mx-2" />
        </button>

      </header>
    </div>
  );
}

export default App;
