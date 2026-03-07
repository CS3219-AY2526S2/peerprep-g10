import dotenv from 'dotenv';
dotenv.config();

import pool from './db';
import { initDb } from './init-db';

interface Question {
  title: string;
  description: string;
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  examples: string;
  pseudocode: string;
}

const topics = [
  'Arrays',
  'Strings',
  'Hash Tables',
  'Linked Lists',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Sorting',
  'Searching',
  'Stacks and Queues',
];

const handWrittenQuestions: Question[] = [
  // Arrays
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    topics: ['Arrays', 'Hash Tables'],
    difficulty: 'easy',
    examples: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9',
    pseudocode: 'Create a hash map. For each number, check if (target - number) exists in the map. If yes, return both indices. Otherwise, add the number and its index to the map.',
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    description: 'Given an array prices where prices[i] is the price of a given stock on the ith day, find the maximum profit you can achieve from one transaction.',
    topics: ['Arrays', 'Dynamic Programming'],
    difficulty: 'easy',
    examples: 'Input: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5.',
    pseudocode: 'Track the minimum price seen so far. For each price, compute profit = price - minPrice. Update maxProfit if this profit is larger. Update minPrice if current price is lower.',
  },
  {
    title: 'Contains Duplicate',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    topics: ['Arrays', 'Hash Tables'],
    difficulty: 'easy',
    examples: 'Input: nums = [1,2,3,1]\nOutput: true',
    pseudocode: 'Use a set. For each element, if it is already in the set, return true. Otherwise add it. If loop ends, return false.',
  },
  {
    title: 'Maximum Subarray',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    topics: ['Arrays', 'Dynamic Programming'],
    difficulty: 'medium',
    examples: 'Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.',
    pseudocode: 'Use Kadane\'s algorithm: maintain currentSum and maxSum. For each element, currentSum = max(element, currentSum + element). Update maxSum = max(maxSum, currentSum).',
  },
  {
    title: 'Product of Array Except Self',
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i], without using division.',
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: 'Input: nums = [1,2,3,4]\nOutput: [24,12,8,6]',
    pseudocode: 'Build a prefix product array (left to right) and a suffix product array (right to left). The answer at index i is prefix[i-1] * suffix[i+1].',
  },
  {
    title: 'Merge Intervals',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
    topics: ['Arrays', 'Sorting'],
    difficulty: 'medium',
    examples: 'Input: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]',
    pseudocode: 'Sort intervals by start time. Iterate and merge: if current interval overlaps with last merged, extend the end. Otherwise add as new interval.',
  },
  {
    title: 'Trapping Rain Water',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    topics: ['Arrays', 'Dynamic Programming'],
    difficulty: 'hard',
    examples: 'Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6',
    pseudocode: 'Use two pointers (left, right). Track leftMax and rightMax. Move the pointer with smaller max inward. Water at each position = max - height.',
  },

  // Strings
  {
    title: 'Valid Anagram',
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    topics: ['Strings', 'Hash Tables'],
    difficulty: 'easy',
    examples: 'Input: s = "anagram", t = "nagaram"\nOutput: true',
    pseudocode: 'Count character frequencies of both strings using a hash map. Compare the two frequency maps.',
  },
  {
    title: 'Valid Palindrome',
    description: 'Given a string s, return true if it is a palindrome considering only alphanumeric characters and ignoring cases.',
    topics: ['Strings'],
    difficulty: 'easy',
    examples: 'Input: s = "A man, a plan, a canal: Panama"\nOutput: true',
    pseudocode: 'Use two pointers from both ends. Skip non-alphanumeric characters. Compare lowercase characters. If mismatch, return false.',
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    topics: ['Strings', 'Hash Tables'],
    difficulty: 'medium',
    examples: 'Input: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with length 3.',
    pseudocode: 'Use a sliding window with a set. Expand right pointer, adding chars to set. If duplicate found, shrink left pointer until no duplicate. Track max window size.',
  },
  {
    title: 'Longest Palindromic Substring',
    description: 'Given a string s, return the longest palindromic substring in s.',
    topics: ['Strings', 'Dynamic Programming'],
    difficulty: 'medium',
    examples: 'Input: s = "babad"\nOutput: "bab" (or "aba")',
    pseudocode: 'For each index, expand around center for both odd and even length palindromes. Track the longest one found.',
  },
  {
    title: 'Minimum Window Substring',
    description: 'Given two strings s and t, return the minimum window substring of s such that every character in t is included in the window.',
    topics: ['Strings', 'Hash Tables'],
    difficulty: 'hard',
    examples: 'Input: s = "ADOBECODEBANC", t = "ABC"\nOutput: "BANC"',
    pseudocode: 'Use sliding window with two pointers. Maintain a frequency map for t. Expand right to include all chars, then shrink left to minimize window while still valid.',
  },

  // Hash Tables
  {
    title: 'Group Anagrams',
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    topics: ['Hash Tables', 'Strings'],
    difficulty: 'medium',
    examples: 'Input: strs = ["eat","tea","tan","ate","nat","bat"]\nOutput: [["bat"],["nat","tan"],["ate","eat","tea"]]',
    pseudocode: 'For each string, sort its characters to create a key. Use a hash map to group strings by their sorted key.',
  },
  {
    title: 'Top K Frequent Elements',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements.',
    topics: ['Hash Tables', 'Sorting'],
    difficulty: 'medium',
    examples: 'Input: nums = [1,1,1,2,2,3], k = 2\nOutput: [1,2]',
    pseudocode: 'Count frequencies using a hash map. Use bucket sort: create an array where index = frequency, value = list of numbers with that frequency. Collect from highest bucket.',
  },

  // Linked Lists
  {
    title: 'Reverse Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    topics: ['Linked Lists'],
    difficulty: 'easy',
    examples: 'Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]',
    pseudocode: 'Use three pointers: prev=null, curr=head. While curr exists: save next=curr.next, point curr.next=prev, move prev=curr, curr=next. Return prev.',
  },
  {
    title: 'Linked List Cycle',
    description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
    topics: ['Linked Lists'],
    difficulty: 'easy',
    examples: 'Input: head = [3,2,0,-4], pos = 1\nOutput: true\nExplanation: There is a cycle where tail connects to the 1st node.',
    pseudocode: 'Use Floyd\'s cycle detection: slow pointer moves 1 step, fast pointer moves 2 steps. If they meet, there is a cycle. If fast reaches null, no cycle.',
  },
  {
    title: 'Merge Two Sorted Lists',
    description: 'Merge two sorted linked lists and return it as a sorted list.',
    topics: ['Linked Lists'],
    difficulty: 'easy',
    examples: 'Input: l1 = [1,2,4], l2 = [1,3,4]\nOutput: [1,1,2,3,4,4]',
    pseudocode: 'Create a dummy head. Compare heads of both lists, append the smaller one. Move that list\'s pointer forward. Append remaining nodes.',
  },
  {
    title: 'Remove Nth Node From End of List',
    description: 'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
    topics: ['Linked Lists'],
    difficulty: 'medium',
    examples: 'Input: head = [1,2,3,4,5], n = 2\nOutput: [1,2,3,5]',
    pseudocode: 'Use two pointers. Advance the first pointer n steps. Then move both pointers until the first reaches the end. The second pointer is now at the node before the one to remove.',
  },
  {
    title: 'Merge K Sorted Lists',
    description: 'You are given an array of k linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list.',
    topics: ['Linked Lists', 'Sorting'],
    difficulty: 'hard',
    examples: 'Input: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]',
    pseudocode: 'Use a min-heap (priority queue). Add the head of each list to the heap. Extract the minimum, add it to the result, and push its next node into the heap.',
  },

  // Trees
  {
    title: 'Maximum Depth of Binary Tree',
    description: 'Given the root of a binary tree, return its maximum depth.',
    topics: ['Trees'],
    difficulty: 'easy',
    examples: 'Input: root = [3,9,20,null,null,15,7]\nOutput: 3',
    pseudocode: 'Recursively: if node is null, return 0. Otherwise return 1 + max(depth(left), depth(right)).',
  },
  {
    title: 'Invert Binary Tree',
    description: 'Given the root of a binary tree, invert the tree, and return its root.',
    topics: ['Trees'],
    difficulty: 'easy',
    examples: 'Input: root = [4,2,7,1,3,6,9]\nOutput: [4,7,2,9,6,3,1]',
    pseudocode: 'Recursively swap left and right children of each node. Base case: if node is null, return null.',
  },
  {
    title: 'Validate Binary Search Tree',
    description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
    topics: ['Trees'],
    difficulty: 'medium',
    examples: 'Input: root = [2,1,3]\nOutput: true',
    pseudocode: 'Recursively validate with min/max bounds. For each node, check if its value is within (min, max). Left child gets (min, node.val), right child gets (node.val, max).',
  },
  {
    title: 'Binary Tree Level Order Traversal',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    topics: ['Trees'],
    difficulty: 'medium',
    examples: 'Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]',
    pseudocode: 'Use BFS with a queue. Process nodes level by level: for each level, dequeue all current nodes, record their values, and enqueue their children.',
  },
  {
    title: 'Serialize and Deserialize Binary Tree',
    description: 'Design an algorithm to serialize and deserialize a binary tree.',
    topics: ['Trees'],
    difficulty: 'hard',
    examples: 'Input: root = [1,2,3,null,null,4,5]\nOutput: [1,2,3,null,null,4,5]',
    pseudocode: 'Serialize: Use preorder traversal, representing null nodes as a marker. Deserialize: Read tokens in preorder, recursively build left then right subtrees.',
  },

  // Graphs
  {
    title: 'Number of Islands',
    description: 'Given an m x n 2D binary grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
    topics: ['Graphs'],
    difficulty: 'medium',
    examples: 'Input: grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]\nOutput: 3',
    pseudocode: 'Iterate through grid. When a "1" is found, increment count and run BFS/DFS to mark all connected "1"s as visited.',
  },
  {
    title: 'Clone Graph',
    description: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.',
    topics: ['Graphs', 'Hash Tables'],
    difficulty: 'medium',
    examples: 'Input: adjList = [[2,4],[1,3],[2,4],[1,3]]\nOutput: [[2,4],[1,3],[2,4],[1,3]]',
    pseudocode: 'Use BFS/DFS with a hash map (old node -> new node). For each node, create a clone and recursively clone its neighbors.',
  },
  {
    title: 'Course Schedule',
    description: 'There are numCourses courses. Some have prerequisites. Determine if it is possible to finish all courses.',
    topics: ['Graphs'],
    difficulty: 'medium',
    examples: 'Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true',
    pseudocode: 'Build a directed graph. Detect cycles using topological sort (Kahn\'s algorithm with in-degree counting) or DFS with coloring.',
  },
  {
    title: 'Word Ladder',
    description: 'Given two words beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence.',
    topics: ['Graphs', 'Strings'],
    difficulty: 'hard',
    examples: 'Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]\nOutput: 5',
    pseudocode: 'Use BFS. From each word, try changing each character to every letter a-z. If the new word is in the dictionary, add it to the queue. Track the level (distance).',
  },

  // Dynamic Programming
  {
    title: 'Climbing Stairs',
    description: 'You are climbing a staircase that takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
    topics: ['Dynamic Programming'],
    difficulty: 'easy',
    examples: 'Input: n = 3\nOutput: 3\nExplanation: 1+1+1, 1+2, 2+1',
    pseudocode: 'dp[i] = dp[i-1] + dp[i-2]. Base cases: dp[1]=1, dp[2]=2. This is essentially the Fibonacci sequence.',
  },
  {
    title: 'House Robber',
    description: 'Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without robbing two adjacent houses.',
    topics: ['Dynamic Programming'],
    difficulty: 'medium',
    examples: 'Input: nums = [1,2,3,1]\nOutput: 4\nExplanation: Rob house 1 (1) and house 3 (3) = 1 + 3 = 4.',
    pseudocode: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]). The choice at each house: skip it or rob it (adding to the best total from two houses back).',
  },
  {
    title: 'Coin Change',
    description: 'Given an integer array coins and an amount, return the fewest number of coins needed to make up that amount. Return -1 if it cannot be made.',
    topics: ['Dynamic Programming'],
    difficulty: 'medium',
    examples: 'Input: coins = [1,2,5], amount = 11\nOutput: 3\nExplanation: 11 = 5 + 5 + 1',
    pseudocode: 'dp[i] = min coins to make amount i. For each amount from 1 to target, try each coin: dp[i] = min(dp[i], dp[i - coin] + 1).',
  },
  {
    title: 'Longest Increasing Subsequence',
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
    topics: ['Dynamic Programming', 'Searching'],
    difficulty: 'medium',
    examples: 'Input: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: [2,3,7,101]',
    pseudocode: 'Maintain a tails array. For each number, use binary search to find its position. If it extends the sequence, append. Otherwise replace the appropriate element.',
  },
  {
    title: 'Edit Distance',
    description: 'Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) required to convert word1 to word2.',
    topics: ['Dynamic Programming', 'Strings'],
    difficulty: 'hard',
    examples: 'Input: word1 = "horse", word2 = "ros"\nOutput: 3',
    pseudocode: 'dp[i][j] = edit distance of word1[0..i] and word2[0..j]. If chars match, dp[i][j]=dp[i-1][j-1]. Otherwise min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1.',
  },

  // Sorting
  {
    title: 'Merge Sort Implementation',
    description: 'Implement merge sort to sort an array of integers in ascending order.',
    topics: ['Sorting'],
    difficulty: 'easy',
    examples: 'Input: [38,27,43,3,9,82,10]\nOutput: [3,9,10,27,38,43,82]',
    pseudocode: 'Divide array in half recursively until single elements. Merge two sorted halves by comparing elements and building a sorted result.',
  },
  {
    title: 'Sort Colors',
    description: 'Given an array nums with n objects colored red (0), white (1), and blue (2), sort them in-place using one pass.',
    topics: ['Sorting', 'Arrays'],
    difficulty: 'medium',
    examples: 'Input: nums = [2,0,2,1,1,0]\nOutput: [0,0,1,1,2,2]',
    pseudocode: 'Dutch National Flag: use three pointers (low, mid, high). Swap 0s to low, 2s to high, skip 1s. Process until mid > high.',
  },
  {
    title: 'Kth Largest Element in an Array',
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array.',
    topics: ['Sorting', 'Searching'],
    difficulty: 'medium',
    examples: 'Input: nums = [3,2,1,5,6,4], k = 2\nOutput: 5',
    pseudocode: 'Use Quickselect (partition-based selection). Partition around a pivot. If pivot index = n-k, return it. Otherwise recurse on the appropriate side.',
  },

  // Searching
  {
    title: 'Binary Search',
    description: 'Given a sorted array of integers nums and a target value, return the index of target, or -1 if not found.',
    topics: ['Searching', 'Arrays'],
    difficulty: 'easy',
    examples: 'Input: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4',
    pseudocode: 'Set low=0, high=n-1. While low<=high: mid=(low+high)/2. If nums[mid]==target return mid. If nums[mid]<target, low=mid+1. Else high=mid-1.',
  },
  {
    title: 'Search in Rotated Sorted Array',
    description: 'Given a rotated sorted array and a target, return its index or -1 if not found. Algorithm must be O(log n).',
    topics: ['Searching', 'Arrays'],
    difficulty: 'medium',
    examples: 'Input: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4',
    pseudocode: 'Modified binary search. Determine which half is sorted. If target is in the sorted half, search there. Otherwise search the other half.',
  },
  {
    title: 'Find Minimum in Rotated Sorted Array',
    description: 'Given a sorted rotated array of unique elements, find the minimum element in O(log n) time.',
    topics: ['Searching', 'Arrays'],
    difficulty: 'medium',
    examples: 'Input: nums = [3,4,5,1,2]\nOutput: 1',
    pseudocode: 'Binary search: if nums[mid] > nums[high], minimum is in right half. Otherwise it is in left half (including mid).',
  },

  // Stacks and Queues
  {
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters (){}[], determine if the input string is valid.',
    topics: ['Stacks and Queues'],
    difficulty: 'easy',
    examples: 'Input: s = "()[]{}"\nOutput: true',
    pseudocode: 'Use a stack. For each opening bracket, push its closing counterpart. For each closing bracket, pop and compare. If mismatch or stack not empty at end, invalid.',
  },
  {
    title: 'Implement Queue using Stacks',
    description: 'Implement a first-in-first-out (FIFO) queue using only two stacks.',
    topics: ['Stacks and Queues'],
    difficulty: 'easy',
    examples: 'Input: ["MyQueue","push","push","peek","pop","empty"]\nOutput: [null,null,null,1,1,false]',
    pseudocode: 'Use two stacks: inbox and outbox. Push to inbox. For pop/peek, if outbox is empty, transfer all from inbox to outbox (reverses order). Pop from outbox.',
  },
  {
    title: 'Min Stack',
    description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
    topics: ['Stacks and Queues'],
    difficulty: 'medium',
    examples: 'Input: ["MinStack","push","push","push","getMin","pop","top","getMin"]\nOutput: [null,null,null,null,-3,null,0,-2]',
    pseudocode: 'Use two stacks: one for values, one for minimums. On push, also push to min stack if value <= current min. On pop, also pop from min stack if value == current min.',
  },
  {
    title: 'Sliding Window Maximum',
    description: 'Given an array nums and a sliding window of size k, return the max value in each window position.',
    topics: ['Stacks and Queues', 'Arrays'],
    difficulty: 'hard',
    examples: 'Input: nums = [1,3,-1,-3,5,3,6,7], k = 3\nOutput: [3,3,5,5,6,7]',
    pseudocode: 'Use a monotonic deque (decreasing). For each element, remove smaller elements from back. Remove front if outside window. Front of deque is the maximum.',
  },
];

function generateQuestions(): Question[] {
  const all: Question[] = [...handWrittenQuestions];

  const templates: Record<string, { easy: string[]; medium: string[]; hard: string[] }> = {
    'Arrays': {
      easy: [
        'Find the Maximum Element',
        'Find the Minimum Element',
        'Reverse an Array',
        'Remove Duplicates from Sorted Array',
        'Move Zeroes',
        'Single Number',
        'Intersection of Two Arrays',
        'Plus One',
        'Shuffle the Array',
        'Running Sum of 1d Array',
      ],
      medium: [
        'Rotate Array',
        '3Sum',
        'Container With Most Water',
        'Next Permutation',
        'Spiral Matrix',
        'Jump Game',
        'Set Matrix Zeroes',
        'Subarray Sum Equals K',
      ],
      hard: [
        'First Missing Positive',
        'Median of Two Sorted Arrays',
        'Candy Distribution',
        'Maximum Gap',
        'Count of Smaller Numbers After Self',
      ],
    },
    'Strings': {
      easy: [
        'Reverse String',
        'First Unique Character in a String',
        'Implement strStr()',
        'Count and Say',
        'Longest Common Prefix',
        'Roman to Integer',
        'Is Subsequence',
        'Ransom Note',
      ],
      medium: [
        'String to Integer (atoi)',
        'Zigzag Conversion',
        'Letter Combinations of a Phone Number',
        'Generate Parentheses',
        'Decode Ways',
        'Palindromic Substrings',
      ],
      hard: [
        'Regular Expression Matching',
        'Wildcard Matching',
        'Shortest Palindrome',
        'Distinct Subsequences',
      ],
    },
    'Hash Tables': {
      easy: [
        'Two Sum II',
        'Happy Number',
        'Isomorphic Strings',
        'Word Pattern',
        'Intersection of Two Arrays II',
        'Jewels and Stones',
        'Number of Good Pairs',
        'How Many Numbers Are Smaller',
      ],
      medium: [
        'Longest Consecutive Sequence',
        '4Sum II',
        'Find All Anagrams in a String',
        'Subarray Sum Equals K (Hash)',
        'Brick Wall',
        'Encode and Decode TinyURL',
      ],
      hard: [
        'LRU Cache',
        'LFU Cache',
        'Max Points on a Line',
        'Substring with Concatenation of All Words',
      ],
    },
    'Linked Lists': {
      easy: [
        'Remove Duplicates from Sorted List',
        'Palindrome Linked List',
        'Intersection of Two Linked Lists',
        'Middle of the Linked List',
        'Delete Node in a Linked List',
        'Convert Binary Number in Linked List to Integer',
      ],
      medium: [
        'Add Two Numbers',
        'Odd Even Linked List',
        'Sort List',
        'Swap Nodes in Pairs',
        'Rotate List',
        'Copy List with Random Pointer',
      ],
      hard: [
        'Reverse Nodes in k-Group',
        'Design Linked List (Hard Variant)',
      ],
    },
    'Trees': {
      easy: [
        'Same Tree',
        'Symmetric Tree',
        'Path Sum',
        'Subtree of Another Tree',
        'Diameter of Binary Tree',
        'Balanced Binary Tree',
        'Minimum Depth of Binary Tree',
      ],
      medium: [
        'Construct Binary Tree from Preorder and Inorder',
        'Kth Smallest Element in a BST',
        'Lowest Common Ancestor of BST',
        'Binary Tree Right Side View',
        'Count Complete Tree Nodes',
        'Flatten Binary Tree to Linked List',
      ],
      hard: [
        'Binary Tree Maximum Path Sum',
        'Recover Binary Search Tree',
      ],
    },
    'Graphs': {
      easy: [
        'Find if Path Exists in Graph',
        'Find the Town Judge',
        'Find Center of Star Graph',
      ],
      medium: [
        'Pacific Atlantic Water Flow',
        'Graph Valid Tree',
        'Redundant Connection',
        'Accounts Merge',
        'Evaluate Division',
        'Rotting Oranges',
      ],
      hard: [
        'Alien Dictionary',
        'Shortest Path in a Grid with Obstacles',
        'Reconstruct Itinerary',
        'Critical Connections in a Network',
      ],
    },
    'Dynamic Programming': {
      easy: [
        'Fibonacci Number',
        'Min Cost Climbing Stairs',
        'Pascal\'s Triangle',
        'Is Subsequence (DP)',
        'Counting Bits',
        'Divisor Game',
      ],
      medium: [
        'Unique Paths',
        'Decode Ways (DP)',
        'Word Break',
        'Partition Equal Subset Sum',
        'Target Sum',
        'Longest Common Subsequence',
        'Maximal Square',
      ],
      hard: [
        'Regular Expression Matching (DP)',
        'Burst Balloons',
        'Longest Valid Parentheses',
      ],
    },
    'Sorting': {
      easy: [
        'Squares of a Sorted Array',
        'Relative Sort Array',
        'Sort Array By Parity',
        'Height Checker',
        'Largest Perimeter Triangle',
      ],
      medium: [
        'Largest Number',
        'Wiggle Sort II',
        'Pancake Sorting',
        'Custom Sort String',
        'Frequency Sort',
      ],
      hard: [
        'Maximum Gap (Bucket Sort)',
        'Count of Range Sum',
      ],
    },
    'Searching': {
      easy: [
        'Sqrt(x)',
        'First Bad Version',
        'Guess Number Higher or Lower',
        'Count Negative Numbers in a Sorted Matrix',
        'Intersection of Two Arrays (Search)',
      ],
      medium: [
        'Find Peak Element',
        'Search a 2D Matrix',
        'Find First and Last Position in Sorted Array',
        'Search a 2D Matrix II',
        'Time Based Key-Value Store',
      ],
      hard: [
        'Median of Two Sorted Arrays (Search)',
        'Split Array Largest Sum',
      ],
    },
    'Stacks and Queues': {
      easy: [
        'Implement Stack using Queues',
        'Next Greater Element I',
        'Baseball Game',
        'Backspace String Compare',
        'Remove All Adjacent Duplicates In String',
      ],
      medium: [
        'Daily Temperatures',
        'Evaluate Reverse Polish Notation',
        'Decode String',
        'Asteroid Collision',
        'Online Stock Span',
      ],
      hard: [
        'Largest Rectangle in Histogram',
        'Basic Calculator',
        'Maximal Rectangle',
      ],
    },
  };

  for (const [topic, byDifficulty] of Object.entries(templates)) {
    for (const [difficulty, titles] of Object.entries(byDifficulty)) {
      for (const title of titles) {
        // Skip if we already have a hand-written version
        if (all.some((q) => q.title === title)) continue;

        all.push({
          title,
          description: `Solve the "${title}" problem. This is a ${difficulty}-level ${topic.toLowerCase()} problem commonly seen in coding interviews.`,
          topics: [topic],
          difficulty: difficulty as 'easy' | 'medium' | 'hard',
          examples: `This is a ${difficulty} difficulty problem in the ${topic} category.`,
          pseudocode: `Apply standard ${topic.toLowerCase()} techniques to solve this ${difficulty} problem.`,
        });
      }
    }
  }

  return all;
}

async function seed() {
  await initDb();

  await pool.query('DELETE FROM questions');

  const questions = generateQuestions();

  const values: string[] = [];
  const params: unknown[] = [];
  let paramIdx = 1;

  for (const q of questions) {
    values.push(`($${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2}, $${paramIdx + 3}, $${paramIdx + 4}, $${paramIdx + 5})`);
    params.push(q.title, q.description, q.topics, q.difficulty, q.examples, q.pseudocode);
    paramIdx += 6;
  }

  await pool.query(
    `INSERT INTO questions (title, description, topics, difficulty, examples, pseudocode) VALUES ${values.join(', ')}`,
    params
  );

  console.log(`Seeded ${questions.length} questions`);
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
