import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Education } from "@/models/user";

interface AddEducationFormProps {
  initialData?: Education; // for editing
  onSave: (edu: Education) => void;
  onCancel: () => void;
}

export default function AddEducationForm({ initialData, onSave, onCancel }: AddEducationFormProps) {
  const [degree, setDegree] = useState(initialData?.degree || "");
  const [institution, setInstitution] = useState(initialData?.institution || "");
  const [graduationYear, setGraduationYear] = useState(initialData?.graduationYear || "");
  const [gpa, setGpa] = useState(initialData?.gpa || "");
  const [honors, setHonors] = useState(initialData?.honors || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ degree, institution, graduationYear, gpa, honors });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Degree</Label>
          <Input
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            placeholder="e.g. Bachelor of Science"
            required
          />
        </div>
        <div>
          <Label>Institution</Label>
          <Input
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="e.g. University of Sydney"
            required
          />
        </div>
        <div>
          <Label>Graduation Year</Label>
          <Input
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            placeholder="e.g. 2024"
            required
          />
        </div>
        <div>
          <Label>GPA</Label>
          <Input
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            placeholder="e.g. 3.8"
          />
        </div>
        <div className="md:col-span-2">
          <Label>Honors</Label>
          <Input
            value={honors}
            onChange={(e) => setHonors(e.target.value)}
            placeholder="e.g. First Class Honors"
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
