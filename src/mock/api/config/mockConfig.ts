import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

/**
 * モック設定のインターフェース
 */
export interface MockConfig {
  delayResponse?: number;
  onNoMatch?: 'passthrough' | 'throwException';
}

/**
 * MockAdapterを作成する関数
 */
export const createMockAdapter = (
  axiosInstance: AxiosInstance,
  config: MockConfig = { delayResponse: 1000 }
) => {
  return new MockAdapter(axiosInstance, config);
};
