export interface Message {
 sender: string; // uid of the sender
 content: string;
 timestamp: string;
 chatId: string;
 senderName?: string;
}