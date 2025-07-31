import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Profile {
  name: string;
  token_file: string;
  client_secret_file: string;
  video_folder: string;
  audio_folder: string;
  thumb_folder: string;
  output_folder: string;
  title_file: string;
  desc_file: string;
  num_audio: string;
  num_video: string;
  category: string;
  start_time: string;
  schedule_slots: string;
  monetization: boolean;
  auth_status?: string;
  auth_class?: string;
}

export interface SystemStats {
  cpu: number;
  ram: number;
}

export interface FileList {
  videos: string[];
  audios: string[];
  thumbnails: string[];
}

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/login', { username, password }),
  logout: () => api.get('/logout'),
};

// Profile API
export const profileAPI = {
  getProfiles: () => api.get('/'),
  getProfile: (profileName: string) => api.get(`/get_profile/${profileName}`),
  saveProfile: (data: Partial<Profile> & { profile_name: string }) =>
    api.post('/save_profile', data),
  addProfile: (formData: FormData) =>
    api.post('/add_profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteProfile: (profileName: string) =>
    api.post('/delete_profile', { profile_name: profileName }),
  authenticate: (profileName: string) => `/auth/${profileName}`,
};

// File API
export const fileAPI = {
  listFiles: (profileName: string) => api.get(`/list_files/${profileName}`),
  uploadFiles: (formData: FormData) =>
    api.post('/upload_file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteFile: (profileName: string, fileName: string, fileType: string) =>
    api.post('/delete_file', {
      profile_name: profileName,
      file_name: fileName,
      file_type: fileType,
    }),
  getTextFile: (profileName: string, fileType: string) =>
    api.get(`/get_text_file/${profileName}/${fileType}`),
  saveTextFile: (profileName: string, fileType: string, content: string) =>
    api.post('/save_text_file', {
      profile_name: profileName,
      file_type: fileType,
      content,
    }),
};

export default api;