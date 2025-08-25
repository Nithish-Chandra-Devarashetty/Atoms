export const reactData = {
  url: "https://youtu.be/CgkZ7MvWUAA",
  title: "React Quiz: Core Concepts",
  subjectInfo: {
    title: "React",
    description: "Learn the fundamentals and advanced concepts of React, a popular JavaScript library for building user interfaces.",
    color: "from-blue-400 to-indigo-500"
  },
  videos: [
    {
      id: "1",
      title: "React Core Concepts",
      url: "https://youtu.be/CgkZ7MvWUAA",
      duration: "4:43:02",
      watched: false
    }
  ],
  quizzes: {
    "1": [
      {
        question: "What is the Virtual DOM in React?",
        options: [
          "A different browser window",
          "An in-memory representation of the real DOM, allowing React to update only what’s necessary",
          "A new feature of JavaScript",
          "The entire webpage"
        ],
        correct: 1
      },
      {
        question: "What are the differences between functional and class components in React?",
        options: [
          "Only class components can use JSX",
          "Functional components can use hooks and are generally simpler, while class components use lifecycle methods and have more boilerplate",
          "Class components run faster",
          "There is no difference"
        ],
        correct: 1
      },
      {
        question: "Which hook manages state in a functional component?",
        options: [
          "useState",
          "useContext",
          "useRef",
          "useEffect"
        ],
        correct: 0
      },
      {
        question: "What is the purpose of the useEffect hook?",
        options: [
          "To manage state",
          "To perform side effects (such as data fetching, subscriptions) in functional components",
          "To create new JSX elements",
          "To render arrays"
        ],
        correct: 1
      },
      {
        question: "What are props in React?",
        options: [
          "Properties that allow data to be passed from parent to child components",
          "Values stored locally in a component",
          "Only available in class components",
          "Used to store CSS"
        ],
        correct: 0
      },
      {
        question: "What is 'lifting state up' in React?",
        options: [
          "Moving a state variable from a child component to a parent component to share it among multiple children",
          "Deleting state variables",
          "Changing prop values",
          "Passing state to the Redux store"
        ],
        correct: 0
      },
      {
        question: "How can you optimize performance in React applications?",
        options: [
          "By using useMemo, React.memo, and lazy loading",
          "By writing all your code in one component",
          "By not using hooks",
          "By avoiding state"
        ],
        correct: 0
      },
      {
        question: "What is lazy loading and why is it useful?",
        options: [
          "Loading images at the end of the page",
          "Loading components only when they are needed, reducing the initial load time",
          "Loading everything upfront",
          "Caching data"
        ],
        correct: 1
      },
      {
        question: "What is React Router used for?",
        options: [
          "Managing and navigating between views/routes in a single page application",
          "Optimizing images",
          "Storing user data",
          "Creating API endpoints"
        ],
        correct: 0
      },
      {
        question: "How do you make a component respond to user input in React?",
        options: [
          "Use state, update it via setState or useState, and attach event handlers like onClick",
          "Use getElementById",
          "Use AJAX",
          "Only with Redux"
        ],
        correct: 0
      },
      {
        question: "What is JSX and why is it used in React?",
        options: [
          "JavaScript extension for server-side",
          "Syntax extension for JavaScript, allowing HTML to be written in JS",
          "Styling language",
          "Replaces CSS"
        ],
        correct: 1
      },
      {
        question: "Why are keys important in lists rendered with .map() in React?",
        options: [
          "They make the list look good",
          "Keys help React identify which items have changed, are added, or are removed",
          "Keys are only used for sorting",
          "No importance"
        ],
        correct: 1
      },
      {
        question: "What are controlled components in React?",
        options: [
          "Form elements controlled by the DOM",
          "Form elements whose values are controlled by React state",
          "Components that always re-render",
          "Components with no props"
        ],
        correct: 1
      },
      {
        question: "What is Context API used for?",
        options: [
          "Styling components",
          "Passing data deeply without prop drilling",
          "Handling HTTP requests",
          "Routing"
        ],
        correct: 1
      },
      {
        question: "What is the difference between state and props in React?",
        options: [
          "State is used for CSS, props for JavaScript",
          "State is mutable and local to the component; props are immutable and passed from parent",
          "State can only be used in functional components",
          "No difference"
        ],
        correct: 1
      },
      {
        question: "What does useReducer do in React?",
        options: [
          "Used for animation",
          "Manages complex state logic in functional components, similar to Redux",
          "Uses AJAX for fetching",
          "Updates CSS dynamically"
        ],
        correct: 1
      },
      {
        question: "What is an error boundary in React?",
        options: [
          "A component that prevents network errors",
          "Component that catches JavaScript errors in its child tree and displays a fallback UI",
          "Function to debug",
          "Handles authentication"
        ],
        correct: 1
      },
      {
        question: "What is React.memo and why is it used?",
        options: [
          "Alternate to useRef",
          "Higher-order component to memoize functional components and prevent unnecessary re-renders",
          "Creates routes",
          "Performs AJAX requests"
        ],
        correct: 1
      },
      {
        question: "What is useRef used for?",
        options: [
          "Creating state variables",
          "Accessing DOM elements or persisting values across renders without causing re-renders",
          "Adding styles",
          "Sending HTTP requests"
        ],
        correct: 1
      },
      {
        question: "What does code splitting mean in React?",
        options: [
          "Splitting code into different languages",
          "Breaking large bundles into smaller chunks loaded on demand for performance",
          "Splitting JSX and CSS",
          "Requires Redux"
        ],
        correct: 1
      }
    ]
  },
  projectIdeas: []
};