import { useEffect, useMemo, useState } from "react";

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
      { label: "Medicina/enfermería", value: "9" },
      { label: "Educación social/terapia ocupacional", value: "10" },
      { label: "Trabajo social", value: "11" },
      { label: "Cocina/higiene", value: "12" },
      { label: "Otros", value: "13" },
    ],
  },
  { label: "Datos de contacto", value: "14" },
];

export default function CheckboxAccordion({ selected, setSelected }) {
  const [expanded, setExpanded] = useState({});

  const getAllValues = (items) =>
    items.flatMap((item) =>
      item.children ? [item.value, ...item.children.map((c) => c.value)] : [item.value]
    );

  const allValues = useMemo(() => getAllValues(items), []);
  const allSelected = allValues.every((val) => selected.includes(val));
  const isChecked = (value) => selected.includes(value);

  // ✅ Preseleccionar hijos o todo si selected cambia desde fuera
  useEffect(() => {
    let updated = [...selected];

    if (selected.includes("0")) {
      updated = [...allValues];
    } else {
      items.forEach((item) => {
        if (selected.includes(item.value) && item.children) {
          item.children.forEach((child) => {
            if (!updated.includes(child.value)) {
              updated.push(child.value);
            }
          });
        }
      });
    }

    // Solo actualiza si hay cambios
    if (updated.sort().join() !== selected.sort().join()) {
      setSelected(updated);
    }
  }, [selected]);

  // Expandir secciones si algún hijo está seleccionado
  useEffect(() => {
    const newExpanded = {};
    items.forEach((item) => {
      if (item.children?.some((child) => selected.includes(child.value))) {
        newExpanded[item.value] = true;
      }
    });
    setExpanded(newExpanded);
  }, [selected]);

  const toggleSelectAll = () => {
    setSelected(allSelected ? [] : allValues);
  };

  const toggleExpand = (value) => {
    setExpanded((prev) => ({ ...prev, [value]: !prev[value] }));
  };

  const toggleCheckbox = (value, children = []) => {
    const isSelected = selected.includes(value);
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
    <div className="space-y-2 rounded-lg border-1 border-gray-300 p-4">
      {/* Checkbox de seleccionar todo */}
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
                className="mr-2 text-lg font-bold w-5"
                onClick={() => toggleExpand(item.value)}
              >
                {expanded[item.value] ? "−" : "+"}
              </button>
            )}
            {!item.children && <span className="w-5 mr-2" />} {/* Espaciado */}
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
                  <span className="w-5" />
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
