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
    quiz : [
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
  },
  {
    question: 'What happens during a context switch?',
    options: [
      'The operating system shuts down the CPU',
      'The process control block of the running process is updated and another process is loaded',
      'The CPU cache is cleared',
      'Threads within a process are terminated'
    ],
    correct: 1,
    explanation: 'During a context switch, the OS saves the state of the current process in its PCB and loads the state of the next process to resume execution.'
  },
  {
    question: 'Which of the following is a preemptive scheduling algorithm?',
    options: ['First Come First Serve (FCFS)', 'Shortest Job Next (SJN)', 'Round Robin (RR)', 'Priority Scheduling (Non-preemptive)'],
    correct: 2,
    explanation: 'Round Robin is a preemptive scheduling algorithm where each process is given a fixed time slice before being preempted.'
  },
  {
    question: 'In process life cycle, which state comes immediately after "New"?',
    options: ['Ready', 'Running', 'Waiting', 'Terminated'],
    correct: 0,
    explanation: 'After a process is created (New state), it moves to Ready state when it is loaded into memory and waits for CPU allocation.'
  },
  {
    question: 'Which inter-process communication (IPC) method requires synchronization for access?',
    options: ['Shared Memory', 'Message Passing', 'Pipes', 'Signals'],
    correct: 0,
    explanation: 'Shared memory allows processes to access the same memory region, which requires synchronization to avoid race conditions.'
  },
  {
    question: 'Which scheduling type allows a process to run until it finishes or voluntarily gives up CPU?',
    options: ['Preemptive', 'Non-preemptive', 'Round Robin', 'Priority Preemptive'],
    correct: 1,
    explanation: 'Non-preemptive scheduling allows a process to run until completion or until it blocks itself.'
  },
  {
    question: 'What does the "Waiting" state in a process life cycle indicate?',
    options: [
      'The process is ready for execution',
      'The process is using the CPU',
      'The process is waiting for an event such as I/O',
      'The process has finished execution'
    ],
    correct: 2,
    explanation: 'A process in the Waiting state is waiting for an external event like I/O completion before it can move to the Ready state.'
  },
  {
    question: 'Which of the following is NOT stored in a Process Control Block (PCB)?',
    options: ['CPU registers', 'Process state', 'I/O information', 'Source code of the process'],
    correct: 3,
    explanation: 'PCB contains process state, program counter, CPU registers, and I/O info, but not the actual source code of the process.'
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
    quiz : [
  {
    question: 'In First Come First Serve (FCFS) scheduling, which process is executed first?',
    options: [
      'The process with the shortest burst time',
      'The process with the highest priority',
      'The process that arrives first in the ready queue',
      'The process with the least waiting time'
    ],
    correct: 2,
    explanation: 'In FCFS, the process that arrives first in the ready queue is executed first, following a queue-like structure (FIFO).'
  },
  {
    question: 'Which of the following is a major disadvantage of Shortest Job First (SJF) scheduling?',
    options: [
      'It leads to poor CPU utilization',
      'It causes starvation of long processes',
      'It does not consider process arrival time',
      'It requires very high memory usage'
    ],
    correct: 1,
    explanation: 'SJF minimizes average waiting time but may cause starvation for processes with long burst times if short jobs keep arriving.'
  },
  {
    question: 'Round Robin scheduling is mainly designed for which type of system?',
    options: [
      'Batch systems',
      'Interactive time-sharing systems',
      'Real-time embedded systems',
      'Multiprocessor systems only'
    ],
    correct: 1,
    explanation: 'Round Robin scheduling is well-suited for interactive time-sharing systems, as it gives each process a fixed time slice in a cyclic order.'
  },
  {
    question: 'In Round Robin scheduling, what happens when a process exceeds its time quantum?',
    options: [
      'It is terminated immediately',
      'It continues running until completion',
      'It is preempted and placed at the end of the ready queue',
      'It gets the highest priority'
    ],
    correct: 2,
    explanation: 'If a process exceeds its time quantum in Round Robin, it is preempted and moved to the end of the ready queue, ensuring fairness among processes.'
  },
  {
    question: 'Which scheduling algorithm may lead to starvation due to indefinite postponement?',
    options: [
      'First Come First Serve (FCFS)',
      'Shortest Job First (SJF)',
      'Round Robin',
      'Priority Scheduling (Non-preemptive)'
    ],
    correct: 3,
    explanation: 'In Priority Scheduling, low-priority processes may suffer starvation if higher-priority processes keep arriving.'
  },
  {
    question: 'Which scheduling algorithm can be implemented with aging to prevent starvation?',
    options: [
      'Priority Scheduling',
      'Round Robin',
      'First Come First Serve',
      'Multilevel Queue Scheduling'
    ],
    correct: 0,
    explanation: 'Priority Scheduling can use aging, where the priority of a waiting process increases over time, to avoid starvation.'
  },
  {
    question: 'In Multilevel Queue Scheduling, how are processes typically divided?',
    options: [
      'By memory usage only',
      'By CPU burst time only',
      'By process type (foreground, background, system, interactive, etc.)',
      'Randomly into different queues'
    ],
    correct: 2,
    explanation: 'In Multilevel Queue Scheduling, processes are divided into multiple queues based on type, such as foreground, background, or system processes.'
  },
  {
    question: 'Which scheduling algorithm generally gives the minimum average waiting time if burst times are known in advance?',
    options: [
      'FCFS',
      'SJF (Shortest Job First)',
      'Round Robin',
      'Priority Scheduling'
    ],
    correct: 1,
    explanation: 'SJF is provably optimal for minimizing average waiting time if the CPU burst times are known in advance.'
  },
  {
    question: 'In Priority Scheduling, if two processes have the same priority, which scheduling method is typically used to break the tie?',
    options: [
      'Round Robin',
      'Shortest Job First',
      'First Come First Serve',
      'Random selection'
    ],
    correct: 2,
    explanation: 'When two processes have the same priority, First Come First Serve (FCFS) is usually applied as a tie-breaker.'
  },
  {
    question: 'Which of the following is TRUE about Multilevel Queue Scheduling?',
    options: [
      'A process can move between queues',
      'Each queue has its own scheduling algorithm',
      'It always uses Round Robin in all queues',
      'It is non-preemptive only'
    ],
    correct: 1,
    explanation: 'In Multilevel Queue Scheduling, each queue can have its own scheduling algorithm (e.g., Round Robin for foreground, FCFS for background).'
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
    question: 'What is the main difference between multithreading and multiprocessing?',
    options: [
      'Multithreading uses multiple CPUs, multiprocessing does not',
      'Multithreading allows multiple threads within the same process, multiprocessing uses separate processes',
      'Multiprocessing is faster in all cases',
      'Multithreading requires more memory than multiprocessing'
    ],
    correct: 1,
    explanation: 'Multithreading allows multiple threads to run within the same process (sharing memory), while multiprocessing uses separate processes with isolated memory spaces.'
  },
  {
    question: 'Which is TRUE about user-level threads compared to kernel-level threads?',
    options: [
      'User-level threads are managed by the OS kernel',
      'User-level threads are faster to create and switch',
      'User-level threads can always take advantage of multiple processors',
      'User-level threads require no runtime support'
    ],
    correct: 1,
    explanation: 'User-level threads are managed by a user-level thread library, not the OS. They are faster to create and switch, but cannot always utilize multiple processors effectively.'
  },
  {
    question: 'What causes a race condition?',
    options: [
      'When two processes use different CPUs',
      'When multiple threads access shared data without proper synchronization',
      'When scheduling is always preemptive',
      'When processes are blocked waiting for I/O'
    ],
    correct: 1,
    explanation: 'A race condition occurs when multiple threads or processes access and modify shared data concurrently without proper synchronization, leading to unpredictable results.'
  },
  {
    question: 'Which of the following best describes a critical section problem?',
    options: [
      'A part of code where only one process/thread should execute at a time',
      'A code block that always executes faster',
      'A situation where all processes are waiting indefinitely',
      'A section of code that deals with process creation'
    ],
    correct: 0,
    explanation: 'The critical section problem arises when multiple threads or processes need to access shared resources, and only one should execute the critical section at a time to avoid data inconsistency.'
  },
  {
    question: 'Which synchronization tool allows only one thread to access a resource at a time?',
    options: ['Semaphore', 'Mutex', 'Monitor', 'Spinlock'],
    correct: 1,
    explanation: 'A mutex (mutual exclusion) allows only one thread to lock and access a resource at a time.'
  },
  {
    question: 'Which synchronization tool allows multiple processes to access a finite number of resources?',
    options: ['Mutex', 'Semaphore', 'Monitor', 'Condition Variable'],
    correct: 1,
    explanation: 'A semaphore can be used to allow multiple processes to access a limited number of resource instances, unlike a mutex which only allows one.'
  },
  {
    question: 'Which of the following is NOT a necessary condition for deadlock?',
    options: [
      'Mutual Exclusion',
      'Hold and Wait',
      'Preemption',
      'Circular Wait'
    ],
    correct: 2,
    explanation: 'The four necessary conditions for deadlock are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. "Preemption" alone is not one of them.'
  },
  {
    question: 'In the Banker\'s Algorithm, what is the main goal?',
    options: [
      'To detect a deadlock once it occurs',
      'To avoid deadlock by ensuring the system never enters an unsafe state',
      'To prevent starvation in scheduling',
      'To speed up context switching'
    ],
    correct: 1,
    explanation: 'Banker\'s Algorithm is a deadlock avoidance algorithm that ensures the system always remains in a safe state, preventing deadlock.'
  },
  {
    question: 'What is the main drawback of using semaphores directly?',
    options: [
      'They are slower than mutexes',
      'They cannot be used for process synchronization',
      'They are prone to programming errors like deadlock and priority inversion',
      'They require special hardware support'
    ],
    correct: 2,
    explanation: 'Semaphores are powerful but can lead to complex synchronization issues such as deadlock, priority inversion, or accidental forgetting of signal/wait operations.'
  },
  {
    question: 'Which technique can be used to prevent deadlock?',
    options: [
      'Allowing circular wait',
      'Imposing an ordering on resource acquisition',
      'Removing mutual exclusion',
      'Disabling interrupts'
    ],
    correct: 1,
    explanation: 'Deadlock prevention can be achieved by imposing an ordering on resource acquisition, ensuring circular wait cannot occur.'
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
    question: 'In contiguous memory allocation, which strategy always chooses the smallest free block that is large enough for the process?',
    options: ['First Fit', 'Best Fit', 'Worst Fit', 'Next Fit'],
    correct: 1,
    explanation: 'Best Fit searches the memory and allocates the smallest available block that is large enough, reducing wasted space but possibly causing external fragmentation.'
  },
  {
    question: 'Which memory management technique divides memory into fixed-size blocks called frames?',
    options: ['Paging', 'Segmentation', 'Contiguous Allocation', 'Swapping'],
    correct: 0,
    explanation: 'Paging divides physical memory into fixed-size frames and logical memory into pages of the same size, eliminating external fragmentation.'
  },
  {
    question: 'Which of the following best describes segmentation?',
    options: [
      'Memory is divided into fixed-size blocks',
      'Memory is divided into variable-size logical units based on program structure',
      'Pages are swapped in and out of memory',
      'Processes are stored in contiguous blocks only'
    ],
    correct: 1,
    explanation: 'Segmentation divides memory into variable-sized segments like functions, arrays, or modules, reflecting the program’s logical structure.'
  },
  {
    question: 'Which statement is TRUE about paging vs segmentation?',
    options: [
      'Paging suffers from external fragmentation, segmentation does not',
      'Segmentation uses fixed-size partitions, paging uses variable-size',
      'Paging uses fixed-size pages, segmentation uses variable-size segments',
      'Both paging and segmentation eliminate internal fragmentation'
    ],
    correct: 2,
    explanation: 'Paging divides memory into fixed-size pages, while segmentation divides memory into variable-sized logical units.'
  },
  {
    question: 'What is the main purpose of virtual memory?',
    options: [
      'To increase the physical size of RAM',
      'To allow programs to use more memory than physically available by using disk space',
      'To eliminate internal fragmentation',
      'To speed up CPU scheduling'
    ],
    correct: 1,
    explanation: 'Virtual memory allows programs to use a large address space, even larger than physical RAM, by using disk storage as a backup.'
  },
  {
    question: 'In demand paging, when is a page loaded into memory?',
    options: [
      'At the time of process creation',
      'Only when the page is referenced for the first time',
      'When the OS starts',
      'All pages are preloaded before execution'
    ],
    correct: 1,
    explanation: 'In demand paging, pages are brought into memory only when they are first accessed, reducing initial memory load.'
  },
  {
    question: 'Which page replacement algorithm may result in "Belady’s Anomaly"?',
    options: ['FIFO', 'LRU', 'Optimal', 'Clock'],
    correct: 0,
    explanation: 'FIFO (First In First Out) can suffer from Belady’s Anomaly, where increasing the number of frames may increase the number of page faults.'
  },
  {
    question: 'Which page replacement algorithm replaces the page that has not been used for the longest time?',
    options: ['FIFO', 'LRU', 'Optimal', 'Random'],
    correct: 1,
    explanation: 'LRU (Least Recently Used) replaces the page that has not been used for the longest time, approximating the Optimal strategy in practice.'
  },
  {
    question: 'Which page replacement algorithm guarantees the lowest number of page faults if future knowledge is available?',
    options: ['FIFO', 'LRU', 'Optimal', 'Random'],
    correct: 2,
    explanation: 'The Optimal algorithm replaces the page that will not be used for the longest time in the future, but it requires knowledge of future references.'
  },
  {
    question: 'What is thrashing in operating systems?',
    options: [
      'When a process occupies the CPU without releasing it',
      'When processes are swapped in and out of memory excessively, causing high paging activity and low CPU utilization',
      'When all processes are stuck in deadlock',
      'When the system uses segmentation and paging together'
    ],
    correct: 1,
    explanation: 'Thrashing occurs when the system spends more time swapping pages in and out of memory than executing processes, leading to poor performance.'
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
    question: 'Which of the following is an example of sequential file access?',
    options: [
      'Reading a video file from start to finish',
      'Accessing a record in a database by key',
      'Jumping to the middle of a file instantly',
      'Randomly editing bytes in a file'
    ],
    correct: 0,
    explanation: 'Sequential access means data is read or written in order, such as playing a video or audio file.'
  },
  {
    question: 'In direct access method, how are records accessed?',
    options: [
      'Only in a linear sequence',
      'By calculating the record’s address directly',
      'By using an index for lookups',
      'By linking through pointers'
    ],
    correct: 1,
    explanation: 'In direct access, any record can be accessed by calculating its address, without reading sequentially.'
  },
  {
    question: 'Which file allocation method can suffer from external fragmentation?',
    options: ['Contiguous Allocation', 'Linked Allocation', 'Indexed Allocation', 'Hash Allocation'],
    correct: 0,
    explanation: 'Contiguous allocation stores a file in consecutive blocks, which may cause external fragmentation if free space is scattered.'
  },
  {
    question: 'Which file allocation method uses pointers within each block to link to the next block?',
    options: ['Contiguous Allocation', 'Linked Allocation', 'Indexed Allocation', 'Clustered Allocation'],
    correct: 1,
    explanation: 'In linked allocation, each file block contains a pointer to the next block, avoiding external fragmentation but increasing overhead.'
  },
  {
    question: 'Which file allocation method uses an index block to store pointers to file data blocks?',
    options: ['Contiguous Allocation', 'Linked Allocation', 'Indexed Allocation', 'Virtual Allocation'],
    correct: 2,
    explanation: 'Indexed allocation uses an index block that contains pointers to all file blocks, supporting direct access without external fragmentation.'
  },
  {
    question: 'Which of the following is a single-level directory structure limitation?',
    options: [
      'It allows too many files',
      'It does not support file access',
      'It does not allow two files with the same name',
      'It requires multiple paths for each file'
    ],
    correct: 2,
    explanation: 'In a single-level directory, all files are in the same directory, so no two files can have the same name.'
  },
  {
    question: 'Which directory structure organizes files in a hierarchy similar to a tree?',
    options: [
      'Single-level directory',
      'Two-level directory',
      'Tree-structured directory',
      'Acyclic graph directory'
    ],
    correct: 2,
    explanation: 'Tree-structured directories organize files hierarchically, allowing paths and subdirectories.'
  },
  {
    question: 'What does file system mounting mean?',
    options: [
      'Attaching a secondary storage device to the system',
      'Making a file system accessible by attaching it to a directory in the existing file hierarchy',
      'Copying files from one system to another',
      'Granting permissions to access a file'
    ],
    correct: 1,
    explanation: 'Mounting is the process of making a file system accessible by attaching it to a directory in the existing hierarchy.'
  },
  {
    question: 'In Unix-style file permissions, what does "rwxr-xr--" mean for the owner, group, and others?',
    options: [
      'Owner: read/write/execute, Group: read/execute, Others: read only',
      'Owner: read/write, Group: execute only, Others: no access',
      'Owner: execute only, Group: read/write, Others: read/write',
      'Owner: full access, Group: no access, Others: read only'
    ],
    correct: 0,
    explanation: 'In rwxr-xr--, the owner has full permissions (read, write, execute), the group has read and execute, and others have read-only.'
  },
  {
    question: 'Which Unix command is used to change file permissions?',
    options: ['chmod', 'chown', 'ls', 'umask'],
    correct: 0,
    explanation: 'The chmod command is used in Unix/Linux to change file access permissions (read, write, execute).'
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
    question: 'How does the CPU typically interact with I/O devices?',
    options: [
      'By directly executing device driver code stored in the device',
      'Through device controllers and device drivers',
      'By using only cache memory',
      'By storing I/O instructions in main memory'
    ],
    correct: 1,
    explanation: 'The CPU communicates with I/O devices using device controllers (hardware) and device drivers (software) that manage the interaction.'
  },
  {
    question: 'What is the main drawback of polling as an I/O technique?',
    options: [
      'It requires additional hardware',
      'It wastes CPU cycles by repeatedly checking device status',
      'It does not support multiple devices',
      'It cannot detect device completion'
    ],
    correct: 1,
    explanation: 'In polling, the CPU continuously checks device status, wasting cycles that could be used for computation.'
  },
  {
    question: 'Which of the following I/O techniques allows devices to transfer data directly to memory without CPU intervention?',
    options: ['Polling', 'Interrupts', 'DMA (Direct Memory Access)', 'Caching'],
    correct: 2,
    explanation: 'DMA allows devices to transfer blocks of data directly to/from memory, reducing CPU overhead.'
  },
  {
    question: 'Which I/O technique uses the CPU only when the device signals that it is ready?',
    options: ['Polling', 'Interrupts', 'DMA', 'Spooling'],
    correct: 1,
    explanation: 'Interrupts allow devices to notify the CPU only when they are ready, avoiding constant polling.'
  },
  {
    question: 'Which disk scheduling algorithm services requests in the order they arrive?',
    options: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN'],
    correct: 0,
    explanation: 'First Come First Serve (FCFS) services disk I/O requests in the order of arrival, similar to a queue.'
  },
  {
    question: 'Which disk scheduling algorithm selects the request closest to the current head position?',
    options: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN'],
    correct: 1,
    explanation: 'Shortest Seek Time First (SSTF) chooses the request with the shortest seek time from the current head position.'
  },
  {
    question: 'In SCAN (elevator algorithm), how does the disk arm move?',
    options: [
      'Randomly between requests',
      'In one direction servicing requests, then reverses direction',
      'Always in a circular manner',
      'Directly to the farthest request first'
    ],
    correct: 1,
    explanation: 'In SCAN, the disk arm moves like an elevator: it services requests in one direction, then reverses and continues.'
  },
  {
    question: 'How does C-SCAN differ from SCAN?',
    options: [
      'C-SCAN serves requests in both directions',
      'C-SCAN only serves requests at cylinder 0',
      'C-SCAN moves in one direction, then jumps back to the start without servicing on the return',
      'C-SCAN is slower than SCAN in all cases'
    ],
    correct: 2,
    explanation: 'In C-SCAN, the disk arm services requests in one direction, then jumps back to the beginning without servicing during the return, providing more uniform wait times.'
  },
  {
    question: 'What is the main purpose of buffering in I/O systems?',
    options: [
      'To permanently store I/O data',
      'To handle speed mismatches between producers and consumers of data',
      'To avoid disk scheduling',
      'To reduce memory fragmentation'
    ],
    correct: 1,
    explanation: 'Buffering stores data temporarily in memory to handle speed mismatches between devices and CPU.'
  },
  {
    question: 'How does caching differ from buffering?',
    options: [
      'Caching is temporary storage, buffering is permanent',
      'Buffering improves throughput, caching improves access time',
      'Caching is for disk only, buffering is for all devices',
      'They are the same thing in OS context'
    ],
    correct: 1,
    explanation: 'Buffering helps smooth data transfer rates (throughput), while caching keeps frequently accessed data for faster access (reducing latency).'
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
    question: 'Which of the following are Coffman’s necessary conditions for deadlock?',
    options: [
      'Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait',
      'Preemption, Synchronization, Mutual Exclusion, Starvation',
      'Deadlock, Livelock, Starvation, Thrashing',
      'Hold and Wait, Paging, Virtual Memory, Context Switching'
    ],
    correct: 0,
    explanation: 'Coffman’s conditions define four requirements for deadlock: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.'
  },
  {
    question: 'In a Resource Allocation Graph (RAG), what does a cycle indicate?',
    options: [
      'The system is deadlocked',
      'Deadlock may exist if each resource has only one instance',
      'Deadlock always occurs with a cycle, regardless of instances',
      'The system is free from deadlock'
    ],
    correct: 1,
    explanation: 'A cycle in a RAG indicates the possibility of deadlock. If each resource has only one instance, the cycle means deadlock exists.'
  },
  {
    question: 'Which approach is used for deadlock detection?',
    options: [
      'Checking for unsafe states',
      'Periodic examination of the resource allocation graph',
      'Disabling interrupts',
      'Imposing an ordering on resources'
    ],
    correct: 1,
    explanation: 'Deadlock detection involves periodically analyzing the resource allocation graph (or similar methods) to find cycles that indicate deadlock.'
  },
  {
    question: 'What is the main drawback of deadlock detection and recovery?',
    options: [
      'It requires very little overhead',
      'It cannot detect deadlocks',
      'It may require killing processes or preempting resources',
      'It always prevents deadlocks'
    ],
    correct: 2,
    explanation: 'Deadlock detection and recovery may require drastic measures such as terminating processes or preempting resources to break deadlock.'
  },
  {
    question: 'What is the main goal of Banker’s Algorithm?',
    options: [
      'To detect deadlock after it occurs',
      'To prevent deadlock by restricting resource requests',
      'To avoid deadlock by ensuring the system always remains in a safe state',
      'To speed up process execution'
    ],
    correct: 2,
    explanation: 'Banker’s Algorithm is a deadlock avoidance technique that ensures resource allocation only occurs if the system remains in a safe state.'
  },
  {
    question: 'In Banker’s Algorithm, what defines a "safe state"?',
    options: [
      'All processes have equal priority',
      'There is a sequence in which all processes can finish execution',
      'No process ever enters the waiting state',
      'Processes are always scheduled in order of arrival'
    ],
    correct: 1,
    explanation: 'A system is in a safe state if there exists at least one sequence of processes such that each can finish with currently available and future resources.'
  },
  {
    question: 'Which deadlock prevention strategy eliminates the "Hold and Wait" condition?',
    options: [
      'Allowing preemption of resources',
      'Requiring processes to request all needed resources at once',
      'Assigning a global ordering to resources',
      'Making some resources sharable'
    ],
    correct: 1,
    explanation: 'To prevent Hold and Wait, processes must request all required resources at once, preventing them from holding some while waiting for others.'
  },
  {
    question: 'Which deadlock prevention strategy removes the "Circular Wait" condition?',
    options: [
      'Resource preemption',
      'Releasing resources voluntarily',
      'Imposing a total ordering of resource acquisition',
      'Using semaphores'
    ],
    correct: 2,
    explanation: 'By imposing a strict order in which resources can be requested, circular wait is eliminated, preventing deadlock.'
  },
  {
    question: 'Which of the following is TRUE about deadlock avoidance vs prevention?',
    options: [
      'Avoidance ensures the system never enters an unsafe state, prevention eliminates conditions of deadlock',
      'Avoidance requires Coffman’s conditions, prevention does not',
      'Prevention uses Banker’s Algorithm, avoidance does not',
      'Both guarantee maximum resource utilization'
    ],
    correct: 0,
    explanation: 'Deadlock avoidance (e.g., Banker’s Algorithm) ensures the system does not enter an unsafe state, while prevention eliminates one or more of the Coffman conditions.'
  },
  {
    question: 'What is a common drawback of deadlock prevention techniques?',
    options: [
      'They always cause starvation',
      'They may reduce system resource utilization and throughput',
      'They cannot be applied in multiprocessor systems',
      'They require detection before working'
    ],
    correct: 1,
    explanation: 'Deadlock prevention can reduce system efficiency because resources may be underutilized due to strict constraints (e.g., forcing processes to request all resources upfront).'
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
    question: 'What is the main difference between user mode and kernel mode in an operating system?',
    options: [
      'User mode has unrestricted access to hardware, kernel mode does not',
      'Kernel mode has full access to hardware and system resources, user mode has restricted access',
      'User mode is faster than kernel mode',
      'Kernel mode is only used by applications'
    ],
    correct: 1,
    explanation: 'Kernel mode allows unrestricted access to hardware and system resources, while user mode restricts access for protection and security.'
  },
  {
    question: 'Which of the following is a key reason for having user and kernel modes?',
    options: [
      'To separate file management from process scheduling',
      'To provide protection and prevent user programs from directly accessing hardware',
      'To speed up user applications',
      'To allow multitasking'
    ],
    correct: 1,
    explanation: 'User and kernel modes provide a protection boundary, ensuring user programs cannot directly access critical hardware or memory.'
  },
  {
    question: 'What is a system call?',
    options: [
      'A request made by a program to the operating system for a service',
      'A function executed only in user mode',
      'An interrupt generated by hardware',
      'A method for process scheduling'
    ],
    correct: 0,
    explanation: 'A system call is the interface through which user programs request services from the operating system.'
  },
  {
    question: 'Which of the following is a type of system call?',
    options: [
      'Process control, file management, device management, information maintenance, communication',
      'Thread management, context switching, deadlock prevention',
      'Paging, segmentation, caching, buffering',
      'Scheduling, polling, interrupts, DMA'
    ],
    correct: 0,
    explanation: 'System calls are generally classified into five categories: process control, file management, device management, information maintenance, and communication.'
  },
  {
    question: 'Which of the following is an example of a process control system call?',
    options: ['fork()', 'open()', 'read()', 'chmod()'],
    correct: 0,
    explanation: 'fork() is a process control system call used to create a new process.'
  },
  {
    question: 'Which type of operating system executes jobs in the order they arrive without user interaction?',
    options: ['Batch OS', 'Time-sharing OS', 'Real-time OS', 'Distributed OS'],
    correct: 0,
    explanation: 'Batch operating systems group jobs together and execute them sequentially without user interaction.'
  },
  {
    question: 'Which type of OS allows multiple users to share the system simultaneously?',
    options: ['Single-user OS', 'Multi-user OS', 'Batch OS', 'Real-time OS'],
    correct: 1,
    explanation: 'Multi-user operating systems allow multiple users to access the system at the same time through terminals or network connections.'
  },
  {
    question: 'Which operating system type provides immediate response to input and is used in embedded systems?',
    options: ['Batch OS', 'Time-sharing OS', 'Real-time OS', 'Distributed OS'],
    correct: 2,
    explanation: 'Real-time operating systems (RTOS) guarantee quick response times and are commonly used in embedded systems like automotive and medical devices.'
  },
  {
    question: 'Which OS type distributes computation across multiple machines connected via a network?',
    options: ['Batch OS', 'Time-sharing OS', 'Real-time OS', 'Distributed OS'],
    correct: 3,
    explanation: 'Distributed operating systems manage resources across a network of computers, making them appear as a single system to users.'
  },
  {
    question: 'In a time-sharing operating system, CPU scheduling is primarily based on?',
    options: ['Shortest job first', 'Fixed priority', 'Time slices (quantum)', 'First come first serve only'],
    correct: 2,
    explanation: 'Time-sharing OS uses time slices (quantum) to switch between processes rapidly, giving the illusion of simultaneous execution.'
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
    question: 'What is a Virtual Machine (VM)?',
    options: [
      'A physical computer with dedicated hardware',
      'An emulation of a computer system running on top of another system',
      'A lightweight containerized process',
      'A kernel module that runs without OS support'
    ],
    correct: 1,
    explanation: 'A Virtual Machine is an emulation of a computer system that runs on top of another system using virtualization software.'
  },
  {
    question: 'Which component manages and allocates resources to virtual machines?',
    options: [
      'Operating System',
      'Hypervisor',
      'File System',
      'BIOS'
    ],
    correct: 1,
    explanation: 'The hypervisor (Virtual Machine Monitor) manages and allocates CPU, memory, and I/O resources to virtual machines.'
  },
  {
    question: 'What is a Type 1 hypervisor?',
    options: [
      'Runs directly on hardware without a host OS',
      'Runs on top of a host OS',
      'Used only for containerization',
      'A VM running inside another VM'
    ],
    correct: 0,
    explanation: 'A Type 1 hypervisor (bare-metal) runs directly on the host’s hardware, e.g., VMware ESXi, Microsoft Hyper-V.'
  },
  {
    question: 'Which of the following is an example of a Type 2 hypervisor?',
    options: [
      'VMware ESXi',
      'Microsoft Hyper-V (bare metal)',
      'Oracle VirtualBox',
      'Xen'
    ],
    correct: 2,
    explanation: 'Oracle VirtualBox is a Type 2 hypervisor because it runs on top of a host OS.'
  },
  {
    question: 'Which hypervisor type generally offers better performance?',
    options: [
      'Type 1 (Bare-metal)',
      'Type 2 (Hosted)',
      'Both are equal',
      'Neither, it depends on hardware only'
    ],
    correct: 0,
    explanation: 'Type 1 hypervisors offer better performance since they interact directly with hardware without the overhead of a host OS.'
  },
  {
    question: 'How do containers differ from virtual machines?',
    options: [
      'Containers virtualize hardware, VMs virtualize OS',
      'Containers share the host OS kernel, VMs include a full OS',
      'VMs are always faster than containers',
      'Containers require a hypervisor to run'
    ],
    correct: 1,
    explanation: 'Containers share the host OS kernel and isolate processes, whereas VMs emulate a full hardware stack and run their own OS.'
  },
  {
    question: 'Which technology is commonly used to run containers?',
    options: [
      'VMware',
      'Docker',
      'Hyper-V',
      'VirtualBox'
    ],
    correct: 1,
    explanation: 'Docker is the most widely used containerization platform.'
  },
  {
    question: 'What is the main advantage of containers over virtual machines?',
    options: [
      'Stronger hardware isolation',
      'Faster startup times and lower resource overhead',
      'Ability to emulate any OS',
      'They can run without an operating system'
    ],
    correct: 1,
    explanation: 'Containers are lightweight, start quickly, and consume fewer resources because they share the host OS kernel.'
  },
  {
    question: 'Which of the following best describes Docker?',
    options: [
      'A hypervisor for managing virtual machines',
      'A platform for developing, shipping, and running containers',
      'A tool for managing Type 1 hypervisors',
      'A kernel-level scheduling algorithm'
    ],
    correct: 1,
    explanation: 'Docker is a containerization platform that allows applications to run in isolated environments called containers.'
  },
  {
    question: 'In which scenario would you prefer VMs over containers?',
    options: [
      'Running multiple lightweight microservices',
      'When full OS isolation and different OS types are required',
      'When rapid scaling with minimal resources is needed',
      'When deploying serverless applications'
    ],
    correct: 1,
    explanation: 'VMs are preferred when complete OS isolation is required or when different operating systems must run on the same hardware.'
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
    question: 'Which command is used to display currently running processes in a dynamic real-time view?',
    options: ['ps', 'top', 'kill', 'ls -l'],
    correct: 1,
    explanation: 'The `top` command shows running processes dynamically, updating CPU and memory usage in real time.'
  },
  {
    question: 'What does the command `ps` display?',
    options: [
      'Process status (snapshot of running processes)',
      'File permissions',
      'Disk usage',
      'Background jobs'
    ],
    correct: 0,
    explanation: 'The `ps` command displays a snapshot of currently running processes.'
  },
  {
    question: 'Which command is used to terminate a process by PID?',
    options: ['kill', 'chmod', 'du', 'nice'],
    correct: 0,
    explanation: 'The `kill` command is used to send signals to processes, typically to terminate them.'
  },
  {
    question: 'What does the `nice` command do?',
    options: [
      'Shows process tree',
      'Changes process priority',
      'Kills background jobs',
      'Displays disk usage'
    ],
    correct: 1,
    explanation: 'The `nice` command is used to start a process with a specified priority level (niceness).'
  },
  {
    question: 'In the output of `ls -l`, what do the first 10 characters (e.g., `-rwxr-xr--`) represent?',
    options: [
      'File ownership',
      'File permissions and type',
      'File size',
      'Process ID'
    ],
    correct: 1,
    explanation: 'The first field of `ls -l` output shows file type and permissions (rwx for owner, group, and others).'
  },
  {
    question: 'Which command is used to change file permissions in Linux?',
    options: ['ls -l', 'chmod', 'df', 'ps'],
    correct: 1,
    explanation: 'The `chmod` command is used to modify file permissions.'
  },
  {
    question: 'Which command shows available disk space usage of file systems?',
    options: ['df', 'du', 'ls -l', 'top'],
    correct: 0,
    explanation: 'The `df` command reports file system disk space usage.'
  },
  {
    question: 'What is the difference between `df` and `du`?',
    options: [
      '`df` shows overall filesystem usage, `du` shows usage of files/directories',
      '`df` shows file permissions, `du` shows file owners',
      '`df` runs only in root mode, `du` runs as normal user',
      'They are the same command'
    ],
    correct: 0,
    explanation: '`df` displays filesystem-level usage, while `du` displays disk usage of specific files and directories.'
  },
  {
    question: 'Which operator is used for piping output of one command to another?',
    options: ['>', '|', '>>', '&'],
    correct: 1,
    explanation: 'The pipe (`|`) operator sends the output of one command as input to another command.'
  },
  {
    question: 'In shell scripting, what does the `&` at the end of a command do?',
    options: [
      'Runs the command with higher priority',
      'Runs the command in the background',
      'Redirects output to a file',
      'Terminates the command immediately'
    ],
    correct: 1,
    explanation: 'Appending `&` runs the command in the background, allowing the terminal to be used for other tasks.'
  }
]

  }
]; 