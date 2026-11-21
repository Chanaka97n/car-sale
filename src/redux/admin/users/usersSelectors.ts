import type { RootState } from "../../store";

export const selectUsers = (state: RootState) => state.users.users;
export const selectUsersStatus = (state: RootState) => state.users.status;
/** Load error or last mutation error, whichever is set. */
export const selectUsersError = (state: RootState) =>
  state.users.mutationError ?? state.users.error;
export const selectUsersMutationStatus = (state: RootState) => state.users.mutationStatus;
export const selectTemporaryCredentials = (state: RootState) => state.users.temporaryCredentials;
