export interface Topic {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  quiz: QuizQuestion[];
  completed: boolean;
  readUrl?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export const osTopics: Topic[] = [
  {
    id: 'process-management',
    title: 'Process Management',
    description: 'Understanding processes, threads, and process lifecycle',
    completed: false,
    readUrl: 'https://medium.com/@akhandmishra/operating-system-process-and-process-management-108d83e8ce60',
    concepts: [
      'Process vs Thread',
      'Process Life Cycle (New, Ready, Running, Waiting, Terminated)',
      'Context Switching',
      'Process Control Block (PCB)',
      'Types of Scheduling: Preemptive vs Non-preemptive',
      'Inter-Process Communication (IPC): Shared memory, Message passing'
    ],
    quiz: [
      {
        question: 'What is the main difference between a process and a thread?',
        options: [
          'Processes are faster than threads',
          'Threads share the same memory space, processes have separate memory',
          'Processes can only run on single-core systems',
          'Threads are always more efficient than processes'
        ],
        correct: 1,
        explanation: 'Threads share the same memory space within a process, while processes have separate memory spaces.'
      },
      {
        question: 'Which state does a process enter when it is waiting for I/O?',
        options: ['Ready', 'Running', 'Waiting', 'Terminated'],
        correct: 2,
        explanation: 'When a process is waiting for I/O operations to complete, it enters the Waiting state.'
      },
      {
        question: 'What is the purpose of a Process Control Block (PCB)?',
        options: [
          'To store only the process ID',
          'To store all information about a process including state, registers, memory limits',
          'To control the CPU directly',
          'To manage only the process name'
        ],
        correct: 1,
        explanation: 'PCB stores all information about a process including its state, CPU registers, memory limits, and other details needed for process management.'
      }
    ]
  },
  {
    id: 'cpu-scheduling',
    title: 'CPU Scheduling Algorithms',
    description: 'Different algorithms for CPU scheduling and their characteristics',
    completed: false,
    readUrl: 'https://vsonwalkar3.medium.com/scheduling-algorithms-in-operating-system-bade5f192ca4',
    concepts: [
      'FCFS (First Come First Serve)',
      'SJF (Shortest Job First)',
      'Round Robin',
      'Priority Scheduling',
      'Multilevel Queue Scheduling'
    ],
    quiz: [
      {
        question: 'Which scheduling algorithm is non-preemptive?',
        options: ['Round Robin', 'FCFS', 'Priority Scheduling', 'All of the above'],
        correct: 1,
        explanation: 'FCFS (First Come First Serve) is non-preemptive as it doesn\'t interrupt running processes.'
      },
      {
        question: 'What is the main advantage of Round Robin scheduling?',
        options: [
          'It always gives the shortest waiting time',
          'It provides fair CPU time to all processes',
          'It has the highest throughput',
          'It uses the least memory'
        ],
        correct: 1,
        explanation: 'Round Robin provides fair CPU time to all processes by giving each process a time quantum.'
      },
      {
        question: 'Which algorithm would be best for a system with many short jobs?',
        options: ['FCFS', 'SJF', 'Round Robin', 'Priority Scheduling'],
        correct: 1,
        explanation: 'SJF (Shortest Job First) is optimal for minimizing average waiting time when there are many short jobs.'
      }
    ]
  },
  {
    id: 'thread-concurrency',
    title: 'Thread and Concurrency',
    description: 'Multithreading, synchronization, and deadlock prevention',
    completed: false,
    readUrl: 'https://medium.com/@akhandmishra/operating-system-threads-and-concurrency-aec2036b90f8',
    concepts: [
      'Multithreading vs Multiprocessing',
      'User-level vs Kernel-level threads',
      'Race Conditions',
      'Critical Section Problems',
      'Synchronization Tools: Mutex, Semaphore, Monitors',
      'Deadlock: Necessary Conditions, Detection, Avoidance (Banker\'s Algorithm), Prevention'
    ],
    quiz: [
      {
        question: 'What is a race condition?',
        options: [
          'A condition where threads compete for CPU time',
          'A condition where the outcome depends on the timing of thread execution',
          'A condition where threads are blocked',
          'A condition where threads share memory'
        ],
        correct: 1,
        explanation: 'A race condition occurs when the outcome depends on the relative timing of thread execution.'
      },
      {
        question: 'What is the difference between a mutex and a semaphore?',
        options: [
          'Mutex is faster than semaphore',
          'Mutex allows only one thread, semaphore can allow multiple threads',
          'Semaphore is always binary',
          'There is no difference'
        ],
        correct: 1,
        explanation: 'A mutex allows only one thread to access a resource, while a semaphore can allow multiple threads (up to a specified count).'
      },
      {
        question: 'Which of the following is NOT a necessary condition for deadlock?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'Circular Wait', 'Resource Starvation'],
        correct: 4,
        explanation: 'Resource starvation is not one of the four necessary conditions for deadlock (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait).'
      }
    ]
  },
  {
    id: 'memory-management',
    title: 'Memory Management',
    description: 'Memory allocation, paging, segmentation, and virtual memory',
    completed: false,
    readUrl: 'https://medium.com/@cloud.devops.enthusiast/memory-management-in-os-e076e1ceaadf',
    concepts: [
      'Contiguous Memory Allocation (First Fit, Best Fit, Worst Fit)',
      'Paging',
      'Segmentation',
      'Paging vs Segmentation',
      'Virtual Memory',
      'Demand Paging',
      'Page Replacement Algorithms (FIFO, LRU, Optimal)',
      'Thrashing'
    ],
    quiz: [
      {
        question: 'What is a page fault?',
        options: [
          'When a page is corrupted',
          'When a requested page is not in main memory',
          'When a page is too large',
          'When a page is deleted'
        ],
        correct: 1,
        explanation: 'A page fault occurs when a program tries to access a page that is not currently in main memory.'
      },
      {
        question: 'Which page replacement algorithm replaces the page that has been unused for the longest time?',
        options: ['FIFO', 'LRU', 'Optimal', 'Random'],
        correct: 1,
        explanation: 'LRU (Least Recently Used) replaces the page that has been unused for the longest time.'
      },
      {
        question: 'What is thrashing?',
        options: [
          'When the system crashes',
          'When the CPU is overloaded',
          'When the system spends more time swapping pages than executing',
          'When memory is full'
        ],
        correct: 2,
        explanation: 'Thrashing occurs when the system spends more time swapping pages in and out of memory than executing actual work.'
      }
    ]
  },
  {
    id: 'file-system',
    title: 'File System',
    description: 'File organization, allocation methods, and directory structures',
    completed: false,
    readUrl: 'https://medium.com/@cloud.devops.enthusiast/file-system-in-operating-system-os-b11d292376aa',
    concepts: [
      'File Types and Access Methods (Sequential, Direct, Indexed)',
      'File Allocation Methods: Contiguous, Linked, Indexed',
      'Directory Structures',
      'File System Mounting',
      'File Access Permissions (Unix style: rwx)'
    ],
    quiz: [
      {
        question: 'What is the difference between a hard link and a soft link?',
        options: [
          'Hard links are faster than soft links',
          'Hard links point to the inode, soft links point to the filename',
          'Soft links can cross file systems, hard links cannot',
          'All of the above'
        ],
        correct: 3,
        explanation: 'All statements are correct. Hard links point to the inode, soft links point to the filename, and soft links can cross file systems.'
      },
      {
        question: 'What does the permission "rwxr-xr-x" mean?',
        options: [
          'Owner can read, write, execute; group and others can read and execute',
          'Everyone can read, write, and execute',
          'Only owner can read, write, and execute',
          'No one can access the file'
        ],
        correct: 0,
        explanation: 'rwxr-xr-x means owner has read/write/execute, group has read/execute, others have read/execute permissions.'
      },
      {
        question: 'Which file allocation method is best for random access?',
        options: ['Contiguous', 'Linked', 'Indexed', 'All are equal'],
        correct: 2,
        explanation: 'Indexed allocation is best for random access as it provides direct access to any block through the index.'
      }
    ]
  },
  {
    id: 'io-management',
    title: 'I/O Management',
    description: 'I/O devices, disk scheduling, and buffering',
    completed: false,
    readUrl: 'https://freedium.cfd/https://medium.com/@Kannan91/io-management-in-operating-systems-a-comprehensive-guide-4e6ee6055cf1',
    concepts: [
      'I/O Devices and their interaction with CPU',
      'Polling vs Interrupts vs DMA',
      'Disk Scheduling Algorithms: FCFS, SSTF, SCAN, C-SCAN',
      'Buffering and Caching'
    ],
    quiz: [
      {
        question: 'What is the main advantage of DMA over interrupts?',
        options: [
          'DMA is faster',
          'DMA doesn\'t require CPU intervention for data transfer',
          'DMA uses less memory',
          'DMA is simpler to implement'
        ],
        correct: 1,
        explanation: 'DMA (Direct Memory Access) allows data transfer without CPU intervention, freeing the CPU for other tasks.'
      },
      {
        question: 'Which disk scheduling algorithm moves the disk head in one direction until it reaches the end?',
        options: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN'],
        correct: 2,
        explanation: 'SCAN algorithm moves the disk head in one direction until it reaches the end, then reverses direction.'
      },
      {
        question: 'When would you use buffering?',
        options: [
          'When you want to slow down the system',
          'When there is a speed mismatch between producer and consumer',
          'When memory is unlimited',
          'When you want to increase CPU usage'
        ],
        correct: 1,
        explanation: 'Buffering is used when there is a speed mismatch between the producer and consumer of data.'
      }
    ]
  },
  {
    id: 'deadlock',
    title: 'Deadlock',
    description: 'Deadlock conditions, detection, and prevention strategies',
    completed: false,
    readUrl: 'https://medium.com/@parul947a/deadlocks-in-os-da7634638f5',
    concepts: [
      'Coffman\'s conditions',
      'Resource Allocation Graph (RAG)',
      'Deadlock Detection & Recovery',
      'Banker\'s Algorithm',
      'Deadlock Prevention & Avoidance'
    ],
    quiz: [
      {
        question: 'What are the four necessary conditions for deadlock?',
        options: [
          'Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait',
          'Mutual Exclusion, Hold and Wait, Preemption, Linear Wait',
          'Shared Resources, Hold and Wait, Preemption, Circular Wait',
          'Mutual Exclusion, Release and Wait, No Preemption, Circular Wait'
        ],
        correct: 0,
        explanation: 'The four necessary conditions for deadlock are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.'
      },
      {
        question: 'How does the Banker\'s Algorithm work?',
        options: [
          'It prevents deadlock by avoiding unsafe states',
          'It detects deadlock after it occurs',
          'It breaks deadlock by killing processes',
          'It ignores deadlock completely'
        ],
        correct: 0,
        explanation: 'The Banker\'s Algorithm prevents deadlock by avoiding unsafe states through careful resource allocation.'
      },
      {
        question: 'Is the Banker\'s Algorithm always safe?',
        options: [
          'Yes, it always prevents deadlock',
          'No, it can still lead to deadlock in some cases',
          'It depends on the system configuration',
          'It only works for single-threaded applications'
        ],
        correct: 0,
        explanation: 'Yes, the Banker\'s Algorithm is always safe when properly implemented as it only grants resources when the system remains in a safe state.'
      }
    ]
  },
  {
    id: 'system-calls',
    title: 'System Calls and OS Types',
    description: 'User vs kernel mode, system calls, and operating system types',
    completed: false,
    readUrl: 'https://freedium.cfd/https://medium.com/@teja.ravi474/understanding-system-calls-in-operating-systems-e39535f958b6',
    concepts: [
      'User vs Kernel Mode',
      'System Calls Types (Process control, File management, etc.)',
      'Types of OS: Batch, Time-sharing, Real-time, Distributed, Multi-user'
    ],
    quiz: [
      {
        question: 'What is a system call?',
        options: [
          'A call to the hardware directly',
          'A request to the operating system kernel for a service',
          'A call to another process',
          'A call to the user interface'
        ],
        correct: 1,
        explanation: 'A system call is a request to the operating system kernel for a service that requires privileged access.'
      },
      {
        question: 'How does the OS switch between user and kernel mode?',
        options: [
          'Through a special instruction called a trap or interrupt',
          'By restarting the computer',
          'By changing the user password',
          'By closing all applications'
        ],
        correct: 0,
        explanation: 'The OS switches between user and kernel mode through a special instruction called a trap or interrupt.'
      },
      {
        question: 'Which type of OS is designed for real-time applications?',
        options: ['Batch OS', 'Time-sharing OS', 'Real-time OS', 'Distributed OS'],
        correct: 2,
        explanation: 'Real-time OS is designed for applications that require immediate response to events.'
      }
    ]
  },
  {
    id: 'virtualization',
    title: 'Virtualization and Containers',
    description: 'Virtual machines, hypervisors, and container technology',
    completed: false,
    readUrl: 'https://medium.com/@vinayak-singh/virtual-machines-vs-containers-933f345046d4',
    concepts: [
      'Basics of Virtual Machines',
      'Hypervisors: Type 1 vs Type 2',
      'Docker and Containers vs Virtual Machines'
    ],
    quiz: [
      {
        question: 'What is the difference between Type 1 and Type 2 hypervisors?',
        options: [
          'Type 1 runs on bare metal, Type 2 runs on an OS',
          'Type 1 is faster, Type 2 is slower',
          'Type 1 is free, Type 2 is paid',
          'There is no difference'
        ],
        correct: 0,
        explanation: 'Type 1 hypervisors run directly on bare metal, while Type 2 hypervisors run on top of an operating system.'
      },
      {
        question: 'What is the main advantage of containers over virtual machines?',
        options: [
          'Containers are more secure',
          'Containers share the host OS kernel and are lighter',
          'Containers are always faster',
          'Containers can run any OS'
        ],
        correct: 1,
        explanation: 'Containers share the host OS kernel and are much lighter than virtual machines, which need their own OS.'
      },
      {
        question: 'Which technology is better for microservices architecture?',
        options: ['Virtual Machines', 'Containers', 'Both are equal', 'Neither'],
        correct: 1,
        explanation: 'Containers are better for microservices architecture due to their lightweight nature and fast startup times.'
      }
    ]
  },
  {
    id: 'linux-commands',
    title: 'Linux Commands',
    description: 'Essential Linux commands and shell scripting basics',
    completed: false,
    readUrl: 'https://freedium.cfd/https://medium.com/@subhampradhan966/linux-fundamentals-and-basic-commands-30a1ea72ea11',
    concepts: [
      'ps, top, kill, nice, chmod, ls -l, df, du',
      'File redirection, piping, background/foreground jobs',
      'Shell scripting basics'
    ],
    quiz: [
      {
        question: 'What does the command "ps aux" show?',
        options: [
          'All running processes with detailed information',
          'Only user processes',
          'Only system processes',
          'Only stopped processes'
        ],
        correct: 0,
        explanation: 'ps aux shows all running processes with detailed information including CPU and memory usage.'
      },
      {
        question: 'What does "chmod 755 filename" do?',
        options: [
          'Gives read/write/execute to owner, read/execute to group and others',
          'Gives all permissions to everyone',
          'Removes all permissions',
          'Makes the file executable only'
        ],
        correct: 0,
        explanation: 'chmod 755 gives read/write/execute (7) to owner, read/execute (5) to group and others.'
      },
      {
        question: 'What does the pipe operator "|" do?',
        options: [
          'Connects two commands where output of first becomes input of second',
          'Creates a new file',
          'Stops the execution of a command',
          'Changes the directory'
        ],
        correct: 0,
        explanation: 'The pipe operator "|" connects two commands where the output of the first command becomes the input of the second command.'
      }
    ]
  }
]; 