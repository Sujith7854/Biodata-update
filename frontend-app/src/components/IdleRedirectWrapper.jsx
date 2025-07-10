import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IdleRedirectWrapper = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem("is_verified");
        navigate("/");
      }, 15 * 60 * 1000); // 15 minutes
    };

    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); // initialize on mount

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timer);
    };
  }, [navigate]);

  return children;
};

export default IdleRedirectWrapper;
