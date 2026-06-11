import axios from 'axios';
import type { AxiosInstance } from 'axios';

const baseURL = process.env.DEEZER_API_URL || 'https://api.deezer.com';

export const api: AxiosInstance = axios.create({
	baseURL,
	timeout: 5000,
});
