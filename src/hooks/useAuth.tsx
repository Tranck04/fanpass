import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { API_BASE } from "@/lib/fanpass-api";

type AuthState = {
  token: string | null;
  fanId: string | null;
  avatarInitials: string;
  fanIdStatus: string;
  isLoading: boolean;
};

type AuthContextType = AuthState & {
  deleteAccount: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  verifyFanId: (docType: string, docNumber: string) => Promise<void>;
};

type RegisterData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  nationality?: string;
  language?: string;
  supported_team?: string;
  fan_profile?: string;
};

type ProfileUpdateData = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  nationality?: string;
  language?: string;
  supported_team?: string;
  fan_profile?: string;
};

const STORAGE_KEY = "fanpass:auth:v1";

const AuthContext = createContext<AuthContextType | null>(null);

function readStoredAuth(): AuthState {
  if (typeof window === "undefined")
    return {
      token: null,
      fanId: null,
      avatarInitials: "YA",
      fanIdStatus: "pending",
      isLoading: true,
    };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return {
        token: null,
        fanId: null,
        avatarInitials: "YA",
        fanIdStatus: "pending",
        isLoading: false,
      };
    const parsed = JSON.parse(raw);
    return {
      token: parsed.token ?? null,
      fanId: parsed.fanId ?? null,
      avatarInitials: parsed.avatarInitials ?? "YA",
      fanIdStatus: parsed.fanIdStatus ?? "pending",
      isLoading: false,
    };
  } catch {
    return {
      token: null,
      fanId: null,
      avatarInitials: "YA",
      fanIdStatus: "pending",
      isLoading: false,
    };
  }
}

function saveAuth(state: AuthState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      token: state.token,
      fanId: state.fanId,
      avatarInitials: state.avatarInitials,
      fanIdStatus: state.fanIdStatus,
    }),
  );
}

async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string | null,
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Erreur réseau" }));
    throw new Error(err.detail || "Erreur réseau");
  }
  return res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(readStoredAuth);

  // After SSR hydration, isLoading may be stuck at true because
  // readStoredAuth() returns isLoading:true on the server and React
  // reuses that server state during hydration. This effect ensures
  // the loading flag is cleared once the client takes over.
  useEffect(() => {
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  useEffect(() => {
    saveAuth(state);
  }, [state]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setState({
      token: data.access_token,
      fanId: data.fan_id,
      avatarInitials: data.avatar_initials,
      fanIdStatus: data.fan_id_status,
      isLoading: false,
    });
  }, []);

  const register = useCallback(async (regData: RegisterData) => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(regData),
    });
    setState({
      token: data.access_token,
      fanId: data.fan_id,
      avatarInitials: data.avatar_initials,
      fanIdStatus: data.fan_id_status,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    setState({
      token: null,
      fanId: null,
      avatarInitials: "YA",
      fanIdStatus: "pending",
      isLoading: false,
    });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.token) return;
    try {
      const data = await apiFetch("/auth/me", {}, state.token);
      setState((prev) => ({
        ...prev,
        avatarInitials: data.avatar_initials,
        fanIdStatus: data.fan_id_status,
      }));
    } catch {
      // Silently fail — token may be expired
    }
  }, [state.token]);

  const updateProfile = useCallback(
    async (profileData: ProfileUpdateData) => {
      if (!state.token) throw new Error("Non connecté");
      const data = await apiFetch(
        "/auth/me",
        {
          method: "PUT",
          body: JSON.stringify(profileData),
        },
        state.token,
      );
      setState((prev) => ({ ...prev, avatarInitials: data.avatar_initials }));
    },
    [state.token],
  );

  const verifyFanId = useCallback(
    async (docType: string, docNumber: string) => {
      if (!state.token) throw new Error("Non connecté");
      await apiFetch(
        "/auth/fanid/verify",
        {
          method: "POST",
          body: JSON.stringify({
            document_type: docType,
            document_number: docNumber,
          }),
        },
        state.token,
      );
      setState((prev) => ({ ...prev, fanIdStatus: "verified" }));
    },
    [state.token],
  );

  const deleteAccount = useCallback(async () => {
    if (!state.token) return;
    await apiFetch("/auth/me", { method: "DELETE" }, state.token);
    setState({
      token: null,
      fanId: null,
      avatarInitials: "YA",
      fanIdStatus: "pending",
      isLoading: false,
    });
  }, [state.token]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        deleteAccount,
        logout,
        refreshProfile,
        updateProfile,
        verifyFanId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
