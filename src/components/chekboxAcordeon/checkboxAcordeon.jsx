import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const items = [
  { label: "Datos personales", value: "1" },
  { label: "Personalidad", value: "2" },
  {
    label: "Historia de vida",
    value: "16",
    children: [
      { label: "Infancia", value: "3" },
      { label: "Juventud", value: "4" },
      { label: "Edad adulta", value: "5" },
      { label: "Madurez", value: "6" },
    ],
  },
  {
    label: "Datos sanitarios",
    value: "7",
    children: [
      { label: "Farmacia", value: "8" },
      { label: "Medicina", value: "9" },
      { label: "Terapia ocupacional", value: "10" },
      { label: "Trabajo social", value: "11" },
      { label: "Cocina", value: "12" },
      { label: "Otros", value: "13" },
    ],
  },
  { label: "Datos de contacto", value: "14" },
];

export default function CheckboxAccordion({ selected, setSelected }) {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (value) => {
    setExpanded((prev) => ({ ...prev, [value]: !prev[value] }));
  };

  const isChecked = (value) => selected.includes(value);

  const getAllValues = (items) => {
    let all = [];
    for (const item of items) {
      if (item.value) all.push(item.value);
      if (item.children) {
        all.push(...item.children.map((child) => child.value));
      }
    }
    return all;
  };

  const allValues = useMemo(() => getAllValues(items), [items]);
  const allSelected = allValues.every((val) => selected.includes(val));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(allValues);
    }
  };

  const toggleCheckbox = (value, children = []) => {
    const isSelected = isChecked(value);
    let newSelected = [...selected];

    if (!isSelected) {
      newSelected.push(value);
      children.forEach((child) => {
        if (!newSelected.includes(child.value)) newSelected.push(child.value);
      });
    } else {
      newSelected = newSelected.filter((v) => v !== value);
      children.forEach((child) => {
        newSelected = newSelected.filter((v) => v !== child.value);
      });
    }

    setSelected(newSelected);
  };

  const toggleChild = (childValue) => {
    setSelected((prev) =>
      prev.includes(childValue)
        ? prev.filter((v) => v !== childValue)
        : [...prev, childValue]
    );
  };

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="select-all"
          className="mr-2"
          checked={allSelected}
          onChange={toggleSelectAll}
        />
        <label htmlFor="select-all" className="text-sm font-semibold text-gray-900">
          Seleccionar todo
        </label>
      </div>
      {items.map((item) => (
        <div key={item.value}>
          <div className="flex items-center">
            {item.children && (
              <button
                type="button"
                className="mr-2"
                onClick={() => toggleExpand(item.value)}
              >
                {expanded[item.value] ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>
            )}
            <input
              type="checkbox"
              id={item.value}
              className="mr-2"
              checked={isChecked(item.value)}
              onChange={() => toggleCheckbox(item.value, item.children)}
            />
            <label htmlFor={item.value} className="text-sm font-medium text-gray-900">
              {item.label}
            </label>
          </div>

          {item.children && expanded[item.value] && (
            <div className="ml-6 mt-2 space-y-1">
              {item.children.map((child) => (
                <div className="flex items-center" key={child.value}>
                  <input
                    type="checkbox"
                    id={child.value}
                    className="mr-2"
                    checked={isChecked(child.value)}
                    onChange={() => toggleChild(child.value)}
                  />
                  <label htmlFor={child.value} className="text-sm text-gray-800">
                    {child.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
