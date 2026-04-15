/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: GPT-5.3-Codex), date: 2026-03-23
 * Scope: I used Copilot to help with implementation work in this file, mainly drafting/refactoring code and troubleshooting issues.
 * Author review: I reviewed each suggestion, kept only what fit this project, rewrote parts where needed, and tested the final behavior myself.
 */
import axios from 'axios';

const COLLAB_SERVICE_URL = process.env.COLLAB_SERVICE_URL || 'http://localhost:3001';

export interface CollabSessionResponse {
  id: string;
}

class CollaborationClient {
  /**
   * Provisions a new collaborative coding room for the two matched users.
   * @param userA The ID of the first user
   * @param userB The ID of the second user
   * @param questionId The question ID fetched from the Question Service
   * @returns The session details, crucially including the generated roomId
   */
  public async createSession(userA: string, userB: string, questionId: string): Promise<CollabSessionResponse> {
    try {
      const payload = {
        questionId: questionId, 
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