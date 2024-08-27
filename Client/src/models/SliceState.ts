export default interface SliceState {
    status: SliceStatus;
    error: SliceError;
}
export type SliceError = string | null;
export type SliceStatus = 'loading' | 'idle' | 'error';