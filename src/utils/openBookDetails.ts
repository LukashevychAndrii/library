import { useNavigate } from "react-router-dom";

interface params {
  bookID: number;
}

export const useOpenBookDetails = ({ bookID }: params): void => {
  const navigate = useNavigate();
  navigate(`library/${bookID}`);
};
