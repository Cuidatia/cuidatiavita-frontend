import clsx from 'clsx';

export default function PopUp({ 
    open, 
    popTitle, 
    popContent, 
    popType, 
    confirmFunction, 
    cancelFunction,
    loading
  }) {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="w-full max-w-md bg-white rounded-sm shadow-xl p-6">
          {popTitle && <h2 className="text-xl font-bold mb-4">{popTitle}</h2>}
          {popContent && <div className="mb-6">{popContent}</div>}
          
          <div className="flex justify-end space-x-3">
            {popType === 'option' && (
              <button 
                onClick={cancelFunction} disabled={loading}
                className={clsx("px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-sm hover:cursor-pointer", 
                loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300'
                )}
              >
                Cancelar
              </button>
            )}
            <button
              onClick={confirmFunction} disabled={loading}
              className={clsx("px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm hover:cursor-pointer", 
                loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
                )}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }