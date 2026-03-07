const Logo = ({ className }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Cortex Logo"
        >
            <circle cx="50" cy="50" r="45" fill="url(#logo_gradient)" />
            <path
                d="M50 20C33.4315 20 20 33.4315 20 50C20 66.5685 33.4315 80 50 80C66.5685 80 80 66.5685 80 50C80 33.4315 66.5685 20 50 20ZM50 72C37.8497 72 28 62.1503 28 50C28 37.8497 37.8497 28 50 28C62.1503 28 72 37.8497 72 50C72 62.1503 62.1503 72 50 72Z"
                fill="white"
                fillOpacity="0.8"
            />
            <circle cx="50" cy="50" r="12" fill="white" />
            <defs>
                <linearGradient id="logo_gradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5E5CE6" /> {/* Indigo */}
                    <stop offset="1" stopColor="#BF5AF2" /> {/* Purple */}
                </linearGradient>
            </defs>
        </svg>
    )
}

export default Logo
