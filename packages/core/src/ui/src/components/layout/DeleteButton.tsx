import { Trash2 } from "lucide-react";
import { prepareApiUrl } from "../../utils/api";
import { useConfig } from "../../utils/context";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export default function DeleteButton() {
  const config = useConfig();

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete all entries. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      customClass: {
        popup: '!bg-gray-800',
        title: '!text-white',
        htmlContainer: '!text-gray-400'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(prepareApiUrl(config.api.truncate), {
            method: "DELETE",
          });
          window.location.reload();
        } catch (error) {
          console.error("Failed to delete:", error);
        }
      }
    });
  };

  return (
    <>
      <button
        onClick={handleDelete}
        className="relative p-2.5 rounded-[10px] border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group"
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
