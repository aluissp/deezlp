import axios from 'axios';
import constants from '../constants';
import type { AxiosInstance } from 'axios';

const baseURL = constants.DEEZER_API_URL;

export const api: AxiosInstance = axios.create({
	baseURL,
	timeout: 5000,
});
