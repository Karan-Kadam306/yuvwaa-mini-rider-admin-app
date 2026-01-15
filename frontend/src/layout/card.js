import React from "react";

function Card({ title, value }) {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-6 w-full sm:w-1/2 lg:w-1/4 m-2">
      <h3 className="text-gray-800 font-semibold">{title}</h3>
      <p className="text-primary text-2xl mt-2">{value}</p>
    </div>
  );
}

export default Card;
