import type { MessageInstance } from 'antd/es/message/interface';

import type { ApiResult } from './result';

export type ApiError = ApiResult<null>;

const FALLBACK_ERROR_MESSAGE = '请求失败，请稍后再试';

export function createApiError(message: string | string[] = FALLBACK_ERROR_MESSAGE): ApiError {
  return {
    statusCode: 500,
    message,
    data: null,
  };
}

export function getApiErrorMessages(error: unknown): string[] {
  if (isApiError(error)) {
    return Array.isArray(error.message) ? error.message : [error.message];
  }

  if (error instanceof Error && error.message) {
    return [error.message];
  }

  return [FALLBACK_ERROR_MESSAGE];
}

export function normalizeApiError(messageApi: Pick<MessageInstance, 'error'>, error: unknown) {
  getApiErrorMessages(error).forEach((message) => {
    messageApi.error(message);
  });
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'statusCode' in error
  );
}
