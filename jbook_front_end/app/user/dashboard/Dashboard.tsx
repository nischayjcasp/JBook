"use client";

import { FaPlus } from "react-icons/fa";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TaskCard from "@/components/dashboard/TaskCard";
import { useState } from "react";

const Dashboard = () => {
  const [todosTimeLine, setTodosTimeLine] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    ,
    12,
    13,
    14,
    15,
  ]);
  return (
    <div className="w-full max-h-screen">
      {/* Add task button */}
      <div className="w-full">
        <button
          type="button"
          className="mx-auto my-10 px-4 py-3 rounded-md bg-primary text-white text-lg font-semibold flex items-center gap-1 cursor-pointer"
        >
          <FaPlus className="text-lg" />
          <span>Add Task</span>
        </button>
      </div>
      {/* defaultExpanded={true} */}

      {/* Task lists */}
      <ul className="px-32 flex flex-col gap-4">
        {todosTimeLine &&
          todosTimeLine.map((task, inx) => (
            <li key={`task-${inx}`}>
              <Accordion
                sx={{
                  "&.MuiAccordion-root": {
                    boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                  },
                  "& .Mui-expanded": {
                    margin: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel-content"
                  id="panel-header"
                >
                  <p className="font-semibold text-lg flex items-center">
                    Today
                  </p>
                </AccordionSummary>
                <AccordionDetails className="max-h-[400px] overflow-y-auto">
                  <ul>
                    <li className="mb-3">
                      <TaskCard />
                    </li>
                    <li className="mb-3">
                      <TaskCard />
                    </li>
                    <li className="mb-3">
                      <TaskCard />
                    </li>
                    <li className="mb-3">
                      <TaskCard />
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Dashboard;
