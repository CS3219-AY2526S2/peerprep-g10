import axios from 'axios';

const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL || 'http://localhost:3003';

export interface Question {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  examples?: string;
  pseudocode?: string;
  images?: string[];
}

class QuestionServiceClient {
  /**
   * Retrieves a random question matching the specified topic and difficulty.
   * This directly fulfills requirement M3:F1.2.1.
   * @param topic The agreed-upon topic between the two matched users
   * @param difficulty The agreed-upon difficulty level
   * @returns A Question object to initialize the workspace
   */
  public async getRandomQuestion(topic: string, difficulty: string): Promise<Question> {
    const mockQuestion: Question = {
        id: `stub-question-${Date.now()}`,
        title: `Two Sum (Mocked ${difficulty} ${topic} version)`,
        description: `Given an array of integers, return indices of the two numbers such that they add up to a specific target.\n\n*Note: This is a stubbed question because the Question Service API is not yet ready.*`,
        topic: topic.toLowerCase(),
        difficulty: difficulty.toLowerCase(),
        examples: `Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]`,
        pseudocode: `function twoSum(nums, target) {\n  // Mock implementation\n  return [0, 1];\n}`,
    };

    console.log(`[QuestionClient STUB] Returned mock question: "${mockQuestion.title}"`);
    return mockQuestion;
  }
}

export const QuestionClient = new QuestionServiceClient();