import API from "@/lib/api";
import {
  MergerInitialLogPayloadType,
  MergerStep1LogPayloadType,
} from "./merger.type";

export const mergerInitialLog = (
  mergerInitialLogPayload: MergerInitialLogPayloadType
) => {
  return API.post("/merger/log/0", mergerInitialLogPayload);
};

export const mergerStep1Log = (
  mergerStep1LogPayload: MergerStep1LogPayloadType
) => {
  return API.post("/merger/log/1", mergerStep1LogPayload);
};

export const mergerCompareAPI = (
  mergerComparePayload: MergerStep1LogPayloadType
): Promise<{ status: number; message: string; report: any }> => {
  return API.post("/merger/compare", mergerComparePayload);
};
