import React from "react";
import "../components/SMNavIcons.css";

const SMIcons = () => {
  return (
    <div>
      <form>
        <ul className="SM-icon-list">
          {/* Home Icon-1 */}
          <li>
            <input
              type="radio"
              id="choose1"
              name="iconSelection"
              className="SM-radio-input"
              defaultChecked
            />
            <label htmlFor="choose1">
              <svg
                viewBox="0 0 24 24"
                className="SM-icon-svg"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 12L12 4L20 12M6 10.5V19a1 1 0 001 1h3v-3a1 1 0 011-1h2a1 1 0 011 1v3h3a1 1 0 001-1v-8.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </li>

          {/* Search Icon- 2 */}
          <li>
            <input
              type="radio"
              id="choose2"
              name="iconSelection"
              className="SM-radio-input"
            />
            <label htmlFor="choose2">
              <svg
                viewBox="0 0 24 24"
                className="SM-icon-svg"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M21 21L17.5 17.5M17 10a7 7 0 11-14 0 7 7 0 0114 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </label>
          </li>

          {/* Bookmark Icon- 3 */}
          <li>
            <input
              type="radio"
              id="choose3"
              name="iconSelection"
              className="SM-radio-input"
            />
            <label htmlFor="choose3">
              <svg
                viewBox="0 0 24 24"
                className="SM-icon-svg"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M17 21L12 17L7 21V3.889a.92.92 0 01.244-.629.808.808 0 01.59-.26h8.333a.81.81 0 01.589.26.92.92 0 01.244.63V21Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </li>

          {/* Account Icon- 4 */}
          <li>
            <input
              type="radio"
              id="choose4"
              name="iconSelection"
              className="SM-radio-input"
            />
            <label htmlFor="choose4">
              <svg
                viewBox="0 0 24 24"
                className="SM-icon-svg"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12Zm0 2c-3.15 0-9 1.585-9 4.5V21h18v-2.5c0-2.915-5.85-4.5-9-4.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default SMIcons;
