import Dropdown from "./Dropdown";

const AvatarDropdown = () => {
    return (
        <Dropdown>
            <Dropdown.Trigger>
                {/* Avatar */}
                <div className="avatar-user">
                    <svg
                        width="25"
                        height="25"
                        viewBox="0 0 35 35"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M17.4998 31.5L29.6242 24.5V10.5L17.4998 3.5L5.37549 10.5V24.5L17.4998 31.5ZM17.4998 31.5V18.375M17.4998 18.375L6.12484 11.375M17.4998 18.375L28.8748 11.375"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </Dropdown.Trigger>

            {/* Dropdown Content */}
            <Dropdown.Content contentClasses="p-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg w-25 box-avatar">
                <Dropdown.Link
                    href="/profile"
                    className="button"
                >
                    <span>Profiler</span>
                </Dropdown.Link>
                <Dropdown.Link
                    href="/logout"
                    method="post"
                    className="button"
                >
                  <span>Logout</span>
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );
};

export default AvatarDropdown;
