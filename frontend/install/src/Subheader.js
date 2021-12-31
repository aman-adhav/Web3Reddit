import SubheaderBanner from './subheader.jpg';
import SubheaderLogo from './subheader-logo.png';

function Subheader(){
    return (
        <>
            <div className='h-40 bg-cover' style={{backgroundImage:`url(${SubheaderBanner})`}}>
            </div>
            <div className="bg-crypdit_dark-search_text">
            <div className='mx-4 relative flex'>
                <div className="flex-shrink-0 h-20 w-20 rounded-full overflow-hidden relative -top-3 border-4 border-white bg-white">
                <img src={SubheaderLogo} />
                </div>
                <div className='pt-2 pl-4'>
                <h1 className="text-gray-300 text-3xl">Blockchain & Cryptocurrency Focused Discussions</h1>
                <h5 className="text-gray-500">c/blockchain</h5>
                </div>
            </div>
            </div>
        </>
    );
}

export default Subheader;