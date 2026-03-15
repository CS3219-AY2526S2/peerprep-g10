import axios from 'axios';

const COLLAB_SERVICE_URL = process.env.COLLAB_SERVICE_URL || 'http://localhost:3001';

export interface CollabSessionResponse {
  roomId: string;
  status: string;
  createdAt: string;
}

class CollaborationClient {
    /**
     * Provisions a new collaborative coding session for the two matched users.
     * @param userA The ID of the first user
     * @param userB The ID of the second user
     * @param questionId The ID of the question to initialize the workspace with
     * @returns The session details, crucially including the generated roomId
     */
    public async createSession(userA: string, userB: string, questionId: number): Promise<CollabSessionResponse> {
        const mockResponse: CollabSessionResponse = {
            roomId: `stub-room-${Math.random().toString(36).substring(2, 10)}`,
            status: 'created',
            createdAt: new Date().toISOString(),
        };

        console.log(`[CollabClient STUB] Created mock session ${mockResponse.roomId}`);
        return mockResponse;
    }  
}

export const CollabClient = new CollaborationClient();