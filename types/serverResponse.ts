interface ServerResponse {
  message?: string,
  ok: boolean,
  status: number,
  error?: unknown
}

export default ServerResponse