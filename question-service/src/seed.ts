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

const questions: Question[] = [
  {
    title: `Two Sum`,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    topics: ['Arrays', 'Hash Tables'],
    difficulty: 'easy',
    examples: `Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Output: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
\`2 <= nums.length <= 103\`
\`-109 <= nums[i] <= 109\`
\`-109 <= target <= 109\`
Only one valid answer exists.`,
    pseudocode: '',
  },
  {
    title: `Maximum Subarray`,
    description: `Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.`,
    topics: ['Arrays', 'Dynamic Programming'],
    difficulty: 'easy',
    examples: `Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.


Example 2:
Input: nums = [1]
Output: 1

Example 3:
Input: nums = [5,4,-1,7,8]
Output: 23

Constraints:
\`1 <= nums.length <= 3 * 104\`
\`-105 <= nums[i] <= 105\`
Follow up: If you have figured out the \`O(n)\` solution, try coding another solution using the divide and conquer approach, which is more subtle.`,
    pseudocode: '',
  },
  {
    title: `Best Time to Buy and Sell Stock`,
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`ith\` day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    topics: ['Arrays', 'Dynamic Programming'],
    difficulty: 'easy',
    examples: `Example 1:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.

Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.


Example 2:
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.


Constraints:
\`1 <= prices.length <= 105\`
\`0 <= prices[i] <= 104\``,
    pseudocode: '',
  },
  {
    title: `Valid Parentheses`,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
Open brackets must be closed by the same type of brackets.

Open brackets must be closed in the correct order.`,
    topics: ['Strings', 'Stacks and Queues'],
    difficulty: 'easy',
    examples: `Example 1:
Input: s = ()
Output: true

Example 2:
Input: s = ()[]{}
Output: true

Example 3:
Input: s = (]
Output: false

Example 4:
Input: s = ([)]
Output: false

Example 5:
Input: s = {[]}
Output: true

Constraints:
\`1 <= s.length <= 104\`
\`s\` consists of parentheses only \`'()[]{}'\`.`,
    pseudocode: `def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            if not stack or stack[-1] != mapping[char]:
                return False
            stack.pop()
        else:
            stack.append(char)
    return len(stack) == 0

# Approach: Stack matching
# Time Complexity: O(n)
# Space Complexity: O(n)`,
  },
  {
    title: `Reverse Linked List`,
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    topics: ['Linked Lists'],
    difficulty: 'easy',
    examples: `Example 1:
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

Example 2:
Input: head = [1,2]
Output: [2,1]

Example 3:
Input: head = []
Output: []

Constraints:
The number of nodes in the list is the range \`[0, 5000]\`.

\`-5000 <= Node.val <= 5000\`
Follow up: A linked list can be reversed either iteratively or recursively. Could you implement both?`,
    pseudocode: '',
  },
  {
    title: `Merge Two Sorted Lists`,
    description: `Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.`,
    topics: ['Linked Lists'],
    difficulty: 'easy',
    examples: `Example 1:
Input: l1 = [1,2,4], l2 = [1,3,4]
Output: [1,1,2,3,4,4]

Example 2:
Input: l1 = [], l2 = []
Output: []

Example 3:
Input: l1 = [], l2 = [0]
Output: [0]

Constraints:
The number of nodes in both lists is in the range \`[0, 50]\`.

\`-100 <= Node.val <= 100\`
Both \`l1\` and \`l2\` are sorted in non-decreasing order.`,
    pseudocode: '',
  },
  {
    title: `Climbing Stairs`,
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    topics: ['Dynamic Programming'],
    difficulty: 'easy',
    examples: `Example 1:
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.

1. 1 step + 1 step
2. 2 steps

Example 2:
Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top.

1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step

Constraints:
\`1 <= n <= 45\``,
    pseudocode: '',
  },
  {
    title: `Single Number`,
    description: `Given a non-empty array of integers \`nums\`, every element appears twice except for one. Find that single one.

Follow up: Could you implement a solution with a linear runtime complexity and without using extra memory?`,
    topics: ['Hash Tables'],
    difficulty: 'easy',
    examples: `Example 1:
Input: nums = [2,2,1]
Output: 1

Example 2:
Input: nums = [4,1,2,1,2]
Output: 4

Example 3:
Input: nums = [1]
Output: 1

Constraints:
\`1 <= nums.length <= 3 * 104\`
\`-3 * 104 <= nums[i] <= 3 * 104\`
Each element in the array appears twice except for one element which appears only once.`,
    pseudocode: '',
  },
  {
    title: `Symmetric Tree`,
    description: `Given the \`root\` of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'easy',
    examples: `Example 1:
Input: root = [1,2,2,3,4,4,3]
Output: true

Example 2:
Input: root = [1,2,2,null,3,null,3]
Output: false

Constraints:
The number of nodes in the tree is in the range \`[1, 1000]\`.

\`-100 <= Node.val <= 100\`
Follow up: Could you solve it both recursively and iteratively?`,
    pseudocode: '',
  },
  {
    title: `Intersection of Two Linked Lists`,
    description: `Given the heads of two singly linked-lists \`headA\` and \`headB\`, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return \`null\`.

For example, the following two linked lists begin to intersect at node \`c1\`:
It is guaranteed that there are no cycles anywhere in the entire linked structure.

Note that the linked lists must retain their original structure after the function returns.`,
    topics: ['Linked Lists'],
    difficulty: 'easy',
    examples: `Example 1:
Input: intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
Output: Intersected at '8'
Explanation: The intersected node's value is 8 (note that this must not be 0 if the two lists intersect).

From the head of A, it reads as [4,1,8,4,5]. From the head of B, it reads as [5,6,1,8,4,5]. There are 2 nodes before the intersected node in A; There are 3 nodes before the intersected node in B.


Example 2:
Input: intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
Output: Intersected at '2'
Explanation: The intersected node's value is 2 (note that this must not be 0 if the two lists intersect).

From the head of A, it reads as [1,9,1,2,4]. From the head of B, it reads as [3,2,4]. There are 3 nodes before the intersected node in A; There are 1 node before the intersected node in B.


Example 3:
Input: intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
Output: No intersection
Explanation: From the head of A, it reads as [2,6,4]. From the head of B, it reads as [1,5]. Since the two lists do not intersect, intersectVal must be 0, while skipA and skipB can be arbitrary values.

Explanation: The two lists do not intersect, so return null.


Constraints:
The number of nodes of \`listA\` is in the \`m\`.

The number of nodes of \`listB\` is in the \`n\`.

\`0 <= m, n <= 3 * 104\`
\`1 <= Node.val <= 105\`
\`0 <= skipA <= m\`
\`0 <= skipB <= n\`
\`intersectVal\` is \`0\` if \`listA\` and \`listB\` do not intersect.

\`intersectVal == listA[skipA + 1] == listB[skipB + 1]\` if \`listA\` and \`listB\` intersect.

Follow up: Could you write a solution that runs in \`O(n)\` time and use only \`O(1)\` memory?`,
    pseudocode: '',
  },
  {
    title: `Move Zeroes`,
    description: `Given an integer array \`nums\`, move all \`0\`'s to the end of it while maintaining the relative order of the non-zero elements.

Note that you must do this in-place without making a copy of the array.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'easy',
    examples: `Example 1:
Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]

Example 2:
Input: nums = [0]
Output: [0]

Constraints:
\`1 <= nums.length <= 104\`
\`-231 <= nums[i] <= 231 - 1\`
Follow up: Could you minimize the total number of operations done?`,
    pseudocode: '',
  },
  {
    title: `Palindrome Linked List`,
    description: `Given the \`head\` of a singly linked list, return \`true\` if it is a palindrome.`,
    topics: ['Linked Lists', 'Searching'],
    difficulty: 'easy',
    examples: `Example 1:
Input: head = [1,2,2,1]
Output: true

Example 2:
Input: head = [1,2]
Output: false

Constraints:
The number of nodes in the list is in the range \`[1, 105]\`.

\`0 <= Node.val <= 9\`
Follow up: Could you do it in \`O(n)\` time and \`O(1)\` space?`,
    pseudocode: '',
  },
  {
    title: `Invert Binary Tree`,
    description: `Given the \`root\` of a binary tree, invert the tree, and return its root.`,
    topics: ['Trees'],
    difficulty: 'easy',
    examples: `Example 1:
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]

Example 2:
Input: root = [2,1,3]
Output: [2,3,1]

Example 3:
Input: root = []
Output: []

Constraints:
The number of nodes in the tree is in the range \`[0, 100]\`.

\`-100 <= Node.val <= 100\``,
    pseudocode: '',
  },
  {
    title: `Majority Element`,
    description: `Given an array \`nums\` of size \`n\`, return the majority element.

The majority element is the element that appears more than \`⌊n / 2⌋\` times. You may assume that the majority element always exists in the array.`,
    topics: ['Arrays'],
    difficulty: 'easy',
    examples: `Example 1:
Input: nums = [3,2,3]
Output: 3

Example 2:
Input: nums = [2,2,1,1,1,2,2]
Output: 2

Constraints:
\`n == nums.length\`
\`1 <= n <= 5 * 104\`
\`-231 <= nums[i] <= 231 - 1\`
Follow-up: Could you solve the problem in linear time and in \`O(1)\` space?`,
    pseudocode: '',
  },
  {
    title: `Min Stack`,
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the \`MinStack\` class:
\`MinStack()\` initializes the stack object.

\`void push(val)\` pushes the element \`val\` onto the stack.

\`void pop()\` removes the element on the top of the stack.

\`int top()\` gets the top element of the stack.

\`int getMin()\` retrieves the minimum element in the stack.`,
    topics: ['Stacks and Queues'],
    difficulty: 'easy',
    examples: `Example 1:
Input
[MinStack,push,push,push,getMin,pop,top,getMin]
[[],[-2],[0],[-3],[],[],[],[]]
Output
[null,null,null,null,-3,null,0,-2]
Explanation
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin(); // return -3
minStack.pop();
minStack.top();    // return 0
minStack.getMin(); // return -2

Constraints:
\`-231 <= val <= 231 - 1\`
Methods \`pop\`, \`top\` and \`getMin\` operations will always be called on non-empty stacks.

At most \`3 * 104\` calls will be made to \`push\`, \`pop\`, \`top\`, and \`getMin\`.`,
    pseudocode: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)

    def pop(self):
        if self.stack.pop() == self.min_stack[-1]:
            self.min_stack.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.min_stack[-1]

# Approach: Two stacks (main + min tracker)
# Time Complexity: O(1) for all operations
# Space Complexity: O(n)`,
  },
  {
    title: `Diameter of Binary Tree`,
    description: `Given the \`root\` of a binary tree, return the length of the diameter of the tree.

The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the \`root\`.

The length of a path between two nodes is represented by the number of edges between them.`,
    topics: ['Trees'],
    difficulty: 'easy',
    examples: `Example 1:
Input: root = [1,2,3,4,5]
Output: 3
Explanation: 3is the length of the path [4,2,1,3] or [5,2,1,3].


Example 2:
Input: root = [1,2]
Output: 1

Constraints:
The number of nodes in the tree is in the range \`[1, 104]\`.

\`-100 <= Node.val <= 100\``,
    pseudocode: '',
  },
  {
    title: `Linked List Cycle`,
    description: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer. Internally, \`pos\` is used to denote the index of the node that tail's \`next\` pointer is connected to. Note that \`pos\` is not passed as a parameter.

Return \`true\` if there is a cycle in the linked list. Otherwise, return \`false\`.`,
    topics: ['Linked Lists', 'Searching'],
    difficulty: 'easy',
    examples: `Example 1:
Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).


Example 2:
Input: head = [1,2], pos = 0
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.


Example 3:
Input: head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.


Constraints:
The number of the nodes in the list is in the range \`[0, 104]\`.

\`-105 <= Node.val <= 105\`
\`pos\` is \`-1\` or a valid index in the linked-list.

Follow up: Can you solve it using \`O(1)\` (i.e. constant) memory?`,
    pseudocode: '',
  },
  {
    title: `Merge Two Binary Trees`,
    description: `You are given two binary trees \`root1\` and \`root2\`.

Imagine that when you put one of them to cover the other, some nodes of the two trees are overlapped while the others are not. You need to merge the two trees into a new binary tree. The merge rule is that if two nodes overlap, then sum node values up as the new value of the merged node. Otherwise, the NOT null node will be used as the node of the new tree.

Return the merged tree.

Note: The merging process must start from the root nodes of both trees.`,
    topics: ['Trees'],
    difficulty: 'easy',
    examples: `Example 1:
Input: root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]
Output: [3,4,5,5,4,null,7]

Example 2:
Input: root1 = [1], root2 = [1,2]
Output: [2,2]

Constraints:
The number of nodes in both trees is in the range \`[0, 2000]\`.

\`-104 <= Node.val <= 104\``,
    pseudocode: '',
  },
  {
    title: `Find All Numbers Disappeared in an Array`,
    description: `Given an array \`nums\` of \`n\` integers where \`nums[i]\` is in the range \`[1, n]\`, return an array of all the integers in the range \`[1, n]\` that do not appear in \`nums\`.`,
    topics: ['Arrays'],
    difficulty: 'easy',
    examples: `Example 1:
Input: nums = [4,3,2,7,8,2,3,1]
Output: [5,6]

Example 2:
Input: nums = [1,1]
Output: [2]

Constraints:
\`n == nums.length\`
\`1 <= n <= 105\`
\`1 <= nums[i] <= n\`
Follow up: Could you do it without extra space and in \`O(n)\` runtime? You may assume the returned list does not count as extra space.`,
    pseudocode: '',
  },
  {
    title: `Longest Common Prefix`,
    description: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string \`\`.`,
    topics: ['Strings'],
    difficulty: 'easy',
    examples: `Example 1:
Input: strs = [flower,flow,flight]
Output: fl

Example 2:
Input: strs = [dog,racecar,car]
Output: 
Explanation: There is no common prefix among the input strings.


Constraints:
\`0 <= strs.length <= 200\`
\`0 <= strs[i].length <= 200\`
\`strs[i]\` consists of only lower-case English letters.`,
    pseudocode: '',
  },
  {
    title: `Best Time to Buy and Sell Stock II`,
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`ith\` day.

Find the maximum profit you can achieve. You may complete as many transactions as you like (i.e., buy one and sell one share of the stock multiple times).

Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).`,
    topics: ['Arrays'],
    difficulty: 'easy',
    examples: `Example 1:
Input: prices = [7,1,5,3,6,4]
Output: 7
Explanation: Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.

Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.


Example 2:
Input: prices = [1,2,3,4,5]
Output: 4
Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.

Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are engaging multiple transactions at the same time. You must sell before buying again.


Example 3:
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transaction is done, i.e., max profit = 0.


Constraints:
\`1 <= prices.length <= 3 * 104\`
\`0 <= prices[i] <= 104\``,
    pseudocode: '',
  },
  {
    title: `Maximum Depth of Binary Tree`,
    description: `Given the \`root\` of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'easy',
    examples: `Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: 3

Example 2:
Input: root = [1,null,2]
Output: 2

Example 3:
Input: root = []
Output: 0

Example 4:
Input: root = [0]
Output: 1

Constraints:
The number of nodes in the tree is in the range \`[0, 104]\`.

\`-100 <= Node.val <= 100\``,
    pseudocode: '',
  },
  {
    title: `Remove Duplicates from Sorted Array`,
    description: `Given a sorted array nums, remove the duplicates in-place such that each element appears only once and returns the new length.

Do not allocate extra space for another array, you must do this by modifying the input array in-place with O(1) extra memory.

Clarification:
Confused why the returned value is an integer but your answer is an array?
Note that the input array is passed in by reference, which means a modification to the input array will be known to the caller as well.

Internally you can think of this:
// nums is passed in by reference. (i.e., without making a copy)
int len = removeDuplicates(nums);
// any modification to nums in your function would be known by the caller.

// using the length returned by your function, it prints the first len elements.

for (int i = 0; i < len; i++) {
    print(nums[i]);
}`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'easy',
    examples: `Example 1:
Input: nums = [1,1,2]
Output: 2, nums = [1,2]
Explanation: Your function should return length = \`2\`, with the first two elements of \`nums\` being \`1\` and \`2\` respectively. It doesn't matter what you leave beyond the returned length.


Example 2:
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4]
Explanation: Your function should return length = \`5\`, with the first five elements of \`nums\` being modified to \`0\`, \`1\`, \`2\`, \`3\`, and \`4\` respectively. It doesn't matter what values are set beyond the returned length.


Constraints:
\`0 <= nums.length <= 3 * 104\`
\`-104 <= nums[i] <= 104\`
\`nums\` is sorted in ascending order.`,
    pseudocode: '',
  },
  {
    title: `Convert Sorted Array to Binary Search Tree`,
    description: `Given an integer array \`nums\` where the elements are sorted in ascending order, convert it to a height-balanced binary search tree.

A height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'easy',
    examples: `Example 1:
Input: nums = [-10,-3,0,5,9]
Output: [0,-3,9,-10,null,5]
Explanation: [0,-10,5,null,-3,null,9] is also accepted:

Example 2:
Input: nums = [1,3]
Output: [3,1]
Explanation: [1,3] and [3,1] are both a height-balanced BSTs.


Constraints:
\`1 <= nums.length <= 104\`
\`-104 <= nums[i] <= 104\`
\`nums\` is sorted in a strictly increasing order.`,
    pseudocode: '',
  },
  {
    title: `Merge Sorted Array`,
    description: `Given two sorted integer arrays \`nums1\` and \`nums2\`, merge \`nums2\` into \`nums1\` as one sorted array.

The number of elements initialized in \`nums1\` and \`nums2\` are \`m\` and \`n\` respectively. You may assume that \`nums1\` has a size equal to \`m + n\` such that it has enough space to hold additional elements from \`nums2\`.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'easy',
    examples: `Example 1:
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]

Example 2:
Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]

Constraints:
\`nums1.length == m + n\`
\`nums2.length == n\`
\`0 <= m, n <= 200\`
\`1 <= m + n <= 200\`
\`-109 <= nums1[i], nums2[i] <= 109\``,
    pseudocode: '',
  },
  {
    title: `Search Insert Position`,
    description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'easy',
    examples: `Example 1:
Input: nums = [1,3,5,6], target = 5
Output: 2

Example 2:
Input: nums = [1,3,5,6], target = 2
Output: 1

Example 3:
Input: nums = [1,3,5,6], target = 7
Output: 4

Example 4:
Input: nums = [1,3,5,6], target = 0
Output: 0

Example 5:
Input: nums = [1], target = 0
Output: 0

Constraints:
\`1 <= nums.length <= 104\`
\`-104 <= nums[i] <= 104\`
\`nums\` contains distinct values sorted in ascending order.

\`-104 <= target <= 104\``,
    pseudocode: '',
  },
  {
    title: `Balanced Binary Tree`,
    description: `Given a binary tree, determine if it is height-balanced.

For this problem, a height-balanced binary tree is defined as:
a binary tree in which the left and right subtrees of every node differ in height by no more than 1.`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'easy',
    examples: `Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: true

Example 2:
Input: root = [1,2,2,3,3,null,null,4,4]
Output: false

Example 3:
Input: root = []
Output: true

Constraints:
The number of nodes in the tree is in the range \`[0, 5000]\`.

\`-104 <= Node.val <= 104\``,
    pseudocode: '',
  },
  {
    title: `Subtree of Another Tree`,
    description: `Given two non-empty binary trees s and t, check whether tree t has exactly the same structure and node values with a subtree of s. A subtree of s is a tree consists of a node in s and all of this node's descendants. The tree s could also be considered as a subtree of itself.`,
    topics: ['Trees'],
    difficulty: 'easy',
    examples: `Example 1:
Given tree s:
     3
    / \\
   4   5
  / \\
 1   2
Given tree t:
   4 
  / \\
 1   2
Return true, because t has the same structure and node values with a subtree of s.


Example 2:
Given tree s:
     3
    / \\
   4   5
  / \\
 1   2
    /
   0
Given tree t:
   4
  / \\
 1   2
Return false.`,
    pseudocode: '',
  },
  {
    title: `Same Tree`,
    description: `Given the roots of two binary trees \`p\` and \`q\`, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'easy',
    examples: `Example 1:
Input: p = [1,2,3], q = [1,2,3]
Output: true

Example 2:
Input: p = [1,2], q = [1,null,2]
Output: false

Example 3:
Input: p = [1,2,1], q = [1,1,2]
Output: false

Constraints:
The number of nodes in both trees is in the range \`[0, 100]\`.

\`-104 <= Node.val <= 104\``,
    pseudocode: '',
  },
  {
    title: `Happy Number`,
    description: `Write an algorithm to determine if a number \`n\` is happy.

A happy number is a number defined by the following process:
Starting with any positive integer, replace the number by the sum of the squares of its digits.

Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.

Those numbers for which this process ends in 1 are happy.

Return \`true\` if \`n\` is a happy number, and \`false\` if not.`,
    topics: ['Hash Tables'],
    difficulty: 'easy',
    examples: `Example 1:
Input: n = 19
Output: true
Explanation:
12 + 92 = 82
82 + 22 = 68
62 + 82 = 100
12 + 02 + 02 = 1

Example 2:
Input: n = 2
Output: false

Constraints:
\`1 <= n <= 231 - 1\``,
    pseudocode: '',
  },
  {
    title: `Min Cost Climbing Stairs`,
    description: `You are given an integer array \`cost\` where \`cost[i]\` is the cost of \`ith\` step on a staircase. Once you pay the cost, you can either climb one or two steps.

You can either start from the step with index \`0\`, or the step with index \`1\`.

Return the minimum cost to reach the top of the floor.`,
    topics: ['Arrays', 'Dynamic Programming'],
    difficulty: 'easy',
    examples: `Example 1:
Input: cost = [10,15,20]
Output: 15
Explanation: Cheapest is: start on cost[1], pay that cost, and go to the top.


Example 2:
Input: cost = [1,100,1,1,1,100,1,1,100,1]
Output: 6
Explanation: Cheapest is: start on cost[0], and only step on 1s, skipping cost[3].


Constraints:
\`2 <= cost.length <= 1000\`
\`0 <= cost[i] <= 999\``,
    pseudocode: '',
  },
  {
    title: `Path Sum`,
    description: `Given the \`root\` of a binary tree and an integer \`targetSum\`, return \`true\` if the tree has a root-to-leaf path such that adding up all the values along the path equals \`targetSum\`.

A leaf is a node with no children.`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'easy',
    examples: `Example 1:
Input: root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
Output: true

Example 2:
Input: root = [1,2,3], targetSum = 5
Output: false

Example 3:
Input: root = [1,2], targetSum = 0
Output: false

Constraints:
The number of nodes in the tree is in the range \`[0, 5000]\`.

\`-1000 <= Node.val <= 1000\`
\`-1000 <= targetSum <= 1000\``,
    pseudocode: '',
  },
  {
    title: `Lowest Common Ancestor of a Binary Search Tree`,
    description: `Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in \`T\` that has both \`p\` and \`q\` as descendants (where we allow a node to be a descendant of itself).”`,
    topics: ['Trees'],
    difficulty: 'easy',
    examples: `Example 1:
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6
Explanation: The LCA of nodes 2 and 8 is 6.


Example 2:
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
Output: 2
Explanation: The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself according to the LCA definition.


Example 3:
Input: root = [2,1], p = 2, q = 1
Output: 2

Constraints:
The number of nodes in the tree is in the range \`[2, 105]\`.

\`-109 <= Node.val <= 109\`
All \`Node.val\` are unique.

\`p != q\`
\`p\` and \`q\` will exist in the BST.`,
    pseudocode: '',
  },
  {
    title: `Missing Number`,
    description: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the only number in the range that is missing from the array.

Follow up: Could you implement a solution using only \`O(1)\` extra space complexity and \`O(n)\` runtime complexity?`,
    topics: ['Arrays'],
    difficulty: 'easy',
    examples: `Example 1:
Input: nums = [3,0,1]
Output: 2
Explanation: n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number in the range since it does not appear in nums.


Example 2:
Input: nums = [0,1]
Output: 2
Explanation: n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number in the range since it does not appear in nums.


Example 3:
Input: nums = [9,6,4,2,3,5,7,0,1]
Output: 8
Explanation: n = 9 since there are 9 numbers, so all numbers are in the range [0,9]. 8 is the missing number in the range since it does not appear in nums.


Example 4:
Input: nums = [0]
Output: 1
Explanation: n = 1 since there is 1 number, so all numbers are in the range [0,1]. 1 is the missing number in the range since it does not appear in nums.


Constraints:
\`n == nums.length\`
\`1 <= n <= 104\`
\`0 <= nums[i] <= n\`
All the numbers of \`nums\` are unique.`,
    pseudocode: '',
  },
  {
    title: `Count Primes`,
    description: `Count the number of prime numbers less than a non-negative number, \`n\`.`,
    topics: ['Hash Tables'],
    difficulty: 'easy',
    examples: `Example 1:
Input: n = 10
Output: 4
Explanation: There are 4 prime numbers less than 10, they are 2, 3, 5, 7.


Example 2:
Input: n = 0
Output: 0

Example 3:
Input: n = 1
Output: 0

Constraints:
\`0 <= n <= 5 * 106\``,
    pseudocode: '',
  },
  {
    title: `First Unique Character in a String`,
    description: `Given a string \`s\`, return the first non-repeating character in it and return its index. If it does not exist, return \`-1\`.`,
    topics: ['Hash Tables', 'Strings'],
    difficulty: 'easy',
    examples: `Example 1:
Input: s = leetcode
Output: 0

Example 2:
Input: s = loveleetcode
Output: 2

Example 3:
Input: s = aabb
Output: -1

Constraints:
\`1 <= s.length <= 105\`
\`s\` consists of only lowercase English letters.`,
    pseudocode: '',
  },
  {
    title: `Add Binary`,
    description: `Given two binary strings \`a\` and \`b\`, return their sum as a binary string.`,
    topics: ['Strings'],
    difficulty: 'easy',
    examples: `Example 1:
Input: a = 11, b = 1
Output: 100

Example 2:
Input: a = 1010, b = 1011
Output: 10101

Constraints:
\`1 <= a.length, b.length <= 104\`
\`a\` and \`b\` consist only of \`'0'\` or \`'1'\` characters.

Each string does not contain leading zeros except for the zero itself.`,
    pseudocode: '',
  },
  {
    title: `Island Perimeter`,
    description: `You are given \`row x col\` \`grid\` representing a map where \`grid[i][j] = 1\` represents land and \`grid[i][j] = 0\` represents water.

Grid cells are connected horizontally/vertically (not diagonally). The \`grid\` is completely surrounded by water, and there is exactly one island (i.e., one or more connected land cells).

The island doesn't have lakes, meaning the water inside isn't connected to the water around the island. One cell is a square with side length 1. The grid is rectangular, width and height don't exceed 100. Determine the perimeter of the island.`,
    topics: ['Hash Tables'],
    difficulty: 'easy',
    examples: `Example 1:
Input: grid = [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]
Output: 16
Explanation: The perimeter is the 16 yellow stripes in the image above.


Example 2:
Input: grid = [[1]]
Output: 4

Example 3:
Input: grid = [[1,0]]
Output: 4

Constraints:
\`row == grid.length\`
\`col == grid[i].length\`
\`1 <= row, col <= 100\`
\`grid[i][j]\` is \`0\` or \`1\`.`,
    pseudocode: '',
  },
  {
    title: `Jewels and Stones`,
    description: `You're given strings \`jewels\` representing the types of stones that are jewels, and \`stones\` representing the stones you have. Each character in \`stones\` is a type of stone you have. You want to know how many of the stones you have are also jewels.

Letters are case sensitive, so \`a\` is considered a different type of stone from \`A\`.`,
    topics: ['Hash Tables'],
    difficulty: 'easy',
    examples: `Example 1:
Input: jewels = aA, stones = aAAbbbb
Output: 3

Example 2:
Input: jewels = z, stones = ZZ
Output: 0

Constraints:
\`1 <= jewels.length, stones.length <= 50\`
\`jewels\` and \`stones\` consist of only English letters.

All the characters of \`jewels\` are unique.`,
    pseudocode: '',
  },
  {
    title: `Remove Linked List Elements`,
    description: `Given the \`head\` of a linked list and an integer \`val\`, remove all the nodes of the linked list that has \`Node.val == val\`, and return the new head.`,
    topics: ['Linked Lists'],
    difficulty: 'easy',
    examples: `Example 1:
Input: head = [1,2,6,3,4,5,6], val = 6
Output: [1,2,3,4,5]

Example 2:
Input: head = [], val = 1
Output: []

Example 3:
Input: head = [7,7,7,7], val = 7
Output: []

Constraints:
The number of nodes in the list is in the range \`[0, 104]\`.

\`1 <= Node.val <= 50\`
\`0 <= k <= 50\``,
    pseudocode: '',
  },
  {
    title: `Two Sum II - Input array is sorted`,
    description: `Given an array of integers \`numbers\` that is already sorted in ascending order, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers (1-indexed) as an integer array \`answer\` of size \`2\`, where \`1 <= answer[0] < answer[1] <= numbers.length\`.

You may assume that each input would have exactly one solution and you may not use the same element twice.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'easy',
    examples: `Example 1:
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
Explanation: The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2.


Example 2:
Input: numbers = [2,3,4], target = 6
Output: [1,3]

Example 3:
Input: numbers = [-1,0], target = -1
Output: [1,2]

Constraints:
\`2 <= numbers.length <= 3 * 104\`
\`-1000 <= numbers[i] <= 1000\`
\`numbers\` is sorted in increasing order.

\`-1000 <= target <= 1000\`
Only one valid answer exists.`,
    pseudocode: '',
  },
  {
    title: `Delete Node in a Linked List`,
    description: `Write a function to delete a node in a singly-linked list. You will not be given access to the \`head\` of the list, instead you will be given access to the node to be deleted directly.

It is guaranteed that the node to be deleted is not a tail node in the list.`,
    topics: ['Linked Lists'],
    difficulty: 'easy',
    examples: `Example 1:
Input: head = [4,5,1,9], node = 5
Output: [4,1,9]
Explanation: You are given the second node with value 5, the linked list should become 4 -> 1 -> 9 after calling your function.


Example 2:
Input: head = [4,5,1,9], node = 1
Output: [4,5,9]
Explanation: You are given the third node with value 1, the linked list should become 4 -> 5 -> 9 after calling your function.


Example 3:
Input: head = [1,2,3,4], node = 3
Output: [1,2,4]

Example 4:
Input: head = [0,1], node = 0
Output: [1]

Example 5:
Input: head = [-3,5,-99], node = -3
Output: [5,-99]

Constraints:
The number of the nodes in the given list is in the range \`[2, 1000]\`.

\`-1000 <= Node.val <= 1000\`
The value of each node in the list is unique.

The \`node\` to be deleted is in the list and is not a tail node`,
    pseudocode: '',
  },
  {
    title: `Binary Tree Paths`,
    description: `Given the \`root\` of a binary tree, return all root-to-leaf paths in any order.

A leaf is a node with no children.`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'easy',
    examples: `Example 1:
Input: root = [1,2,3,null,5]
Output: [1->2->5,1->3]

Example 2:
Input: root = [1]
Output: [1]

Constraints:
The number of nodes in the tree is in the range \`[1, 100]\`.

\`-100 <= Node.val <= 100\``,
    pseudocode: '',
  },
  {
    title: `Valid Anagram`,
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.`,
    topics: ['Hash Tables', 'Sorting'],
    difficulty: 'easy',
    examples: `Example 1:
Input: s = anagram, t = nagaram
Output: true

Example 2:
Input: s = rat, t = car
Output: false

Constraints:
\`1 <= s.length, t.length <= 5 * 104\`
\`s\` and \`t\` consist of lowercase English letters.

Follow up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?`,
    pseudocode: `def isAnagram(s, t):
    if len(s) != len(t):
        return False
    count = {}
    for c in s:
        count[c] = count.get(c, 0) + 1
    for c in t:
        count[c] = count.get(c, 0) - 1
        if count[c] < 0:
            return False
    return True

# Approach: Character frequency count
# Time Complexity: O(n)
# Space Complexity: O(1) (at most 26 characters)`,
  },
  {
    title: `Valid Palindrome II`,
    description: `Given a non-empty string \`s\`, you may delete at most one character.  Judge whether you can make it a palindrome.`,
    topics: ['Strings'],
    difficulty: 'easy',
    examples: `Example 1:
Input: aba
Output: True

Example 2:
Input: abca
Output: True
Explanation: You could delete the character 'c'.

Note:
The string will only contain lowercase characters a-z.

The maximum length of the string is 50000.`,
    pseudocode: '',
  },
  {
    title: `Remove Duplicates from Sorted List`,
    description: `Given the \`head\` of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.`,
    topics: ['Linked Lists'],
    difficulty: 'easy',
    examples: `Example 1:
Input: head = [1,1,2]
Output: [1,2]

Example 2:
Input: head = [1,1,2,3,3]
Output: [1,2,3]

Constraints:
The number of nodes in the list is in the range \`[0, 300]\`.

\`-100 <= Node.val <= 100\`
The list is guaranteed to be sorted in ascending order.`,
    pseudocode: '',
  },
  {
    title: `Backspace String Compare`,
    description: `Given two strings \`s\` and \`t\`, return \`true\` if they are equal when both are typed into empty text editors. \`'#'\` means a backspace character.

Note that after backspacing an empty text, the text will continue empty.`,
    topics: ['Searching', 'Stacks and Queues'],
    difficulty: 'easy',
    examples: `Example 1:
Input: s = ab#c, t = ad#c
Output: true
Explanation: Both s and t become ac.


Example 2:
Input: s = ab##, t = c#d#
Output: true
Explanation: Both s and t become .


Example 3:
Input: s = a##c, t = #a#c
Output: true
Explanation: Both s and t become c.


Example 4:
Input: s = a#c, t = b
Output: false
Explanation: s becomes c while t becomes b.


Constraints:
\`1 <= s.length, t.length <= 200\`
\`s\` and \`t\` only contain lowercase letters and \`'#'\` characters.

Follow up: Can you solve it in \`O(n)\` time and \`O(1)\` space?`,
    pseudocode: `def backspaceCompare(s, t):
    def build(string):
        stack = []
        for c in string:
            if c == '#':
                if stack:
                    stack.pop()
            else:
                stack.append(c)
        return stack
    return build(s) == build(t)

# Approach: Stack simulation
# Time Complexity: O(m + n)
# Space Complexity: O(m + n)`,
  },
  {
    title: `Is Subsequence`,
    description: `Given two strings \`s\` and \`t\`, check if \`s\` is a subsequence of \`t\`.

A subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters. (i.e., \`ace\` is a subsequence of \`abcde\` while \`aec\` is not).`,
    topics: ['Searching', 'Dynamic Programming'],
    difficulty: 'easy',
    examples: `Example 1:
Input: s = abc, t = ahbgdc
Output: true

Example 2:
Input: s = axc, t = ahbgdc
Output: false

Constraints:
\`0 <= s.length <= 100\`
\`0 <= t.length <= 104\`
\`s\` and \`t\` consist only of lowercase English letters.

Follow up: If there are lots of incoming \`s\`, say \`s1, s2, ..., sk\` where \`k >= 109\`, and you want to check one by one to see if \`t\` has its subsequence. In this scenario, how would you change your code?`,
    pseudocode: '',
  },
  {
    title: `Next Greater Element I`,
    description: `You are given two integer arrays \`nums1\` and \`nums2\` both of unique elements, where \`nums1\` is a subset of \`nums2\`.

Find all the next greater numbers for \`nums1\`'s elements in the corresponding places of \`nums2\`.

The Next Greater Number of a number \`x\` in \`nums1\` is the first greater number to its right in \`nums2\`. If it does not exist, return \`-1\` for this number.`,
    topics: ['Stacks and Queues'],
    difficulty: 'easy',
    examples: `Example 1:
Input: nums1 = [4,1,2], nums2 = [1,3,4,2]
Output: [-1,3,-1]
Explanation:
For number 4 in the first array, you cannot find the next greater number for it in the second array, so output -1.

For number 1 in the first array, the next greater number for it in the second array is 3.

For number 2 in the first array, there is no next greater number for it in the second array, so output -1.


Example 2:
Input: nums1 = [2,4], nums2 = [1,2,3,4]
Output: [3,-1]
Explanation:
For number 2 in the first array, the next greater number for it in the second array is 3.

For number 4 in the first array, there is no next greater number for it in the second array, so output -1.


Constraints:
\`1 <= nums1.length <= nums2.length <= 1000\`
\`0 <= nums1[i], nums2[i] <= 104\`
All integers in \`nums1\` and \`nums2\` are unique.

All the integers of \`nums1\` also appear in \`nums2\`.

Follow up: Could you find an \`O(nums1.length + nums2.length)\` solution?`,
    pseudocode: `def nextGreaterElement(nums1, nums2):
    stack = []
    next_greater = {}
    for num in nums2:
        while stack and stack[-1] < num:
            next_greater[stack.pop()] = num
        stack.append(num)
    return [next_greater.get(num, -1) for num in nums1]

# Approach: Monotonic decreasing stack
# Time Complexity: O(m + n)
# Space Complexity: O(n)`,
  },
  {
    title: `Pascal's Triangle`,
    description: `Given an integer \`numRows\`, return the first numRows of Pascal's triangle.

In Pascal's triangle, each number is the sum of the two numbers directly above it as shown:`,
    topics: ['Arrays'],
    difficulty: 'easy',
    examples: `Example 1:
Input: numRows = 5
Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]

Example 2:
Input: numRows = 1
Output: [[1]]

Constraints:
\`1 <= numRows <= 30\``,
    pseudocode: '',
  },
  {
    title: `Longest Substring Without Repeating Characters`,
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    topics: ['Hash Tables', 'Searching', 'Strings'],
    difficulty: 'medium',
    examples: `Example 1:
Input: s = abcabcbb
Output: 3
Explanation: The answer is abc, with the length of 3.


Example 2:
Input: s = bbbbb
Output: 1
Explanation: The answer is b, with the length of 1.


Example 3:
Input: s = pwwkew
Output: 3
Explanation: The answer is wke, with the length of 3.

Notice that the answer must be a substring, pwke is a subsequence and not a substring.


Example 4:
Input: s = 
Output: 0

Constraints:
\`0 <= s.length <= 5 * 104\`
\`s\` consists of English letters, digits, symbols and spaces.`,
    pseudocode: '',
  },
  {
    title: `Add Two Numbers`,
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    topics: ['Linked Lists'],
    difficulty: 'medium',
    examples: `Example 1:
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.


Example 2:
Input: l1 = [0], l2 = [0]
Output: [0]

Example 3:
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]

Constraints:
The number of nodes in each linked list is in the range \`[1, 100]\`.

\`0 <= Node.val <= 9\`
It is guaranteed that the list represents a number that does not have leading zeros.`,
    pseudocode: '',
  },
  {
    title: `Longest Palindromic Substring`,
    description: `Given a string \`s\`, return the longest palindromic substring in \`s\`.`,
    topics: ['Strings', 'Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: s = babad
Output: bab
Note: aba is also a valid answer.


Example 2:
Input: s = cbbd
Output: bb

Example 3:
Input: s = a
Output: a

Example 4:
Input: s = ac
Output: a

Constraints:
\`1 <= s.length <= 1000\`
\`s\` consist of only digits and English letters (lower-case and/or upper-case),`,
    pseudocode: '',
  },
  {
    title: `3Sum`,
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]

Example 2:
Input: nums = []
Output: []

Example 3:
Input: nums = [0]
Output: []

Constraints:
\`0 <= nums.length <= 3000\`
\`-105 <= nums[i] <= 105\``,
    pseudocode: '',
  },
  {
    title: `Container With Most Water`,
    description: `Given \`n\` non-negative integers \`a1, a2, ..., an\` , where each represents a point at coordinate \`(i, ai)\`. \`n\` vertical lines are drawn such that the two endpoints of the line \`i\` is at \`(i, ai)\` and \`(i, 0)\`. Find two lines, which, together with the x-axis forms a container, such that the container contains the most water.

Notice that you may not slant the container.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.


Example 2:
Input: height = [1,1]
Output: 1

Example 3:
Input: height = [4,3,2,1,4]
Output: 16

Example 4:
Input: height = [1,2,1]
Output: 2

Constraints:
\`n == height.length\`
\`2 <= n <= 105\`
\`0 <= height[i] <= 104\``,
    pseudocode: '',
  },
  {
    title: `Number of Islands`,
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    topics: ['Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: grid = [
  [1,1,1,1,0],
  [1,1,0,1,0],
  [1,1,0,0,0],
  [0,0,0,0,0]
]
Output: 1

Example 2:
Input: grid = [
  [1,1,0,0,0],
  [1,1,0,0,0],
  [0,0,1,0,0],
  [0,0,0,1,1]
]
Output: 3

Constraints:
\`m == grid.length\`
\`n == grid[i].length\`
\`1 <= m, n <= 300\`
\`grid[i][j]\` is \`'0'\` or \`'1'\`.`,
    pseudocode: '',
  },
  {
    title: `Generate Parentheses`,
    description: `Given \`n\` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.`,
    topics: ['Strings'],
    difficulty: 'medium',
    examples: `Example 1:
Input: n = 3
Output: [((())),(()()),(())(),()(()),()()()]

Example 2:
Input: n = 1
Output: [()]

Constraints:
\`1 <= n <= 8\``,
    pseudocode: '',
  },
  {
    title: `Search in Rotated Sorted Array`,
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).

Prior to being passed to your function, \`nums\` is rotated at an unknown pivot index \`k\` (\`0 <= k < nums.length\`) such that the resulting array is \`[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]\` (0-indexed). For example, \`[0,1,2,4,5,6,7]\` might be rotated at pivot index \`3\` and become \`[4,5,6,7,0,1,2]\`.

Given the array \`nums\` after the rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4

Example 2:
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1

Example 3:
Input: nums = [1], target = 0
Output: -1

Constraints:
\`1 <= nums.length <= 5000\`
\`-104 <= nums[i] <= 104\`
All values of \`nums\` are unique.

\`nums\` is guaranteed to be rotated at some pivot.

\`-104 <= target <= 104\`
Follow up: Can you achieve this in \`O(log n)\` time complexity?`,
    pseudocode: '',
  },
  {
    title: `Find the Duplicate Number`,
    description: `Given an array of integers \`nums\` containing \`n + 1\` integers where each integer is in the range \`[1, n]\` inclusive.

There is only one repeated number in \`nums\`, return this repeated number.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [1,3,4,2,2]
Output: 2

Example 2:
Input: nums = [3,1,3,4,2]
Output: 3

Example 3:
Input: nums = [1,1]
Output: 1

Example 4:
Input: nums = [1,1,2]
Output: 1

Constraints:
\`2 <= n <= 3 * 104\`
\`nums.length == n + 1\`
\`1 <= nums[i] <= n\`
All the integers in \`nums\` appear only once except for precisely one integer which appears two or more times.

Follow up:
How can we prove that at least one duplicate number must exist in \`nums\`?
Can you solve the problem without modifying the array \`nums\`?
Can you solve the problem using only constant, \`O(1)\` extra space?
Can you solve the problem with runtime complexity less than \`O(n2)\`?`,
    pseudocode: '',
  },
  {
    title: `Product of Array Except Self`,
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is guaranteed to fit in a 32-bit integer.`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]

Example 2:
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]

Constraints:
\`2 <= nums.length <= 105\`
\`-30 <= nums[i] <= 30\`
The product of any prefix or suffix of \`nums\` is guaranteed to fit in a 32-bit integer.

Follow up:
Could you solve it in \`O(n)\` time complexity and without using division?
Could you solve it with \`O(1)\` constant space complexity? (The output array does not count as extra space for space complexity analysis.)`,
    pseudocode: '',
  },
  {
    title: `Subarray Sum Equals K`,
    description: `Given an array of integers \`nums\` and an integer \`k\`, return the total number of continuous subarrays whose sum equals to \`k\`.`,
    topics: ['Arrays', 'Hash Tables'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [1,1,1], k = 2
Output: 2

Example 2:
Input: nums = [1,2,3], k = 3
Output: 2

Constraints:
\`1 <= nums.length <= 2 * 104\`
\`-1000 <= nums[i] <= 1000\`
\`-107 <= k <= 107\``,
    pseudocode: '',
  },
  {
    title: `Merge Intervals`,
    description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    topics: ['Arrays', 'Sorting'],
    difficulty: 'medium',
    examples: `Example 1:
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlaps, merge them into [1,6].


Example 2:
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.


Constraints:
\`1 <= intervals.length <= 104\`
\`intervals[i].length == 2\`
\`0 <= starti <= endi <= 104\``,
    pseudocode: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

# Approach: Sort by start, then merge overlapping
# Time Complexity: O(n log n)
# Space Complexity: O(n)`,
  },
  {
    title: `Longest Increasing Subsequence`,
    description: `Given an integer array \`nums\`, return the length of the longest strictly increasing subsequence.

A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements. For example, \`[3,6,2,7]\` is a subsequence of the array \`[0,3,1,6,2,2,7]\`.`,
    topics: ['Searching', 'Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.


Example 2:
Input: nums = [0,1,0,3,2,3]
Output: 4

Example 3:
Input: nums = [7,7,7,7,7,7,7]
Output: 1

Constraints:
\`1 <= nums.length <= 2500\`
\`-104 <= nums[i] <= 104\`
Follow up:
Could you come up with the \`O(n2)\` solution?
Could you improve it to \`O(n log(n))\` time complexity?`,
    pseudocode: '',
  },
  {
    title: `House Robber`,
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array \`nums\` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    topics: ['Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).

Total amount you can rob = 1 + 3 = 4.


Example 2:
Input: nums = [2,7,9,3,1]
Output: 12
Explanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).

Total amount you can rob = 2 + 9 + 1 = 12.


Constraints:
\`1 <= nums.length <= 100\`
\`0 <= nums[i] <= 400\``,
    pseudocode: '',
  },
  {
    title: `Coin Change`,
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    topics: ['Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1

Example 2:
Input: coins = [2], amount = 3
Output: -1

Example 3:
Input: coins = [1], amount = 0
Output: 0

Example 4:
Input: coins = [1], amount = 1
Output: 1

Example 5:
Input: coins = [1], amount = 2
Output: 2

Constraints:
\`1 <= coins.length <= 12\`
\`1 <= coins[i] <= 231 - 1\`
\`0 <= amount <= 104\``,
    pseudocode: '',
  },
  {
    title: `Maximum Product Subarray`,
    description: `Given an integer array \`nums\`, find a contiguous non-empty subarray within the array that has the largest product, and return the product.

It is guaranteed that the answer will fit in a 32-bit integer.

A subarray is a contiguous subsequence of the array.`,
    topics: ['Arrays', 'Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [2,3,-2,4]
Output: 6
Explanation: [2,3] has the largest product 6.


Example 2:
Input: nums = [-2,0,-1]
Output: 0
Explanation: The result cannot be 2, because [-2,-1] is not a subarray.


Constraints:
\`1 <= nums.length <= 2 * 104\`
\`-10 <= nums[i] <= 10\`
The product of any prefix or suffix of \`nums\` is guaranteed to fit in a 32-bit integer.`,
    pseudocode: '',
  },
  {
    title: `Word Break`,
    description: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    topics: ['Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: s = leetcode, wordDict = [leet,code]
Output: true
Explanation: Return true because leetcode can be segmented as leet code.


Example 2:
Input: s = applepenapple, wordDict = [apple,pen]
Output: true
Explanation: Return true because applepenapple can be segmented as apple pen apple.

Note that you are allowed to reuse a dictionary word.


Example 3:
Input: s = catsandog, wordDict = [cats,dog,sand,and,cat]
Output: false

Constraints:
\`1 <= s.length <= 300\`
\`1 <= wordDict.length <= 1000\`
\`1 <= wordDict[i].length <= 20\`
\`s\` and \`wordDict[i]\` consist of only lowercase English letters.

All the strings of \`wordDict\` are unique.`,
    pseudocode: '',
  },
  {
    title: `Jump Game`,
    description: `Given an array of non-negative integers \`nums\`, you are initially positioned at the first index of the array.

Each element in the array represents your maximum jump length at that position.

Determine if you are able to reach the last index.`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.


Example 2:
Input: nums = [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.


Constraints:
\`1 <= nums.length <= 3 * 104\`
\`0 <= nums[i] <= 105\``,
    pseudocode: '',
  },
  {
    title: `Combination Sum`,
    description: `Given an array of distinct integers \`candidates\` and a target integer \`target\`, return a list of all unique combinations of \`candidates\` where the chosen numbers sum to \`target\`. You may return the combinations in any order.

The same number may be chosen from \`candidates\` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

It is guaranteed that the number of unique combinations that sum up to \`target\` is less than \`150\` combinations for the given input.`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: `Example 1:
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
Explanation:
2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.

7 is a candidate, and 7 = 7.

These are the only two combinations.


Example 2:
Input: candidates = [2,3,5], target = 8
Output: [[2,2,2,2],[2,3,3],[3,5]]

Example 3:
Input: candidates = [2], target = 1
Output: []

Example 4:
Input: candidates = [1], target = 1
Output: [[1]]

Example 5:
Input: candidates = [1], target = 2
Output: [[1,1]]

Constraints:
\`1 <= candidates.length <= 30\`
\`1 <= candidates[i] <= 200\`
All elements of \`candidates\` are distinct.

\`1 <= target <= 500\``,
    pseudocode: '',
  },
  {
    title: `Letter Combinations of a Phone Number`,
    description: `Given a string containing digits from \`2-9\` inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.

A mapping of digit to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.`,
    topics: ['Strings', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: digits = 23
Output: [ad,ae,af,bd,be,bf,cd,ce,cf]

Example 2:
Input: digits = 
Output: []

Example 3:
Input: digits = 2
Output: [a,b,c]

Constraints:
\`0 <= digits.length <= 4\`
\`digits[i]\` is a digit in the range \`['2', '9']\`.`,
    pseudocode: '',
  },
  {
    title: `Course Schedule`,
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you must take course \`bi\` first if you want to take course \`ai\`.

For example, the pair \`[0, 1]\`, indicates that to take course \`0\` you have to first take course \`1\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
    topics: ['Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: There are a total of 2 courses to take. 
To take course 1 you should have finished course 0. So it is possible.


Example 2:
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: There are a total of 2 courses to take. 
To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.


Constraints:
\`1 <= numCourses <= 105\`
\`0 <= prerequisites.length <= 5000\`
\`prerequisites[i].length == 2\`
\`0 <= ai, bi < numCourses\`
All the pairs prerequisites[i] are unique.`,
    pseudocode: '',
  },
  {
    title: `Subsets`,
    description: `Given an integer array \`nums\` of unique elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]

Example 2:
Input: nums = [0]
Output: [[],[0]]

Constraints:
\`1 <= nums.length <= 10\`
\`-10 <= nums[i] <= 10\`
All the numbers of \`nums\` are unique.`,
    pseudocode: '',
  },
  {
    title: `Lowest Common Ancestor of a Binary Tree`,
    description: `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in \`T\` that has both \`p\` and \`q\` as descendants (where we allow a node to be a descendant of itself).”`,
    topics: ['Trees'],
    difficulty: 'medium',
    examples: `Example 1:
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
Output: 3
Explanation: The LCA of nodes 5 and 1 is 3.


Example 2:
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
Output: 5
Explanation: The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself according to the LCA definition.


Example 3:
Input: root = [1,2], p = 1, q = 2
Output: 1

Constraints:
The number of nodes in the tree is in the range \`[2, 105]\`.

\`-109 <= Node.val <= 109\`
All \`Node.val\` are unique.

\`p != q\`
\`p\` and \`q\` will exist in the tree.`,
    pseudocode: '',
  },
  {
    title: `Word Search`,
    description: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: `Example 1:
Input: board = [[A,B,C,E],[S,F,C,S],[A,D,E,E]], word = ABCCED
Output: true

Example 2:
Input: board = [[A,B,C,E],[S,F,C,S],[A,D,E,E]], word = SEE
Output: true

Example 3:
Input: board = [[A,B,C,E],[S,F,C,S],[A,D,E,E]], word = ABCB
Output: false

Constraints:
\`m == board.length\`
\`n = board[i].length\`
\`1 <= m, n <= 6\`
\`1 <= word.length <= 15\`
\`board\` and \`word\` consists of only lowercase and uppercase English letters.

Follow up: Could you use search pruning to make your solution faster with a larger \`board\`?`,
    pseudocode: '',
  },
  {
    title: `Next Permutation`,
    description: `Implement next permutation, which rearranges numbers into the lexicographically next greater permutation of numbers.

If such an arrangement is not possible, it must rearrange it as the lowest possible order (i.e., sorted in ascending order).

The replacement must be in place and use only constant extra memory.`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [1,2,3]
Output: [1,3,2]

Example 2:
Input: nums = [3,2,1]
Output: [1,2,3]

Example 3:
Input: nums = [1,1,5]
Output: [1,5,1]

Example 4:
Input: nums = [1]
Output: [1]

Constraints:
\`1 <= nums.length <= 100\`
\`0 <= nums[i] <= 100\``,
    pseudocode: '',
  },
  {
    title: `Find First and Last Position of Element in Sorted Array`,
    description: `Given an array of integers \`nums\` sorted in ascending order, find the starting and ending position of a given \`target\` value.

If \`target\` is not found in the array, return \`[-1, -1]\`.

Follow up: Could you write an algorithm with \`O(log n)\` runtime complexity?`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]

Example 2:
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]

Example 3:
Input: nums = [], target = 0
Output: [-1,-1]

Constraints:
\`0 <= nums.length <= 105\`
\`-109 <= nums[i] <= 109\`
\`nums\` is a non-decreasing array.

\`-109 <= target <= 109\``,
    pseudocode: '',
  },
  {
    title: `Group Anagrams`,
    description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    topics: ['Hash Tables', 'Strings'],
    difficulty: 'medium',
    examples: `Example 1:
Input: strs = [eat,tea,tan,ate,nat,bat]
Output: [[bat],[nat,tan],[ate,eat,tea]]

Example 2:
Input: strs = []
Output: [[]]

Example 3:
Input: strs = [a]
Output: [[a]]

Constraints:
\`1 <= strs.length <= 104\`
\`0 <= strs[i].length <= 100\`
\`strs[i]\` consists of lower-case English letters.`,
    pseudocode: '',
  },
  {
    title: `Sort Colors`,
    description: `Given an array \`nums\` with \`n\` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We will use the integers \`0\`, \`1\`, and \`2\` to represent the color red, white, and blue, respectively.`,
    topics: ['Arrays', 'Searching', 'Sorting'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]

Example 2:
Input: nums = [2,0,1]
Output: [0,1,2]

Example 3:
Input: nums = [0]
Output: [0]

Example 4:
Input: nums = [1]
Output: [1]

Constraints:
\`n == nums.length\`
\`1 <= n <= 300\`
\`nums[i]\` is \`0\`, \`1\`, or \`2\`.

Follow up:
Could you solve this problem without using the library's sort function?
Could you come up with a one-pass algorithm using only \`O(1)\` constant space?`,
    pseudocode: `def sortColors(nums):
    lo, mid, hi = 0, 0, len(nums) - 1
    while mid <= hi:
        if nums[mid] == 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi -= 1

# Approach: Dutch National Flag (three-way partition)
# Time Complexity: O(n)
# Space Complexity: O(1)`,
  },
  {
    title: `Remove Nth Node From End of List`,
    description: `Given the \`head\` of a linked list, remove the \`nth\` node from the end of the list and return its head.

Follow up: Could you do this in one pass?`,
    topics: ['Linked Lists', 'Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]

Example 2:
Input: head = [1], n = 1
Output: []

Example 3:
Input: head = [1,2], n = 1
Output: [1]

Constraints:
The number of nodes in the list is \`sz\`.

\`1 <= sz <= 30\`
\`0 <= Node.val <= 100\`
\`1 <= n <= sz\``,
    pseudocode: '',
  },
  {
    title: `Construct Binary Tree from Preorder and Inorder Traversal`,
    description: `Given two integer arrays \`preorder\` and \`inorder\` where \`preorder\` is the preorder traversal of a binary tree and \`inorder\` is the inorder traversal of the same tree, construct and return the binary tree.`,
    topics: ['Arrays', 'Trees', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]

Example 2:
Input: preorder = [-1], inorder = [-1]
Output: [-1]

Constraints:
\`1 <= preorder.length <= 3000\`
\`inorder.length == preorder.length\`
\`-3000 <= preorder[i], inorder[i] <= 3000\`
\`preorder\` and \`inorder\` consist of unique values.

Each value of \`inorder\` also appears in \`preorder\`.

\`preorder\` is guaranteed to be the preorder traversal of the tree.

\`inorder\` is guaranteed to be the inorder traversal of the tree.`,
    pseudocode: '',
  },
  {
    title: `Copy List with Random Pointer`,
    description: `A linked list of length \`n\` is given such that each node contains an additional random pointer, which could point to any node in the list, or \`null\`.

Construct a deep copy of the list. The deep copy should consist of exactly \`n\` brand new nodes, where each new node has its value set to the value of its corresponding original node. Both the \`next\` and \`random\` pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state. None of the pointers in the new list should point to nodes in the original list.

For example, if there are two nodes \`X\` and \`Y\` in the original list, where \`X.random --> Y\`, then for the corresponding two nodes \`x\` and \`y\` in the copied list, \`x.random --> y\`.

Return the head of the copied linked list.

The linked list is represented in the input/output as a list of \`n\` nodes. Each node is represented as a pair of \`[val, random_index]\` where:
\`val\`: an integer representing \`Node.val\`
\`random_index\`: the index of the node (range from \`0\` to \`n-1\`) that the \`random\` pointer points to, or \`null\` if it does not point to any node.

Your code will only be given the \`head\` of the original linked list.`,
    topics: ['Hash Tables', 'Linked Lists'],
    difficulty: 'medium',
    examples: `Example 1:
Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]

Example 2:
Input: head = [[1,1],[2,1]]
Output: [[1,1],[2,1]]

Example 3:
Input: head = [[3,null],[3,0],[3,null]]
Output: [[3,null],[3,0],[3,null]]

Example 4:
Input: head = []
Output: []
Explanation: The given linked list is empty (null pointer), so return null.


Constraints:
\`0 <= n <= 1000\`
\`-10000 <= Node.val <= 10000\`
\`Node.random\` is \`null\` or is pointing to some node in the linked list.`,
    pseudocode: '',
  },
  {
    title: `Path Sum III`,
    description: `You are given a binary tree in which each node contains an integer value.

Find the number of paths that sum to a given value.

The path does not need to start or end at the root or a leaf, but it must go downwards
(traveling only from parent nodes to child nodes).

The tree has no more than 1,000 nodes and the values are in the range -1,000,000 to 1,000,000.


Example:
root = [10,5,-3,3,2,null,11,3,-2,null,1], sum = 8
      10
     /  \\
    5   -3
   / \\    \\
  3   2   11
 / \\   \\
3  -2   1
Return 3. The paths that sum to 8 are:
1.  5 -> 3
2.  5 -> 2 -> 1
3. -3 -> 11`,
    topics: ['Trees'],
    difficulty: 'medium',
    examples: ``,
    pseudocode: '',
  },
  {
    title: `Unique Paths`,
    description: `A robot is located at the top-left corner of a \`m x n\` grid (marked 'Start' in the diagram below).

The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).

How many possible unique paths are there?`,
    topics: ['Arrays', 'Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: m = 3, n = 7
Output: 28

Example 2:
Input: m = 3, n = 2
Output: 3
Explanation:
From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Down -> Down
2. Down -> Down -> Right
3. Down -> Right -> Down

Example 3:
Input: m = 7, n = 3
Output: 28

Example 4:
Input: m = 3, n = 3
Output: 6

Constraints:
\`1 <= m, n <= 100\`
It's guaranteed that the answer will be less than or equal to \`2 * 109\`.`,
    pseudocode: '',
  },
  {
    title: `Decode String`,
    description: `Given an encoded string, return its decoded string.

The encoding rule is: \`k[encoded_string]\`, where the \`encoded_string\` inside the square brackets is being repeated exactly \`k\` times. Note that \`k\` is guaranteed to be a positive integer.

You may assume that the input string is always valid; No extra white spaces, square brackets are well-formed, etc.

Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, \`k\`. For example, there won't be input like \`3a\` or \`2[4]\`.`,
    topics: ['Stacks and Queues', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: s = 3[a]2[bc]
Output: aaabcbc

Example 2:
Input: s = 3[a2[c]]
Output: accaccacc

Example 3:
Input: s = 2[abc]3[cd]ef
Output: abcabccdcdcdef

Example 4:
Input: s = abc3[cd]xyz
Output: abccdcdcdxyz

Constraints:
\`1 <= s.length <= 30\`
\`s\` consists of lowercase English letters, digits, and square brackets \`'[]'\`.

\`s\` is guaranteed to be a valid input.

All the integers in \`s\` are in the range \`[1, 300]\`.`,
    pseudocode: `def decodeString(s):
    stack = []
    curr_str = ''
    curr_num = 0
    for c in s:
        if c.isdigit():
            curr_num = curr_num * 10 + int(c)
        elif c == '[':
            stack.append((curr_str, curr_num))
            curr_str = ''
            curr_num = 0
        elif c == ']':
            prev_str, num = stack.pop()
            curr_str = prev_str + curr_str * num
        else:
            curr_str += c
    return curr_str

# Approach: Stack-based parsing
# Time Complexity: O(n * max_k)
# Space Complexity: O(n)`,
  },
  {
    title: `Top K Frequent Elements`,
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in any order.`,
    topics: ['Hash Tables'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]

Example 2:
Input: nums = [1], k = 1
Output: [1]

Constraints:
\`1 <= nums.legth <= 105\`
\`k\` is in the range \`[1, the number of unique elements in the array]\`.

It is guaranteed that the answer is unique.

Follow up: Your algorithm's time complexity must be better than \`O(n log n)\`, where n is the array's size.`,
    pseudocode: '',
  },
  {
    title: `Rotate Image`,
    description: `You are given an n x n 2D \`matrix\` representing an image, rotate the image by 90 degrees (clockwise).

You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: `Example 1:
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]

Example 2:
Input: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]

Example 3:
Input: matrix = [[1]]
Output: [[1]]

Example 4:
Input: matrix = [[1,2],[3,4]]
Output: [[3,1],[4,2]]

Constraints:
\`matrix.length == n\`
\`matrix[i].length == n\`
\`1 <= n <= 20\`
\`-1000 <= matrix[i][j] <= 1000\``,
    pseudocode: '',
  },
  {
    title: `Task Scheduler`,
    description: `Given a characters array \`tasks\`, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle.

However, there is a non-negative integer \`n\` that represents the cooldown period between two same tasks (the same letter in the array), that is that there must be at least \`n\` units of time between any two same tasks.

Return the least number of units of times that the CPU will take to finish all the given tasks.`,
    topics: ['Arrays', 'Stacks and Queues'],
    difficulty: 'medium',
    examples: `Example 1:
Input: tasks = [A,A,A,B,B,B], n = 2
Output: 8
Explanation: 
A -> B -> idle -> A -> B -> idle -> A -> B
There is at least 2 units of time between any two same tasks.


Example 2:
Input: tasks = [A,A,A,B,B,B], n = 0
Output: 6
Explanation: On this case any permutation of size 6 would work since n = 0.

[A,A,A,B,B,B]
[A,B,A,B,A,B]
[B,B,B,A,A,A]
...

And so on.


Example 3:
Input: tasks = [A,A,A,A,A,A,B,C,D,E,F,G], n = 2
Output: 16
Explanation: 
One possible solution is
A -> B -> C -> A -> D -> E -> A -> F -> G -> A -> idle -> idle -> A -> idle -> idle -> A

Constraints:
\`1 <= task.length <= 104\`
\`tasks[i]\` is upper-case English letter.

The integer \`n\` is in the range \`[0, 100]\`.`,
    pseudocode: `def leastInterval(tasks, n):
    freq = {}
    for t in tasks:
        freq[t] = freq.get(t, 0) + 1
    max_freq = max(freq.values())
    max_count = sum(1 for v in freq.values() if v == max_freq)
    result = (max_freq - 1) * (n + 1) + max_count
    return max(result, len(tasks))

# Approach: Greedy (math based on max frequency)
# Time Complexity: O(n)
# Space Complexity: O(1)`,
  },
  {
    title: `Search a 2D Matrix II`,
    description: `Write an efficient algorithm that searches for a \`target\` value in an \`m x n\` integer \`matrix\`. The \`matrix\` has the following properties:
Integers in each row are sorted in ascending from left to right.

Integers in each column are sorted in ascending from top to bottom.`,
    topics: ['Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5
Output: true

Example 2:
Input: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20
Output: false

Constraints:
\`m == matrix.length\`
\`n == matrix[i].length\`
\`1 <= n, m <= 300\`
\`-109 <= matix[i][j] <= 109\`
All the integers in each row are sorted in ascending order.

All the integers in each column are sorted in ascending order.

\`-109 <= target <= 109\``,
    pseudocode: '',
  },
  {
    title: `Minimum Path Sum`,
    description: `Given a \`m x n\` \`grid\` filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.

Note: You can only move either down or right at any point in time.`,
    topics: ['Arrays', 'Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: grid = [[1,3,1],[1,5,1],[4,2,1]]
Output: 7
Explanation: Because the path 1 → 3 → 1 → 1 → 1 minimizes the sum.


Example 2:
Input: grid = [[1,2,3],[4,5,6]]
Output: 12

Constraints:
\`m == grid.length\`
\`n == grid[i].length\`
\`1 <= m, n <= 200\`
\`0 <= grid[i][j] <= 100\``,
    pseudocode: '',
  },
  {
    title: `Binary Tree Inorder Traversal`,
    description: `Given the \`root\` of a binary tree, return the inorder traversal of its nodes' values.`,
    topics: ['Hash Tables', 'Stacks and Queues', 'Trees'],
    difficulty: 'medium',
    examples: `Example 1:
Input: root = [1,null,2,3]
Output: [1,3,2]

Example 2:
Input: root = []
Output: []

Example 3:
Input: root = [1]
Output: [1]

Example 4:
Input: root = [1,2]
Output: [2,1]

Example 5:
Input: root = [1,null,2]
Output: [1,2]

Constraints:
The number of nodes in the tree is in the range \`[0, 100]\`.

\`-100 <= Node.val <= 100\`
Follow up:
Recursive solution is trivial, could you do it iteratively?`,
    pseudocode: `def inorderTraversal(root):
    result = []
    stack = []
    curr = root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    return result

# Approach: Iterative with explicit stack
# Time Complexity: O(n)
# Space Complexity: O(h) where h = tree height`,
  },
  {
    title: `Unique Binary Search Trees`,
    description: `Given an integer \`n\`, return the number of structurally unique BST's (binary search trees) which has exactly \`n\` nodes of unique values from \`1\` to \`n\`.`,
    topics: ['Dynamic Programming', 'Trees'],
    difficulty: 'medium',
    examples: `Example 1:
Input: n = 3
Output: 5

Example 2:
Input: n = 1
Output: 1

Constraints:
\`1 <= n <= 19\``,
    pseudocode: '',
  },
  {
    title: `Binary Tree Level Order Traversal`,
    description: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]

Example 2:
Input: root = [1]
Output: [[1]]

Example 3:
Input: root = []
Output: []

Constraints:
The number of nodes in the tree is in the range \`[0, 2000]\`.

\`-1000 <= Node.val <= 1000\``,
    pseudocode: '',
  },
  {
    title: `Maximal Square`,
    description: `Given an \`m x n\` binary \`matrix\` filled with \`0\`'s and \`1\`'s, find the largest square containing only \`1\`'s and return its area.`,
    topics: ['Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: matrix = [[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0]]
Output: 4

Example 2:
Input: matrix = [[0,1],[1,0]]
Output: 1

Example 3:
Input: matrix = [[0]]
Output: 0

Constraints:
\`m == matrix.length\`
\`n == matrix[i].length\`
\`1 <= m, n <= 300\`
\`matrix[i][j]\` is \`'0'\` or \`'1'\`.`,
    pseudocode: '',
  },
  {
    title: `Partition Labels`,
    description: `A string \`S\` of lowercase English letters is given. We want to partition this string into as many parts as possible so that each letter appears in at most one part, and return a list of integers representing the size of these parts.`,
    topics: ['Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: S = ababcbacadefegdehijhklij
Output: [9,7,8]
Explanation:
The partition is ababcbaca, defegde, hijhklij.

This is a partition so that each letter appears in at most one part.

A partition like ababcbacadefegde, hijhklij is incorrect, because it splits S into less parts.

Note:
\`S\` will have length in range \`[1, 500]\`.

\`S\` will consist of lowercase English letters (\`'a'\` to \`'z'\`) only.`,
    pseudocode: '',
  },
  {
    title: `Rotate Array`,
    description: `Given an array, rotate the array to the right by \`k\` steps, where \`k\` is non-negative.`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]
Explanation:
rotate 1 steps to the right: [7,1,2,3,4,5,6]
rotate 2 steps to the right: [6,7,1,2,3,4,5]
rotate 3 steps to the right: [5,6,7,1,2,3,4]

Example 2:
Input: nums = [-1,-100,3,99], k = 2
Output: [3,99,-1,-100]
Explanation: 
rotate 1 steps to the right: [99,-1,-100,3]
rotate 2 steps to the right: [3,99,-1,-100]

Constraints:
\`1 <= nums.length <= 2 * 104\`
\`-231 <= nums[i] <= 231 - 1\`
\`0 <= k <= 105\`
Follow up:
Try to come up with as many solutions as you can. There are at least three different ways to solve this problem.

Could you do it in-place with \`O(1)\` extra space?`,
    pseudocode: '',
  },
  {
    title: `Perfect Squares`,
    description: `Given an integer \`n\`, return the least number of perfect square numbers that sum to \`n\`.

A perfect square is an integer that is the square of an integer; in other words, it is the product of some integer with itself. For example, \`1\`, \`4\`, \`9\`, and \`16\` are perfect squares while \`3\` and \`11\` are not.`,
    topics: ['Dynamic Programming', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: n = 12
Output: 3
Explanation: 12 = 4 + 4 + 4.


Example 2:
Input: n = 13
Output: 2
Explanation: 13 = 4 + 9.


Constraints:
\`1 <= n <= 104\``,
    pseudocode: '',
  },
  {
    title: `Partition Equal Subset Sum`,
    description: `Given a non-empty array \`nums\` containing only positive integers, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.`,
    topics: ['Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [1,5,11,5]
Output: true
Explanation: The array can be partitioned as [1, 5, 5] and [11].


Example 2:
Input: nums = [1,2,3,5]
Output: false
Explanation: The array cannot be partitioned into equal sum subsets.


Constraints:
\`1 <= nums.length <= 200\`
\`1 <= nums[i] <= 100\``,
    pseudocode: '',
  },
  {
    title: `Decode Ways`,
    description: `A message containing letters from \`A-Z\` can be encoded into numbers using the following mapping:
'A' -> 1
'B' -> 2
...

'Z' -> 26
To decode an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above (there may be multiple ways). For example, \`11106\` can be mapped into:
\`AAJF\` with the grouping \`(1 1 10 6)\`
\`KJF\` with the grouping \`(11 10 6)\`
Note that the grouping \`(1 11 06)\` is invalid because \`06\` cannot be mapped into \`'F'\` since \`6\` is different from \`06\`.

Given a string \`s\` containing only digits, return the number of ways to decode it.

The answer is guaranteed to fit in a 32-bit integer.`,
    topics: ['Strings', 'Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: s = 12
Output: 2
Explanation: 12 could be decoded as AB (1 2) or L (12).


Example 2:
Input: s = 226
Output: 3
Explanation: 226 could be decoded as BZ (2 26), VF (22 6), or BBF (2 2 6).


Example 3:
Input: s = 0
Output: 0
Explanation: There is no character that is mapped to a number starting with 0.

The only valid mappings with 0 are 'J' -> 10 and 'T' -> 20, neither of which start with 0.

Hence, there are no valid ways to decode this since all digits need to be mapped.


Example 4:
Input: s = 06
Output: 0
Explanation: 06 cannot be mapped to F because of the leading zero (6 is different from 06).


Constraints:
\`1 <= s.length <= 100\`
\`s\` contains only digits and may contain leading zero(s).`,
    pseudocode: '',
  },
  {
    title: `Palindromic Substrings`,
    description: `Given a string, your task is to count how many palindromic substrings in this string.

The substrings with different start indexes or end indexes are counted as different substrings even they consist of same characters.`,
    topics: ['Strings', 'Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: abc
Output: 3
Explanation: Three palindromic strings: a, b, c.


Example 2:
Input: aaa
Output: 6
Explanation: Six palindromic strings: a, a, a, aa, aa, aaa.

Note:
The input string length won't exceed 1000.`,
    pseudocode: '',
  },
  {
    title: `Find All Anagrams in a String`,
    description: `Given a string s and a non-empty string p, find all the start indices of p's anagrams in s.

Strings consists of lowercase English letters only and the length of both strings s and p will not be larger than 20,100.

The order of output does not matter.`,
    topics: ['Hash Tables'],
    difficulty: 'medium',
    examples: `Example 1:
Input:
s: cbaebabacd p: abc
Output:
[0, 6]
Explanation:
The substring with start index = 0 is cba, which is an anagram of abc.

The substring with start index = 6 is bac, which is an anagram of abc.


Example 2:
Input:
s: abab p: ab
Output:
[0, 1, 2]
Explanation:
The substring with start index = 0 is ab, which is an anagram of ab.

The substring with start index = 1 is ba, which is an anagram of ab.

The substring with start index = 2 is ab, which is an anagram of ab.`,
    pseudocode: '',
  },
  {
    title: `Flatten Binary Tree to Linked List`,
    description: `Given the \`root\` of a binary tree, flatten the tree into a linked list:
The linked list should use the same \`TreeNode\` class where the \`right\` child pointer points to the next node in the list and the \`left\` child pointer is always \`null\`.

The linked list should be in the same order as a pre-order traversal of the binary tree.`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: root = [1,2,5,3,4,null,6]
Output: [1,null,2,null,3,null,4,null,5,null,6]

Example 2:
Input: root = []
Output: []

Example 3:
Input: root = [0]
Output: [0]

Constraints:
The number of nodes in the tree is in the range \`[0, 2000]\`.

\`-100 <= Node.val <= 100\`
Follow up: Can you flatten the tree in-place (with \`O(1)\` extra space)?`,
    pseudocode: '',
  },
  {
    title: `Sort List`,
    description: `Given the \`head\` of a linked list, return the list after sorting it in ascending order.

Follow up: Can you sort the linked list in \`O(n logn)\` time and \`O(1)\` memory (i.e. constant space)?`,
    topics: ['Linked Lists', 'Sorting'],
    difficulty: 'medium',
    examples: `Example 1:
Input: head = [4,2,1,3]
Output: [1,2,3,4]

Example 2:
Input: head = [-1,5,3,4,0]
Output: [-1,0,3,4,5]

Example 3:
Input: head = []
Output: []

Constraints:
The number of nodes in the list is in the range \`[0, 5 * 104]\`.

\`-105 <= Node.val <= 105\``,
    pseudocode: `def sortList(head):
    if not head or not head.next:
        return head
    # Find middle
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    mid = slow.next
    slow.next = None
    left = sortList(head)
    right = sortList(mid)
    # Merge two sorted lists
    dummy = ListNode(0)
    curr = dummy
    while left and right:
        if left.val <= right.val:
            curr.next = left
            left = left.next
        else:
            curr.next = right
            right = right.next
        curr = curr.next
    curr.next = left or right
    return dummy.next

# Approach: Merge Sort on linked list
# Time Complexity: O(n log n)
# Space Complexity: O(log n) recursion stack`,
  },
  {
    title: `Daily Temperatures`,
    description: `Given a list of daily temperatures \`T\`, return a list such that, for each day in the input, tells you how many days you would have to wait until a warmer temperature.  If there is no future day for which this is possible, put \`0\` instead.

For example, given the list of temperatures \`T = [73, 74, 75, 71, 69, 72, 76, 73]\`, your output should be \`[1, 1, 4, 2, 1, 1, 0, 0]\`.

Note:
The length of \`temperatures\` will be in the range \`[1, 30000]\`.

Each temperature will be an integer in the range \`[30, 100]\`.`,
    topics: ['Hash Tables', 'Stacks and Queues'],
    difficulty: 'medium',
    examples: ``,
    pseudocode: `def dailyTemperatures(temperatures):
    n = len(temperatures)
    result = [0] * n
    stack = []  # indices of temps waiting for a warmer day
    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            j = stack.pop()
            result[j] = i - j
        stack.append(i)
    return result

# Approach: Monotonic decreasing stack
# Time Complexity: O(n)
# Space Complexity: O(n)`,
  },
  {
    title: `Linked List Cycle II`,
    description: `Given a linked list, return the node where the cycle begins. If there is no cycle, return \`null\`.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer. Internally, \`pos\` is used to denote the index of the node that tail's \`next\` pointer is connected to. Note that \`pos\` is not passed as a parameter.

Notice that you should not modify the linked list.`,
    topics: ['Linked Lists', 'Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: head = [3,2,0,-4], pos = 1
Output: tail connects to node index 1
Explanation: There is a cycle in the linked list, where tail connects to the second node.


Example 2:
Input: head = [1,2], pos = 0
Output: tail connects to node index 0
Explanation: There is a cycle in the linked list, where tail connects to the first node.


Example 3:
Input: head = [1], pos = -1
Output: no cycle
Explanation: There is no cycle in the linked list.


Constraints:
The number of the nodes in the list is in the range \`[0, 104]\`.

\`-105 <= Node.val <= 105\`
\`pos\` is \`-1\` or a valid index in the linked-list.

Follow up: Can you solve it using \`O(1)\` (i.e. constant) memory?`,
    pseudocode: '',
  },
  {
    title: `Target Sum`,
    description: `You are given a list of non-negative integers, a1, a2, ..., an, and a target, S. Now you have 2 symbols \`+\` and \`-\`. For each integer, you should choose one from \`+\` and \`-\` as its new symbol.

Find out how many ways to assign symbols to make sum of integers equal to target S.`,
    topics: ['Dynamic Programming', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums is [1, 1, 1, 1, 1], S is 3. 
Output: 5
Explanation: 
-1+1+1+1+1 = 3
+1-1+1+1+1 = 3
+1+1-1+1+1 = 3
+1+1+1-1+1 = 3
+1+1+1+1-1 = 3
There are 5 ways to assign symbols to make the sum of nums be target 3.


Constraints:
The length of the given array is positive and will not exceed 20.

The sum of elements in the given array will not exceed 1000.

Your output answer is guaranteed to be fitted in a 32-bit integer.`,
    pseudocode: '',
  },
  {
    title: `House Robber III`,
    description: `The thief has found himself a new place for his thievery again. There is only one entrance to this area, called \`root\`.

Besides the \`root\`, each house has one and only one parent house. After a tour, the smart thief realized that all houses in this place form a binary tree. It will automatically contact the police if two directly-linked houses were broken into on the same night.

Given the \`root\` of the binary tree, return the maximum amount of money the thief can rob without alerting the police.`,
    topics: ['Dynamic Programming', 'Trees', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: root = [3,2,3,null,3,null,1]
Output: 7
Explanation: Maximum amount of money the thief can rob = 3 + 3 + 1 = 7.


Example 2:
Input: root = [3,4,5,1,3,null,1]
Output: 9
Explanation: Maximum amount of money the thief can rob = 4 + 5 = 9.


Constraints:
The number of nodes in the tree is in the range \`[1, 104]\`.

\`0 <= Node.val <= 104\``,
    pseudocode: '',
  },
  {
    title: `Jump Game II`,
    description: `Given an array of non-negative integers \`nums\`, you are initially positioned at the first index of the array.

Each element in the array represents your maximum jump length at that position.

Your goal is to reach the last index in the minimum number of jumps.

You can assume that you can always reach the last index.`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [2,3,1,1,4]
Output: 2
Explanation: The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.


Example 2:
Input: nums = [2,3,0,1,4]
Output: 2

Constraints:
\`1 <= nums.length <= 1000\`
\`0 <= nums[i] <= 105\``,
    pseudocode: '',
  },
  {
    title: `Shortest Unsorted Continuous Subarray`,
    description: `Given an integer array \`nums\`, you need to find one continuous subarray that if you only sort this subarray in ascending order, then the whole array will be sorted in ascending order.

Return the shortest such subarray and output its length.`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [2,6,4,8,10,9,15]
Output: 5
Explanation: You need to sort [6, 4, 8, 10, 9] in ascending order to make the whole array sorted in ascending order.


Example 2:
Input: nums = [1,2,3,4]
Output: 0

Example 3:
Input: nums = [1]
Output: 0

Constraints:
\`1 <= nums.length <= 104\`
\`-105 <= nums[i] <= 105\`
Follow up: Can you solve it in \`O(n)\` time complexity?`,
    pseudocode: '',
  },
  {
    title: `Counting Bits`,
    description: `Given an integer \`num\`, return an array of the number of \`1\`'s in the binary representation of every number in the range \`[0, num]\`.`,
    topics: ['Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: num = 2
Output: [0,1,1]
Explanation:
0 --> 0
1 --> 1
2 --> 10

Example 2:
Input: num = 5
Output: [0,1,1,2,1,2]
Explanation:
0 --> 0
1 --> 1
2 --> 10
3 --> 11
4 --> 100
5 --> 101

Constraints:
\`0 <= num <= 105\`
Follow up:
It is very easy to come up with a solution with run time \`O(32n)\`. Can you do it in linear time \`O(n)\` and possibly in a single pass?
Could you solve it in \`O(n)\` space complexity?
Can you do it without using any built-in function (i.e., like \`__builtin_popcount\` in C++)?`,
    pseudocode: '',
  },
  {
    title: `Binary Tree Right Side View`,
    description: `Given the \`root\` of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.`,
    topics: ['Trees', 'Graphs', 'Stacks and Queues'],
    difficulty: 'medium',
    examples: `Example 1:
Input: root = [1,2,3,null,5,null,4]
Output: [1,3,4]

Example 2:
Input: root = [1,null,3]
Output: [1,3]

Example 3:
Input: root = []
Output: []

Constraints:
The number of nodes in the tree is in the range \`[0, 100]\`.

\`-100 <= Node.val <= 100\``,
    pseudocode: `from collections import deque

def rightSideView(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)
        for i in range(level_size):
            node = queue.popleft()
            if i == level_size - 1:
                result.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return result

# Approach: BFS level order, take last node per level
# Time Complexity: O(n)
# Space Complexity: O(n)`,
  },
  {
    title: `Kth Smallest Element in a BST`,
    description: `Given the \`root\` of a binary search tree, and an integer \`k\`, return the \`kth\` (1-indexed) smallest element in the tree.`,
    topics: ['Searching', 'Trees'],
    difficulty: 'medium',
    examples: `Example 1:
Input: root = [3,1,4,null,2], k = 1
Output: 1

Example 2:
Input: root = [5,3,6,2,4,null,null,1], k = 3
Output: 3

Constraints:
The number of nodes in the tree is \`n\`.

\`1 <= k <= n <= 104\`
\`0 <= Node.val <= 104\`
Follow up: If the BST is modified often (i.e., we can do insert and delete operations) and you need to find the kth smallest frequently, how would you optimize?`,
    pseudocode: '',
  },
  {
    title: `Spiral Matrix`,
    description: `Given an \`m x n\` \`matrix\`, return all elements of the \`matrix\` in spiral order.`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: `Example 1:
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]

Example 2:
Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]

Constraints:
\`m == matrix.length\`
\`n == matrix[i].length\`
\`1 <= m, n <= 10\`
\`-100 <= matrix[i][j] <= 100\``,
    pseudocode: '',
  },
  {
    title: `Minimum Size Subarray Sum`,
    description: `Given an array of positive integers \`nums\` and a positive integer \`target\`, return the minimal length of a contiguous subarray \`[numsl, numsl+1, ..., numsr-1, numsr]\` of which the sum is greater than or equal to \`target\`. If there is no such subarray, return \`0\` instead.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: target = 7, nums = [2,3,1,2,4,3]
Output: 2
Explanation: The subarray [4,3] has the minimal length under the problem constraint.


Example 2:
Input: target = 4, nums = [1,4,4]
Output: 1

Example 3:
Input: target = 11, nums = [1,1,1,1,1,1,1,1]
Output: 0

Constraints:
\`1 <= target <= 109\`
\`1 <= nums.length <= 105\`
\`1 <= nums[i] <= 105\`
Follow up: If you have figured out the \`O(n)\` solution, try coding another solution of which the time complexity is \`O(n log(n))\`.`,
    pseudocode: '',
  },
  {
    title: `Binary Search Tree Iterator`,
    description: `Implement the \`BSTIterator\` class that represents an iterator over the in-order traversal of a binary search tree (BST):
\`BSTIterator(TreeNode root)\` Initializes an object of the \`BSTIterator\` class. The \`root\` of the BST is given as part of the constructor. The pointer should be initialized to a non-existent number smaller than any element in the BST.

\`boolean hasNext()\` Returns \`true\` if there exists a number in the traversal to the right of the pointer, otherwise returns \`false\`.

\`int next()\` Moves the pointer to the right, then returns the number at the pointer.

Notice that by initializing the pointer to a non-existent smallest number, the first call to \`next()\` will return the smallest element in the BST.

You may assume that \`next()\` calls will always be valid. That is, there will be at least a next number in the in-order traversal when \`next()\` is called.`,
    topics: ['Stacks and Queues', 'Trees'],
    difficulty: 'medium',
    examples: `Example 1:
Input
[BSTIterator, next, next, hasNext, next, hasNext, next, hasNext, next, hasNext]
[[[7, 3, 15, null, null, 9, 20]], [], [], [], [], [], [], [], [], []]
Output
[null, 3, 7, true, 9, true, 15, true, 20, false]
Explanation
BSTIterator bSTIterator = new BSTIterator([7, 3, 15, null, null, 9, 20]);
bSTIterator.next();    // return 3
bSTIterator.next();    // return 7
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 9
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 15
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 20
bSTIterator.hasNext(); // return False

Constraints:
The number of nodes in the tree is in the range \`[1, 105]\`.

\`0 <= Node.val <= 106\`
At most \`105\` calls will be made to \`hasNext\`, and \`next\`.

Follow up:
Could you implement \`next()\` and \`hasNext()\` to run in average \`O(1)\` time and use \`O(h)\` memory, where \`h\` is the height of the tree?`,
    pseudocode: `class BSTIterator:
    def __init__(self, root):
        self.stack = []
        self._push_left(root)

    def _push_left(self, node):
        while node:
            self.stack.append(node)
            node = node.left

    def next(self):
        node = self.stack.pop()
        self._push_left(node.right)
        return node.val

    def hasNext(self):
        return len(self.stack) > 0

# Approach: Controlled inorder traversal with stack
# Time Complexity: O(1) amortized per call
# Space Complexity: O(h)`,
  },
  {
    title: `Course Schedule II`,
    description: `There are a total of \`n\` courses you have to take labelled from \`0\` to \`n - 1\`.

Some courses may have \`prerequisites\`, for example, if \`prerequisites[i] = [ai, bi]\` this means you must take the course \`bi\` before the course \`ai\`.

Given the total number of courses \`numCourses\` and a list of the \`prerequisite\` pairs, return the ordering of courses you should take to finish all courses.

If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.`,
    topics: ['Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: numCourses = 2, prerequisites = [[1,0]]
Output: [0,1]
Explanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0. So the correct course order is [0,1].


Example 2:
Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
Output: [0,2,1,3]
Explanation: There are a total of 4 courses to take. To take course 3 you should have finished both courses 1 and 2. Both courses 1 and 2 should be taken after you finished course 0.

So one correct course order is [0,1,2,3]. Another correct ordering is [0,2,1,3].


Example 3:
Input: numCourses = 1, prerequisites = []
Output: [0]

Constraints:
\`1 <= numCourses <= 2000\`
\`0 <= prerequisites.length <= numCourses * (numCourses - 1)\`
\`prerequisites[i].length == 2\`
\`0 <= ai, bi < numCourses\`
\`ai != bi\`
All the pairs \`[ai, bi]\` are distinct.`,
    pseudocode: '',
  },
  {
    title: `Best Time to Buy and Sell Stock with Cooldown`,
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`ith\` day.

Find the maximum profit you can achieve. You may complete as many transactions as you like (i.e., buy one and sell one share of the stock multiple times) with the following restrictions:
After you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day).

Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).`,
    topics: ['Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: prices = [1,2,3,0,2]
Output: 3
Explanation: transactions = [buy, sell, cooldown, buy, sell]

Example 2:
Input: prices = [1]
Output: 0

Constraints:
\`1 <= prices.length <= 5000\`
\`0 <= prices[i] <= 1000\``,
    pseudocode: '',
  },
  {
    title: `Reverse Linked List II`,
    description: `Given the \`head\` of a singly linked list and two integers \`left\` and \`right\` where \`left <= right\`, reverse the nodes of the list from position \`left\` to position \`right\`, and return the reversed list.`,
    topics: ['Linked Lists'],
    difficulty: 'medium',
    examples: `Example 1:
Input: head = [1,2,3,4,5], left = 2, right = 4
Output: [1,4,3,2,5]

Example 2:
Input: head = [5], left = 1, right = 1
Output: [5]

Constraints:
The number of nodes in the list is \`n\`.

\`1 <= n <= 500\`
\`-500 <= Node.val <= 500\`
\`1 <= left <= right <= n\`
Follow up: Could you do it in one pass?`,
    pseudocode: '',
  },
  {
    title: `Kth Smallest Element in a Sorted Matrix`,
    description: `Given an \`n x n\` \`matrix\` where each of the rows and columns are sorted in ascending order, return the \`kth\` smallest element in the matrix.

Note that it is the \`kth\` smallest element in the sorted order, not the \`kth\` distinct element.`,
    topics: ['Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8
Output: 13
Explanation: The elements in the matrix are [1,5,9,10,11,12,13,13,15], and the 8th smallest number is 13

Example 2:
Input: matrix = [[-5]], k = 1
Output: -5

Constraints:
\`n == matrix.length\`
\`n == matrix[i].length\`
\`1 <= n <= 300\`
\`-109 <= matrix[i][j] <= 109\`
All the rows and columns of \`matrix\` are guaranteed to be sorted in non-degreasing order.

\`1 <= k <= n2\``,
    pseudocode: '',
  },
  {
    title: `Swap Nodes in Pairs`,
    description: `Given a linked list, swap every two adjacent nodes and return its head.`,
    topics: ['Linked Lists'],
    difficulty: 'medium',
    examples: `Example 1:
Input: head = [1,2,3,4]
Output: [2,1,4,3]

Example 2:
Input: head = []
Output: []

Example 3:
Input: head = [1]
Output: [1]

Constraints:
The number of nodes in the list is in the range \`[0, 100]\`.

\`0 <= Node.val <= 100\`
Follow up: Can you solve the problem without modifying the values in the list's nodes? (i.e., Only nodes themselves may be changed.)`,
    pseudocode: '',
  },
  {
    title: `Insert Delete GetRandom O(1)`,
    description: `Implement the \`RandomizedSet\` class:
\`RandomizedSet()\` Initializes the \`RandomizedSet\` object.

\`bool insert(int val)\` Inserts an item \`val\` into the set if not present. Returns \`true\` if the item was not present, \`false\` otherwise.

\`bool remove(int val)\` Removes an item \`val\` from the set if present. Returns \`true\` if the item was present, \`false\` otherwise.

\`int getRandom()\` Returns a random element from the current set of elements (it's guaranteed that at least one element exists when this method is called). Each element must have the same probability of being returned.`,
    topics: ['Arrays', 'Hash Tables'],
    difficulty: 'medium',
    examples: `Example 1:
Input
[RandomizedSet, insert, remove, insert, getRandom, remove, insert, getRandom]
[[], [1], [2], [2], [], [1], [2], []]
Output
[null, true, false, true, 2, true, false, 2]
Explanation
RandomizedSet randomizedSet = new RandomizedSet();
randomizedSet.insert(1); // Inserts 1 to the set. Returns true as 1 was inserted successfully.

randomizedSet.remove(2); // Returns false as 2 does not exist in the set.

randomizedSet.insert(2); // Inserts 2 to the set, returns true. Set now contains [1,2].

randomizedSet.getRandom(); // getRandom() should return either 1 or 2 randomly.

randomizedSet.remove(1); // Removes 1 from the set, returns true. Set now contains [2].

randomizedSet.insert(2); // 2 was already in the set, so return false.

randomizedSet.getRandom(); // Since 2 is the only number in the set, getRandom() will always return 2.


Constraints:
\`-231 <= val <= 231 - 1\`
At most \`105\` calls will be made to \`insert\`, \`remove\`, and \`getRandom\`.

There will be at least one element in the data structure when \`getRandom\` is called.

Follow up: Could you implement the functions of the class with each function works in average \`O(1)\` time?`,
    pseudocode: '',
  },
  {
    title: `Find All Duplicates in an Array`,
    description: `Given an array of integers, 1 ≤ a[i] ≤ n (n = size of array), some elements appear twice and others appear once.

Find all the elements that appear twice in this array.

Could you do it without extra space and in O(n) runtime?

Example:
Input:
[4,3,2,7,8,2,3,1]
Output:
[2,3]`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: ``,
    pseudocode: '',
  },
  {
    title: `All Nodes Distance K in Binary Tree`,
    description: `We are given a binary tree (with root node \`root\`), a \`target\` node, and an integer value \`K\`.

Return a list of the values of all nodes that have a distance \`K\` from the \`target\` node.  The answer can be returned in any order.`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, K = 2
Output: [7,4,1]
Explanation: 
The nodes that are a distance 2 from the target node (with value 5)
have values 7, 4, and 1.

Note that the inputs root and target are actually TreeNodes.

The descriptions of the inputs above are just serializations of these objects.

Note:
The given tree is non-empty.

Each node in the tree has unique values \`0 <= node.val <= 500\`.

The \`target\` node is a node in the tree.

\`0 <= K <= 1000\`.`,
    pseudocode: '',
  },
  {
    title: `Evaluate Division`,
    description: `You are given an array of variable pairs \`equations\` and an array of real numbers \`values\`, where \`equations[i] = [Ai, Bi]\` and \`values[i]\` represent the equation \`Ai / Bi = values[i]\`. Each \`Ai\` or \`Bi\` is a string that represents a single variable.

You are also given some \`queries\`, where \`queries[j] = [Cj, Dj]\` represents the \`jth\` query where you must find the answer for \`Cj / Dj = ?\`.

Return the answers to all queries. If a single answer cannot be determined, return \`-1.0\`.

Note: The input is always valid. You may assume that evaluating the queries will not result in division by zero and that there is no contradiction.`,
    topics: ['Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: equations = [[a,b],[b,c]], values = [2.0,3.0], queries = [[a,c],[b,a],[a,e],[a,a],[x,x]]
Output: [6.00000,0.50000,-1.00000,1.00000,-1.00000]
Explanation: 
Given: a / b = 2.0, b / c = 3.0
queries are: a / c = ?, b / a = ?, a / e = ?, a / a = ?, x / x = ?
return: [6.0, 0.5, -1.0, 1.0, -1.0 ]

Example 2:
Input: equations = [[a,b],[b,c],[bc,cd]], values = [1.5,2.5,5.0], queries = [[a,c],[c,b],[bc,cd],[cd,bc]]
Output: [3.75000,0.40000,5.00000,0.20000]

Example 3:
Input: equations = [[a,b]], values = [0.5], queries = [[a,b],[b,a],[a,c],[x,y]]
Output: [0.50000,2.00000,-1.00000,-1.00000]

Constraints:
\`1 <= equations.length <= 20\`
\`equations[i].length == 2\`
\`1 <= Ai.length, Bi.length <= 5\`
\`values.length == equations.length\`
\`0.0 < values[i] <= 20.0\`
\`1 <= queries.length <= 20\`
\`queries[i].length == 2\`
\`1 <= Cj.length, Dj.length <= 5\`
\`Ai, Bi, Cj, Dj\` consist of lower case English letters and digits.`,
    pseudocode: '',
  },
  {
    title: `Find Minimum in Rotated Sorted Array`,
    description: `Suppose an array of length \`n\` sorted in ascending order is rotated between \`1\` and \`n\` times. For example, the array \`nums = [0,1,2,4,5,6,7]\` might become:
\`[4,5,6,7,0,1,2]\` if it was rotated \`4\` times.

\`[0,1,2,4,5,6,7]\` if it was rotated \`7\` times.

Notice that rotating an array \`[a[0], a[1], a[2], ..., a[n-1]]\` 1 time results in the array \`[a[n-1], a[0], a[1], a[2], ..., a[n-2]]\`.

Given the sorted rotated array \`nums\` of unique elements, return the minimum element of this array.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [3,4,5,1,2]
Output: 1
Explanation: The original array was [1,2,3,4,5] rotated 3 times.


Example 2:
Input: nums = [4,5,6,7,0,1,2]
Output: 0
Explanation: The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.


Example 3:
Input: nums = [11,13,15,17]
Output: 11
Explanation: The original array was [11,13,15,17] and it was rotated 4 times. 

Constraints:
\`n == nums.length\`
\`1 <= n <= 5000\`
\`-5000 <= nums[i] <= 5000\`
All the integers of \`nums\` are unique.

\`nums\` is sorted and rotated between \`1\` and \`n\` times.`,
    pseudocode: '',
  },
  {
    title: `Binary Tree Zigzag Level Order Traversal`,
    description: `Given the \`root\` of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).`,
    topics: ['Stacks and Queues', 'Trees', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[20,9],[15,7]]

Example 2:
Input: root = [1]
Output: [[1]]

Example 3:
Input: root = []
Output: []

Constraints:
The number of nodes in the tree is in the range \`[0, 2000]\`.

\`-100 <= Node.val <= 100\``,
    pseudocode: `from collections import deque

def zigzagLevelOrder(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    left_to_right = True
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        if not left_to_right:
            level.reverse()
        result.append(level)
        left_to_right = not left_to_right
    return result

# Approach: BFS with alternating direction
# Time Complexity: O(n)
# Space Complexity: O(n)`,
  },
  {
    title: `Set Matrix Zeroes`,
    description: `Given an \`m x n\` matrix. If an element is 0, set its entire row and column to 0. Do it in-place.

Follow up:
A straight forward solution using O(mn) space is probably a bad idea.

A simple improvement uses O(m + n) space, but still not the best solution.

Could you devise a constant space solution?`,
    topics: ['Arrays'],
    difficulty: 'medium',
    examples: `Example 1:
Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
Output: [[1,0,1],[0,0,0],[1,0,1]]

Example 2:
Input: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]

Constraints:
\`m == matrix.length\`
\`n == matrix[0].length\`
\`1 <= m, n <= 200\`
\`-231 <= matrix[i][j] <= 231 - 1\``,
    pseudocode: '',
  },
  {
    title: `Populating Next Right Pointers in Each Node`,
    description: `You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. The binary tree has the following definition:
struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}
Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to \`NULL\`.

Initially, all next pointers are set to \`NULL\`.

Follow up:
You may only use constant extra space.

Recursive approach is fine, you may assume implicit stack space does not count as extra space for this problem.`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: root = [1,2,3,4,5,6,7]
Output: [1,#,2,3,#,4,5,6,7,#]
Explanation: Given the above perfect binary tree (Figure A), your function should populate each next pointer to point to its next right node, just like in Figure B. The serialized output is in level order as connected by the next pointers, with '#' signifying the end of each level.


Constraints:
The number of nodes in the given tree is less than \`4096\`.

\`-1000 <= node.val <= 1000\``,
    pseudocode: '',
  },
  {
    title: `Palindrome Partitioning`,
    description: `Given a string \`s\`, partition \`s\` such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of \`s\`.

A palindrome string is a string that reads the same backward as forward.`,
    topics: ['Dynamic Programming', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: s = aab
Output: [[a,a,b],[aa,b]]

Example 2:
Input: s = a
Output: [[a]]

Constraints:
\`1 <= s.length <= 16\`
\`s\` contains only lowercase English letters.`,
    pseudocode: '',
  },
  {
    title: `Rotting Oranges`,
    description: `You are given an \`m x n\` \`grid\` where each cell can have one of three values:
\`0\` representing an empty cell,
\`1\` representing a fresh orange, or
\`2\` representing a rotten orange.

Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.

Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return \`-1\`.`,
    topics: ['Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: grid = [[2,1,1],[1,1,0],[0,1,1]]
Output: 4

Example 2:
Input: grid = [[2,1,1],[0,1,1],[1,0,1]]
Output: -1
Explanation: The orange in the bottom left corner (row 2, column 0) is never rotten, because rotting only happens 4-directionally.


Example 3:
Input: grid = [[0,2]]
Output: 0
Explanation: Since there are already no fresh oranges at minute 0, the answer is just 0.


Constraints:
\`m == grid.length\`
\`n == grid[i].length\`
\`1 <= m, n <= 10\`
\`grid[i][j]\` is \`0\`, \`1\`, or \`2\`.`,
    pseudocode: '',
  },
  {
    title: `Remove K Digits`,
    description: `Given a non-negative integer num represented as a string, remove k digits from the number so that the new number is the smallest possible.

Note:
The length of num is less than 10002 and will be ≥ k.

The given num does not contain any leading zero.`,
    topics: ['Stacks and Queues'],
    difficulty: 'medium',
    examples: `Example 1:
Input: num = 1432219, k = 3
Output: 1219
Explanation: Remove the three digits 4, 3, and 2 to form the new number 1219 which is the smallest.


Example 2:
Input: num = 10200, k = 1
Output: 200
Explanation: Remove the leading 1 and the number is 200. Note that the output must not contain leading zeroes.


Example 3:
Input: num = 10, k = 2
Output: 0
Explanation: Remove all the digits from the number and it is left with nothing which is 0.`,
    pseudocode: `def removeKdigits(num, k):
    stack = []
    for digit in num:
        while k and stack and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)
    # Remove remaining from the end
    stack = stack[:len(stack) - k]
    # Remove leading zeros
    result = ''.join(stack).lstrip('0')
    return result or '0'

# Approach: Monotonic increasing stack (greedy)
# Time Complexity: O(n)
# Space Complexity: O(n)`,
  },
  {
    title: `4Sum`,
    description: `Given an array \`nums\` of n integers and an integer \`target\`, are there elements a, b, c, and d in \`nums\` such that a + b + c + d = \`target\`? Find all unique quadruplets in the array which gives the sum of \`target\`.

Notice that the solution set must not contain duplicate quadruplets.`,
    topics: ['Arrays', 'Hash Tables', 'Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [1,0,-1,0,-2,2], target = 0
Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]

Example 2:
Input: nums = [], target = 0
Output: []

Constraints:
\`0 <= nums.length <= 200\`
\`-109 <= nums[i] <= 109\`
\`-109 <= target <= 109\``,
    pseudocode: '',
  },
  {
    title: `Search a 2D Matrix`,
    description: `Write an efficient algorithm that searches for a value in an \`m x n\` matrix. This matrix has the following properties:
Integers in each row are sorted from left to right.

The first integer of each row is greater than the last integer of the previous row.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true

Example 2:
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false

Constraints:
\`m == matrix.length\`
\`n == matrix[i].length\`
\`1 <= m, n <= 100\`
\`-104 <= matrix[i][j], target <= 104\``,
    pseudocode: '',
  },
  {
    title: `3Sum Closest`,
    description: `Given an array \`nums\` of n integers and an integer \`target\`, find three integers in \`nums\` such that the sum is closest to \`target\`. Return the sum of the three integers. You may assume that each input would have exactly one solution.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [-1,2,1,-4], target = 1
Output: 2
Explanation: The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).


Constraints:
\`3 <= nums.length <= 10^3\`
\`-10^3 <= nums[i] <= 10^3\`
\`-10^4 <= target <= 10^4\``,
    pseudocode: '',
  },
  {
    title: `Reorder List`,
    description: `You are given the head of a singly linked-list. The list can be represented as:
L0 → L1 → ... → Ln - 1 → Ln
Reorder the list to be on the following form:
L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → ...

You may not modify the values in the list's nodes. Only nodes themselves may be changed.`,
    topics: ['Linked Lists'],
    difficulty: 'medium',
    examples: `Example 1:
Input: head = [1,2,3,4]
Output: [1,4,2,3]

Example 2:
Input: head = [1,2,3,4,5]
Output: [1,5,2,4,3]

Constraints:
The number of nodes in the list is in the range \`[1, 5 * 104]\`.

\`1 <= Node.val <= 1000\``,
    pseudocode: '',
  },
  {
    title: `Minimum Height Trees`,
    description: `A tree is an undirected graph in which any two vertices are connected by exactly one path. In other words, any connected graph without simple cycles is a tree.

Given a tree of \`n\` nodes labelled from \`0\` to \`n - 1\`, and an array of \`n - 1\` \`edges\` where \`edges[i] = [ai, bi]\` indicates that there is an undirected edge between the two nodes \`ai\` and \`bi\` in the tree, you can choose any node of the tree as the root. When you select a node \`x\` as the root, the result tree has height \`h\`. Among all possible rooted trees, those with minimum height (i.e. \`min(h)\`)  are called minimum height trees (MHTs).

Return a list of all MHTs' root labels. You can return the answer in any order.

The height of a rooted tree is the number of edges on the longest downward path between the root and a leaf.`,
    topics: ['Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: n = 4, edges = [[1,0],[1,2],[1,3]]
Output: [1]
Explanation: As shown, the height of the tree is 1 when the root is the node with label 1 which is the only MHT.


Example 2:
Input: n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]
Output: [3,4]

Example 3:
Input: n = 1, edges = []
Output: [0]

Example 4:
Input: n = 2, edges = [[0,1]]
Output: [0,1]

Constraints:
\`1 <= n <= 2 * 104\`
\`edges.length == n - 1\`
\`0 <= ai, bi < n\`
\`ai != bi\`
All the pairs \`(ai, bi)\` are distinct.

The given input is guaranteed to be a tree and there will be no repeated edges.`,
    pseudocode: '',
  },
  {
    title: `Longest Palindromic Subsequence`,
    description: `Given a string \`s\`, find the longest palindromic subsequence's length in \`s\`.

A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.`,
    topics: ['Dynamic Programming'],
    difficulty: 'medium',
    examples: `Example 1:
Input: s = bbbab
Output: 4
Explanation: One possible longest palindromic subsequence is bbbb.


Example 2:
Input: s = cbbd
Output: 2
Explanation: One possible longest palindromic subsequence is bb.


Constraints:
\`1 <= s.length <= 1000\`
\`s\` consists only of lowercase English letters.`,
    pseudocode: '',
  },
  {
    title: `Unique Binary Search Trees II`,
    description: `Given an integer \`n\`, return all the structurally unique BST's (binary search trees), which has exactly \`n\` nodes of unique values from \`1\` to \`n\`. Return the answer in any order.`,
    topics: ['Dynamic Programming', 'Trees'],
    difficulty: 'medium',
    examples: `Example 1:
Input: n = 3
Output: [[1,null,2,null,3],[1,null,3,2],[2,1,3],[3,1,null,null,2],[3,2,null,1]]

Example 2:
Input: n = 1
Output: [[1]]

Constraints:
\`1 <= n <= 8\``,
    pseudocode: '',
  },
  {
    title: `Odd Even Linked List`,
    description: `Given the \`head\` of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list.

The first node is considered odd, and the second node is even, and so on.

Note that the relative order inside both the even and odd groups should remain as it was in the input.`,
    topics: ['Linked Lists'],
    difficulty: 'medium',
    examples: `Example 1:
Input: head = [1,2,3,4,5]
Output: [1,3,5,2,4]

Example 2:
Input: head = [2,1,3,5,6,4,7]
Output: [2,3,6,7,1,5,4]

Constraints:
The number of nodes in the linked list is in the range \`[0, 104]\`.

\`-106 <= Node.val <= 106\`
Follow up: Could you solve it in \`O(1)\` space complexity and \`O(nodes)\` time complexity?`,
    pseudocode: '',
  },
  {
    title: `Max Area of Island`,
    description: `Given a non-empty 2D array \`grid\` of 0's and 1's, an island is a group of \`1\`'s (representing land) connected 4-directionally (horizontal or vertical.) You may assume all four edges of the grid are surrounded by water.

Find the maximum area of an island in the given 2D array. (If there is no island, the maximum area is 0.)`,
    topics: ['Arrays', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
[[0,0,1,0,0,0,0,1,0,0,0,0,0],
 [0,0,0,0,0,0,0,1,1,1,0,0,0],
 [0,1,1,0,1,0,0,0,0,0,0,0,0],
 [0,1,0,0,1,1,0,0,1,0,1,0,0],
 [0,1,0,0,1,1,0,0,1,1,1,0,0],
 [0,0,0,0,0,0,0,0,0,0,1,0,0],
 [0,0,0,0,0,0,0,1,1,1,0,0,0],
 [0,0,0,0,0,0,0,1,1,0,0,0,0]]
Given the above grid, return \`6\`. Note the answer is not 11, because the island must be connected 4-directionally.


Example 2:
[[0,0,0,0,0,0,0,0]]
Given the above grid, return \`0\`.

Note: The length of each dimension in the given \`grid\` does not exceed 50.`,
    pseudocode: '',
  },
  {
    title: `Cheapest Flights Within K Stops`,
    description: `There are \`n\` cities connected by \`m\` flights. Each flight starts from city \`u\` and arrives at \`v\` with a price \`w\`.

Now given all the cities and flights, together with starting city \`src\` and the destination \`dst\`, your task is to find the cheapest price from \`src\` to \`dst\` with up to \`k\` stops. If there is no such route, output \`-1\`.`,
    topics: ['Dynamic Programming', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: 
n = 3, edges = [[0,1,100],[1,2,100],[0,2,500]]
src = 0, dst = 2, k = 1
Output: 200
Explanation: 
The graph looks like this:
The cheapest price from city \`0\` to city \`2\` with at most 1 stop costs 200, as marked red in the picture.


Example 2:
Input: 
n = 3, edges = [[0,1,100],[1,2,100],[0,2,500]]
src = 0, dst = 2, k = 0
Output: 500
Explanation: 
The graph looks like this:
The cheapest price from city \`0\` to city \`2\` with at most 0 stop costs 500, as marked blue in the picture.


Constraints:
The number of nodes \`n\` will be in range \`[1, 100]\`, with nodes labeled from \`0\` to \`n\`\` - 1\`.

The size of \`flights\` will be in range \`[0, n * (n - 1) / 2]\`.

The format of each flight will be \`(src, \`\`dst\`\`, price)\`.

The price of each flight will be in the range \`[1, 10000]\`.

\`k\` is in the range of \`[0, n - 1]\`.

There will not be any duplicated flights or self cycles.`,
    pseudocode: '',
  },
  {
    title: `Largest Number`,
    description: `Given a list of non-negative integers \`nums\`, arrange them such that they form the largest number.

Note: The result may be very large, so you need to return a string instead of an integer.`,
    topics: ['Sorting'],
    difficulty: 'medium',
    examples: `Example 1:
Input: nums = [10,2]
Output: 210

Example 2:
Input: nums = [3,30,34,5,9]
Output: 9534330

Example 3:
Input: nums = [1]
Output: 1

Example 4:
Input: nums = [10]
Output: 10

Constraints:
\`1 <= nums.length <= 100\`
\`0 <= nums[i] <= 109\``,
    pseudocode: `from functools import cmp_to_key

def largestNumber(nums):
    def compare(a, b):
        if a + b > b + a:
            return -1
        elif a + b < b + a:
            return 1
        return 0
    strs = [str(n) for n in nums]
    strs.sort(key=cmp_to_key(compare))
    result = ''.join(strs)
    return '0' if result[0] == '0' else result

# Approach: Custom sort comparator (compare a+b vs b+a)
# Time Complexity: O(n log n * k) where k = avg digit length
# Space Complexity: O(n)`,
  },
  {
    title: `Number of Provinces`,
    description: `There are \`n\` cities. Some of them are connected, while some are not. If city \`a\` is connected directly with city \`b\`, and city \`b\` is connected directly with city \`c\`, then city \`a\` is connected indirectly with city \`c\`.

A province is a group of directly or indirectly connected cities and no other cities outside of the group.

You are given an \`n x n\` matrix \`isConnected\` where \`isConnected[i][j] = 1\` if the \`ith\` city and the \`jth\` city are directly connected, and \`isConnected[i][j] = 0\` otherwise.

Return the total number of provinces.`,
    topics: ['Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: isConnected = [[1,1,0],[1,1,0],[0,0,1]]
Output: 2

Example 2:
Input: isConnected = [[1,0,0],[0,1,0],[0,0,1]]
Output: 3

Constraints:
\`1 <= n <= 200\`
\`n == isConnected.length\`
\`n == isConnected[i].length\`
\`isConnected[i][j]\` is \`1\` or \`0\`.

\`isConnected[i][i] == 1\`
\`isConnected[i][j] == isConnected[j][i]\``,
    pseudocode: '',
  },
  {
    title: `Clone Graph`,
    description: `Given a reference of a node in a connected undirected graph.

Return a deep copy (clone) of the graph.

Each node in the graph contains a val (\`int\`) and a list (\`List[Node]\`) of its neighbors.

class Node {
    public int val;
    public List<Node> neighbors;
}
Test case format:
For simplicity sake, each node's value is the same as the node's index (1-indexed). For example, the first node with \`val = 1\`, the second node with \`val = 2\`, and so on. The graph is represented in the test case using an adjacency list.

Adjacency list is a collection of unordered lists used to represent a finite graph. Each list describes the set of neighbors of a node in the graph.

The given node will always be the first node with \`val = 1\`. You must return the copy of the given node as a reference to the cloned graph.`,
    topics: ['Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
Explanation: There are 4 nodes in the graph.

1st node (val = 1)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).

2nd node (val = 2)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).

3rd node (val = 3)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).

4th node (val = 4)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).


Example 2:
Input: adjList = [[]]
Output: [[]]
Explanation: Note that the input contains one empty list. The graph consists of only one node with val = 1 and it does not have any neighbors.


Example 3:
Input: adjList = []
Output: []
Explanation: This an empty graph, it does not have any nodes.


Example 4:
Input: adjList = [[2],[1]]
Output: [[2],[1]]

Constraints:
\`1 <= Node.val <= 100\`
\`Node.val\` is unique for each node.

Number of Nodes will not exceed 100.

There is no repeated edges and no self-loops in the graph.

The Graph is connected and all nodes can be visited starting from the given node.`,
    pseudocode: '',
  },
  {
    title: `K Closest Points to Origin`,
    description: `Given an array of \`points\` where \`points[i] = [xi, yi]\` represents a point on the X-Y plane and an integer \`k\`, return the \`k\` closest points to the origin \`(0, 0)\`.

The distance between two points on the X-Y plane is the Euclidean distance (i.e., \`√(x1 - x2)2 + (y1 - y2)2\`).

You may return the answer in any order. The answer is guaranteed to be unique (except for the order that it is in).`,
    topics: ['Sorting'],
    difficulty: 'medium',
    examples: `Example 1:
Input: points = [[1,3],[-2,2]], k = 1
Output: [[-2,2]]
Explanation:
The distance between (1, 3) and the origin is sqrt(10).

The distance between (-2, 2) and the origin is sqrt(8).

Since sqrt(8) < sqrt(10), (-2, 2) is closer to the origin.

We only want the closest k = 1 points from the origin, so the answer is just [[-2,2]].


Example 2:
Input: points = [[3,3],[5,-1],[-2,4]], k = 2
Output: [[3,3],[-2,4]]
Explanation: The answer [[-2,4],[3,3]] would also be accepted.


Constraints:
\`1 <= k <= points.length <= 104\`
\`-104 < xi, yi < 104\``,
    pseudocode: `import heapq

def kClosest(points, k):
    return heapq.nsmallest(k, points, key=lambda p: p[0]**2 + p[1]**2)

# Alternative using max-heap for O(n log k):
# import heapq
# def kClosest(points, k):
#     heap = []
#     for x, y in points:
#         dist = -(x*x + y*y)
#         if len(heap) < k:
#             heapq.heappush(heap, (dist, x, y))
#         else:
#             heapq.heappushpop(heap, (dist, x, y))
#     return [[x, y] for _, x, y in heap]

# Approach: Min-heap / nsmallest
# Time Complexity: O(n log k)
# Space Complexity: O(k)`,
  },
  {
    title: `Top K Frequent Words`,
    description: `Given a non-empty list of words, return the k most frequent elements.

Your answer should be sorted by frequency from highest to lowest. If two words have the same frequency, then the word with the lower alphabetical order comes first.`,
    topics: ['Hash Tables'],
    difficulty: 'medium',
    examples: `Example 1:
Input: [i, love, leetcode, i, love, coding], k = 2
Output: [i, love]
Explanation: i and love are the two most frequent words.

    Note that i comes before love due to a lower alphabetical order.


Example 2:
Input: [the, day, is, sunny, the, the, the, sunny, is, is], k = 4
Output: [the, is, sunny, day]
Explanation: the, is, sunny and day are the four most frequent words,
    with the number of occurrence being 4, 3, 2 and 1 respectively.

Note:
You may assume k is always valid, 1 ≤ k ≤ number of unique elements.

Input words contain only lowercase letters.
Follow up:
Try to solve it in O(n log k) time and O(n) extra space.`,
    pseudocode: '',
  },
  {
    title: `Design Add and Search Words Data Structure`,
    description: `Design a data structure that supports adding new words and finding if a string matches any previously added string.

Implement the \`WordDictionary\` class:
\`WordDictionary()\` Initializes the object.

\`void addWord(word)\` Adds \`word\` to the data structure, it can be matched later.

\`bool search(word)\` Returns \`true\` if there is any string in the data structure that matches \`word\` or \`false\` otherwise. \`word\` may contain dots \`'.'\` where dots can be matched with any letter.


Example:
Input
[WordDictionary,addWord,addWord,addWord,search,search,search,search]
[[],[bad],[dad],[mad],[pad],[bad],[.ad],[b..]]
Output
[null,null,null,null,false,true,true,true]
Explanation
WordDictionary wordDictionary = new WordDictionary();
wordDictionary.addWord(bad);
wordDictionary.addWord(dad);
wordDictionary.addWord(mad);
wordDictionary.search(pad); // return False
wordDictionary.search(bad); // return True
wordDictionary.search(.ad); // return True
wordDictionary.search(b..); // return True`,
    topics: ['Graphs'],
    difficulty: 'medium',
    examples: `Constraints:
\`1 <= word.length <= 500\`
\`word\` in \`addWord\` consists lower-case English letters.

\`word\` in \`search\` consist of  \`'.'\` or lower-case English letters.

At most \`50000\` calls will be made to \`addWord\` and \`search\`.`,
    pseudocode: '',
  },
  {
    title: `Count Complete Tree Nodes`,
    description: `Given the \`root\` of a complete binary tree, return the number of the nodes in the tree.

According to Wikipedia, every level, except possibly the last, is completely filled in a complete binary tree, and all nodes in the last level are as far left as possible. It can have between \`1\` and \`2h\` nodes inclusive at the last level \`h\`.`,
    topics: ['Searching', 'Trees'],
    difficulty: 'medium',
    examples: `Example 1:
Input: root = [1,2,3,4,5,6]
Output: 6

Example 2:
Input: root = []
Output: 0

Example 3:
Input: root = [1]
Output: 1

Constraints:
The number of nodes in the tree is in the range \`[0, 5 * 104]\`.

\`0 <= Node.val <= 5 * 104\`
The tree is guaranteed to be complete.

Follow up: Traversing the tree to count the number of nodes in the tree is an easy solution but with \`O(n)\` complexity. Could you find a faster algorithm?`,
    pseudocode: '',
  },
  {
    title: `Remove Duplicates from Sorted List II`,
    description: `Given the \`head\` of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list. Return the linked list sorted as well.`,
    topics: ['Linked Lists'],
    difficulty: 'medium',
    examples: `Example 1:
Input: head = [1,2,3,3,4,4,5]
Output: [1,2,5]

Example 2:
Input: head = [1,1,1,2,3]
Output: [2,3]

Constraints:
The number of nodes in the list is in the range \`[0, 300]\`.

\`-100 <= Node.val <= 100\`
The list is guaranteed to be sorted in ascending order.`,
    pseudocode: '',
  },
  {
    title: `Delete Node in a BST`,
    description: `Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference (possibly updated) of the BST.

Basically, the deletion can be divided into two stages:
Search for a node to remove.

If the node is found, delete the node.

Follow up: Can you solve it with time complexity \`O(height of tree)\`?`,
    topics: ['Trees'],
    difficulty: 'medium',
    examples: `Example 1:
Input: root = [5,3,6,2,4,null,7], key = 3
Output: [5,4,6,2,null,null,7]
Explanation: Given key to delete is 3. So we find the node with value 3 and delete it.

One valid answer is [5,4,6,2,null,null,7], shown in the above BST.

Please notice that another valid answer is [5,2,6,null,4,null,7] and it's also accepted.


Example 2:
Input: root = [5,3,6,2,4,null,7], key = 0
Output: [5,3,6,2,4,null,7]
Explanation: The tree does not contain a node with value = 0.


Example 3:
Input: root = [], key = 0
Output: []

Constraints:
The number of nodes in the tree is in the range \`[0, 104]\`.

\`-105 <= Node.val <= 105\`
Each node has a unique value.

\`root\` is a valid binary search tree.

\`-105 <= key <= 105\``,
    pseudocode: '',
  },
  {
    title: `Convert Sorted List to Binary Search Tree`,
    description: `Given the \`head\` of a singly linked list where elements are sorted in ascending order, convert it to a height balanced BST.

For this problem, a height-balanced binary tree is defined as a binary tree in which the depth of the two subtrees of every node never differ by more than 1.`,
    topics: ['Linked Lists', 'Graphs'],
    difficulty: 'medium',
    examples: `Example 1:
Input: head = [-10,-3,0,5,9]
Output: [0,-3,9,-10,null,5]
Explanation: One possible answer is [0,-3,9,-10,null,5], which represents the shown height balanced BST.


Example 2:
Input: head = []
Output: []

Example 3:
Input: head = [0]
Output: [0]

Example 4:
Input: head = [1,3]
Output: [3,1]

Constraints:
The number of nodes in \`head\` is in the range \`[0, 2 * 104]\`.

\`-10^5 <= Node.val <= 10^5\``,
    pseudocode: '',
  },
  {
    title: `Trapping Rain Water`,
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    topics: ['Arrays', 'Searching', 'Dynamic Programming', 'Stacks and Queues'],
    difficulty: 'hard',
    examples: `Example 1:
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.


Example 2:
Input: height = [4,2,0,3,2,5]
Output: 9

Constraints:
\`n == height.length\`
\`0 <= n <= 3 * 104\`
\`0 <= height[i] <= 105\``,
    pseudocode: `def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    return water

# Approach: Two Pointers
# Time Complexity: O(n)
# Space Complexity: O(1)`,
  },
  {
    title: `Median of Two Sorted Arrays`,
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'hard',
    examples: `Example 1:
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.


Example 2:
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.


Example 3:
Input: nums1 = [0,0], nums2 = [0,0]
Output: 0.00000

Example 4:
Input: nums1 = [], nums2 = [1]
Output: 1.00000

Example 5:
Input: nums1 = [2], nums2 = []
Output: 2.00000

Constraints:
\`nums1.length == m\`
\`nums2.length == n\`
\`0 <= m <= 1000\`
\`0 <= n <= 1000\`
\`1 <= m + n <= 2000\`
\`-106 <= nums1[i], nums2[i] <= 106\`
Follow up: The overall run time complexity should be \`O(log (m+n))\`.`,
    pseudocode: '',
  },
  {
    title: `Merge k Sorted Lists`,
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    topics: ['Linked Lists'],
    difficulty: 'hard',
    examples: `Example 1:
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: The linked-lists are:
[
  1->4->5,
  1->3->4,
  2->6
]
merging them into one sorted list:
1->1->2->3->4->4->5->6

Example 2:
Input: lists = []
Output: []

Example 3:
Input: lists = [[]]
Output: []

Constraints:
\`k == lists.length\`
\`0 <= k <= 10^4\`
\`0 <= lists[i].length <= 500\`
\`-10^4 <= lists[i][j] <= 10^4\`
\`lists[i]\` is sorted in ascending order.

The sum of \`lists[i].length\` won't exceed \`10^4\`.`,
    pseudocode: '',
  },
  {
    title: `Minimum Window Substring`,
    description: `Given two strings \`s\` and \`t\`, return the minimum window in \`s\` which will contain all the characters in \`t\`. If there is no such window in \`s\` that covers all characters in \`t\`, return the empty string \`\`.

Note that If there is such a window, it is guaranteed that there will always be only one unique minimum window in \`s\`.`,
    topics: ['Hash Tables', 'Searching', 'Strings'],
    difficulty: 'hard',
    examples: `Example 1:
Input: s = ADOBECODEBANC, t = ABC
Output: BANC

Example 2:
Input: s = a, t = a
Output: a

Constraints:
\`1 <= s.length, t.length <= 105\`
\`s\` and \`t\` consist of English letters.

Follow up: Could you find an algorithm that runs in \`O(n)\` time?`,
    pseudocode: '',
  },
  {
    title: `Regular Expression Matching`,
    description: `Given an input string (\`s\`) and a pattern (\`p\`), implement regular expression matching with support for \`'.'\` and \`'*'\` where:\` \`
\`'.'\` Matches any single character.​​​​
\`'*'\` Matches zero or more of the preceding element.

The matching should cover the entire input string (not partial).`,
    topics: ['Strings', 'Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: s = aa, p = a
Output: false
Explanation: a does not match the entire string aa.


Example 2:
Input: s = aa, p = a*
Output: true
Explanation: '*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes aa.


Example 3:
Input: s = ab, p = .*
Output: true
Explanation: .* means zero or more (*) of any character (.).


Example 4:
Input: s = aab, p = c*a*b
Output: true
Explanation: c can be repeated 0 times, a can be repeated 1 time. Therefore, it matches aab.


Example 5:
Input: s = mississippi, p = mis*is*p*.
Output: false

Constraints:
\`0 <= s.length <= 20\`
\`0 <= p.length <= 30\`
\`s\` contains only lowercase English letters.

\`p\` contains only lowercase English letters, \`'.'\`, and \`'*'\`.

It is guaranteed for each appearance of the character \`'*'\`, there will be a previous valid character to match.`,
    pseudocode: '',
  },
  {
    title: `Largest Rectangle in Histogram`,
    description: `Given an array of integers \`heights\` representing the histogram's bar height where the width of each bar is \`1\`, return the area of the largest rectangle in the histogram.`,
    topics: ['Arrays', 'Stacks and Queues'],
    difficulty: 'hard',
    examples: `Example 1:
Input: heights = [2,1,5,6,2,3]
Output: 10
Explanation: The above is a histogram where width of each bar is 1.

The largest rectangle is shown in the red area, which has an area = 10 units.


Example 2:
Input: heights = [2,4]
Output: 4

Constraints:
\`1 <= heights.length <= 105\`
\`0 <= heights[i] <= 104\``,
    pseudocode: `def largestRectangleArea(heights):
    stack = []
    max_area = 0
    heights.append(0)  # sentinel to flush remaining
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    heights.pop()  # remove sentinel
    return max_area

# Approach: Monotonic increasing stack
# Time Complexity: O(n)
# Space Complexity: O(n)`,
  },
  {
    title: `First Missing Positive`,
    description: `Given an unsorted integer array \`nums\`, find the smallest missing positive integer.`,
    topics: ['Arrays'],
    difficulty: 'hard',
    examples: `Example 1:
Input: nums = [1,2,0]
Output: 3

Example 2:
Input: nums = [3,4,-1,1]
Output: 2

Example 3:
Input: nums = [7,8,9,11,12]
Output: 1

Constraints:
\`0 <= nums.length <= 300\`
\`-231 <= nums[i] <= 231 - 1\`
Follow up: Could you implement an algorithm that runs in \`O(n)\` time and uses constant extra space?`,
    pseudocode: '',
  },
  {
    title: `Sliding Window Maximum`,
    description: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.`,
    topics: ['Stacks and Queues'],
    difficulty: 'hard',
    examples: `Example 1:
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
Explanation: 
Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7

Example 2:
Input: nums = [1], k = 1
Output: [1]

Example 3:
Input: nums = [1,-1], k = 1
Output: [1,-1]

Example 4:
Input: nums = [9,11], k = 2
Output: [11]

Example 5:
Input: nums = [4,-2], k = 2
Output: [4]

Constraints:
\`1 <= nums.length <= 105\`
\`-104 <= nums[i] <= 104\`
\`1 <= k <= nums.length\``,
    pseudocode: `from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()  # stores indices, front = max
    result = []
    for i in range(len(nums)):
        # Remove elements outside the window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # Remove smaller elements from back
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result

# Approach: Monotonic decreasing deque
# Time Complexity: O(n)
# Space Complexity: O(k)`,
  },
  {
    title: `Binary Tree Maximum Path Sum`,
    description: `A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the \`root\` of a binary tree, return the maximum path sum of any path.`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'hard',
    examples: `Example 1:
Input: root = [1,2,3]
Output: 6
Explanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.


Example 2:
Input: root = [-10,9,20,null,null,15,7]
Output: 42
Explanation: The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.


Constraints:
The number of nodes in the tree is in the range \`[1, 3 * 104]\`.

\`-1000 <= Node.val <= 1000\``,
    pseudocode: '',
  },
  {
    title: `Edit Distance`,
    description: `Given two strings \`word1\` and \`word2\`, return the minimum number of operations required to convert \`word1\` to \`word2\`.

You have the following three operations permitted on a word:
Insert a character
Delete a character
Replace a character`,
    topics: ['Strings', 'Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: word1 = horse, word2 = ros
Output: 3
Explanation: 
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')

Example 2:
Input: word1 = intention, word2 = execution
Output: 5
Explanation: 
intention -> inention (remove 't')
inention -> enention (replace 'i' with 'e')
enention -> exention (replace 'n' with 'x')
exention -> exection (replace 'n' with 'c')
exection -> execution (insert 'u')

Constraints:
\`0 <= word1.length, word2.length <= 500\`
\`word1\` and \`word2\` consist of lowercase English letters.`,
    pseudocode: '',
  },
  {
    title: `Longest Valid Parentheses`,
    description: `Given a string containing just the characters \`'('\` and \`')'\`, find the length of the longest valid (well-formed) parentheses substring.`,
    topics: ['Strings', 'Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: s = (()
Output: 2
Explanation: The longest valid parentheses substring is ().


Example 2:
Input: s = )()())
Output: 4
Explanation: The longest valid parentheses substring is ()().


Example 3:
Input: s = 
Output: 0

Constraints:
\`0 <= s.length <= 3 * 104\`
\`s[i]\` is \`'('\`, or \`')'\`.`,
    pseudocode: '',
  },
  {
    title: `Longest Consecutive Sequence`,
    description: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence.`,
    topics: ['Arrays'],
    difficulty: 'hard',
    examples: `Example 1:
Input: nums = [100,4,200,1,3,2]
Output: 4
Explanation: The longest consecutive elements sequence is \`[1, 2, 3, 4]\`. Therefore its length is 4.


Example 2:
Input: nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9

Constraints:
\`0 <= nums.length <= 104\`
\`-109 <= nums[i] <= 109\`
Follow up: Could you implement the \`O(n)\` solution?`,
    pseudocode: '',
  },
  {
    title: `Word Ladder`,
    description: `A transformation sequence from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words \`beginWord -> s1 -> s2 -> ... -> sk\` such that:
Every adjacent pair of words differs by a single letter.

Every \`si\` for \`1 <= i <= k\` is in \`wordList\`. Note that \`beginWord\` does not need to be in \`wordList\`.

\`sk == endWord\`
Given two words, \`beginWord\` and \`endWord\`, and a dictionary \`wordList\`, return the number of words in the shortest transformation sequence from \`beginWord\` to \`endWord\`, or \`0\` if no such sequence exists.`,
    topics: ['Graphs'],
    difficulty: 'hard',
    examples: `Example 1:
Input: beginWord = hit, endWord = cog, wordList = [hot,dot,dog,lot,log,cog]
Output: 5
Explanation: One shortest transformation sequence is hit -> hot -> dot -> dog -> cog, which is 5 words long.


Example 2:
Input: beginWord = hit, endWord = cog, wordList = [hot,dot,dog,lot,log]
Output: 0
Explanation: The endWord cog is not in wordList, therefore there is no valid transformation sequence.


Constraints:
\`1 <= beginWord.length <= 10\`
\`endWord.length == beginWord.length\`
\`1 <= wordList.length <= 5000\`
\`wordList[i].length == beginWord.length\`
\`beginWord\`, \`endWord\`, and \`wordList[i]\` consist of lowercase English letters.

\`beginWord != endWord\`
All the words in \`wordList\` are unique.`,
    pseudocode: '',
  },
  {
    title: `Serialize and Deserialize Binary Tree`,
    description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

Clarification: The input/output format is the same as how LeetCode serializes a binary tree. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.`,
    topics: ['Trees'],
    difficulty: 'hard',
    examples: `Example 1:
Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]

Example 2:
Input: root = []
Output: []

Example 3:
Input: root = [1]
Output: [1]

Example 4:
Input: root = [1,2]
Output: [1,2]

Constraints:
The number of nodes in the tree is in the range \`[0, 104]\`.

\`-1000 <= Node.val <= 1000\``,
    pseudocode: '',
  },
  {
    title: `Maximal Rectangle`,
    description: `Given a \`rows x cols\` binary \`matrix\` filled with \`0\`'s and \`1\`'s, find the largest rectangle containing only \`1\`'s and return its area.`,
    topics: ['Arrays', 'Hash Tables', 'Dynamic Programming', 'Stacks and Queues'],
    difficulty: 'hard',
    examples: `Example 1:
Input: matrix = [[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0]]
Output: 6
Explanation: The maximal rectangle is shown in the above picture.


Example 2:
Input: matrix = []
Output: 0

Example 3:
Input: matrix = [[0]]
Output: 0

Example 4:
Input: matrix = [[1]]
Output: 1

Example 5:
Input: matrix = [[0,0]]
Output: 0

Constraints:
\`rows == matrix.length\`
\`cols == matrix[i].length\`
\`0 <= row, cols <= 200\`
\`matrix[i][j]\` is \`'0'\` or \`'1'\`.`,
    pseudocode: `def maximalRectangle(matrix):
    if not matrix:
        return 0
    cols = len(matrix[0])
    heights = [0] * (cols + 1)
    max_area = 0
    for row in matrix:
        for j in range(cols):
            heights[j] = heights[j] + 1 if row[j] == '1' else 0
        # Largest rectangle in histogram using stack
        stack = []
        for i in range(cols + 1):
            while stack and heights[stack[-1]] > heights[i]:
                h = heights[stack.pop()]
                w = i if not stack else i - stack[-1] - 1
                max_area = max(max_area, h * w)
            stack.append(i)
    return max_area

# Approach: Row-by-row histogram + monotonic stack
# Time Complexity: O(m * n)
# Space Complexity: O(n)`,
  },
  {
    title: `Reverse Nodes in k-Group`,
    description: `Given a linked list, reverse the nodes of a linked list k at a time and return its modified list.

k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k then left-out nodes, in the end, should remain as it is.

Follow up:
Could you solve the problem in \`O(1)\` extra memory space?
You may not alter the values in the list's nodes, only nodes itself may be changed.`,
    topics: ['Linked Lists'],
    difficulty: 'hard',
    examples: `Example 1:
Input: head = [1,2,3,4,5], k = 2
Output: [2,1,4,3,5]

Example 2:
Input: head = [1,2,3,4,5], k = 3
Output: [3,2,1,4,5]

Example 3:
Input: head = [1,2,3,4,5], k = 1
Output: [1,2,3,4,5]

Example 4:
Input: head = [1], k = 1
Output: [1]

Constraints:
The number of nodes in the list is in the range \`sz\`.

\`1 <= sz <= 5000\`
\`0 <= Node.val <= 1000\`
\`1 <= k <= sz\``,
    pseudocode: '',
  },
  {
    title: `Burst Balloons`,
    description: `You are given \`n\` balloons, indexed from \`0\` to \`n - 1\`. Each balloon is painted with a number on it represented by an array \`nums\`. You are asked to burst all the balloons.

If you burst the \`ith\` balloon, you will get \`nums[i - 1] * nums[i] * nums[i + 1]\` coins. If \`i - 1\` or \`i + 1\` goes out of bounds of the array, then treat it as if there is a balloon with a \`1\` painted on it.

Return the maximum coins you can collect by bursting the balloons wisely.`,
    topics: ['Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: nums = [3,1,5,8]
Output: 167
Explanation:
nums = [3,1,5,8] --> [3,5,8] --> [3,8] --> [8] --> []
coins =  3*1*5    +   3*5*8   +  1*3*8  + 1*8*1 = 167

Example 2:
Input: nums = [1,5]
Output: 10

Constraints:
\`n == nums.length\`
\`1 <= n <= 500\`
\`0 <= nums[i] <= 100\``,
    pseudocode: '',
  },
  {
    title: `Best Time to Buy and Sell Stock III`,
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`ith\` day.

Find the maximum profit you can achieve. You may complete at most two transactions.

Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).`,
    topics: ['Arrays', 'Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: prices = [3,3,5,0,0,3,1,4]
Output: 6
Explanation: Buy on day 4 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.

Then buy on day 7 (price = 1) and sell on day 8 (price = 4), profit = 4-1 = 3.


Example 2:
Input: prices = [1,2,3,4,5]
Output: 4
Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.

Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are engaging multiple transactions at the same time. You must sell before buying again.


Example 3:
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transaction is done, i.e. max profit = 0.


Example 4:
Input: prices = [1]
Output: 0

Constraints:
\`1 <= prices.length <= 105\`
\`0 <= prices[i] <= 105\``,
    pseudocode: '',
  },
  {
    title: `Count of Smaller Numbers After Self`,
    description: `You are given an integer array \`nums\` and you have to return a new \`counts\` array. The \`counts\` array has the property where \`counts[i]\` is the number of smaller elements to the right of \`nums[i]\`.`,
    topics: ['Searching', 'Sorting'],
    difficulty: 'hard',
    examples: `Example 1:
Input: nums = [5,2,6,1]
Output: [2,1,1,0]
Explanation:
To the right of 5 there are 2 smaller elements (2 and 1).

To the right of 2 there is only 1 smaller element (1).

To the right of 6 there is 1 smaller element (1).

To the right of 1 there is 0 smaller element.


Example 2:
Input: nums = [-1]
Output: [0]

Example 3:
Input: nums = [-1,-1]
Output: [0,0]

Constraints:
\`1 <= nums.length <= 105\`
\`-104 <= nums[i] <= 104\``,
    pseudocode: `def countSmaller(nums):
    result = [0] * len(nums)
    indices = list(range(len(nums)))

    def merge_sort(lo, hi):
        if hi - lo <= 1:
            return
        mid = (lo + hi) // 2
        merge_sort(lo, mid)
        merge_sort(mid, hi)
        temp = []
        i, j = lo, mid
        while i < mid and j < hi:
            if nums[indices[i]] <= nums[indices[j]]:
                temp.append(indices[j])
                j += 1
            else:
                result[indices[i]] += j - mid
                temp.append(indices[i])
                i += 1
        while i < mid:
            result[indices[i]] += j - mid
            temp.append(indices[i])
            i += 1
        while j < hi:
            temp.append(indices[j])
            j += 1
        indices[lo:hi] = temp

    merge_sort(0, len(nums))
    return result

# Approach: Merge Sort with index tracking
# Time Complexity: O(n log n)
# Space Complexity: O(n)`,
  },
  {
    title: `Remove Invalid Parentheses`,
    description: `Given a string \`s\` that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.

Return all the possible results. You may return the answer in any order.`,
    topics: ['Graphs'],
    difficulty: 'hard',
    examples: `Example 1:
Input: s = ()())()
Output: [(())(),()()()]

Example 2:
Input: s = (a)())()
Output: [(a())(),(a)()()]

Example 3:
Input: s = )(
Output: []

Constraints:
\`1 <= s.length <= 25\`
\`s\` consists of lowercase English letters and parentheses \`'('\` and \`')'\`.

There will be at most \`20\` parentheses in \`s\`.`,
    pseudocode: '',
  },
  {
    title: `Word Break II`,
    description: `Given a string \`s\` and a dictionary of strings \`wordDict\`, add spaces in \`s\` to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    topics: ['Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: s = catsanddog, wordDict = [cat,cats,and,sand,dog]
Output: [cats and dog,cat sand dog]

Example 2:
Input: s = pineapplepenapple, wordDict = [apple,pen,applepen,pine,pineapple]
Output: [pine apple pen apple,pineapple pen apple,pine applepen apple]
Explanation: Note that you are allowed to reuse a dictionary word.


Example 3:
Input: s = catsandog, wordDict = [cats,dog,sand,and,cat]
Output: []

Constraints:
\`1 <= s.length <= 20\`
\`1 <= wordDict.length <= 1000\`
\`1 <= wordDict[i].length <= 10\`
\`s\` and \`wordDict[i]\` consist of only lowercase English letters.

All the strings of \`wordDict\` are unique.`,
    pseudocode: '',
  },
  {
    title: `Longest Increasing Path in a Matrix`,
    description: `Given an \`m x n\` integers \`matrix\`, return the length of the longest increasing path in \`matrix\`.

From each cell, you can either move in four directions: left, right, up, or down. You may not move diagonally or move outside the boundary (i.e., wrap-around is not allowed).`,
    topics: ['Graphs', 'Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: matrix = [[9,9,4],[6,6,8],[2,1,1]]
Output: 4
Explanation: The longest increasing path is \`[1, 2, 6, 9]\`.


Example 2:
Input: matrix = [[3,4,5],[3,2,6],[2,2,1]]
Output: 4
Explanation: The longest increasing path is \`[3, 4, 5, 6]\`. Moving diagonally is not allowed.


Example 3:
Input: matrix = [[1]]
Output: 1

Constraints:
\`m == matrix.length\`
\`n == matrix[i].length\`
\`1 <= m, n <= 200\`
\`0 <= matrix[i][j] <= 231 - 1\``,
    pseudocode: '',
  },
  {
    title: `Wildcard Matching`,
    description: `Given an input string (\`s\`) and a pattern (\`p\`), implement wildcard pattern matching with support for \`'?'\` and \`'*'\` where:
\`'?'\` Matches any single character.

\`'*'\` Matches any sequence of characters (including the empty sequence).

The matching should cover the entire input string (not partial).`,
    topics: ['Strings', 'Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: s = aa, p = a
Output: false
Explanation: a does not match the entire string aa.


Example 2:
Input: s = aa, p = *
Output: true
Explanation: '*' matches any sequence.


Example 3:
Input: s = cb, p = ?a
Output: false
Explanation: '?' matches 'c', but the second letter is 'a', which does not match 'b'.


Example 4:
Input: s = adceb, p = *a*b
Output: true
Explanation: The first '*' matches the empty sequence, while the second '*' matches the substring dce.


Example 5:
Input: s = acdcb, p = a*c?b
Output: false

Constraints:
\`0 <= s.length, p.length <= 2000\`
\`s\` contains only lowercase English letters.

\`p\` contains only lowercase English letters, \`'?'\` or \`'*'\`.`,
    pseudocode: '',
  },
  {
    title: `Sudoku Solver`,
    description: `Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy all of the following rules:
Each of the digits \`1-9\` must occur exactly once in each row.

Each of the digits \`1-9\` must occur exactly once in each column.

Each of the digits \`1-9\` must occur exactly once in each of the 9 \`3x3\` sub-boxes of the grid.

The \`'.'\` character indicates empty cells.`,
    topics: ['Hash Tables'],
    difficulty: 'hard',
    examples: `Example 1:
Input: board = [[5,3,.,.,7,.,.,.,.],[6,.,.,1,9,5,.,.,.],[.,9,8,.,.,.,.,6,.],[8,.,.,.,6,.,.,.,3],[4,.,.,8,.,3,.,.,1],[7,.,.,.,2,.,.,.,6],[.,6,.,.,.,.,2,8,.],[.,.,.,4,1,9,.,.,5],[.,.,.,.,8,.,.,7,9]]
Output: [[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]]
Explanation: The input board is shown above and the only valid solution is shown below:

Constraints:
\`board.length == 9\`
\`board[i].length == 9\`
\`board[i][j]\` is a digit or \`'.'\`.

It is guaranteed that the input board has only one solution.`,
    pseudocode: '',
  },
  {
    title: `Split Array Largest Sum`,
    description: `Given an array \`nums\` which consists of non-negative integers and an integer \`m\`, you can split the array into \`m\` non-empty continuous subarrays.

Write an algorithm to minimize the largest sum among these \`m\` subarrays.`,
    topics: ['Searching', 'Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: nums = [7,2,5,10,8], m = 2
Output: 18
Explanation:
There are four ways to split nums into two subarrays.

The best way is to split it into [7,2,5] and [10,8],
where the largest sum among the two subarrays is only 18.


Example 2:
Input: nums = [1,2,3,4,5], m = 2
Output: 9

Example 3:
Input: nums = [1,4,4], m = 3
Output: 4

Constraints:
\`1 <= nums.length <= 1000\`
\`0 <= nums[i] <= 106\`
\`1 <= m <= min(50, nums.length)\``,
    pseudocode: '',
  },
  {
    title: `Word Ladder II`,
    description: `A transformation sequence from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words \`beginWord -> s1 -> s2 -> ... -> sk\` such that:
Every adjacent pair of words differs by a single letter.

Every \`si\` for \`1 <= i <= k\` is in \`wordList\`. Note that \`beginWord\` does not need to be in \`wordList\`.

\`sk == endWord\`
Given two words, \`beginWord\` and \`endWord\`, and a dictionary \`wordList\`, return all the shortest transformation sequences from \`beginWord\` to \`endWord\`, or an empty list if no such sequence exists. Each sequence should be returned as a list of the words \`[beginWord, s1, s2, ..., sk]\`.`,
    topics: ['Arrays', 'Strings', 'Graphs'],
    difficulty: 'hard',
    examples: `Example 1:
Input: beginWord = hit, endWord = cog, wordList = [hot,dot,dog,lot,log,cog]
Output: [[hit,hot,dot,dog,cog],[hit,hot,lot,log,cog]]
Explanation: There are 2 shortest transformation sequences:
hit -> hot -> dot -> dog -> cog
hit -> hot -> lot -> log -> cog

Example 2:
Input: beginWord = hit, endWord = cog, wordList = [hot,dot,dog,lot,log]
Output: []
Explanation: The endWord cog is not in wordList, therefore there is no valid transformation sequence.


Constraints:
\`1 <= beginWord.length <= 10\`
\`endWord.length == beginWord.length\`
\`1 <= wordList.length <= 5000\`
\`wordList[i].length == beginWord.length\`
\`beginWord\`, \`endWord\`, and \`wordList[i]\` consist of lowercase English letters.

\`beginWord != endWord\`
All the words in \`wordList\` are unique.`,
    pseudocode: '',
  },
  {
    title: `Best Time to Buy and Sell Stock IV`,
    description: `You are given an integer array \`prices\` where \`prices[i]\` is the price of a given stock on the \`ith\` day, and an integer \`k\`.

Find the maximum profit you can achieve. You may complete at most \`k\` transactions.

Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).`,
    topics: ['Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: k = 2, prices = [2,4,1]
Output: 2
Explanation: Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4-2 = 2.


Example 2:
Input: k = 2, prices = [3,2,6,5,0,3]
Output: 7
Explanation: Buy on day 2 (price = 2) and sell on day 3 (price = 6), profit = 6-2 = 4. Then buy on day 5 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.


Constraints:
\`0 <= k <= 100\`
\`0 <= prices.length <= 1000\`
\`0 <= prices[i] <= 1000\``,
    pseudocode: '',
  },
  {
    title: `Recover Binary Search Tree`,
    description: `You are given the \`root\` of a binary search tree (BST), where exactly two nodes of the tree were swapped by mistake. Recover the tree without changing its structure.

Follow up: A solution using \`O(n)\` space is pretty straight forward. Could you devise a constant space solution?`,
    topics: ['Trees', 'Graphs'],
    difficulty: 'hard',
    examples: `Example 1:
Input: root = [1,3,null,null,2]
Output: [3,1,null,null,2]
Explanation: 3 cannot be a left child of 1 because 3 > 1. Swapping 1 and 3 makes the BST valid.


Example 2:
Input: root = [3,1,4,null,null,2]
Output: [2,1,4,null,null,3]
Explanation: 2 cannot be in the right subtree of 3 because 2 < 3. Swapping 2 and 3 makes the BST valid.


Constraints:
The number of nodes in the tree is in the range \`[2, 1000]\`.

\`-231 <= Node.val <= 231 - 1\``,
    pseudocode: '',
  },
  {
    title: `Dungeon Game`,
    description: `The demons had captured the princess and imprisoned her in the bottom-right corner of a \`dungeon\`. The \`dungeon\` consists of \`m x n\` rooms laid out in a 2D grid. Our valiant knight was initially positioned in the top-left room and must fight his way through \`dungeon\` to rescue the princess.

The knight has an initial health point represented by a positive integer. If at any point his health point drops to \`0\` or below, he dies immediately.

Some of the rooms are guarded by demons (represented by negative integers), so the knight loses health upon entering these rooms; other rooms are either empty (represented as 0) or contain magic orbs that increase the knight's health (represented by positive integers).

To reach the princess as quickly as possible, the knight decides to move only rightward or downward in each step.

Return the knight's minimum initial health so that he can rescue the princess.

Note that any room can contain threats or power-ups, even the first room the knight enters and the bottom-right room where the princess is imprisoned.`,
    topics: ['Searching', 'Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: dungeon = [[-2,-3,3],[-5,-10,1],[10,30,-5]]
Output: 7
Explanation: The initial health of the knight must be at least 7 if he follows the optimal path: RIGHT-> RIGHT -> DOWN -> DOWN.


Example 2:
Input: dungeon = [[0]]
Output: 1

Constraints:
\`m == dungeon.length\`
\`n == dungeon[i].length\`
\`1 <= m, n <= 200\`
\`-1000 <= dungeon[i][j] <= 1000\``,
    pseudocode: '',
  },
  {
    title: `Critical Connections in a Network`,
    description: `There are \`n\` servers numbered from \`0\` to \`n-1\` connected by undirected server-to-server \`connections\` forming a network where \`connections[i] = [a, b]\` represents a connection between servers \`a\` and \`b\`. Any server can reach any other server directly or indirectly through the network.

A critical connection is a connection that, if removed, will make some server unable to reach some other server.

Return all critical connections in the network in any order.`,
    topics: ['Graphs'],
    difficulty: 'hard',
    examples: `Example 1:
Input: n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]
Output: [[1,3]]
Explanation: [[3,1]] is also accepted.


Constraints:
\`1 <= n <= 10^5\`
\`n-1 <= connections.length <= 10^5\`
\`connections[i][0] != connections[i][1]\`
There are no repeated connections.`,
    pseudocode: '',
  },
  {
    title: `Basic Calculator`,
    description: `Given a string \`s\` representing an expression, implement a basic calculator to evaluate it.`,
    topics: ['Stacks and Queues'],
    difficulty: 'hard',
    examples: `Example 1:
Input: s = 1 + 1
Output: 2

Example 2:
Input: s =  2-1 + 2 
Output: 3

Example 3:
Input: s = (1+(4+5+2)-3)+(6+8)
Output: 23

Constraints:
\`1 <= s.length <= 3 * 105\`
\`s\` consists of digits, \`'+'\`, \`'-'\`, \`'('\`, \`')'\`, and \`' '\`.

\`s\` represents a valid expression.`,
    pseudocode: `def calculate(s):
    stack = []
    result = 0
    num = 0
    sign = 1
    for c in s:
        if c.isdigit():
            num = num * 10 + int(c)
        elif c == '+':
            result += sign * num
            num = 0
            sign = 1
        elif c == '-':
            result += sign * num
            num = 0
            sign = -1
        elif c == '(':
            stack.append(result)
            stack.append(sign)
            result = 0
            sign = 1
        elif c == ')':
            result += sign * num
            num = 0
            result *= stack.pop()  # sign before parenthesis
            result += stack.pop()  # result before parenthesis
    result += sign * num
    return result

# Approach: Stack with sign tracking
# Time Complexity: O(n)
# Space Complexity: O(n)`,
  },
  {
    title: `Russian Doll Envelopes`,
    description: `You are given a 2D array of integers \`envelopes\` where \`envelopes[i] = [wi, hi]\` represents the width and the height of an envelope.

One envelope can fit into another if and only if both the width and height of one envelope are greater than the other envelope's width and height.

Return the maximum number of envelopes you can Russian doll (i.e., put one inside the other).

Note: You cannot rotate an envelope.`,
    topics: ['Searching', 'Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: envelopes = [[5,4],[6,4],[6,7],[2,3]]
Output: 3
Explanation: The maximum number of envelopes you can Russian doll is \`3\` ([2,3] => [5,4] => [6,7]).


Example 2:
Input: envelopes = [[1,1],[1,1],[1,1]]
Output: 1

Constraints:
\`1 <= envelopes.length <= 5000\`
\`envelopes[i].length == 2\`
\`1 <= wi, hi <= 104\``,
    pseudocode: '',
  },
  {
    title: `Distinct Subsequences`,
    description: `Given two strings \`s\` and \`t\`, return the number of distinct subsequences of \`s\` which equals \`t\`.

A string's subsequence is a new string formed from the original string by deleting some (can be none) of the characters without disturbing the remaining characters' relative positions. (i.e., \`ACE\` is a subsequence of \`ABCDE\` while \`AEC\` is not).

It is guaranteed the answer fits on a 32-bit signed integer.`,
    topics: ['Strings', 'Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: s = rabbbit, t = rabbit
Output: 3
Explanation:
As shown below, there are 3 ways you can generate rabbit from S.

\`rabbbit\`
\`rabbbit\`
\`rabbbit\`

Example 2:
Input: s = babgbag, t = bag
Output: 5
Explanation:
As shown below, there are 5 ways you can generate bag from S.

\`babgbag\`
\`babgbag\`
\`babgbag\`
\`babgbag\`
\`babgbag\`

Constraints:
\`1 <= s.length, t.length <= 1000\`
\`s\` and \`t\` consist of English letters.`,
    pseudocode: '',
  },
  {
    title: `Trapping Rain Water II`,
    description: `Given an \`m x n\` matrix of positive integers representing the height of each unit cell in a 2D elevation map, compute the volume of water it is able to trap after raining.


Example:
Given the following 3x6 height map:
[
  [1,4,3,1,3,2],
  [3,2,1,3,2,4],
  [2,3,3,2,3,1]
]
Return 4.

The above image represents the elevation map \`[[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]\` before the rain.

After the rain, water is trapped between the blocks. The total volume of water trapped is 4.`,
    topics: ['Graphs'],
    difficulty: 'hard',
    examples: `Constraints:
\`1 <= m, n <= 110\`
\`0 <= heightMap[i][j] <= 20000\``,
    pseudocode: '',
  },
  {
    title: `Maximum Frequency Stack`,
    description: `Design a stack-like data structure to push elements to the stack and pop the most frequent element from the stack.

Implement the \`FreqStack\` class:
\`FreqStack()\` constructs an empty frequency stack.

\`void push(int val)\` pushes an integer \`val\` onto the top of the stack.

\`int pop()\` removes and returns the most frequent element in the stack.

	
If there is a tie for the most frequent element, the element closest to the stack's top is removed and returned.`,
    topics: ['Hash Tables', 'Stacks and Queues'],
    difficulty: 'hard',
    examples: `Example 1:
Input
[FreqStack, push, push, push, push, push, push, pop, pop, pop, pop]
[[], [5], [7], [5], [7], [4], [5], [], [], [], []]
Output
[null, null, null, null, null, null, null, 5, 7, 5, 4]
Explanation
FreqStack freqStack = new FreqStack();
freqStack.push(5); // The stack is [5]
freqStack.push(7); // The stack is [5,7]
freqStack.push(5); // The stack is [5,7,5]
freqStack.push(7); // The stack is [5,7,5,7]
freqStack.push(4); // The stack is [5,7,5,7,4]
freqStack.push(5); // The stack is [5,7,5,7,4,5]
freqStack.pop();   // return 5, as 5 is the most frequent. The stack becomes [5,7,5,7,4].

freqStack.pop();   // return 7, as 5 and 7 is the most frequent, but 7 is closest to the top. The stack becomes [5,7,5,4].

freqStack.pop();   // return 5, as 5 is the most frequent. The stack becomes [5,7,4].

freqStack.pop();   // return 4, as 4, 5 and 7 is the most frequent, but 4 is closest to the top. The stack becomes [5,7].


Constraints:
\`0 <= val <= 109\`
At most \`2 * 104\` calls will be made to \`push\` and \`pop\`.

It is guaranteed that there will be at least one element in the stack before calling \`pop\`.`,
    pseudocode: `class FreqStack:
    def __init__(self):
        self.freq = {}
        self.group = {}
        self.max_freq = 0

    def push(self, val):
        f = self.freq.get(val, 0) + 1
        self.freq[val] = f
        if f > self.max_freq:
            self.max_freq = f
        self.group.setdefault(f, []).append(val)

    def pop(self):
        val = self.group[self.max_freq].pop()
        self.freq[val] -= 1
        if not self.group[self.max_freq]:
            self.max_freq -= 1
        return val

# Approach: Stack per frequency + hash map
# Time Complexity: O(1) for push and pop
# Space Complexity: O(n)`,
  },
  {
    title: `Palindrome Partitioning II`,
    description: `Given a string \`s\`, partition \`s\` such that every substring of the partition is a palindrome.

Return the minimum cuts needed for a palindrome partitioning of \`s\`.`,
    topics: ['Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: s = aab
Output: 1
Explanation: The palindrome partitioning [aa,b] could be produced using 1 cut.


Example 2:
Input: s = a
Output: 0

Example 3:
Input: s = ab
Output: 1

Constraints:
\`1 <= s.length <= 2000\`
\`s\` consists of lower-case English letters only.`,
    pseudocode: '',
  },
  {
    title: `Palindrome Pairs`,
    description: `Given a list of unique words, return all the pairs of the distinct indices \`(i, j)\` in the given list, so that the concatenation of the two words \`words[i] + words[j]\` is a palindrome.`,
    topics: ['Hash Tables', 'Strings'],
    difficulty: 'hard',
    examples: `Example 1:
Input: words = [abcd,dcba,lls,s,sssll]
Output: [[0,1],[1,0],[3,2],[2,4]]
Explanation: The palindromes are [dcbaabcd,abcddcba,slls,llssssll]

Example 2:
Input: words = [bat,tab,cat]
Output: [[0,1],[1,0]]
Explanation: The palindromes are [battab,tabbat]

Example 3:
Input: words = [a,]
Output: [[0,1],[1,0]]

Constraints:
\`1 <= words.length <= 5000\`
\`0 <= words[i].length <= 300\`
\`words[i]\` consists of lower-case English letters.`,
    pseudocode: '',
  },
  {
    title: `Shortest Subarray with Sum at Least K`,
    description: `Return the length of the shortest, non-empty, contiguous subarray of \`A\` with sum at least \`K\`.

If there is no non-empty subarray with sum at least \`K\`, return \`-1\`.`,
    topics: ['Searching', 'Stacks and Queues'],
    difficulty: 'hard',
    examples: `Example 1:
Input: A = [1], K = 1
Output: 1

Example 2:
Input: A = [1,2], K = 4
Output: -1

Example 3:
Input: A = [2,-1,2], K = 3
Output: 3
Note:
\`1 <= A.length <= 50000\`
\`-10 ^ 5 <= A[i] <= 10 ^ 5\`
\`1 <= K <= 10 ^ 9\``,
    pseudocode: `from collections import deque

def shortestSubarray(nums, k):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    dq = deque()
    result = n + 1
    for i in range(n + 1):
        while dq and prefix[i] - prefix[dq[0]] >= k:
            result = min(result, i - dq.popleft())
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        dq.append(i)
    return result if result <= n else -1

# Approach: Monotonic deque with prefix sums
# Time Complexity: O(n)
# Space Complexity: O(n)`,
  },
  {
    title: `Subarrays with K Different Integers`,
    description: `Given an array \`A\` of positive integers, call a (contiguous, not necessarily distinct) subarray of \`A\` good if the number of different integers in that subarray is exactly \`K\`.

(For example, \`[1,2,3,1,2]\` has \`3\` different integers: \`1\`, \`2\`, and \`3\`.)
Return the number of good subarrays of \`A\`.`,
    topics: ['Hash Tables', 'Searching'],
    difficulty: 'hard',
    examples: `Example 1:
Input: A = [1,2,1,2,3], K = 2
Output: 7
Explanation: Subarrays formed with exactly 2 different integers: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2].


Example 2:
Input: A = [1,2,1,3,4], K = 3
Output: 3
Explanation: Subarrays formed with exactly 3 different integers: [1,2,1,3], [2,1,3], [1,3,4].

Note:
\`1 <= A.length <= 20000\`
\`1 <= A[i] <= A.length\`
\`1 <= K <= A.length\``,
    pseudocode: '',
  },
  {
    title: `Shortest Palindrome`,
    description: `You are given a string \`s\`. You can convert \`s\` to a palindrome by adding characters in front of it.

Return the shortest palindrome you can find by performing this transformation.`,
    topics: ['Strings'],
    difficulty: 'hard',
    examples: `Example 1:
Input: s = aacecaaa
Output: aaacecaaa

Example 2:
Input: s = abcd
Output: dcbabcd

Constraints:
\`0 <= s.length <= 5 * 104\`
\`s\` consists of lowercase English letters only.`,
    pseudocode: '',
  },
  {
    title: `Cherry Pickup`,
    description: `You are given an \`n x n\` \`grid\` representing a field of cherries, each cell is one of three possible integers.

\`0\` means the cell is empty, so you can pass through,
\`1\` means the cell contains a cherry that you can pick up and pass through, or
\`-1\` means the cell contains a thorn that blocks your way.

Return the maximum number of cherries you can collect by following the rules below:
Starting at the position \`(0, 0)\` and reaching \`(n - 1, n - 1)\` by moving right or down through valid path cells (cells with value \`0\` or \`1\`).

After reaching \`(n - 1, n - 1)\`, returning to \`(0, 0)\` by moving left or up through valid path cells.

When passing through a path cell containing a cherry, you pick it up, and the cell becomes an empty cell \`0\`.

If there is no valid path between \`(0, 0)\` and \`(n - 1, n - 1)\`, then no cherries can be collected.`,
    topics: ['Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: grid = [[0,1,-1],[1,0,-1],[1,1,1]]
Output: 5
Explanation: The player started at (0, 0) and went down, down, right right to reach (2, 2).

4 cherries were picked up during this single trip, and the matrix becomes [[0,1,-1],[0,0,-1],[0,0,0]].

Then, the player went left, up, up, left to return home, picking up one more cherry.

The total number of cherries picked up is 5, and this is the maximum possible.


Example 2:
Input: grid = [[1,1,-1],[1,-1,1],[-1,1,1]]
Output: 0

Constraints:
\`n == grid.length\`
\`n == grid[i].length\`
\`1 <= n <= 50\`
\`grid[i][j]\` is \`-1\`, \`0\`, or \`1\`.

\`grid[0][0] != -1\`
\`grid[n - 1][n - 1] != -1\``,
    pseudocode: '',
  },
  {
    title: `Find Minimum in Rotated Sorted Array II`,
    description: `Suppose an array of length \`n\` sorted in ascending order is rotated between \`1\` and \`n\` times. For example, the array \`nums = [0,1,4,4,5,6,7]\` might become:
\`[4,5,6,7,0,1,4]\` if it was rotated \`4\` times.

\`[0,1,4,4,5,6,7]\` if it was rotated \`7\` times.

Notice that rotating an array \`[a[0], a[1], a[2], ..., a[n-1]]\` 1 time results in the array \`[a[n-1], a[0], a[1], a[2], ..., a[n-2]]\`.

Given the sorted rotated array \`nums\` that may contain duplicates, return the minimum element of this array.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'hard',
    examples: `Example 1:
Input: nums = [1,3,5]
Output: 1

Example 2:
Input: nums = [2,2,2,0,1]
Output: 0

Constraints:
\`n == nums.length\`
\`1 <= n <= 5000\`
\`-5000 <= nums[i] <= 5000\`
\`nums\` is sorted and rotated between \`1\` and \`n\` times.

Follow up: This is the same as Find Minimum in Rotated Sorted Array but with duplicates. Would allow duplicates affect the run-time complexity? How and why?`,
    pseudocode: '',
  },
  {
    title: `Frog Jump`,
    description: `A frog is crossing a river. The river is divided into some number of units, and at each unit, there may or may not exist a stone. The frog can jump on a stone, but it must not jump into the water.

Given a list of \`stones\`' positions (in units) in sorted ascending order, determine if the frog can cross the river by landing on the last stone. Initially, the frog is on the first stone and assumes the first jump must be \`1\` unit.

If the frog's last jump was \`k\` units, its next jump must be either \`k - 1\`, \`k\`, or \`k + 1\` units. The frog can only jump in the forward direction.`,
    topics: ['Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: stones = [0,1,3,5,6,8,12,17]
Output: true
Explanation: The frog can jump to the last stone by jumping 1 unit to the 2nd stone, then 2 units to the 3rd stone, then 2 units to the 4th stone, then 3 units to the 6th stone, 4 units to the 7th stone, and 5 units to the 8th stone.


Example 2:
Input: stones = [0,1,2,3,4,8,9,11]
Output: false
Explanation: There is no way to jump to the last stone as the gap between the 5th and 6th stone is too large.


Constraints:
\`2 <= stones.length <= 2000\`
\`0 <= stones[i] <= 231 - 1\`
\`stones[0] == 0\``,
    pseudocode: '',
  },
  {
    title: `Integer to English Words`,
    description: `Convert a non-negative integer \`num\` to its English words representation.`,
    topics: ['Strings'],
    difficulty: 'hard',
    examples: `Example 1:
Input: num = 123
Output: One Hundred Twenty Three

Example 2:
Input: num = 12345
Output: Twelve Thousand Three Hundred Forty Five

Example 3:
Input: num = 1234567
Output: One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven

Example 4:
Input: num = 1234567891
Output: One Billion Two Hundred Thirty Four Million Five Hundred Sixty Seven Thousand Eight Hundred Ninety One

Constraints:
\`0 <= num <= 231 - 1\``,
    pseudocode: '',
  },
  {
    title: `Vertical Order Traversal of a Binary Tree`,
    description: `Given the \`root\` of a binary tree, calculate the vertical order traversal of the binary tree.

For each node at position \`(row, col)\`, its left and right children will be at positions \`(row + 1, col - 1)\` and \`(row + 1, col + 1)\` respectively. The root of the tree is at \`(0, 0)\`.

The vertical order traversal of a binary tree is a list of top-to-bottom orderings for each column index starting from the leftmost column and ending on the rightmost column. There may be multiple nodes in the same row and same column. In such a case, sort these nodes by their values.

Return the vertical order traversal of the binary tree.`,
    topics: ['Hash Tables', 'Trees', 'Graphs'],
    difficulty: 'hard',
    examples: `Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: [[9],[3,15],[20],[7]]
Explanation:
Column -1: Only node 9 is in this column.

Column 0: Nodes 3 and 15 are in this column in that order from top to bottom.

Column 1: Only node 20 is in this column.

Column 2: Only node 7 is in this column.


Example 2:
Input: root = [1,2,3,4,5,6,7]
Output: [[4],[2],[1,5,6],[3],[7]]
Explanation:
Column -2: Only node 4 is in this column.

Column -1: Only node 2 is in this column.

Column 0: Nodes 1, 5, and 6 are in this column.

          1 is at the top, so it comes first.

          5 and 6 are at the same position (2, 0), so we order them by their value, 5 before 6.

Column 1: Only node 3 is in this column.

Column 2: Only node 7 is in this column.


Example 3:
Input: root = [1,2,3,4,6,5,7]
Output: [[4],[2],[1,5,6],[3],[7]]
Explanation:
This case is the exact same as example 2, but with nodes 5 and 6 swapped.

Note that the solution remains the same since 5 and 6 are in the same location and should be ordered by their values.


Constraints:
The number of nodes in the tree is in the range \`[1, 1000]\`.

\`0 <= Node.val <= 1000\``,
    pseudocode: '',
  },
  {
    title: `Smallest Range Covering Elements from K Lists`,
    description: `You have \`k\` lists of sorted integers in non-decreasing order. Find the smallest range that includes at least one number from each of the \`k\` lists.

We define the range \`[a, b]\` is smaller than range \`[c, d]\` if \`b - a < d - c\` or \`a < c\` if \`b - a == d - c\`.`,
    topics: ['Hash Tables', 'Searching', 'Strings'],
    difficulty: 'hard',
    examples: `Example 1:
Input: nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]
Output: [20,24]
Explanation: 
List 1: [4, 10, 15, 24,26], 24 is in range [20,24].

List 2: [0, 9, 12, 20], 20 is in range [20,24].

List 3: [5, 18, 22, 30], 22 is in range [20,24].


Example 2:
Input: nums = [[1,2,3],[1,2,3],[1,2,3]]
Output: [1,1]

Example 3:
Input: nums = [[10,10],[11,11]]
Output: [10,11]

Example 4:
Input: nums = [[10],[11]]
Output: [10,11]

Example 5:
Input: nums = [[1],[2],[3],[4],[5],[6],[7]]
Output: [1,7]

Constraints:
\`nums.length == k\`
\`1 <= k <= 3500\`
\`1 <= nums[i].length <= 50\`
\`-105 <= nums[i][j] <= 105\`
\`nums[i]\` is sorted in non-decreasing order.`,
    pseudocode: '',
  },
  {
    title: `Unique Paths III`,
    description: `On a 2-dimensional \`grid\`, there are 4 types of squares:
\`1\` represents the starting square.  There is exactly one starting square.

\`2\` represents the ending square.  There is exactly one ending square.

\`0\` represents empty squares we can walk over.

\`-1\` represents obstacles that we cannot walk over.

Return the number of 4-directional walks from the starting square to the ending square, that walk over every non-obstacle square exactly once.`,
    topics: ['Graphs'],
    difficulty: 'hard',
    examples: `Example 1:
Input: [[1,0,0,0],[0,0,0,0],[0,0,2,-1]]
Output: 2
Explanation: We have the following two paths: 
1. (0,0),(0,1),(0,2),(0,3),(1,3),(1,2),(1,1),(1,0),(2,0),(2,1),(2,2)
2. (0,0),(1,0),(2,0),(2,1),(1,1),(0,1),(0,2),(0,3),(1,3),(1,2),(2,2)

Example 2:
Input: [[1,0,0,0],[0,0,0,0],[0,0,0,2]]
Output: 4
Explanation: We have the following four paths: 
1. (0,0),(0,1),(0,2),(0,3),(1,3),(1,2),(1,1),(1,0),(2,0),(2,1),(2,2),(2,3)
2. (0,0),(0,1),(1,1),(1,0),(2,0),(2,1),(2,2),(1,2),(0,2),(0,3),(1,3),(2,3)
3. (0,0),(1,0),(2,0),(2,1),(2,2),(1,2),(1,1),(0,1),(0,2),(0,3),(1,3),(2,3)
4. (0,0),(1,0),(2,0),(2,1),(1,1),(0,1),(0,2),(0,3),(1,3),(1,2),(2,2),(2,3)

Example 3:
Input: [[0,1],[2,0]]
Output: 0
Explanation: 
There is no path that walks over every empty square exactly once.

Note that the starting and ending square can be anywhere in the grid.

Note:
\`1 <= grid.length * grid[0].length <= 20\``,
    pseudocode: '',
  },
  {
    title: `Super Egg Drop`,
    description: `You are given \`k\` identical eggs and you have access to a building with \`n\` floors labeled from \`1\` to \`n\`.

You know that there exists a floor \`f\` where \`0 <= f <= n\` such that any egg dropped at a floor higher than \`f\` will break, and any egg dropped at or below floor \`f\` will not break.

Each move, you may take an unbroken egg and drop it from any floor \`x\` (where \`1 <= x <= n\`). If the egg breaks, you can no longer use it. However, if the egg does not break, you may reuse it in future moves.

Return the minimum number of moves that you need to determine with certainty what the value of \`f\` is.`,
    topics: ['Searching', 'Dynamic Programming'],
    difficulty: 'hard',
    examples: `Example 1:
Input: k = 1, n = 2
Output: 2
Explanation: 
Drop the egg from floor 1. If it breaks, we know that f = 0.

Otherwise, drop the egg from floor 2. If it breaks, we know that f = 1.

If it does not break, then we know f = 2.

Hence, we need at minimum 2 moves to determine with certainty what the value of f is.


Example 2:
Input: k = 2, n = 6
Output: 3

Example 3:
Input: k = 3, n = 14
Output: 4

Constraints:
\`1 <= k <= 100\`
\`1 <= n <= 104\``,
    pseudocode: '',
  },
  {
    title: `Reverse Pairs`,
    description: `Given an array \`nums\`, we call \`(i, j)\` an important reverse pair if \`i < j\` and \`nums[i] > 2*nums[j]\`.

You need to return the number of important reverse pairs in the given array.`,
    topics: ['Searching', 'Sorting'],
    difficulty: 'hard',
    examples: `Example1:
Input: [1,3,2,3,1]
Output: 2

Example2:
Input: [2,4,3,5,1]
Output: 3
Note:
The length of the given array will not exceed \`50,000\`.

All the numbers in the input array are in the range of 32-bit integer.`,
    pseudocode: `def reversePairs(nums):
    count = [0]

    def merge_sort(arr):
        if len(arr) <= 1:
            return arr
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        # Count important reverse pairs
        j = 0
        for i in range(len(left)):
            while j < len(right) and left[i] > 2 * right[j]:
                j += 1
            count[0] += j
        # Standard merge
        merged = []
        i = j = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                merged.append(left[i])
                i += 1
            else:
                merged.append(right[j])
                j += 1
        merged.extend(left[i:])
        merged.extend(right[j:])
        return merged

    merge_sort(nums)
    return count[0]

# Approach: Merge Sort with pair counting
# Time Complexity: O(n log n)
# Space Complexity: O(n)`,
  },
  {
    title: `Find K-th Smallest Pair Distance`,
    description: `Given an integer array, return the k-th smallest distance among all the pairs. The distance of a pair (A, B) is defined as the absolute difference between A and B.`,
    topics: ['Arrays', 'Searching'],
    difficulty: 'hard',
    examples: `Example 1:
Input:
nums = [1,3,1]
k = 1
Output: 0 
Explanation:
Here are all the pairs:
(1,3) -> 2
(1,1) -> 0
(3,1) -> 2
Then the 1st smallest distance pair is (1,1), and its distance is 0.

Note:
\`2 <= len(nums) <= 10000\`.

\`0 <= nums[i] < 1000000\`.

\`1 <= k <= len(nums) * (len(nums) - 1) / 2\`.`,
    pseudocode: '',
  },
];

async function seed() {
  await initDb();

  await pool.query('TRUNCATE questions RESTART IDENTITY');

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
