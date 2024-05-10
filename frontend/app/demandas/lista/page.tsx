// @ts-nocheck
"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stateManagement/store";
import { fetchTasks } from "../../stateManagement/features/tasksSlice";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import TaskModal from "@/app/components/TaskModal";
import {
  fetchItemsForTask,
  Item,
} from "@/app/stateManagement/features/itemsSlice";
import DeleteModal from "@/app/components/DeleteModal";

export default function List() {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedTaskId, setSelectedTaskId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localItems, setLocalItems] = useState<Item[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const handleEditButtonClick = async (
    taskId: number,
    start_date: string,
    end_date: string
  ) => {
    try {
      const fetchedItems = await dispatch(fetchItemsForTask(taskId));
      setLocalItems(fetchedItems);

      setSelectedTaskId(taskId);
      setStartDate(start_date);
      setEndDate(end_date);

      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch items for task:", error);
    } finally {
      setLoading(false);
    }
  };
  const labelClasses = (label: string) => {
    switch (label) {
      case "PLANEJAMENTO":
        return "bg-red-300 text-red-800";
      case "EM ANDAMENTO":
        return "bg-blue-300 text-blue-900";
      case "CONCLUÍDO":
        return "bg-green-300 text-green-900";
      default:
        return "";
    }
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleModalDelete = (
    taskId: number,
    start_date: string,
    end_date: string
  ) => {
    setSelectedTaskId(taskId);
    setStartDate(start_date);
    setEndDate(end_date);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col px-8 py-8 space-y-8 md:px-16">
        <div className="flex flex-col space-y-8">
          <h1 className="float-left text-2xl font-semibold text-left">
            DEMANDAS DE PRODUÇÃO DE LATINHAS
          </h1>
          <Link
            href={"/demandas/adicionar"}
            className="w-[200px] px-4 py-2 text-center text-white bg-[#0A192F] rounded-md hover:bg-[#0A192F]/80 transition-all ease-in-out text-sm"
          >
            + ADICIONAR
          </Link>
        </div>
        <div className="overflow-x-auto rounded-lg shadow-md max-h-[60vh] overflow-y-auto">
          <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 rounded-md shadow-md ">
            <thead className="sticky top-0 text-black bg-gray-200">
              <tr>
                <th className="w-1/5 px-6 py-3 tracking-wider text-left text-gray-700 uppercase ">
                  Período
                </th>
                <th className="px-6 py-3 tracking-wider text-left text-gray-700 uppercase ">
                  SKUs
                </th>
                <th className="px-6 py-3 tracking-wider text-left text-gray-700 uppercase w-1/10">
                  Total Plan (tons)
                </th>
                <th className="px-6 py-3 tracking-wider text-left text-gray-700 uppercase w-1/10">
                  Total prod (tons)
                </th>
                <th className="w-1/5 px-6 py-3 tracking-wider text-left text-gray-700 uppercase ">
                  Status
                </th>
                <th className="px-6 py-3 tracking-wider text-left text-gray-700 uppercase ">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-base whitespace-nowrap">
                      {task.start_date} a {task.end_date}
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap">
                      {task.item_count}
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap">
                      {task.total_plan_sum}
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap">0</td>
                    <td
                      className={`px-6 py-4 text-base whitespace-nowrap ${labelClasses(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() =>
                          handleEditButtonClick(
                            task.id,
                            task.start_date,
                            task.end_date
                          )
                        }
                        className="mr-6 text-blue-500 cursor-pointer"
                      />
                      <FontAwesomeIcon
                        onClick={() => {
                          handleModalDelete(
                            task.id,
                            task.start_date,
                            task.end_date
                          );
                        }}
                        icon={faTrash}
                        className="text-red-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center">
                    Nenhuma demanda disponível.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* update task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          items={localItems}
          start_date={startDate}
          end_date={endDate}
          task_id={selectedTaskId}
        />

        {/* delete task modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          task_id={selectedTaskId}
          start_date={startDate}
          end_date={endDate}
        />
      </div>
    </>
  );
}
