import api from '@/src/utils/api';

export type MomentAttributes = Record<string, unknown>;
export type MomentEntity = IMomentItem<MomentAttributes>;
export type MomentListResult = Omit<IGetMomentListResponse, 'moments'> & {
  moments: MomentEntity[];
};

export function getPublicMoments(page: number, pageSize: number) {
  return api.get<MomentListResult>('/moment/public', { page, pageSize });
}

export function getPublicMomentById(id: number) {
  return api.get<MomentEntity>(`/moment/public/${id}`);
}

export function getOwnerMoment(id: number) {
  return api.get<MomentEntity>(`/moment/owner/${id}`);
}

export function getAllMoments(page: number, pageSize: number) {
  return api.get<MomentListResult>('/moment/all', { page, pageSize });
}

export function createMoment(payload?: Partial<MomentEntity>) {
  return api.post<MomentEntity>('/moment', payload);
}

export function updateMoment(id: number, payload: Partial<MomentEntity>) {
  return api.patch<MomentEntity>(`/moment/${id}`, payload);
}

export function deleteMoment(id: number) {
  return api.del<null>(`/moment/${id}`);
}
