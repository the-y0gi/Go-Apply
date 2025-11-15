"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

interface AddAchievementFormProps {
  onSave: (achievement: { title: string; description: string; date: string }) => void;
  onCancel: () => void;
  initialData?: { title: string; description: string; date: string }; // optional for editing
}

export default function AddAchievementForm({
  onSave,
  onCancel,
  initialData,
}: AddAchievementFormProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
  });

  // Prefill form if editing
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date) {
      // toast.error("Title and Date are required!");
      // return;
    }
    const selectedDate = new Date();
    const today = new Date();
    if(selectedDate > today){
      toast.error("Date cannot be in the future!");
      return;
    }
    // Pass form data to parent
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className="border p-4 rounded-lg bg-background/50 backdrop-blur">
      {/* <Toaster position="top-right" /> */}
      <h2 className="font-semibold mb-4 text-lg">
        {initialData ? "Edit Achievement" : "Add Achievement"}
      </h2>

      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
        value={form.title}
        className="border p-2 w-full mb-3 rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        value={form.description}
        className="border p-2 w-full mb-3 rounded"
        required
      />
      <input
        type="date"
        name="date"
        onChange={handleChange}
        value={form.date}
        className="border p-2 w-full mb-3 rounded"
        required
      />

      <div className="flex gap-2">
        <Button >Save</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
    </form>
  );
}
