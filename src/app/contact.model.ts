import { Chat } from "./chat.model";

export interface Contact {
 email: string,
 chat: Chat[],
 name: string,
 id: string
}