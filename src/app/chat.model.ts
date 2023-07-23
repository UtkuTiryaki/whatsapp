export interface Chat{
 participants: { [uid:string]: boolean},
 lastMessage: {
  sender: string // uid of the sender
  content: string,
  timeStamp: string
 }
 chatId: string
}