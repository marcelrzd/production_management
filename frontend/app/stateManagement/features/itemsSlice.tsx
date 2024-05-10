// @ts-nocheck
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Item {
  sku: string;
  description: string | null;
}

export interface ItemTaskUI {
  sku: string;
  description: string;
  start_date: string;
  end_date: string;
  total_plan: number;
}

interface ItemState {
  items: Item[];
  loading: boolean;
  error: string | null;
  disabledItems: string[]; // This will keep track of disabled items by SKU
}

const initialState: ItemState = {
  items: [],
  loading: false,
  error: null,
  disabledItems: [],
};

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = [...action.payload];
      state.loading = false;
      state.error = null;
    },
    enableItem: (state, action: PayloadAction<string>) => {
      const sku = action.payload;
      state.disabledItems = state.disabledItems.filter(
        (disabledSku) => disabledSku !== sku
      );
    },
  },
});

export const { startLoading, setItems } = itemSlice.actions;

// fetch items for tasks
export const fetchItemsForTask =
  (taskId: number): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(startLoading());
      const response = await axios.get(
        `${backendUrl}/items-for-task/${taskId}/`
      );
      dispatch(setItems(response.data));
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        // Handle standard JS errors
        console.error("Error fetching items for task:", error.message);
        throw error;
      } else if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response
      ) {
        // Handle Axios errors with type checks
        const axiosError = error as { response: { data: { message: string } } };
        console.error(
          "Error fetching items for task:",
          axiosError.response.data
        );
        throw error;
      } else {
        // Handle any other unknown errors
        console.error("An unknown error occurred:", error);
        throw error;
      }
    }
  };

// fetch all items
export const fetchItems = (): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading());
    const response = await axios.get(`${backendUrl}/item-list/`);
    dispatch(setItems(response.data));
  } catch (error) {
    if (error instanceof Error) {
      // Handle standard JS errors
      console.error("Error fetching items:", error.message);
      throw error;
    } else if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response
    ) {
      // Handle Axios errors with type checks
      const axiosError = error as { response: { data: { message: string } } };
      console.error("Error fetching items:", axiosError.response.data);
      throw error;
    } else {
      // Handle any other unknown errors
      console.error("An unknown error occurred:", error);
      throw error;
    }
  }
};

// update the total_plans of a task
export const updateTotalPlans =
  (editedPlans: EditedPlans, task_id: string): AppThunk =>
  async (dispatch) => {
    try {
      console.log("Sending data:", editedPlans);

      const response = await axios.post(
        `${backendUrl}/update-total-plans/${task_id}/`,
        {
          items: editedPlans,
        }
      );

      if (response.status === 200) {
        // Handle success, maybe dispatch some action to indicate the update was successful or refresh data
        dispatch(fetchItemsForTask(task_id)); // Refetching the items for the task to reflect the updates
      }
    } catch (error) {
      if (error instanceof Error) {
        // Handle standard JS errors
        console.error("Error updating total plans:", error.message);
        throw error;
      } else if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response
      ) {
        // Handle Axios errors with type checks
        const axiosError = error as { response: { data: { message: string } } };
        console.error(
          "Error updating total plans:",
          axiosError.response.data.message
        );
        throw error;
      } else {
        // Handle any other unknown errors
        console.error("An unknown error occurred:", error);
        throw error;
      }
    }
  };

// delete items from a task
export const deleteItemFromTask =
  (task_id: string, item_id: string): AppThunk =>
  async (dispatch) => {
    try {
      await axios.delete(
        `${backendUrl}/delete-item-task/${task_id}/item/${item_id}/`
      );
      dispatch(fetchItemsForTask(task_id)); // Refresh the items after deleting one
    } catch (error) {
      console.error("Error deleting item from task:", error);
      throw error;
    }
  };

// refreshing the item list in the task creation page
export const refreshItems = (): AppThunk => async (dispatch) => {
  dispatch(fetchItems());
};

export default itemSlice.reducer;
