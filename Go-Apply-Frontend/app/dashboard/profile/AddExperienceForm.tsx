import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Experience } from "@/models/user";

interface AddExperienceFormProps {
  initialData?: Experience; // for editing
  onSave: (exp: Experience) => void;
  onCancel: () => void;
}

export default function AddExperienceForm({ initialData, onSave, onCancel }: AddExperienceFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [company, setCompany] = useState(initialData?.company || "");
  const [startYear, setStartYear] = useState(initialData?.startYear || "");
  const [endYear, setEndYear] = useState(initialData?.endYear || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();

    // Validate Start Year
    if (startYear && (isNaN(Number(startYear)) || Number(startYear) < 1900 || Number(startYear) > currentYear)) {
      alert("Start Year cannot be in the future!");
      return;
    }

    // // Validate End Year
    // if (endYear && endYear.toLowerCase() !== "present" && (isNaN(Number(endYear)) || Number(endYear) > currentYear)) {
    //   alert("End Year cannot be in the future!");
    //   return;
    // }

    onSave({
      title, company, startYear, endYear, description,
      duration: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Software Engineer"
            required
          />
        </div>
        <div>
          <Label>Company</Label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Google"
            required
          />
        </div>
        <div>
          <Label>Start Year</Label>
          <Input
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            placeholder="e.g. 2021"
            required
          />
        </div>
        <div>
          <Label>End Year</Label>
          <Input
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            placeholder="e.g. 2023 or Present"
          />
        </div>
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your role and achievements"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Save
        </Button>
      </div>
    </form>
  );
}
