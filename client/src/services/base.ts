import axios from "axios";
import { appConfig } from "../config";

const apiClient = axios.create({
  baseURL: appConfig.baseUrl,
});

const { get, post, put, delete: remove } = apiClient;
export { get, post, put, remove };
