import { proxy, snapshot, useSnapshot } from "valtio";
import { chatStore } from "../chat-store";

const MAX_ROWS = 18;
interface ChatInputStoreProps {
  rows: number;
  keysPressed: Set<string>;
  shortcutActivated: boolean;
}

const state = proxy<ChatInputStoreProps>({
  rows: 1,
  keysPressed: new Set(),
  shortcutActivated: false,
});

export const SetInputRows = (rows: number) => {
  if (rows < MAX_ROWS) {
    state.rows = rows + 1;
  }
};

export const SetInputRowsToMax = () => {
  state.rows = MAX_ROWS;
};

export const ResetInputRows = () => {
  state.rows = 1;
};

// カーソル位置にテキストを挿入し、指定位置にカーソルを移動する関数
function insertTextAtCursor(
  el: HTMLTextAreaElement,
  text: string,
  cursorOffset: number
) {
  console.log("insertTextAtCursor is called");

  // カーソル位置にテキストを挿入
  const value = el.value;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  chatStore.updateInput(
    value.substring(0, start) + text + value.substring(end)
  );

  // カーソルを移動
  setTimeout(() => {
    el.selectionStart = el.selectionEnd = start + cursorOffset;
  }, 0);
}

function scrollToTop(el: HTMLTextAreaElement) {
  el.scrollTop = 0;
  el.selectionStart = el.selectionEnd = 0;
}

function scrollToBottom(el: HTMLTextAreaElement) {
  el.scrollTop = el.scrollHeight;
  el.selectionStart = el.selectionEnd = el.value.length;
}

export const onKeyDown = (
  event: React.KeyboardEvent<HTMLTextAreaElement>,
  submit: () => void
) => {
  const activeElement = event.target as HTMLTextAreaElement;

  // create new row
  state.keysPressed.add(event.key);
  const snap = snapshot(state);

  // submit on ctrl+enter
  if (
    !event.nativeEvent.isComposing &&
    snap.keysPressed.has("Enter") &&
    snap.keysPressed.has("Control") &&
    !snap.keysPressed.has("Shift")
  ) {
    submit();
    ResetInputRows();
    event.preventDefault();
    return;
  }

  // create new row on shift+enter
  if (
    snap.keysPressed.has("Enter") &&
    snap.keysPressed.has("Shift") &&
    !snap.keysPressed.has("Control")
  ) {
    SetInputRows(state.rows + 1);
    return;
  }

  // create new row on enter
  if (
    snap.keysPressed.has("Enter") &&
    !snap.keysPressed.has("Control") &&
    !snap.keysPressed.has("Shift")
  ) {
    SetInputRows(state.rows + 1);
    return;
  }

  // UserScript logic
  if (event.ctrlKey && event.key === "/" && !snap.shortcutActivated) {
    event.preventDefault();
    event.stopPropagation();
    state.shortcutActivated = true;
    const textToInsert = "\n```\n```\n";
    const cursorOffset = textToInsert.indexOf("```") + 3;
    insertTextAtCursor(activeElement, textToInsert, cursorOffset);
    return;
  } else if (event.ctrlKey && event.key === "ArrowUp" && !event.shiftKey) {
    event.preventDefault();
    event.stopPropagation();
    scrollToTop(activeElement);
    return;
  } else if (event.ctrlKey && event.key === "ArrowDown" && !event.shiftKey) {
    event.preventDefault();
    event.stopPropagation();
    scrollToBottom(activeElement);
    return;
  }
};

export const onKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
  state.keysPressed.delete(event.key);
  if (event.key === "/") {
    state.shortcutActivated = false;
  }
};

export const useChatInputDynamicHeight = () => {
  return useSnapshot(state);
};
