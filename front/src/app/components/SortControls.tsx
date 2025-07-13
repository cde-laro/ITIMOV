import React from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

interface SortControlsProps {
  sortField: string;
  setSortField: (field: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sortField, setSortField, sortOrder, setSortOrder }) => {
  return (
    <div className="mb-5 flex gap-4">
      <div className="flex gap-2">
        {["title", "year", "user_note"].map((field) => (
          <button
            key={field}
            onClick={() => setSortField(field)}
            className={`px-4 py-2 rounded-lg ${
              sortField === field ? "bg-white text-black" : "bg-gray-800 text-white"
            }`}
          >
            {field === "user_note" ? "Note" : field.charAt(0).toUpperCase() + field.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className={`px-4 py-2 rounded-lg ${
            sortOrder === "asc" ? "bg-white text-black" : "bg-gray-800 text-white"
          }`}
        >
          {sortOrder === "asc" ? <AiOutlineArrowUp size={20} /> : <AiOutlineArrowDown size={20} />}
        </button>
      </div>
    </div>
  );
};

export default SortControls;
