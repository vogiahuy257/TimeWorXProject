import React from "react";

const ConfirmationForm = ({ type,styleToBox, styleToChildren,children, handleConfirm }) => {

    return (
        <div id="confirmation-form" className={`rounded-2xl flex ${styleToBox}`}>

            <div className="w-1/4 h-full relative">
                {type == 'help' && 
                <svg className='icon-confirmation absolute left-8 -translate-y-1/2' id="icon-confirmation" width="78" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="bg-icon-config" fillRule="evenodd" clipRule="evenodd" d="M45.571 68.4064C46.0378 68.0508 46.579 67.8055 47.1492 67.6667C62.1698 64.0087 73.32 50.4665 73.32 34.32C73.32 15.3656 57.9544 0 39 0C20.0456 0 4.67999 15.3656 4.67999 34.32C4.67999 47.018 11.576 58.1053 21.8272 64.0412C22.5604 64.4658 23.1679 65.0833 23.5394 65.8447L28.2812 75.5654C29.3877 77.8339 32.2928 78.5231 34.3004 76.9935L45.571 68.4064Z" fill="currentColor"/>
                    <ellipse className="item-icon-config" cx="38.8213" cy="46.8696" rx="2.43478" ry="2.43478" fill="currentColor"/>
                    <path className="item-icon-config" d="M43.6305 20.4316C41.8412 19.5492 39.8305 19.2173 37.8525 19.4777C35.8746 19.7381 34.0183 20.5791 32.5184 21.8945C31.5445 22.7486 30.7493 23.7776 30.17 24.9218C29.6493 25.9501 30.3284 27.1095 31.4417 27.4078L32.1137 27.5878C33.227 27.8861 34.3449 27.1813 35.0532 26.272C35.2545 26.0137 35.4805 25.7737 35.7291 25.5557C36.5049 24.8753 37.4651 24.4403 38.4881 24.3056C39.5112 24.1709 40.5513 24.3426 41.4767 24.799C42.4022 25.2554 43.1716 25.976 43.6875 26.8696C44.2035 27.7633 44.4429 28.7899 44.3754 29.8196C44.3079 30.8492 43.9366 31.8358 43.3084 32.6545C42.6802 33.4731 41.8234 34.0871 40.8462 34.4188C40.0434 34.6957 39.8273 34.6957 38.9999 34.6957L38.3043 34.6957C37.1517 34.6957 36.2173 35.6301 36.2173 36.7827V40.2609C36.2173 41.4135 37.1517 42.3479 38.3043 42.3479H38.9999C40.1525 42.3479 41.0869 41.4135 41.0869 40.2609C41.0869 39.7503 41.4569 39.3184 41.9474 39.1763C42.0975 39.1329 42.2519 39.0841 42.4115 39.03C44.3006 38.3887 45.9572 37.2016 47.1717 35.6189C48.3861 34.0361 49.104 32.1288 49.2345 30.138C49.365 28.1473 48.9022 26.1626 47.9047 24.4348C46.9072 22.7071 45.4198 21.314 43.6305 20.4316Z" fill="currentColor"/>
                </svg>
                }
                <svg className="h-40 icon-confirmation icon-bottom rounded-bl-2xl" width="140" height="88" viewBox="0 0 140 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="bg-icon-config" cx="18" cy="40" r="11" fill="currentColor"/>
                    <circle className="bg-icon-config" cx="77.3911" cy="32.3911" r="8.39107" fill="currentColor"/>
                    <circle className="bg-icon-config" cx="60.5" cy="76.5" r="11.5" fill="currentColor"/>
                    <circle className="bg-icon-config" cx="45.1955" cy="18.1955" r="4.19554" fill="currentColor"/>
                    <circle className="bg-icon-config" cx="22.4714" cy="2.09777" r="2.09777" fill="currentColor"/>
                    <circle className="bg-icon-config" cx="31.523" cy="142.523" r="76.1453" transform="rotate(-48.1512 31.523 142.523)" fill="currentColor"/>
                </svg>
                
            </div>

            <div className="w-3/4 flex flex-col justify-center h-ful items-end mx-3">

                <p className={`font-normal ${styleToChildren}`}>{children}</p>

                <div className="btn mt-4">
                    
                    <button
                        className=" px-4 py-1 rounded-md"
                        onClick={() => handleConfirm(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-1 rounded-md ml-4 mr-8"
                        onClick={() => handleConfirm(true)}
                    >
                        Confirm
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default ConfirmationForm;