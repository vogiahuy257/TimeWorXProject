export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <div {...props} className={'mx-2 w-full text-red-600 dark:text-red-400 relative text-xs text-start' + className}>
            <p>{message}</p>

            <svg className={' absolute top-[50%] right-0 mr-4 translate-y-[-50%]'} xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
                <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
            </svg>
        </div>
    ) : null;
}
