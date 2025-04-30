import React, { useState } from "react";
import Chat from "./components/Chat";
import SessionGate from "./components/SessionGate";
import { SessionProvider } from "./contexts/SessionContext";
import { ToastProvider } from "./contexts/ToastContext";

const App = () => {
	const [selectedCaseId, setSelectedCaseId] = useState(null);

	return (
		<SessionProvider>
			<ToastProvider>
				<SessionGate>
					<Chat selectedCaseId={selectedCaseId} onSelectCase={setSelectedCaseId} />
				</SessionGate>
			</ToastProvider>
		</SessionProvider>
	);
};

export default App;
