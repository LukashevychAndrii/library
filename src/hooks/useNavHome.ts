import { useNavigate } from "react-router-dom";

export const useNavHome = () => {
  const navigate = useNavigate();
  const navigateToLibrary = () => {
    navigate("/library");
  };

  return navigateToLibrary;
};
