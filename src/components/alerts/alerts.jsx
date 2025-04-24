export default function Alerts({ 
    alertContent, 
    alertType,
  }) {
  
    return (
        <div id="toast-top-right" className={`fixed flex items-center w-full max-w-xs p-4 space-x-4 ${alertType === 'success' ? ' text-green-700 bg-green-100' : alertType === 'error' && 'text-red-700 bg-red-100'} divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-sm top-5 right-5`} role="alert">
            <div className="text-sm font-normal">{alertContent}</div>
        </div>
    );
  }