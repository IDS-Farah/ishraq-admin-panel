import React, { useState } from "react";
import MasterDataSidebar from "./MasterDataSidebar";
import MasterDataList from "./MasterDataList";
import MasterDataForm from "./MasterDataForm";

const MasterDataLayout = ({
  masterData,
  setMasterData,
}) => {
  const [selectedMaster, setSelectedMaster] =
    useState("userType");

  const [formMode, setFormMode] = useState(null);

  const [selectedItem, setSelectedItem] =
    useState(null);

  const currentMaster = masterData[selectedMaster];

  const openCreate = () => {
    setSelectedItem(null);
    setFormMode("create");
  };

  const openEdit = (item) => {
    setSelectedItem(item);
    setFormMode("edit");
  };

  const openView = (item) => {
    setSelectedItem(item);
    setFormMode("view");
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedItem(null);
  };

  const saveMaster = (data) => {
    if (formMode === "create") {
      const newId =
        Math.max(
          0,
          ...currentMaster.values.map((item) => item.id),
        ) + 1;

      const newItem = {
        id: newId,
        name: data.name,
        active: data.active,
      };

      setMasterData((prev) => ({
        ...prev,

        [selectedMaster]: {
          ...prev[selectedMaster],

          values: [
            ...prev[selectedMaster].values,
            newItem,
          ],
        },
      }));
    }

    if (formMode === "edit" && selectedItem) {
      setMasterData((prev) => ({
        ...prev,

        [selectedMaster]: {
          ...prev[selectedMaster],

          values: prev[selectedMaster].values.map(
            (item) =>
              item.id === selectedItem.id
                ? {
                    ...item,
                    name: data.name,
                    active: data.active,
                  }
                : item,
          ),
        },
      }));
    }

    closeForm();
  };

  const toggleStatus = (item) => {
    setMasterData((prev) => ({
      ...prev,

      [selectedMaster]: {
        ...prev[selectedMaster],

        values: prev[selectedMaster].values.map(
          (value) =>
            value.id === item.id
              ? {
                  ...value,
                  active: !value.active,
                }
              : value,
        ),
      },
    }));
  };

  const handleMasterChange = (master) => {
    setSelectedMaster(master);
    closeForm();
  };

  return (
    <div className="flex min-h-[85vh] flex-1 overflow-hidden">
      <MasterDataSidebar
        masterData={masterData}
        selectedMaster={selectedMaster}
        onSelect={handleMasterChange}
      />

      {formMode ? (
        <MasterDataForm
          mode={formMode}
          title={currentMaster.title}
          item={selectedItem}
          onBack={closeForm}
          onSave={saveMaster}
        />
      ) : (
        <MasterDataList
          title={currentMaster.title}
          values={currentMaster.values}
          onAdd={openCreate}
          onEdit={openEdit}
          onView={openView}
          onToggleStatus={toggleStatus}
        />
      )}
    </div>
  );
};

export default MasterDataLayout;