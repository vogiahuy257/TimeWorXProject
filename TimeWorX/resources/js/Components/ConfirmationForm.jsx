import React from "react";

const ConfirmationForm = ({ type,styleToBox, styleToChildren,children, handleConfirm }) => {

    return (
        <div id="confirmation-form" className={`${type} rounded-2xl pr-2 flex ${styleToBox}`}>

            <div className="w-1/4 h-full relative">
                {type == 'help' && 
                <>
                    <svg className='icon-confirmation absolute left-8 -translate-y-1/2' id="icon-confirmation" width="70" height="70" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="bg-icon-config" fillRule="evenodd" clipRule="evenodd" d="M45.571 68.4064C46.0378 68.0508 46.579 67.8055 47.1492 67.6667C62.1698 64.0087 73.32 50.4665 73.32 34.32C73.32 15.3656 57.9544 0 39 0C20.0456 0 4.67999 15.3656 4.67999 34.32C4.67999 47.018 11.576 58.1053 21.8272 64.0412C22.5604 64.4658 23.1679 65.0833 23.5394 65.8447L28.2812 75.5654C29.3877 77.8339 32.2928 78.5231 34.3004 76.9935L45.571 68.4064Z" fill="currentColor"/>
                        <ellipse className="item-icon-config" cx="38.8213" cy="46.8696" rx="2.43478" ry="2.43478" fill="currentColor"/>
                        <path className="item-icon-config" d="M43.6305 20.4316C41.8412 19.5492 39.8305 19.2173 37.8525 19.4777C35.8746 19.7381 34.0183 20.5791 32.5184 21.8945C31.5445 22.7486 30.7493 23.7776 30.17 24.9218C29.6493 25.9501 30.3284 27.1095 31.4417 27.4078L32.1137 27.5878C33.227 27.8861 34.3449 27.1813 35.0532 26.272C35.2545 26.0137 35.4805 25.7737 35.7291 25.5557C36.5049 24.8753 37.4651 24.4403 38.4881 24.3056C39.5112 24.1709 40.5513 24.3426 41.4767 24.799C42.4022 25.2554 43.1716 25.976 43.6875 26.8696C44.2035 27.7633 44.4429 28.7899 44.3754 29.8196C44.3079 30.8492 43.9366 31.8358 43.3084 32.6545C42.6802 33.4731 41.8234 34.0871 40.8462 34.4188C40.0434 34.6957 39.8273 34.6957 38.9999 34.6957L38.3043 34.6957C37.1517 34.6957 36.2173 35.6301 36.2173 36.7827V40.2609C36.2173 41.4135 37.1517 42.3479 38.3043 42.3479H38.9999C40.1525 42.3479 41.0869 41.4135 41.0869 40.2609C41.0869 39.7503 41.4569 39.3184 41.9474 39.1763C42.0975 39.1329 42.2519 39.0841 42.4115 39.03C44.3006 38.3887 45.9572 37.2016 47.1717 35.6189C48.3861 34.0361 49.104 32.1288 49.2345 30.138C49.365 28.1473 48.9022 26.1626 47.9047 24.4348C46.9072 22.7071 45.4198 21.314 43.6305 20.4316Z" fill="currentColor"/>
                    </svg>
                    
                    <svg className="h-40 icon-confirmation icon-bottom rounded-bl-2xl" width="140" height="88" viewBox="0 0 140 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="bg-icon-config" cx="18" cy="40" r="11" fill="currentColor"/>
                        <circle className="bg-icon-config" cx="77.3911" cy="32.3911" r="8.39107" fill="currentColor"/>
                        <circle className="bg-icon-config" cx="60.5" cy="76.5" r="11.5" fill="currentColor"/>
                        <circle className="bg-icon-config" cx="45.1955" cy="18.1955" r="4.19554" fill="currentColor"/>
                        <circle className="bg-icon-config" cx="22.4714" cy="2.09777" r="2.09777" fill="currentColor"/>
                        <circle className="bg-icon-config" cx="31.523" cy="142.523" r="76.1453" transform="rotate(-48.1512 31.523 142.523)" fill="currentColor"/>
                    </svg>
                </>
                }

                {type == 'error' &&
                <>
                <svg className='icon-confirmation absolute left-8 -translate-y-1/2' id="icon-confirmation" width="70" height="70" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M47.8055 67.6794C48.1344 67.4706 48.4933 67.3124 48.8664 67.2006C63.0117 62.9621 73.3199 49.8448 73.3199 34.32C73.3199 15.3656 57.9543 0 38.9999 0C20.0455 0 4.67993 15.3656 4.67993 34.32C4.67993 47.8227 12.4777 59.5042 23.8158 65.1068C23.8286 65.1132 23.8233 65.1326 23.8091 65.1315C23.7999 65.1308 23.793 65.1396 23.7957 65.1483L26.9037 74.9903C27.6946 77.4949 30.6437 78.5705 32.8614 77.1631L47.8055 67.6794Z" fill="#C81912"/>
                    <path d="M48.8134 27.6379C49.6418 26.8095 49.6418 25.4664 48.8134 24.638L48.362 24.1865C47.5336 23.3581 46.1904 23.3581 45.362 24.1865L39 30.5486L32.6379 24.1865C31.8095 23.3581 30.4664 23.3581 29.638 24.1865L29.1865 24.638C28.3581 25.4664 28.3581 26.8095 29.1865 27.6379L35.5486 34L29.1865 40.362C28.3581 41.1904 28.3581 42.5336 29.1865 43.362L29.638 43.8134C30.4664 44.6419 31.8095 44.6419 32.6379 43.8134L39 37.4514L45.362 43.8134C46.1904 44.6418 47.5336 44.6419 48.362 43.8134L48.8134 43.362C49.6419 42.5336 49.6418 41.1904 48.8134 40.362L42.4514 34L48.8134 27.6379Z" fill="currentColor"/>
                </svg>
                <svg className="h-40 icon-confirmation icon-bottom rounded-bl-2xl" width="93" height="87" viewBox="0 0 93 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle  className="bg-icon-config" cx="33.9429" cy="36.8292" r="6.82918" fill="currentColor"/>
                    <circle className="bg-icon-config" cx="79" cy="27" r="13" fill="currentColor"/>
                    <path className="bg-icon-config" fillRule="evenodd" clipRule="evenodd" d="M32.5511 49.4389C32.4191 48.7782 31.9357 48.2428 31.2918 48.0442C30.5686 47.8212 29.7827 48.0647 29.3124 48.6576L26.6097 52.0648C24.7585 54.3984 21.7904 55.5017 18.8235 55.2372C11.5519 54.5888 4.04597 55.1701 -3.42021 57.1407C-37.9518 66.255 -58.5567 101.637 -49.4425 136.169C-40.3282 170.7 -4.9463 191.305 29.5853 182.191C64.1169 173.077 84.7218 137.695 75.6076 103.163C70.3813 83.3617 56.5177 68.1397 39.13 60.4748C36.2342 59.1983 34.0008 56.6968 33.3809 53.5935L32.5511 49.4389Z" fill="currentColor"/>
                    <circle className="bg-icon-config" cx="21.5475" cy="4.5476" r="3.49096" transform="rotate(-22.0902 21.5475 4.5476)" fill="currentColor"/>
                </svg>
                </>
                }
                
            </div>

            <div className="w-3/4 flex flex-col justify-center h-ful items-end mx-6">

                <div>
                    {type == "error" && (
                        <p className="ml-4 text-3xl mb-2">Oh snap!</p>
                    )}
                    <p className={`${type == 'error' ? 'ml-4 text-sm':null} ${styleToChildren}`}>{children}</p>
                </div>
                <div className="btn mt-4">
                    {type == "error" ? (
                        <button 
                            className="px-4 py-1 rounded-md"
                            onClick={() =>handleConfirm(false)}
                        >
                            ok
                        </button>
                    ) : null }

                    {type == "help" ? (
                        <>
                            <button
                                className=" px-4 py-1 rounded-md mr-1"
                                onClick={() => handleConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-1 rounded-md ml-2"
                                onClick={() => handleConfirm(true)}
                            >
                                Confirm
                            </button>
                        </>
                    ):null}
                    
                </div>
                
            </div>
        </div>
    );
};

export default ConfirmationForm;
