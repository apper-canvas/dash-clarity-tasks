import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div 
            className="flex items-center justify-center min-h-screen px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            
            <motion.div 
              className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    variant === "danger" ? "bg-red-100" : "bg-yellow-100"
                  }`}>
                    <ApperIcon 
                      name={variant === "danger" ? "AlertTriangle" : "AlertCircle"} 
                      className={`w-6 h-6 ${
                        variant === "danger" ? "text-red-600" : "text-yellow-600"
                      }`} 
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                
                <p className="text-gray-600 mb-6">{message}</p>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    variant={variant}
                    onClick={() => {
                      onConfirm()
                      onClose()
                    }}
                  >
                    {confirmLabel}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDialog