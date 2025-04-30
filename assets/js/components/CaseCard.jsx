import React from "react";

const CaseCard = ({ supportCase, onClick, selected }) => {
	return (
		<div
			onClick={() => onClick(supportCase.id)}
			className={`p-4 border rounded-md shadow-sm cursor-pointer ${
				selected ? "bg-blue-100 border-blue-400" : "hover:bg-gray-100"
			}`}
		>
			<div className="font-semibold">{supportCase.title}</div>
			<div className="text-xs text-gray-500">{supportCase.status}</div>
		</div>
	);
};

export default CaseCard;
