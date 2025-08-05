import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Award, ArrowLeft } from 'lucide-react';
import { operatingSystemTopics } from '../data/operatingSystems';
import { TopicData, Concept } from '../types/topic';

const schedulingAlgorithmsData: TopicData = {
  id: 'scheduling-algorithms',
  title: 'Scheduling Algorithms in Operating Systems',
  description: 'Understanding different CPU scheduling algorithms and their characteristics in operating systems.',
  concepts: [
    {
      id: 'cpu-scheduling',
      title: 'What is CPU Scheduling?',
      content: (
        <>
          <p>CPU Scheduling is the process which determines the process which will own the CPU for execution while other processes are in the queue. Whenever the CPU is idle, the Operating System selects one of the process which is ready in the queue. This task is carried out by CPU scheduler which selects one of the processes in memory that is ready for execution.</p>
          <p>Scheduling is used to increase the efficiency of CPU. CPU Scheduling is implemented to minimize Waiting Time, Response Time, and turnaround time and maximize CPU utilization and Throughput.</p>
        </>
      ),
      duration: '8 min read'
    },
    {
      id: 'scheduling-types',
      title: 'Types of CPU Scheduling',
      content: (
        <>
          <p>There are 2 main types of CPU Scheduling:</p>
          <ol>
            <li><strong>Pre-emptive Scheduling:</strong> A priority based approach where higher priority tasks can interrupt lower priority ones.</li>
            <li><strong>Non Pre-emptive Scheduling:</strong> Once a process starts executing, it keeps the CPU until it completes or switches to waiting state.</li>
          </ol>
        </>
      ),
      duration: '7 min read'
    },
    {
      id: 'scheduling-terminology',
      title: 'Scheduling Terminologies',
      content: (
        <>
          <ul className="space-y-2">
            <li><strong>CPU Time:</strong> Time taken by CPU to execute the process</li>
            <li><strong>I/O Time:</strong> Time taken by process to execute I/O operations</li>
            <li><strong>Burst Time:</strong> Time taken by process to complete its execution on CPU</li>
            <li><strong>Arrival Time:</strong> When a process enters ready state</li>
            <li><strong>Completion Time:</strong> When a process completes execution</li>
            <li><strong>Response Time:</strong> Time from process arrival to first CPU allocation</li>
            <li><strong>Waiting Time:</strong> Total time spent in ready state</li>
            <li><strong>Turnaround Time:</strong> Total time from arrival to completion</li>
            <li><strong>Throughput:</strong> Number of processes executed per time unit</li>
          </ul>
        </>
      ),
      duration: '10 min read'
    },
    {
      id: 'scheduling-algorithms',
      title: 'Types of CPU Scheduling Algorithms',
      content: (
        <>
          <p>There are 6 main types of CPU Scheduling Algorithms:</p>
          <ol className="space-y-4">
            <li>
              <strong>FCFS (First Come First Serve)</strong>
              <ul className="ml-6 list-disc mt-2 space-y-1">
                <li>Simple FIFO queue implementation</li>
                <li>Poor performance for short processes behind long ones</li>
                <li>No starvation</li>
              </ul>
            </li>
            <li>
              <strong>SJF (Shortest Job First)</strong>
              <ul className="ml-6 list-disc mt-2 space-y-1">
                <li>Process with shortest burst time executes first</li>
                <li>Can be preemptive or non-preemptive</li>
                <li>Optimal for minimizing average waiting time</li>
              </ul>
            </li>
            <li>
              <strong>SRT (Shortest Remaining Time)</strong>
              <ul className="ml-6 list-disc mt-2 space-y-1">
                <li>Preemptive version of SJF</li>
                <li>Process with shortest remaining time executes next</li>
              </ul>
            </li>
            <li>
              <strong>RR (Round Robin)</strong>
              <ul className="ml-6 list-disc mt-2 space-y-1">
                <li>Each process gets a fixed time quantum</li>
                <li>Good for time-sharing systems</li>
                <li>No starvation</li>
              </ul>
            </li>
            <li>
              <strong>Priority Scheduling</strong>
              <ul className="ml-6 list-disc mt-2 space-y-1">
                <li>Processes executed based on priority</li>
                <li>Can lead to starvation of lower priority processes</li>
              </ul>
            </li>
            <li>
              <strong>Multilevel Queue Scheduling</strong>
              <ul className="ml-6 list-disc mt-2 space-y-1">
                <li>Multiple ready queues with different priorities</li>
                <li>Each queue can have its own scheduling algorithm</li>
              </ul>
            </li>
          </ol>
        </>
      ),
      duration: '15 min read'
    },
    {
      id: 'algorithm-comparison',
      title: 'Algorithm Comparison',
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left border">Algorithm</th>
                <th className="px-4 py-2 text-left border">CPU Utilization</th>
                <th className="px-4 py-2 text-left border">Throughput</th>
                <th className="px-4 py-2 text-left border">Turnaround Time</th>
                <th className="px-4 py-2 text-left border">Waiting Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border">FCFS</td>
                <td className="px-4 py-2 border">Low</td>
                <td className="px-4 py-2 border">Low</td>
                <td className="px-4 py-2 border">High</td>
                <td className="px-4 py-2 border">High</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 border">SJF</td>
                <td className="px-4 py-2 border">High</td>
                <td className="px-4 py-2 border">High</td>
                <td className="px-4 py-2 border">Low</td>
                <td className="px-4 py-2 border">Low</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">RR</td>
                <td className="px-4 py-2 border">Medium</td>
                <td className="px-4 py-2 border">Medium</td>
                <td className="px-4 py-2 border">Medium</td>
                <td className="px-4 py-2 border">Medium</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
      duration: '10 min read'
    }
  ],
  quiz: [
    {
      id: 1,
      question: 'What is the main purpose of CPU Scheduling?',
      options: [
        'To maximize CPU utilization',
        'To minimize response time',
        'To ensure fair allocation of CPU',
        'All of the above'
      ],
      correctAnswer: 'All of the above',
      explanation: 'CPU Scheduling aims to optimize CPU utilization, minimize response time, and ensure fair allocation of CPU resources.'
    },
    {
      id: 2,
      question: 'Which scheduling algorithm is most suitable for time-sharing systems?',
      options: [
        'FCFS',
        'SJF',
        'Round Robin',
        'Priority Scheduling'
      ],
      correctAnswer: 'Round Robin',
      explanation: 'Round Robin is specifically designed for time-sharing systems as it provides equal time slices to each process.'
    },
    {
      id: 3,
      question: 'What is the main disadvantage of the FCFS scheduling algorithm?',
      options: [
        'High average waiting time',
        'Complex implementation',
        'Starvation of processes',
        'High context switching overhead'
      ],
      correctAnswer: 'High average waiting time',
      explanation: 'FCFS can lead to the convoy effect where short processes wait for one long process to complete, increasing average waiting time.'
    },
    {
      id: 4,
      question: 'Which scheduling algorithm is optimal in terms of minimizing average waiting time?',
      options: [
        'FCFS',
        'SJF',
        'Round Robin',
        'Priority Scheduling'
      ],
      correctAnswer: 'SJF',
      explanation: 'SJF (Shortest Job First) is proven to be optimal for minimizing average waiting time, though it requires knowing the burst times in advance.'
    },
    {
      id: 5,
      question: 'What is the main advantage of Priority Scheduling?',
      options: [
        'Simple to implement',
        'Good for real-time systems',
        'No starvation',
        'Minimizes context switches'
      ],
      correctAnswer: 'Good for real-time systems',
      explanation: 'Priority Scheduling is particularly useful in real-time systems where certain processes must be executed before others based on their priority.'
    }
  ]
};

const processManagementData: TopicData = {
  id: 'process-management',
  title: 'Process Management in Operating Systems',
  description: 'Understanding how operating systems manage processes, scheduling, and resource allocation.',
  concepts: [
    {
      id: 'what-is-process',
      title: 'What is a Process?',
      content: (
        <>
          <p>A process is an instance of a program that is being executed. It includes the following key components:</p>
          <ul>
            <li><strong>Program Code (Text Section):</strong> The actual code of the program.</li>
            <li><strong>Data Section:</strong> Includes global and static variables used by the program.</li>
            <li><strong>Heap:</strong> Dynamically allocated memory during runtime.</li>
            <li><strong>Stack:</strong> Memory that contains function parameters, return addresses, and local variables.</li>
            <li><strong>Process Control Block (PCB):</strong> A data structure that contains information about the process, such as its state, program counter, registers, and scheduling information.</li>
          </ul>
        </>
      ),

      duration: '8 min read'
    },
    {
      id: 'process-types',
      title: 'Types of Processes',
      content: (
        <>
          <p>Processes can be categorized into different types based on their functionality and interaction with users:</p>
          <ol>
            <li><strong>User Processes:</strong> Initiated and executed by the user (e.g., web browsers, text editors).</li>
            <li><strong>System Processes:</strong> Essential for OS functioning, running in background.</li>
            <li><strong>Foreground Processes:</strong> Interact directly with the user through a user interface.</li>
            <li><strong>Background Processes:</strong> Run without direct user interaction, handling system maintenance tasks.</li>
          </ol>
        </>
      ),
      duration: '7 min read'
    },
    {
      id: 'process-states',
      title: 'Process States',
      content: (
        <>
          <p>A process goes through several states during its lifecycle:</p>
          <ol>
            <li><strong>New:</strong> The process is being created.</li>
            <li><strong>Ready:</strong> Process is prepared to run, waiting for CPU time.</li>
            <li><strong>Running:</strong> Process is currently being executed by the CPU.</li>
            <li><strong>Waiting:</strong> Process is waiting for an event (e.g., I/O completion).</li>
            <li><strong>Terminated:</strong> Process has finished execution.</li>
          </ol>
          <p>The operating system manages these state transitions to ensure efficient process execution.</p>
        </>
      ),
      duration: '7 min read'
    },
    {
      id: 'pcb',
      title: 'Process Control Block (PCB)',
      content: (
        <>
          <p>The PCB is a crucial data structure that contains all necessary information about a process:</p>
          <ul>
            <li><strong>Process ID (PID):</strong> Unique identifier</li>
            <li><strong>Process State:</strong> Current state (ready, running, etc.)</li>
            <li><strong>Program Counter:</strong> Address of next instruction</li>
            <li><strong>CPU Registers:</strong> Current register values</li>
            <li><strong>Memory Management:</strong> Memory allocation details</li>
            <li><strong>Scheduling Info:</strong> Priority, scheduling queues</li>
            <li><strong>I/O Status:</strong> List of I/O devices allocated</li>
          </ul>
          <p>The PCB is essential for context switching between processes.</p>
        </>
      ),
      duration: '8 min read'
    },
    {
      id: 'scheduling',
      title: 'Process Scheduling',
      content: (
        <>
          <p>Process scheduling determines which process runs on the CPU:</p>
          <p><strong>Scheduling Types:</strong></p>
          <ul>
            <li><strong>Preemptive:</strong> OS can suspend running processes (e.g., Round Robin)</li>
            <li><strong>Non-preemptive:</strong> Process runs to completion (e.g., FCFS)</li>
          </ul>
          <p><strong>Common Algorithms:</strong></p>
          <ul>
            <li>First-Come, First-Served (FCFS)</li>
            <li>Shortest Job Next (SJN)</li>
            <li>Priority Scheduling</li>
            <li>Round Robin (RR)</li>
          </ul>
        </>
      ),
      duration: '9 min read'
    },
    {
      id: 'ipc',
      title: 'Interprocess Communication (IPC)',
      content: (
        <>
          <p>IPC mechanisms enable processes to communicate and coordinate:</p>
          <ol>
            <li><strong>Shared Memory:</strong> Fastest method, processes share memory region</li>
            <li><strong>Message Passing:</strong> Processes communicate by sending/receiving messages</li>
            <li><strong>Pipes:</strong> Unidirectional data flow between processes</li>
            <li><strong>Semaphores/Mutexes:</strong> Synchronization primitives to prevent race conditions</li>
          </ol>
        </>
      ),
      duration: '8 min read'
    },
    {
      id: 'synchronization',
      title: 'Process Synchronization',
      content: (
        <>
          <p>Critical for managing access to shared resources:</p>
          <p><strong>Critical Section:</strong> Code segment accessing shared resources</p>
          <p><strong>Synchronization Tools:</strong></p>
          <ul>
            <li>Mutex Locks</li>
            <li>Semaphores</li>
            <li>Monitors</li>
            <li>Condition Variables</li>
          </ul>
          <p>Prevents race conditions and ensures data consistency.</p>
        </>
      ),
      duration: '8 min read'
    },
    {
      id: 'deadlocks',
      title: 'Deadlocks',
      content: (
        <>
          <p>A deadlock occurs when processes are blocked waiting for resources held by each other.</p>
          <p><strong>Necessary Conditions:</strong></p>
          <ol>
            <li>Mutual Exclusion</li>
            <li>Hold and Wait</li>
            <li>No Preemption</li>
            <li>Circular Wait</li>
          </ol>
          <p><strong>Handling Methods:</strong></p>
          <ul>
            <li>Prevention</li>
            <li>Avoidance (Banker's Algorithm)</li>
            <li>Detection & Recovery</li>
          </ul>
        </>
      ),
      duration: '8 min read'
    }
  ],
  quiz: [
    {
      id: 1,
      question: 'What is a process in an operating system?',
      options: [
        'A program written in high-level language',
        'An entity that can be loaded into the main memory',
        'A program in execution',
        'A part of the compiler'
      ],
      correctAnswer: 'A program in execution',
      explanation: 'A process is a running instance of a program with its own address space and resources.'
    },
    {
      id: 2,
      question: 'Which component of the OS maintains information about processes?',
      options: [
        'Stack',
        'Process Table',
        'Page Table',
        'File Descriptor'
      ],
      correctAnswer: 'Process Table',
      explanation: 'The process table stores all PCBs (Process Control Blocks), which contain info like PID, state, registers, etc.'
    },
    // Add remaining quiz questions here...
  ]
};

export const TopicPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  
  // Get the appropriate topic data based on the topicId
  const topic = operatingSystemTopics[topicId || ''] || processManagementData;
  
  // Track read concepts
  const [conceptsRead] = useState<Set<string>>(
    new Set(topic.concepts.map((c: Concept) => c.id))
  );
  
  // Use conceptsRead to avoid lint warning
  console.debug('Read concepts:', conceptsRead);

  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [topicCompleted, setTopicCompleted] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleAnswer = (): void => {
    const currentQ = topic.quiz[currentQuestion];
    if (selectedOption === currentQ.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    if (currentQuestion < topic.quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleFinishQuiz = () => {
    // Mark the topic as completed
    setTopicCompleted(true);
    setShowQuiz(false);
    
    // Save completion status to localStorage
    const completedTopics = JSON.parse(localStorage.getItem('completedTopics') || '{}');
    completedTopics[topicId || ''] = true;
    localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
    
    // Update the parent component's state if needed
    // This would require passing a callback prop or using a state management solution
  };

  if (showQuiz) {
    if (quizCompleted) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Quiz Completed!</h2>
            <div className="text-center py-8">
              <Award className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <p className="text-xl font-semibold mb-2">Your Score: {score} / {topic.quiz.length}</p>
              <p className="text-gray-600 mb-6">
                {score === topic.quiz.length 
                  ? 'Perfect! You aced the quiz! 🎉' 
                  : score >= topic.quiz.length / 2 
                    ? 'Good job! You passed the quiz! ✅' 
                    : 'Keep practicing! You\'ll do better next time! 💪'}
              </p>
              <button
                onClick={handleFinishQuiz}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Topic
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentQ = topic.quiz[currentQuestion];
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Quiz: {topic.title}</h2>
            <span className="text-gray-500">Question {currentQuestion + 1} of {topic.quiz.length}</span>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
            <div className="space-y-3">
              {currentQ.options.map((option: string, index: number) => (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOption === option 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowQuiz(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Back to Concepts
            </button>
            <button
              onClick={handleAnswer}
              disabled={!selectedOption}
              className={`px-4 py-2 rounded-lg ${
                selectedOption 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentQuestion === topic.quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBackClick = () => {
    if (topicId?.startsWith('os-')) {
      navigate('/os-topics');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to {topicId?.startsWith('os-') ? 'OS Topics' : 'Topics'}
      </button>
      <div className="bg-white rounded-xl shadow-md p-8">
        {topicCompleted ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Topic Completed! 🎉</h3>
            <p className="text-gray-600 mb-6">
              You've successfully completed this topic and passed the quiz with a score of {score}/{topic.quiz.length}.
            </p>
            <button
              onClick={() => setTopicCompleted(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Review Content
            </button>
          </div>
        ) : showQuiz ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Quiz: {topic.title}</h2>
              <span className="text-gray-500">Question {currentQuestion + 1} of {topic.quiz.length}</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">{topic.quiz[currentQuestion].question}</h3>
              <div className="space-y-3">
                {topic.quiz[currentQuestion].options.map((option: string, index: number) => (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOption === option 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </div>
              ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowQuiz(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Back to Content
              </button>
              <button
                onClick={handleAnswer}
                disabled={!selectedOption}
                className={`px-4 py-2 rounded-lg ${
                  selectedOption 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestion === topic.quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-6">{topic.title}</h1>
            <p className="text-gray-600 mb-8 text-lg">{topic.description}</p>
            
            <div className="prose max-w-none space-y-6 text-gray-700">
              {topic.concepts.map((concept: Concept, index: number) => (
              <div key={concept.id} className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {index + 1}. {concept.title}
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {typeof concept.content === 'string' ? (
                    concept.content.split('\n\n').map((paragraph: string, i: number) => (
                      <p key={i} className="text-justify">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <div className="space-y-4">
                      {concept.content}
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200">
              <button
                onClick={handleStartQuiz}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg"
              >
                I'm Ready for the Quiz
              </button>
              <div className="mt-3 text-sm text-gray-500 flex items-center justify-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Estimated time: {topic.concepts.length * 5} minutes</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicPage;
