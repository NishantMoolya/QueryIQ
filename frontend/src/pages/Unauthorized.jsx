import React from 'react';
import { NavLink } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex sm:items-center justify-center h-screen">
      <div className="bg-white p-8 sm:rounded-lg sm:shadow-md h-fit mt-14">
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-4xl font-bold mt-4 text-center">401 Unauthorized</h1>
          <p className="text-gray-500 mt-2 text-center">
            You are not authorized to access this page.
          </p>
          <NavLink to={'/'}>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4">
            Go Back
          </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
