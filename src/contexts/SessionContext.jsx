import React, { createContext, useContext } from "react";
import { useSessionTimeout } from "../hooks/useSessionTimeout";
import SessionWarningModal from "../components/SessionWarningModal";

/**
 * Session Context and Provider
 * 
 * Wraps the application to provide session management functionality.
 * Displays warning modal when session is about to expire.
 */

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const {
    showWarning,
    formattedTime,
    extendSession,
    handleLogoutNow,
    timeoutMinutes,
  } = useSessionTimeout();

  return (
    <SessionContext.Provider value={{ timeoutMinutes }}>
      {children}
      
      {/* Session Warning Modal */}
      <SessionWarningModal
        isOpen={showWarning}
        remainingTime={formattedTime}
        onExtend={extendSession}
        onLogout={handleLogoutNow}
      />
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export default SessionProvider;
