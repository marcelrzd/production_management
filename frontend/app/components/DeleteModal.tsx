import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch } from "react-redux";
import { fetchTasks, deleteTask } from "../stateManagement/features/tasksSlice";
import { AppDispatch } from "../stateManagement/store";
import { start } from "repl";

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  start_date: string;
  end_date: string;
  task_id: string;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  task_id,
  start_date,
  end_date,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Delete the task
  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(task_id));
      toast.success(
        `Demanda ${start_date} - ${end_date} EXCLUÍDA com sucesso!`
      );
      dispatch(fetchTasks());
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Houve um problema ao deletar a Demanda, tente novamente!");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
          <div className="modal modal-open">
            <div className="modal-box p-0 max-w-[800px] rounded-lg max-h-[60vh] overflow-y-auto">
              <div className="bg-[#2c2c2c] top-0 py-2 px-4">
                <h2 className="text-[#0A192F] inline mb-4 text-xl modal-top">
                  Confirmar Deleção
                </h2>
                <button
                  className="inline float-right text-gray-300"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
              <div className="py-6 px-7 ">
                <p>
                  Tem certeza que deseja excluir a demanda{" "}
                  <span className="font-bold">
                    '{start_date} - {end_date}'
                  </span>
                  ?
                </p>
              </div>
              <div className="p-4 modal-action">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-white w-[100px] bg-gray-500 hover:bg-gray-700 h-[2rem] transition-all ease-in-out rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-white bg-red-600 hover:bg-red-800 h-[2rem] rounded-md transition-all ease-in-out w-[100px]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
