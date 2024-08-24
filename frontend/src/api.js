import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const fetchResponse = async (userInput) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/faq`, {
      question: userInput
    });
    return response.data.answer;
  } catch (error) {
    console.error('Error fetching response:', error);
    return 'Sorry, I couldn\'t fetch a response at this time.';
  }
};
