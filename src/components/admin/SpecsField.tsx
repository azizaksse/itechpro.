import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SpecsFieldProps {
  specs: Record<string, string>;
  onChange: (specs: Record<string, string>) => void;
}

const SpecsField = ({ specs, onChange }: SpecsFieldProps) => {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const addSpec = () => {
    if (!newKey.trim()) return;
    onChange({ ...specs, [newKey.trim()]: newValue.trim() });
    setNewKey("");
    setNewValue("");
  };

  const removeSpec = (key: string) => {
    const updated = { ...specs };
    delete updated[key];
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSpec();
    }
  };

  return (
    <div className="space-y-2">
      <Label>المواصفات التقنية</Label>
      
      {Object.entries(specs).length > 0 && (
        <div className="space-y-1.5 rounded-xl border border-border bg-secondary/20 p-3">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              <span className="font-medium text-primary min-w-[80px] shrink-0">{key}</span>
              <span className="text-muted-foreground">:</span>
              <span className="flex-1 truncate">{value}</span>
              <button
                type="button"
                onClick={() => removeSpec(key)}
                className="p-1 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="مثال: المعالج"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Input
          placeholder="مثال: Intel i7-14700K"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addSpec}
          disabled={!newKey.trim()}
          className="shrink-0"
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};

export default SpecsField;
