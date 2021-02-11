import axios from 'axios';
import { appConfig } from '../config';

const apiClient = axios.create({
  baseURL: `http://${appConfig.serverHost}:${appConfig.serverPort}`,
});

const { get, post, put, delete: remove } = apiClient;
export { get, post, put, remove };
