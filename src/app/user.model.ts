import { Chat } from "./chat.model";

export interface User {
 name: string;
 chats: Chat[];
 contacts: User[]
 id: string;
}