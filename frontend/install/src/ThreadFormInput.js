function ThreadFormInput (props) {
    return (
      <input {...props} className={"bg-crypdit_dark-search_form text-crypdit_text p-2 border border-crypdit_dark-search_text rounded-md block "+props.className} />
    );
  }
  
  export default ThreadFormInput;