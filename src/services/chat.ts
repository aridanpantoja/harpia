import axios from 'axios';

async function deleteChat(chatId: string) {
  const response = await axios.delete(`/api/chat/${chatId}`);
  return response.data;
}

async function getChat(chatId: string) {
  const response = await axios.get(`/api/chat/${chatId}`);
  return response.data;
}

export const chatService = { deleteChat, getChat };
