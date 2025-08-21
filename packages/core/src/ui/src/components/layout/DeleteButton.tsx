import { Trash2 } from "lucide-react";
import { useConfig } from "../../utils/context";
import { useState } from "react";
import Modal from "../Modal";
import { prepareApiUrl } from "../../utils/api";

export default function DeleteButton() {
  const config = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Modal visible={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col items-center justify-center gap-4 sm:p-12 p-6 bg-neutral-900 text-white rounded-2xl shadow-2xl border-2 border-neutral-800">
          <h1 className="text-2xl font-bold">Are you sure?</h1>
          <p className="text-gray-500">
            This will delete all entries. This action cannot be undone.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-4 rounded-2xl"
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true);
                  await fetch(prepareApiUrl(config.api.truncate), {
                    method: "DELETE",
                  });
                  window.location.reload();
                } catch (error) {
                  console.error("Failed to delete:", error);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 rounded-[10px] border border-neutral-800 hover:bg-gray-800 bg-neutral-900 transition-all duration-200 shadow-sm hover:shadow-md group"
        aria-label="Delete entries"
      >
        <div className="relative w-5 h-5">
          <Trash2
            size={20}
            className="text-red-500 group-hover:text-red-400 duration-200 transform transition-transform"
          />
        </div>
      </button>
    </>
  );
}
