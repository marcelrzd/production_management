// @ts-nocheck
// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteItemFromTask } from "@/app/stateManagement/features/itemsSlice";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateTotalPlans } from "../stateManagement/features/itemsSlice";
import { AppDispatch } from "../stateManagement/store";
import { fetchTasks } from "../stateManagement/features/tasksSlice";

type EditedPlans = {
  [key: string]: number;
};

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: ItemTask[];
  start_date: string;
  end_date: string;
  task_id: string;
};

type Task = {
  start_date: string;
  end_date: string;
  status: string;
};

type Item = {
  sku: string;
  description: string;
};

type ItemTask = {
  task: Task;
  item: Item;
  total_plan: number;
};

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  items,
  start_date,
  end_date,
  task_id,
}) => {
  const [localItems, setItems] = useState<ItemTask[]>(items);

  const [editedPlans, setEditedPlans] = useState<EditedPlans>({});
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    setItems(items);
  }, [items]);

  useEffect(() => {
    const initialPlans = localItems.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.sku] = item.total_plan;
        return acc;
      },
      {}
    );
    setEditedPlans(initialPlans);
  }, [localItems]);

  const handleTotalPlanChange = (sku: number, value: string) => {
    setEditedPlans((prevPlans) => ({
      ...prevPlans,
      [sku]: value,
    }));
  };

  // save the new total plan values
  const handleSave = () => {
    dispatch(updateTotalPlans(editedPlans, task_id));
    dispatch(fetchTasks());
    toast.success(
      `Demanda '${start_date} - ${end_date}' ATUALIZADA com sucesso`
    );
    onClose();
  };

  // delete seleted item from the task
  const handleItemDelete = async (item_id: string) => {
    try {
      await dispatch(deleteItemFromTask(task_id, item_id));
      setItems((prevItems) => prevItems.filter((item) => item.sku !== item_id));
      dispatch(fetchTasks());
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
          <div className="modal modal-open">
            <div className="modal-box p-0 max-w-[800px] rounded-lg max-h-[75vh] ">
              <div className="bg-[#0A192F] top-0 py-2 px-4">
                <h2 className="inline mb-4 text-xl text-white modal-top">
                  Editar Demanda
                </h2>
                <button
                  className="inline float-right text-gray-300"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
              <div className="py-2 px-7 ">
                <h1 className="text-xl text-[#0A192F] uppercase font-semibold">
                  Semana {task_id}
                </h1>
                <span className="px-4 text-sm font-semibold">
                  {start_date} - {end_date}
                </span>
              </div>
              <form
                method="dialog"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <div className="px-6 pt-6 overflow-y-auto max-h-[50vh]">
                  <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-md ">
                    <thead className="sticky top-0 text-black bg-gray-200">
                      <tr>
                        <th className="w-[10%] px-6 py-3 font-bold tracking-wider text-left text-gray-700 uppercase text-md">
                          SKU
                        </th>
                        <th className="w-[45%] px-6 py-3 font-bold tracking-wider text-left text-gray-700 uppercase text-md">
                          Description
                        </th>
                        <th className="w-[25%] px-6 py-3 font-bold tracking-wider text-left text-gray-700 uppercase text-md">
                          Total Plan
                        </th>
                        <th className="w-[25%] px-6 py-3 font-bold tracking-wider text-left text-gray-700 uppercase text-md">
                          Excluir
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {localItems.map((item) => (
                        <tr key={item.sku}>
                          <td className="px-6 py-3 text-sm whitespace-nowrap">
                            {item.sku}
                          </td>
                          <td className="px-6 py-3 text-sm whitespace-nowrap">
                            {item.description}
                          </td>
                          <td className="px-6 py-3 text-sm whitespace-nowrap">
                            <input
                              className="p-1 border rounded-sm"
                              type="number"
                              value={editedPlans[item.sku] || ""}
                              placeholder={
                                editedPlans[item.sku]
                                  ? editedPlans[item.sku]
                                  : 0
                              }
                              onChange={(e) =>
                                handleTotalPlanChange(item.sku, e.target.value)
                              }
                            />
                          </td>
                          <td className="px-6 py-3 text-sm text-center whitespace-nowrap">
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-red-500 cursor-pointer"
                              onClick={() => handleItemDelete(item.sku)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 modal-action">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-white w-[100px] bg-gray-500 transition-all ease-in-out hover:bg-gray-700 h-[2rem] rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="text-white bg-green-600 transition-all ease-in-out hover:bg-green-800 h-[2rem] rounded-md w-[100px]"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskModal;
