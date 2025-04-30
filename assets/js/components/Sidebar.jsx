import React, { useContext } from "react";
import useSupportCases from "../hooks/useSupportCases";
import SessionContext from "../contexts/SessionContext";

const Sidebar = ({ selectedCaseId, onSelectCase }) => {
	const { session } = useContext(SessionContext);
	const { cases, loading, error } = useSupportCases(session);

	return (
		<aside className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
			<h2 className="text-xl font-semibold mb-4">Support Cases</h2>
			{loading && <p className="text-gray-500">Loading…</p>}
			{error && <p className="text-red-600">{error}</p>}
			<ul className="space-y-2">
				{cases.map((c) => (
					<li
						key={c.id}
						onClick={() => onSelectCase(c.id)}
						className={`p-3 rounded cursor-pointer ${
							c.id === selectedCaseId ? "bg-blue-100" : "bg-gray-100 hover:bg-gray-200"
						}`}
					>
						<div className="font-medium">{c.title}</div>
						<div className="text-xs text-gray-500">{c.status}</div>
					</li>
				))}
			</ul>
		</aside>
	);
};

export default Sidebar;
