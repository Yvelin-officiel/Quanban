export type RuntimeEnv = {
  VITE_API_URL?: string;
};

const runtimeEnv = (globalThis as typeof globalThis & { __ENV__?: RuntimeEnv }).__ENV__;

export const getRuntimeEnv = (): RuntimeEnv => runtimeEnv ?? {};
export const getApiUrl = (): string => getRuntimeEnv().VITE_API_URL || 'http://localhost:3000/api';
