import { authClient } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  const onLogout = () =>
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/login");
        },
      },
    });

  return onLogout;
}
