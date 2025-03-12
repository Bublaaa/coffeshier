import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, body }) => {
  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25 }}
          id="modal-overlay"
          onClick={handleOverlayClick}
          className="fixed inset-0 flex items-end justify-end bg-white/10 backdrop-blur-sm z-50"
        >
          <div className="bg-white shadow-lg rounded-lg p-6 md:w-1/3 w-full max-h-screen overflow-auto m-5">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-300 pb-3">
              <h2 className="text-xl text-dark font-semibold">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-red-400 cursor-pointer bg-transparent hover:bg-red-100 p-2 rounded-lg"
              >
                <LucideIcons.X />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4">{body}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
