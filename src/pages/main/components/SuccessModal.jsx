import React, { useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuccessModal = ({ onClose, header, message, path }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      sessionStorage.clear();
      // Redirect to PATH after modal closes
      navigate(path, {replace: true});
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/10 backdrop-blur-md border border-white/20 animate-fadeIn">
        <div className="bg-white rounded-2xl border border-primary-blue p-8 max-w-sm w-full shadow-2xl animate-scale-in">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {header}
            </h2>
            <p className="text-neutral-600 mb-6">
              {message}
            </p>
            
            {/* Loading spinner */}
            <div className="flex justify-center">
              <Loader2 className="animate-spin h-6 w-6 text-primary-yellow" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessModal;