import { Server } from "socket.io";
import { queueService, MatchTicket } from "../queue.service";
import { QuestionClient } from "../../clients/question.client";
import { CollabClient } from "../../clients/collab.client";
import { matchingService } from "../matching.service";

jest.mock("../queue.service", () => ({
  queueService: {
    getCandidatesInQueue: jest.fn(),
    getTicket: jest.fn(),
    removeUserFromQueue: jest.fn(),
    removeBothUserFromMatchPool: jest.fn(),
  },
}));

jest.mock("../../clients/question.client", () => ({
  QuestionClient: {
    getRandomQuestion: jest.fn(),
  },
}));

jest.mock("../../clients/collab.client", () => ({
  CollabClient: {
    createSession: jest.fn(),
  },
}));

describe("MatchingService Unit Tests", () => {
  let ioMock: Partial<Server>;
  let emitMockA: jest.Mock;
  let emitMockB: jest.Mock;
  let toMock: jest.Mock;
  let payloadA: any;
  let payloadB: any;

  beforeEach(() => {
    jest.clearAllMocks();
    payloadA = undefined;
    payloadB = undefined;

    emitMockA = jest.fn().mockImplementation((event, payload) => { payloadA = { ...payload } });
    emitMockB = jest.fn().mockImplementation((event, payload) => { payloadB = { ...payload } });

    // Mock socket io.to() chain
    toMock = jest.fn().mockImplementation((socketId: string) => {
      if (socketId === "socketA") return { emit: emitMockA };
      if (socketId === "socketB") return { emit: emitMockB };
      return { emit: jest.fn() };
    });

    ioMock = {
      to: toMock,
    } as unknown as Partial<Server>;
  });

  describe("findMatch & tryExactMatch", () => {
    it("should ignore itself as candidate and not emit anything", async () => { 
      (queueService.getCandidatesInQueue as jest.Mock).mockResolvedValue(["userA"]);

      await matchingService.findMatch(ioMock as Server, "userA", ["Arrays"], ["Easy"]);

      expect(queueService.getCandidatesInQueue).toHaveBeenCalledWith("Arrays", "Easy");
      expect(queueService.getTicket).not.toHaveBeenCalled();
      expect(toMock).not.toHaveBeenCalled();
    });

    it("should remove stale candidate if ticket is invalid or mismatched", async () => {
      (queueService.getCandidatesInQueue as jest.Mock).mockResolvedValue(["userA", "userB"]);

      // userB has invalid ticket (mismatched topic/difficulty)
      const staleTicket: MatchTicket = {
        userId: "userB",
        socketId: "socketB",
        topic: ["Strings"],
        difficulty: ["Hard"],
        joinedAt: Date.now(),
      };

      (queueService.getTicket as jest.Mock).mockImplementation((id: string) => {
        if (id === "userB") return Promise.resolve(staleTicket);
        return Promise.resolve(null);
      });

      await matchingService.findMatch(ioMock as Server, "userA", ["Arrays"], ["Easy"]);

      // The candidate was stale with mismatched preferrences, they should be removed
      expect(queueService.removeUserFromQueue).toHaveBeenCalledWith("userB", "Arrays", "Easy");
      expect(toMock).not.toHaveBeenCalled();
    });

    it("should match with the oldest candidate first (wait time sorting)", async () => {
      (queueService.getCandidatesInQueue as jest.Mock).mockResolvedValue(["userA", "userB", "userC"]);

      const ticketA: MatchTicket = { userId: "userA", socketId: "socketA", topic: ["Arrays"], difficulty: ["Easy"], joinedAt: 1000 };
      const ticketB: MatchTicket = { userId: "userB", socketId: "socketB", topic: ["Arrays"], difficulty: ["Easy"], joinedAt: 2000 }; // newer
      const ticketC: MatchTicket = { userId: "userC", socketId: "socketC", topic: ["Arrays"], difficulty: ["Easy"], joinedAt: 500 }; // oldest

      (queueService.getTicket as jest.Mock).mockImplementation((id: string) => {
        if (id === "userA") return Promise.resolve(ticketA);
        if (id === "userB") return Promise.resolve(ticketB);
        if (id === "userC") return Promise.resolve(ticketC);
        return Promise.resolve(null);
      });

      // Both users removed successfully
      (queueService.removeBothUserFromMatchPool as jest.Mock).mockResolvedValue(true);

      // External APIs succeed
      const mockQuestion = { id: "q1", title: "Two Sum" };
      const mockSession = { id: "room123" };
      (QuestionClient.getRandomQuestion as jest.Mock).mockResolvedValue(mockQuestion);
      (CollabClient.createSession as jest.Mock).mockResolvedValue(mockSession); 

      await matchingService.findMatch(ioMock as Server, "userA", ["Arrays"], ["Easy"]);

      // Verify that it tried to match with userC because userC has the smallest joinedAt (500)
      expect(queueService.removeBothUserFromMatchPool).toHaveBeenCalledWith(ticketA, ticketC);

      // Should not have tried userB because userC succeeded
      expect(toMock).toHaveBeenCalledWith("socketA");
    });
  });

  describe("executeMatch", () => {
    const topic = "Arrays";
    const difficulty = "Easy";
    const ticketA: MatchTicket = { userId: "userA", socketId: "socketA", topic: [topic], difficulty: [difficulty], joinedAt: 1000 };
    const ticketB: MatchTicket = { userId: "userB", socketId: "socketB", topic: [topic], difficulty: [difficulty], joinedAt: 2000 };

    beforeEach(() => {
      (queueService.getTicket as jest.Mock).mockImplementation((id: string) => {
        if (id === "userA") return Promise.resolve(ticketA);
        if (id === "userB") return Promise.resolve(ticketB);
        return Promise.resolve(null);
      });
    });

    it("should abort if transaction lock fails (race condition prevention)", async () => {
      (queueService.getCandidatesInQueue as jest.Mock).mockResolvedValue(["userA", "userB"]);

      // Return false indicating redis Lua script returned 0
      (queueService.removeBothUserFromMatchPool as jest.Mock).mockResolvedValue(false);

      await matchingService.findMatch(ioMock as Server, "userA", [topic], [difficulty]);

      expect(queueService.removeBothUserFromMatchPool).toHaveBeenCalledWith(ticketA, ticketB);
      expect(QuestionClient.getRandomQuestion).not.toHaveBeenCalled();
      expect(CollabClient.createSession).not.toHaveBeenCalled();
    });

    it("should emit MATCH_FOUND successfully if everything succeeds", async () => {
      (queueService.getCandidatesInQueue as jest.Mock).mockResolvedValue(["userA", "userB"]);
      (queueService.removeBothUserFromMatchPool as jest.Mock).mockResolvedValue(true);

      const mockQuestion = { id: "q1", title: "Two Sum" };
      const mockSession = { id: "room123" };
      (QuestionClient.getRandomQuestion as jest.Mock).mockResolvedValue(mockQuestion);
      (CollabClient.createSession as jest.Mock).mockResolvedValue(mockSession); 

      await matchingService.findMatch(ioMock as Server, "userA", [topic], [difficulty]);

      expect(toMock).toHaveBeenCalledWith("socketA");
      expect(toMock).toHaveBeenCalledWith("socketB");
      expect(payloadA).toMatchObject({
        roomId: "room123",
        question: mockQuestion,
        userId: "userA",
        partnerId: "userB"
      });
      expect(payloadB).toMatchObject({
        roomId: "room123",
        question: mockQuestion,
        userId: "userB",
        partnerId: "userA"
      });
    });

    it("should emit MATCH_ERROR and abort if external APIs fail", async () => { 
      (queueService.getCandidatesInQueue as jest.Mock).mockResolvedValue(["userA", "userB"]);
      (queueService.removeBothUserFromMatchPool as jest.Mock).mockResolvedValue(true);

      // Fail question fetching
      (QuestionClient.getRandomQuestion as jest.Mock).mockRejectedValue(new Error("Database error fetching question"));

      await matchingService.findMatch(ioMock as Server, "userA", [topic], [difficulty]);

      expect(toMock).toHaveBeenCalledWith("socketA");
      expect(toMock).toHaveBeenCalledWith("socketB");
      
      expect(emitMockA).toHaveBeenCalledWith("MATCH_ERROR", { message: "Database error fetching question" });
      expect(emitMockB).toHaveBeenCalledWith("MATCH_ERROR", { message: "Database error fetching question" });
      expect(CollabClient.createSession).not.toHaveBeenCalled();
    });
  });
});