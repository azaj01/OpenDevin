import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SliceState = { messages: (Message | ErrorMessage)[] };

const initialState: SliceState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage(
      state,
      action: PayloadAction<{
        content: string;
        imageUrls: string[];
        timestamp: string;
        pending?: boolean;
      }>,
    ) {
      const message: Message = {
        sender: "user",
        content: action.payload.content,
        imageUrls: action.payload.imageUrls,
        timestamp: action.payload.timestamp || new Date().toISOString(),
        pending: !!action.payload.pending,
      };
      // Remove any pending messages
      let i = state.messages.length;
      while (i) {
        i -= 1;
        const m = state.messages[i] as Message;
        if (m.pending) {
          state.messages.splice(i, 1);
        }
      }
      state.messages.push(message);
    },

    addAssistantMessage(state, action: PayloadAction<string>) {
      const message: Message = {
        sender: "assistant",
        content: action.payload,
        imageUrls: [],
        timestamp: new Date().toISOString(),
        pending: false,
      };
      state.messages.push(message);
    },

    addErrorMessage(
      state,
      action: PayloadAction<{ id?: string; message: string }>,
    ) {
      const { id, message } = action.payload;
      state.messages.push({ id, message, error: true });
    },

    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const {
  addUserMessage,
  addAssistantMessage,
  addErrorMessage,
  clearMessages,
} = chatSlice.actions;
export default chatSlice.reducer;