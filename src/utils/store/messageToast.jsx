import toast from "react-hot-toast";

export function showMessageToast(username, message, avatar) {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-custom-enter" : "animate-custom-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <img
            className="h-10 w-10 rounded-full"
            src={avatar || "/images/username.svg"}
            alt="User avatar"
          />
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{username}</p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>

      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  ));
}