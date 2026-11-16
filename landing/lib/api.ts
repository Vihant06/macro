const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ChatApiResponse {
  response: string;
  route?: string | null;
  guardrail_blocked?: boolean;
  profile?: Record<string, unknown> | null;
  missing_fields?: string[] | null;
}

export async function sendChatMessage(
  message: string,
  token?: string,
  threadId?: string
): Promise<ChatApiResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message,
      thread_id: threadId,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Chat API error (${res.status}): ${errorText}`);
  }

  return res.json();
}

export async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) {
    throw new Error(`Health check failed (${res.status})`);
  }
  return res.json();
}
