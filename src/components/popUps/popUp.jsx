export default function PopUp({ 
    open, 
    popTitle, 
    popContent, 
    popType, 
    confirmFunction, 
    cancelFunction 
  }) {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="w-full max-w-md bg-white rounded-sm shadow-xl p-6">
          {popTitle && <h2 className="text-xl font-bold mb-4">{popTitle}</h2>}
          {popContent && <p className="mb-6">{popContent}</p>}
          
          <div className="flex justify-end space-x-3">
            {popType === 'option' && (
              <button
                onClick={cancelFunction}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-sm hover:cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={confirmFunction}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm hover:cursor-pointer"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }