import { FaPlus } from "react-icons/fa";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TaskCard from "@/components/dashboard/TaskCard";

const Dashboard = () => {
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

      {/* Task lists */}
      <ul className="px-32 flex flex-col gap-4">
        <li>
          <Accordion
            defaultExpanded={true}
            sx={{
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
                24 Nov 2025
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

        <li>
          <Accordion
            sx={{
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
                23 Nov 2025
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

        <li>
          <Accordion
            sx={{
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
                22 Nov 2025
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

        <li>
          <Accordion
            sx={{
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
                21 Nov 2025
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

        <li>
          <Accordion
            sx={{
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
                20 Nov 2025
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
      </ul>
    </div>
  );
};

export default Dashboard;
