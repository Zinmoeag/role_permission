class ErrorResponse<D>{

  constructor ({
    status,
    message,
    endpoint,
    data,
  }: {
    status: string;
    message: string;
    endpoint : string;
    data ?: D;
  }) {
    return {
      status: status,
      message: message,
      endpoint: endpoint,
      data: data ?? null,
    };
  }
}

export default ErrorResponse;
