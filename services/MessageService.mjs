import Message from '../models/message.mjs';

class MessageService {
  static async submitMessage({ name, email, subject, message }) {
    const newMessage = new Message({ name, email, subject, message });
    return newMessage.save();
  }
}

export default MessageService;
