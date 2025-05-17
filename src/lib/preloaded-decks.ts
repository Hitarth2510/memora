import type { PreloadedDeck } from './types';

export const preloadedDecks: PreloadedDeck[] = [
  {
    id: 'python-basics',
    name: 'Python Basics',
    description: 'Fundamental concepts of Python programming language.',
    category: 'Programming',
    cards: [
      { front: 'What is Python?', back: 'Python is a high-level, interpreted programming language known for its readability and versatility.' },
      { front: 'What are variables in Python?', back: 'Variables are used to store data values. Python has no command for declaring a variable; it is created the moment you first assign a value to it.' },
      { front: 'What is a list in Python?', back: 'A list is a collection which is ordered and changeable. Allows duplicate members. Written with square brackets.' },
      { front: 'What is a dictionary in Python?', back: 'A dictionary is a collection which is unordered, changeable and indexed. No duplicate members. Written with curly braces, and have keys and values.' },
      { front: 'How do you write a comment in Python?', back: 'Comments start with a `#`, and Python will ignore them.' },
      { front: '`print("Hello, World!")`\n\nWhat does this Python code do?', back: 'It outputs the string "Hello, World!" to the console.' },
      { 
        front: 'What is the output of `len(["apple", "banana", "cherry"])`?', 
        back: 'The output is `3`, as `len()` returns the number of items in a list.' 
      },
    ],
  },
  {
    id: 'world-capitals',
    name: 'World Capitals',
    description: 'Test your knowledge of world capitals.',
    category: 'Geography',
    cards: [
      { front: 'What is the capital of France?', back: 'Paris' },
      { front: 'What is the capital of Japan?', back: 'Tokyo' },
      { front: 'What is the capital of Canada?', back: 'Ottawa' },
      { front: 'What is the capital of Australia?', back: 'Canberra' },
      { front: 'What is the capital of Germany?', back: 'Berlin' },
      { front: 'What is the capital of Brazil?', back: 'Brasília' },
      { 
        front: 'Which city is the capital of Italy?', 
        back: 'Rome',
        frontImageUrl: 'https://placehold.co/300x200.png',
        backImageUrl: 'https://placehold.co/300x200.png',
      },
    ],
  },
  {
    id: 'basic-math',
    name: 'Basic Math Operations',
    description: 'Fundamental mathematical operations and concepts.',
    category: 'Mathematics',
    cards: [
      { front: 'What is 2 + 2?', back: '4' },
      { front: 'What is 10 - 3?', back: '7' },
      { front: 'What is 5 * 4?', back: '20' },
      { front: 'What is 12 / 3?', back: '4' },
      { front: 'What is the square root of 9?', back: '3' },
      { front: 'Simplify: `(3 + 5) * 2`', back: 'The result is `16`.' },
    ],
  },
  {
    id: 'us-history-early',
    name: 'Early US History Facts',
    description: 'Key events and figures in early United States history.',
    category: 'History',
    cards: [
      { front: 'In what year was the Declaration of Independence signed?', back: '1776' },
      { front: 'Who was the first President of the United States?', back: 'George Washington' },
      { front: 'The US Constitution was ratified in which year?', back: '1788 (It was written in 1787, but ratification completed in 1788, and it went into effect in 1789)' },
      { front: 'What was the primary cause of the American Revolutionary War?', back: 'Issues of taxation without representation, and British control over colonial affairs.' },
      { 
        front: 'The image shows the signing of which important document?', 
        back: 'The Declaration of Independence.',
        frontImageUrl: 'https://placehold.co/400x250.png',
      },
    ],
  },
];
