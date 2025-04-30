import React, { createContext, useState } from "react";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
	const [toast, setToast] = useState(null);

	const showToast = (msg) => {
		setToast(msg);
		setTimeout(() => setToast(null), 3000);
	};

	return (
		<ToastContext.Provider value={{ toast, showToast }}>
			{children}
			{toast && (
				<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded shadow z-50">
					{toast}
				</div>
			)}
		</ToastContext.Provider>
	);
};

export default ToastContext;
