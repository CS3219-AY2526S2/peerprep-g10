import axios from 'axios';

const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL || 'http://localhost:3003';

export interface Question {
  id: number;
  title: string;
  description: string;
  topics: string[];
  difficulty: string;
  examples?: string;
  pseudocode?: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

class QuestionServiceClient {
  /**
   * Retrieves a random question matching the specified topic and difficulty.
   * @param topic The agreed-upon topic between the two matched users
   * @param difficulty The agreed-upon difficulty level
   * @returns A Question object to initialize the workspace
   */
  public async getRandomQuestion(topic: string, difficulty: string): Promise<Question> {
    try {
      const response = await axios.get<Question>(`${QUESTION_SERVICE_URL}/questions/random`, {
        params: {
          topic: topic,
          difficulty: difficulty,
        },
      });

      console.log(`✅ [QuestionClient] Fetched random question: "${response.data.title}" (${topic} - ${difficulty})`);
      
      return response.data;
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`❌ [QuestionClient] HTTP Error: ${error.response?.status}`, error.response?.data);
        
        if (error.response?.status === 404) {
          throw new Error(`No questions found in the repository for Topic: ${topic}, Difficulty: ${difficulty}.`);
        }
      } else {
        console.error(`❌ [QuestionClient] Unexpected error:`, error);
      }
      
      throw new Error('Failed to fetch a matching question from the Question Service.');
    }
  }
}

export const QuestionClient = new QuestionServiceClient();