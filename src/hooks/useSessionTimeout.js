import { useEffect, useRef, useCallback, useState } from "react";
import { useAuth } from "../contexts/Authcontext";
import { useNavigate } from "react-router-dom";

/**
 * Session Timeout Management Hook
 * 
 * Monitors user activity and automatically logs out after inactivity period.
 * Configurable via VITE_SESSION_TIMEOUT_MINUTES env variable (default: 30 minutes)
 * 
 * Features:
 * - Tracks mouse, keyboard, scroll, and touch events
 * - Shows warning modal 2 minutes before timeout
 * - Allows user to extend session
 * - Persists last activity time to localStorage for cross-tab sync
 */

const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

const STORAGE_KEY = "lastActivityTime";
const WARNING_MINUTES = 5; // Show warning 5 minutes before timeout

export function useSessionTimeout() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const countdownRef = useRef(null);
  
  // Get timeout from env (in minutes), default to 30
  const timeoutMinutes = parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || "30", 10);
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = WARNING_MINUTES * 60 * 1000;

  // Update last activity time
  const updateActivity = useCallback(() => {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, now.toString());
    setShowWarning(false);
  }, []);

  // Handle session expiry
  const handleSessionExpiry = useCallback(async () => {
    console.log("[SESSION] Session expired due to inactivity");
    setShowWarning(false);
    
    // Clear timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    // Logout and redirect
    await logout();
    navigate("/login", { 
      state: { 
        sessionExpired: true,
        message: "Your session has expired due to inactivity. Please log in again."
      }
    });
  }, [logout, navigate]);

  // Extend session (called when user clicks "Stay logged in")
  const extendSession = useCallback(() => {
    console.log("[SESSION] Session extended by user");
    updateActivity();
    setShowWarning(false);
    
    // Clear countdown
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  }, [updateActivity]);

  // Set up activity listeners and timers
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      return;
    }

    console.log(`[SESSION] Session timeout set to ${timeoutMinutes} minutes`);
    
    // Initialize last activity
    updateActivity();

    // Activity handler with debounce
    let debounceTimer = null;
    const handleActivity = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        updateActivity();
      }, 1000); // Debounce 1 second
    };

    // Add activity listeners
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Check for timeout periodically
    const checkTimeout = () => {
      const lastActivity = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      const now = Date.now();
      const elapsed = now - lastActivity;
      
      // Session expired
      if (elapsed >= timeoutMs) {
        handleSessionExpiry();
        return;
      }
      
      // Warning zone (2 minutes before expiry)
      const timeUntilExpiry = timeoutMs - elapsed;
      if (timeUntilExpiry <= warningMs && !showWarning) {
        setShowWarning(true);
        setRemainingTime(Math.ceil(timeUntilExpiry / 1000));
        
        // Start countdown
        countdownRef.current = setInterval(() => {
          setRemainingTime((prev) => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              handleSessionExpiry();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    };

    // Check every 10 seconds
    const intervalId = setInterval(checkTimeout, 10000);
    
    // Initial check
    checkTimeout();

    // Cleanup
    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(intervalId);
      if (debounceTimer) clearTimeout(debounceTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isAuthenticated, currentUser, timeoutMs, warningMs, timeoutMinutes, updateActivity, handleSessionExpiry, showWarning]);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        // Another tab updated activity, hide warning if shown
        setShowWarning(false);
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Format remaining time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    showWarning,
    remainingTime,
    formattedTime: formatTime(remainingTime),
    extendSession,
    handleLogoutNow: handleSessionExpiry,
    timeoutMinutes,
  };
}

export default useSessionTimeout;
