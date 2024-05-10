// @ts-nocheck
"use client";
// toasts
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Item,
  fetchItems,
  refreshItems,
} from "../../stateManagement/features/itemsSlice";
import { addTask } from "../../stateManagement/features/tasksSlice";
import { RootState, AppDispatch } from "../../stateManagement/store";
import Link from "next/link";

export default function AddTaskForm() {
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const initialFormState = {
    startDate: "",
    endDate: "",
    itemRows: [],
  };
  const [startDate, setStartDate] = useState(initialFormState.startDate);
  const [endDate, setEndDate] = useState(initialFormState.endDate);
  const [itemRows, setItemRows] = useState<
    Array<{ sku: string; total_plan: number }>
  >([]);

  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.items.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleAddItemRow = () => {
    setItemRows([...itemRows, { sku: "", total_plan: 0 }]);
  };

  const handleRemoveItemRow = (indexToRemove: number) => {
    const updatedRows = itemRows.filter((_, index) => index !== indexToRemove);
    setItemRows(updatedRows);

    const newSelectedSkus = updatedRows.map((row) => row.sku);
    setSelectedSkus(newSelectedSkus);
  };

  // Set the end date to be one week after start date
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    const selectedDate = new Date(e.target.value);
    const endDateValue = new Date(selectedDate);
    endDateValue.setDate(selectedDate.getDate() + 7);
    const formattedEndDate = endDateValue.toISOString().split("T")[0];
    setEndDate(formattedEndDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itemRows.length === 0 || (itemRows.length === 1 && !itemRows[0].sku)) {
      toast.warn(
        "É obrigatório a adição de pelo menos um item para a criação da demanda!",
        {
          autoClose: 4000,
        }
      );
      return;
    }
    try {
      const taskData = {
        start_date: startDate,
        end_date: endDate,
        items: itemRows.map((item) => ({
          sku: item.sku,
          total_plan: item.total_plan,
        })),
      };
      await dispatch(addTask(taskData));

      setStartDate(initialFormState.startDate);
      setEndDate(initialFormState.endDate);
      setItemRows(initialFormState.itemRows);
      setSelectedSkus([]);
    } catch (error) {
      console.log("Error creating the task: " + error);
      toast.error(error.response.data.message, {
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
        <div className="flex flex-col px-16 py-8 space-y-8">
          <h1 className="text-2xl font-semibold">Criar Demanda</h1>
          <div className="p-6 space-y-6 bg-white border border-gray-200 rounded-md shadow-md max-h-[70vh] overflow-y-auto">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700 capitalize"
                >
                  Data inicial
                </label>
                <input
                  required
                  type="date"
                  name="start_date"
                  id="start_date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700 capitalize"
                >
                  data final
                </label>
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  value={endDate}
                  disabled
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddItemRow}
              className="px-4 py-2 text-white bg-[#0A192F] transition-all ease-in-out rounded-md hover:bg-[#0A192F]/80"
            >
              + Adicionar Item
            </button>

            {itemRows.map((row, index) => (
              <div key={index} className="flex mt-4 space-x-4">
                <select
                  required
                  value={row.sku}
                  onChange={(e) => {
                    const updatedRows = [...itemRows];
                    updatedRows[index].sku = e.target.value;
                    setItemRows(updatedRows);

                    const newSelectedSkus = itemRows.map((row) => row.sku);
                    setSelectedSkus(newSelectedSkus);
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>
                    Selecione um item
                  </option>
                  {items.map((item) => (
                    <option
                      key={item.sku}
                      value={item.sku}
                      disabled={
                        selectedSkus.includes(item.sku) && item.sku !== row.sku
                      }
                    >
                      {item.sku} - {item.description}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  onChange={(e) => {
                    const updatedRows = [...itemRows];
                    updatedRows[index].total_plan = Number(e.target.value);
                    setItemRows(updatedRows);
                  }}
                  placeholder="Total Plan (tons)"
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  className="p-2 text-white transition-all ease-in-out bg-red-500 rounded-md hover:bg-red-500/80"
                  onClick={() => handleRemoveItemRow(index)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
          <div>
            <Link
              href={"/"}
              type="button"
              className="px-16 py-2 w-[200px] text-white text-center bg-blue-600 transition-all ease-in-out rounded-md hover:bg-blue-700"
            >
              Voltar
            </Link>
            <button
              type="submit"
              className="float-right px-4 py-2 w-[200px] text-white bg-green-700 transition-all ease-in-out rounded-md hover:bg-green-800"
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
