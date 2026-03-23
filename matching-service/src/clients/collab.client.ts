import axios from 'axios';
import { Question } from './question.client';

const COLLAB_SERVICE_URL = process.env.COLLAB_SERVICE_URL || 'http://localhost:3001';

export interface CollabSessionResponse {
  roomId: string;
}

class CollaborationClient {
  /**
   * Provisions a new collaborative coding room for the two matched users.
   * @param userA The ID of the first user
   * @param userB The ID of the second user
   * @param question The full question object fetched from the Question Service
   * @returns The session details, crucially including the generated roomId
   */
  public async createSession(userA: string, userB: string, question: Question): Promise<CollabSessionResponse> {
    try {
      const payload = {
        title: question.title,
        topic: question.topics[0],
        difficulty: question.difficulty,
        description: question.description,
        codeExample: question.examples || "",
        starterCode: question.pseudocode || "",
        testCases: [], 
        user1Id: userA,
        user2Id: userB,
      };

      const response = await axios.post<CollabSessionResponse>(`${COLLAB_SERVICE_URL}/rooms`, payload);

      console.log(`✅ [CollabClient] Created room for ${userA} & ${userB}`);
      
      return response.data;
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`❌ [CollabClient] HTTP Error: ${error.response?.status}`, error.response?.data);
      } else {
        console.error(`❌ [CollabClient] Unexpected network error:`, error);
      }
      
      throw new Error('Failed to create collaborative session.');
    }
  }
}

// Export as a singleton
export const CollabClient = new CollaborationClient();