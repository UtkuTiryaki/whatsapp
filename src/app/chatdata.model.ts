export interface ChatData{
  content: string; 
  sender: string; 
  timeStamp: string; 
  participant: string | undefined;
  name: string;
  chatId: string;
}