import {ChatIcon, BellIcon, PlusIcon} from '@heroicons/react/outline';


function HeaderButton(props) {
    
    let defaultClassname = 'border border-gray-300 rounded-full px-3 text-sm font-bold h-8 ';
    if (props.outline) {
        defaultClassname += "text-gray-300 ";
    } else {
        defaultClassname += "bg-gray-300 text-crypdit_dark";
    }
    return ( 

        <button {...props} className={defaultClassname + props.className} />
    //     <>
    //     <button className="px-2 py-1">
    //         <ChatIcon className="text-white w-6 h-6 m-1 mx-2" />
    //     </button>

    //   <button className="px-2 py-1">
    //     <BellIcon className="text-white w-6 h-6 m-1 mx-2" />
    //   </button>

    //   <button className="px-2 py-1">
    //     <PlusIcon className="text-white w-6 h-6 m-1 mx-2" />
    //   </button> 
    //     </>       
    );
}

export default HeaderButton;