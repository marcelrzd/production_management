// @ts-nocheck
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "../store";
import Cookie from "js-cookie";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Task {
  id: number;
  start_date: string;
  end_date: string;
  item_count: number;
  total_plan_sum: number;
}

interface TasksState {
  tasks: Task[];
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  error: null,
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
});

export const { setTasks } = tasksSlice.actions;

// Create a task
export const addTask =
  (taskData: any): AppThunk =>
  async (dispatch) => {
    const csrfToken = Cookie.get("csrftoken");
    try {
      const response = await axios.post(
        `${backendUrl}/create-task/`,
        taskData,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        dispatch(fetchTasks()); // Fetch the updated list after adding the task
      }
      toast.success("Demanda criada com sucesso!", {
        autoClose: 3000,
      });
    } catch (error) {
      if (
        error &&
        error?.response &&
        error?.response?.status >= 400 &&
        error?.response?.status <= 599
      ) {
        // This is an HTTP error response from the backend
        const axiosError = error as { response: { data: { message: string } } };
        console.error(
          "Error creating the task (axios):",
          axiosError.response.data.message
        );

        throw error;
      } else if (error instanceof Error) {
        // Handle standard JS errors
        console.error("Error creating the task:", error.message);
        throw error;
      } else {
        // Handle any other unknown errors
        console.error("An unknown error occurred:", error);
        throw error;
      }
    }
  };

// Delete task
export const deleteTask =
  (task_id: string): AppThunk =>
  async (dispatch) => {
    try {
      await axios.delete(`${backendUrl}/delete-task/${task_id}/`);
      dispatch(fetchTasks()); // Refresh the items after deleting one
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

// Get all the tasks
export const fetchTasks = (): AppThunk => async (dispatch) => {
  try {
    const response = await axios.get(`${backendUrl}/task-list/`);
    dispatch(setTasks(response.data));
  } catch (error) {
    if (error instanceof Error) {
      // Handle standard JS errors
      console.error("Error fetching tasks:", error.message);
      throw error;
    } else if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response
    ) {
      // Handle Axios errors with type checks
      const axiosError = error as { response: { data: { message: string } } };
      console.error("Error fetching tasks:", axiosError.response.data);
      throw error;
    } else {
      // Handle any other unknown errors
      console.error("An unknown error occurred:", error);
      throw error;
    }
  }
};

export default tasksSlice.reducer;
