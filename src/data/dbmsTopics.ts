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

export const dbmsTopics: Topic[] = [
  {
    id: 'dbms-basics',
    title: 'Database Models & Basics',
    description: 'Introduction to DBMS, types, and advantages over file systems',
    completed: false,
    readUrl: 'https://medium.com/@amitvsolutions/from-data-to-information-a-guide-to-data-models-in-dbms-88a76abef4b5',
    concepts: [
      'What is a DBMS?',
      'Difference between DBMS and RDBMS',
      'Types of DBMS: Hierarchical, Network, Relational, Object-Oriented',
      'Advantages of DBMS over file systems'
    ],
    quiz: [
      {
        question: 'What is the main advantage of a DBMS over file systems?',
        options: [
          'Faster hardware',
          'Data redundancy and inconsistency are reduced',
          'It is always free',
          'It does not require queries'
        ],
        correct: 1,
        explanation: 'DBMS reduces data redundancy and inconsistency compared to file systems.'
      },
      {
        question: 'Which of the following is NOT a type of DBMS?',
        options: ['Hierarchical', 'Relational', 'Object-Oriented', 'Procedural'],
        correct: 3,
        explanation: 'Procedural is not a DBMS type; it refers to a programming paradigm.'
      },
      {
        question: 'What is the difference between DBMS and RDBMS?',
        options: [
          'RDBMS stores data in tables, DBMS may not',
          'DBMS is always faster',
          'RDBMS does not support SQL',
          'DBMS supports only relational data'
        ],
        correct: 0,
        explanation: 'RDBMS stores data in tables and supports relationships, while DBMS may use other models.'
      }
    ]
  },
  {
    id: 'er-relational-model',
    title: 'ER Model & Relational Model',
    description: 'Entities, attributes, keys, and ER to relational mapping',
    completed: false,
    readUrl: 'https://medium.com/@kumarjai2466/er-to-relational-mapping-ac84b3c9f258',
    concepts: [
      'Entity, Attribute, Entity Set',
      'Types of Attributes (Composite, Multivalued, Derived)',
      'ER to Relational Mapping',
      'Primary Key, Candidate Key, Foreign Key, Super Key'
    ],
    quiz: [
      {
        question: 'Which of the following is a valid primary key property?',
        options: [
          'It can have duplicate values',
          'It uniquely identifies a record',
          'It can be null',
          'It is always a foreign key'
        ],
        correct: 1,
        explanation: 'A primary key uniquely identifies a record and cannot be null.'
      },
      {
        question: 'What is a composite attribute?',
        options: [
          'An attribute made up of multiple values',
          'An attribute that is derived from another',
          'An attribute that is a key',
          'An attribute that is always unique'
        ],
        correct: 0,
        explanation: 'A composite attribute is made up of multiple sub-attributes.'
      },
      {
        question: 'What is the difference between a primary key and a unique key?',
        options: [
          'Primary key can be null, unique key cannot',
          'Both can be null',
          'Primary key cannot be null, unique key can',
          'There is no difference'
        ],
        correct: 2,
        explanation: 'Primary key cannot be null, but unique key can be null.'
      }
    ]
  },
  {
    id: 'sql',
    title: 'SQL (Structured Query Language)',
    description: 'SQL basics, queries, joins, subqueries, and views',
    completed: false,
    readUrl: 'https://medium.com/@sumanzadeakhil/sql-structured-query-language-tutorial-896f6e358269',
    concepts: [
      'Basic Queries: SELECT, INSERT, UPDATE, DELETE',
      'WHERE, GROUP BY, ORDER BY, HAVING',
      'Joins: Inner, Left, Right, Full',
      'Subqueries and Nested Queries',
      'Views, Indexes, Triggers',
      'SQL vs NoSQL (basic idea)'
    ],
    quiz: [
      {
        question: 'Which SQL clause is used to filter groups after aggregation?',
        options: ['WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'],
        correct: 2,
        explanation: 'HAVING is used to filter groups after aggregation.'
      },
      {
        question: 'Which join returns all records from the left table and matched records from the right table?',
        options: ['Inner Join', 'Left Join', 'Right Join', 'Full Join'],
        correct: 1,
        explanation: 'Left Join returns all records from the left table and matched records from the right.'
      },
      {
        question: 'What is the difference between SQL and NoSQL?',
        options: [
          'SQL is always faster',
          'NoSQL is only for small data',
          'SQL uses structured tables, NoSQL can use documents, key-value, etc.',
          'NoSQL does not support queries'
        ],
        correct: 2,
        explanation: 'SQL uses structured tables, while NoSQL can use various data models.'
      }
    ]
  },
  {
    id: 'normalization',
    title: 'Normalization & Denormalization',
    description: 'Normal forms, functional dependencies, and pros/cons of normalization',
    completed: false,
    readUrl: 'https://medium.com/@adilrk/database-normalization-vs-denormalization-d37b3b9668e0',
    concepts: [
      '1NF, 2NF, 3NF, BCNF',
      'Functional Dependencies',
      'Lossless decomposition, Dependency Preservation',
      'Pros and Cons of Normalization'
    ],
    quiz: [
      {
        question: 'What is the main goal of normalization?',
        options: [
          'Increase redundancy',
          'Reduce data redundancy and improve data integrity',
          'Make queries slower',
          'Remove all keys'
        ],
        correct: 1,
        explanation: 'Normalization reduces redundancy and improves data integrity.'
      },
      {
        question: 'Which normal form removes transitive dependencies?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correct: 2,
        explanation: '3NF removes transitive dependencies.'
      },
      {
        question: 'What is a functional dependency?',
        options: [
          'A relationship between two tables',
          'A constraint between two attributes',
          'A type of join',
          'A type of index'
        ],
        correct: 1,
        explanation: 'A functional dependency is a constraint between two attributes.'
      }
    ]
  },
  {
    id: 'transactions',
    title: 'Transactions & Concurrency Control',
    description: 'ACID properties, serializability, and concurrency issues',
    completed: false,
    readUrl: 'https://medium.com/@sandeepmankoo1995/understanding-database-transactions-and-concurrency-control-c47475f78414',
    concepts: [
      'ACID Properties (Atomicity, Consistency, Isolation, Durability)',
      'Transaction States',
      'Serializability',
      'Conflict & View Serializability',
      'Concurrency Issues: Dirty Read, Lost Update, Phantom Read',
      'Lock-based Protocols (2PL), Timestamp ordering'
    ],
    quiz: [
      {
        question: 'What does the "I" in ACID stand for?',
        options: ['Integrity', 'Isolation', 'Indexing', 'Instance'],
        correct: 1,
        explanation: 'I in ACID stands for Isolation.'
      },
      {
        question: 'Which concurrency issue occurs when two transactions read and write the same data item?',
        options: ['Dirty Read', 'Lost Update', 'Phantom Read', 'Serializability'],
        correct: 1,
        explanation: 'Lost Update occurs when two transactions overwrite each other’s changes.'
      },
      {
        question: 'What is serializability?',
        options: [
          'Ability to serialize data to disk',
          'Ability to execute transactions in a way that the result is equivalent to some serial order',
          'Ability to rollback transactions',
          'Ability to lock tables'
        ],
        correct: 1,
        explanation: 'Serializability ensures the result of concurrent transactions is equivalent to some serial execution.'
      }
    ]
  },
  {
    id: 'indexing',
    title: 'Indexing',
    description: 'Types of indexes and their role in query performance',
    completed: false,
    readUrl: 'https://medium.com/@rtawadrous/introduction-to-database-indexes-9b488e243cc1',
    concepts: [
      'Primary vs Secondary Index',
      'Clustered vs Non-clustered Index',
      'B+ Trees and Hash Indexing'
    ],
    quiz: [
      {
        question: 'What is the main purpose of an index in a database?',
        options: [
          'To store data',
          'To speed up data retrieval',
          'To slow down queries',
          'To enforce constraints'
        ],
        correct: 1,
        explanation: 'Indexes speed up data retrieval.'
      },
      {
        question: 'Which index type determines the physical order of data in the table?',
        options: ['Primary', 'Secondary', 'Clustered', 'Non-clustered'],
        correct: 2,
        explanation: 'Clustered index determines the physical order of data.'
      },
      {
        question: 'Why might an index slow down INSERT or UPDATE operations?',
        options: [
          'Because indexes need to be updated as well',
          'Because indexes are always slow',
          'Because indexes lock the table',
          'Because indexes use more memory'
        ],
        correct: 0,
        explanation: 'Indexes need to be updated on INSERT or UPDATE, which can slow down these operations.'
      }
    ]
  },
  {
    id: 'joins-optimization',
    title: 'Joins and Query Optimization',
    description: 'Join types, join algorithms, and query optimization techniques',
    completed: false,
    readUrl: 'https://freedium.cfd/https://medium.com/@pat.vishad/10-sql-join-optimization-techniques-every-backend-developer-should-know-with-real-query-fixes-87c2506ad5bf',
    concepts: [
      'Join types and execution',
      'Nested Loop Join vs Hash Join vs Merge Join',
      'Query optimization techniques: selection pushdown, join order, indexing'
    ],
    quiz: [
      {
        question: 'Which join algorithm is best for joining large unsorted tables?',
        options: ['Nested Loop Join', 'Hash Join', 'Merge Join', 'Index Join'],
        correct: 1,
        explanation: 'Hash Join is efficient for large unsorted tables.'
      },
      {
        question: 'What is selection pushdown in query optimization?',
        options: [
          'Pushing selection operations as late as possible',
          'Pushing selection operations as early as possible',
          'Ignoring selection operations',
          'Only using indexes for selection'
        ],
        correct: 1,
        explanation: 'Selection pushdown means applying selection operations as early as possible to reduce intermediate results.'
      },
      {
        question: 'How do joins work internally?',
        options: [
          'By comparing every row in both tables',
          'By using indexes only',
          'By using only primary keys',
          'By sorting tables only'],
        correct: 0,
        explanation: 'Joins can be implemented by comparing rows, using indexes, or sorting, depending on the algorithm.'
      }
    ]
  },
  {
    id: 'storage-file-org',
    title: 'Storage & File Organization',
    description: 'How DBMS stores data on disk, file types, and buffer management',
    completed: false,
    readUrl: 'https://medium.com/@aditimishra_541/comprehensive-breakdown-of-database-management-system-dbms-architecture-401385ca209b',
    concepts: [
      'Blocks, Pages, Buffer Management',
      'Heap files, Sorted files, Hashing',
      'Sequential File Organization'
    ],
    quiz: [
      {
        question: 'What is a heap file?',
        options: [
          'A file where records are stored in no particular order',
          'A file where records are sorted',
          'A file used for memory management',
          'A file that stores only indexes'
        ],
        correct: 0,
        explanation: 'Heap files store records in no particular order.'
      },
      {
        question: 'What is the main advantage of hashing for storage?',
        options: [
          'Fast direct access',
          'Always sorted data',
          'Uses less memory',
          'No collisions'],
        correct: 0,
        explanation: 'Hashing provides fast direct access to records.'
      },
      {
        question: 'What is buffer management?',
        options: [
          'Managing memory buffers for disk I/O',
          'Sorting files',
          'Indexing data',
          'Encrypting data'],
        correct: 0,
        explanation: 'Buffer management is about managing memory buffers for disk I/O.'
      }
    ]
  },
  {
    id: 'nosql',
    title: 'NoSQL (Basic Awareness)',
    description: 'Types of NoSQL databases and use-cases',
    completed: false,
    readUrl: 'https://freedium.cfd/https://medium.com/@fullstacktips/nosql-databases-explained-59fbfbbef396',
    concepts: [
      'Types: Key-Value, Document, Columnar, Graph DBs',
      'Use-cases where NoSQL is preferred over SQL'
    ],
    quiz: [
      {
        question: 'Which of the following is a type of NoSQL database?',
        options: ['Relational', 'Document', 'Hierarchical', 'Network'],
        correct: 1,
        explanation: 'Document is a type of NoSQL database.'
      },
      {
        question: 'When would you choose MongoDB over MySQL?',
        options: [
          'When you need flexible, schema-less data storage',
          'When you need strict ACID compliance',
          'When you only use SQL',
          'When you need strong typing'],
        correct: 0,
        explanation: 'MongoDB is preferred for flexible, schema-less data storage.'
      },
      {
        question: 'What is the difference between a document store and a key-value store?',
        options: [
          'Document store can store structured documents, key-value store stores simple key-value pairs',
          'Key-value store is always faster',
          'Document store does not support queries',
          'There is no difference'],
        correct: 0,
        explanation: 'Document stores can store structured documents, while key-value stores store simple key-value pairs.'
      }
    ]
  }
];