import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const TaskCard = () => {
  return (
    <div className="w-full p-4 rounded-md shadow-md border border-slate-200">
      {/* task title */}
      <div className="flex justify-between mb-5">
        <p className="font-semibold text-lg text-left">Task Title</p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="cursor-pointer bg-primary text-white px-2 py-1 rounded-sm flex items-center gap-1"
          >
            <FaEdit className="text-lg" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            className="cursor-pointer bg-red-600 text-white px-2 py-1 rounded-sm flex items-center gap-1"
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Task description */}
      <p className="text-left">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quam
        in porro? Temporibus minus, dolores aut, tempore, quos adipisci
        voluptatibus cum accusamus commodi corrupti necessitatibus amet ea
        architecto possimus placeat.
      </p>
    </div>
  );
};

export default TaskCard;
