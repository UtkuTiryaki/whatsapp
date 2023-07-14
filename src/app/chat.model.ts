import { User } from "./user.model";
import { Post } from "./post.model";

export interface Chat{
 user: User;
 messages: Post[];
}