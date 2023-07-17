export interface ChatData{
  content: string; 
  sender: string; 
  timeStamp: Date; 
  participant: string | undefined;
  name: string;
}