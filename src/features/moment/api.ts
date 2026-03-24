import api from '@/src/utils/api';

export function getPublicMoments(page: number, pageSize: number) {
  return api.get<IGetMomentListResponse>('/moment/public', { page, pageSize });
}

export function getPublicMomentById(id: number) {
  return api.get<IMomentItem<any>>(`/moment/public/${id}`);
}

export function getOwnerMoment(id: number) {
  return api.get<IMomentItem<any>>(`/moment/owner/${id}`);
}

export function getAllMoments(page: number, pageSize: number) {
  return api.get<IGetMomentListResponse>('/moment/all', { page, pageSize });
}

export function createMoment(payload?: Partial<IMomentItem<any>>) {
  return api.post<IMomentItem<any>>('/moment', payload);
}

export function updateMoment(id: number, payload: Partial<IMomentItem<any>>) {
  return api.patch<IMomentItem<any>>(`/moment/${id}`, payload);
}

export function deleteMoment(id: number) {
  return api.del<null>(`/moment/${id}`);
}
