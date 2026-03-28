import { useEffect, useState } from "react";
import { getUserData, StoredUserData } from "@/utils/userStorage";

export function useUserData(email?: string) {
  const [userData, setUserData] = useState<StoredUserData | null>(() =>
    email ? getUserData(email) : null
  );

  useEffect(() => {
    if (!email) {
      setUserData(null);
      return;
    }

    const refresh = () => {
      setUserData(getUserData(email));
    };

    refresh();

    window.addEventListener("user-data-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("user-data-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [email]);

  return userData;
}