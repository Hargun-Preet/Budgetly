import React from "react";

const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 dark:text-neutral-300 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <p className="text-sm">
            © {new Date().getFullYear()} Budgetly. All rights reserved.
          </p>
          <span className="whitespace-nowrap text-sm mt-8">
            Made with{" "}
            <img
            width="20"
            height="20"
            src="https://img.icons8.com/ios-glyphs/30/FA5252/like--v1.png"
            alt="like"
            className="inline-block"
            />{" "}
            by Hargun
        </span>
        </div>

        {/* Center Section */}
        <div className="flex gap-4">
          <a
            href="#"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Contact Us
          </a>
        </div>

        {/* Right Section */}
        <div className="flex gap-4">
          {/* Facebook */}
          <a
            href="#"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <span className="sr-only">Facebook</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.325v21.351C0 23.4.6 24 1.325 24H12v-9.294H9.294V11.53H12V9.294c0-2.675 1.633-4.138 4.018-4.138 1.144 0 2.13.085 2.418.123v2.805h-1.66c-1.304 0-1.556.62-1.556 1.529v2.005h3.113l-.406 3.176H15.22V24h7.455C23.4 24 24 23.4 24 22.675V1.325C24 .6 23.4 0 22.675 0z" />
            </svg>
          </a>

          {/* X (formerly Twitter) */}
          <a
            href="#"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <span className="sr-only">X</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="9 9 31 31"
            >

            <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z"></path>
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="#"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <span className="sr-only">Instagram</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 26 26"
            >
            <path d="M 7.546875 0 C 3.390625 0 0 3.390625 0 7.546875 L 0 18.453125 C 0 22.609375 3.390625 26 7.546875 26 L 18.453125 26 C 22.609375 26 26 22.609375 26 18.453125 L 26 7.546875 C 26 3.390625 22.609375 0 18.453125 0 Z M 7.546875 2 L 18.453125 2 C 21.527344 2 24 4.46875 24 7.546875 L 24 18.453125 C 24 21.527344 21.53125 24 18.453125 24 L 7.546875 24 C 4.472656 24 2 21.53125 2 18.453125 L 2 7.546875 C 2 4.472656 4.46875 2 7.546875 2 Z M 20.5 4 C 19.671875 4 19 4.671875 19 5.5 C 19 6.328125 19.671875 7 20.5 7 C 21.328125 7 22 6.328125 22 5.5 C 22 4.671875 21.328125 4 20.5 4 Z M 13 6 C 9.144531 6 6 9.144531 6 13 C 6 16.855469 9.144531 20 13 20 C 16.855469 20 20 16.855469 20 13 C 20 9.144531 16.855469 6 13 6 Z M 13 8 C 15.773438 8 18 10.226563 18 13 C 18 15.773438 15.773438 18 13 18 C 10.226563 18 8 15.773438 8 13 C 8 10.226563 10.226563 8 13 8 Z"></path>
            </svg>
          </a>

          {/* GitHub */}
          <a
            href="#"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <span className="sr-only">GitHub</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.873.118 3.176.77.84 1.236 1.911 1.236 3.221 0 4.61-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;