import React from 'react';
import { X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReservationsClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'pt';
}

const translations = {
  en: {
    title: "Reservations Currently Closed",
    message: "We're currently not accepting reservations. ",
    hours: "Thursday - Tuesday: 5:00 PM - 10:00 PM",
    closed: "Wednesday: CLOSED",
    button: "Close"
  },
  pt: {
    title: "Reservas Temporariamente Fechadas",
    message: "No momento não estamos aceitando reservas. ",
    hours: "Quinta - Terça: 17:00 - 22:00",
    closed: "Quarta-feira: FECHADO",
    button: "Fechar"
  }
};

const ReservationsClosedModal: React.FC<ReservationsClosedModalProps> = ({ isOpen, onClose, language }) => {
  const text = translations[language];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-500 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{text.title}</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-red-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <Clock className="text-red-500 w-16 h-16" />
              </div>
              <p className="text-gray-700 mb-4 text-center">
                {text.message}
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                
                <p className="text-red-600 font-medium mt-2">{text.closed}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={onClose}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                {text.button}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReservationsClosedModal;