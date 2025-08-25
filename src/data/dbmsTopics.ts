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
    question: 'What is a DBMS (Database Management System)?',
    options: [
      'A software for operating systems',
      'A software for managing databases and data storage',
      'A programming language for databases',
      'A hardware device for storing data'
    ],
    correct: 1,
    explanation: 'DBMS is software that manages databases, providing efficient data storage, retrieval, and manipulation.'
  },
  {
    question: 'Which of the following best describes the difference between DBMS and RDBMS?',
    options: [
      'DBMS supports relational tables, RDBMS does not',
      'RDBMS supports relational tables with constraints, DBMS may not',
      'DBMS is faster than RDBMS',
      'RDBMS cannot handle large datasets'
    ],
    correct: 1,
    explanation: 'RDBMS (Relational DBMS) stores data in tables with relationships and constraints (keys), whereas DBMS may not support relations.'
  },
  {
    question: 'Which of the following is NOT a type of DBMS?',
    options: ['Hierarchical', 'Network', 'Relational', 'Procedural'],
    correct: 3,
    explanation: 'The main DBMS types are Hierarchical, Network, Relational, and Object-Oriented. "Procedural" is not a DBMS type.'
  },
  {
    question: 'In a hierarchical DBMS, data is organized as:',
    options: [
      'Tables with rows and columns',
      'Objects with attributes',
      'A tree-like structure with parent-child relationships',
      'Independent graphs with no links'
    ],
    correct: 2,
    explanation: 'Hierarchical DBMS organizes data in a tree structure where records have parent-child relationships.'
  },
  {
    question: 'Which DBMS type organizes data using nodes and set relationships (pointers)?',
    options: ['Hierarchical', 'Network', 'Relational', 'Object-Oriented'],
    correct: 1,
    explanation: 'A Network DBMS organizes data using records (nodes) connected by set relationships (pointers).'
  },
  {
    question: 'Which DBMS type uses tables (rows and columns) to store data?',
    options: ['Hierarchical', 'Network', 'Relational', 'Object-Oriented'],
    correct: 2,
    explanation: 'Relational DBMS (RDBMS) stores data in tables with rows and columns, enforcing relationships via keys.'
  },
  {
    question: 'Which DBMS type supports complex data types like multimedia, images, and user-defined objects?',
    options: ['Relational', 'Object-Oriented', 'Network', 'Hierarchical'],
    correct: 1,
    explanation: 'Object-Oriented DBMS supports complex data types, including multimedia and user-defined objects.'
  },
  {
    question: 'Which of the following is an advantage of DBMS over traditional file systems?',
    options: [
      'Data redundancy is increased',
      'Provides data consistency, integrity, and security',
      'Data access is slower',
      'DBMS cannot handle concurrent access'
    ],
    correct: 1,
    explanation: 'DBMS provides consistency, integrity, security, and concurrency control, which are major advantages over file systems.'
  },
  {
    question: 'Which of the following is a key feature of DBMS that allows multiple users to access data simultaneously without conflicts?',
    options: ['Concurrency control', 'Data redundancy', 'File locking', 'Manual access'],
    correct: 0,
    explanation: 'DBMS ensures concurrency control, allowing multiple users to access data without conflicts.'
  },
  {
    question: 'Which of these is a disadvantage of traditional file systems compared to DBMS?',
    options: [
      'Better query processing',
      'More data redundancy and inconsistency',
      'More efficient concurrency control',
      'Supports better security'
    ],
    correct: 1,
    explanation: 'File systems often suffer from data redundancy and inconsistency, while DBMS solves these issues.'
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
    question: 'In an ER model, what is an Entity?',
    options: [
      'A property that describes an object',
      'A real-world object that can be distinguished from others',
      'A relationship between two objects',
      'A derived value'
    ],
    correct: 1,
    explanation: 'An Entity is a real-world object that can be uniquely identified, such as a student, employee, or product.'
  },
  {
    question: 'What is an Attribute in an ER model?',
    options: [
      'A characteristic that describes an entity',
      'A connection between two entities',
      'A collection of entities',
      'A derived table in a relational schema'
    ],
    correct: 0,
    explanation: 'Attributes are characteristics or properties that describe an entity (e.g., Student has attributes like Name, RollNo, Age).'
  },
  {
    question: 'What is an Entity Set?',
    options: [
      'A collection of attributes',
      'A set of entities of the same type',
      'A table in a relational database',
      'A derived attribute in ER model'
    ],
    correct: 1,
    explanation: 'An Entity Set is a collection of similar entities, e.g., the set of all Students.'
  },
  {
    question: 'Which of the following is a Composite Attribute?',
    options: [
      'Age',
      'Full Name (First Name + Last Name)',
      'Salary',
      'Date of Birth'
    ],
    correct: 1,
    explanation: 'A Composite Attribute can be divided into smaller sub-parts. Full Name can be split into First Name and Last Name.'
  },
  {
    question: 'Which of the following is a Multivalued Attribute?',
    options: [
      'Phone Numbers',
      'Date of Birth',
      'Employee ID',
      'Age'
    ],
    correct: 0,
    explanation: 'A Multivalued Attribute can have multiple values for the same entity, e.g., an employee can have multiple phone numbers.'
  },
  {
    question: 'Which of the following is a Derived Attribute?',
    options: [
      'Employee Age calculated from Date of Birth',
      'Employee Name',
      'Employee ID',
      'Salary'
    ],
    correct: 0,
    explanation: 'Derived Attributes can be calculated from other attributes, e.g., Age derived from Date of Birth.'
  },
  {
    question: 'In ER to Relational Mapping, what does an Entity Set typically map to?',
    options: [
      'A relationship',
      'A table in the relational schema',
      'A foreign key',
      'An index'
    ],
    correct: 1,
    explanation: 'Entity Sets are mapped to tables in relational databases, where attributes become columns.'
  },
  {
    question: 'What is a Primary Key?',
    options: [
      'A key that uniquely identifies a record in a table',
      'Any attribute in a table',
      'A key used only for foreign references',
      'A redundant attribute in a relation'
    ],
    correct: 0,
    explanation: 'A Primary Key uniquely identifies each record in a table and cannot be NULL.'
  },
  {
    question: 'What is the difference between a Candidate Key and a Primary Key?',
    options: [
      'Candidate Key can be NULL, Primary Key cannot',
      'Primary Key is chosen from Candidate Keys, Candidate Keys are all possible unique identifiers',
      'Candidate Keys are foreign keys, Primary Keys are not',
      'There is no difference'
    ],
    correct: 1,
    explanation: 'Candidate Keys are all possible unique identifiers. One of them is chosen as the Primary Key.'
  },
  {
    question: 'What is a Foreign Key?',
    options: [
      'A key that uniquely identifies records',
      'A key used to connect two tables by referencing the Primary Key of another table',
      'A key that contains derived attributes',
      'A composite key inside the same table'
    ],
    correct: 1,
    explanation: 'A Foreign Key is an attribute in one table that refers to the Primary Key of another table, establishing a relationship.'
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
    question: 'Which SQL statement is used to retrieve data from a database?',
    options: [
      'INSERT',
      'SELECT',
      'UPDATE',
      'DELETE'
    ],
    correct: 1,
    explanation: 'The SELECT statement is used to retrieve data from one or more tables.'
  },
  {
    question: 'Which SQL command is used to add a new row into a table?',
    options: [
      'INSERT',
      'SELECT',
      'UPDATE',
      'ALTER'
    ],
    correct: 0,
    explanation: 'The INSERT command adds new records into a table.'
  },
  {
    question: 'Which SQL clause is used to filter rows based on a condition?',
    options: [
      'GROUP BY',
      'ORDER BY',
      'WHERE',
      'HAVING'
    ],
    correct: 2,
    explanation: 'The WHERE clause filters rows before grouping and aggregation.'
  },
  {
    question: 'Which SQL clause is used to group rows with the same values?',
    options: [
      'GROUP BY',
      'ORDER BY',
      'DISTINCT',
      'HAVING'
    ],
    correct: 0,
    explanation: 'The GROUP BY clause groups rows sharing a common value, often used with aggregate functions.'
  },
  {
    question: 'Which JOIN returns only the rows that have matching values in both tables?',
    options: [
      'LEFT JOIN',
      'RIGHT JOIN',
      'INNER JOIN',
      'FULL OUTER JOIN'
    ],
    correct: 2,
    explanation: 'INNER JOIN returns rows where there is a match in both tables.'
  },
  {
    question: 'Which JOIN returns all rows from the left table and matching rows from the right table?',
    options: [
      'LEFT JOIN',
      'RIGHT JOIN',
      'INNER JOIN',
      'FULL JOIN'
    ],
    correct: 0,
    explanation: 'LEFT JOIN returns all rows from the left table and matching rows from the right, with NULLs where no match exists.'
  },
  {
    question: 'What is a subquery in SQL?',
    options: [
      'A query that runs only once',
      'A query inside another SQL query',
      'A query that updates data',
      'A temporary view of a table'
    ],
    correct: 1,
    explanation: 'A subquery is a query nested inside another query, often used in WHERE or FROM clauses.'
  },
  {
    question: 'Which SQL object is a virtual table created from a query?',
    options: [
      'Index',
      'View',
      'Trigger',
      'Sequence'
    ],
    correct: 1,
    explanation: 'A View is a virtual table based on the result of a query.'
  },
  {
    question: 'What is the main purpose of an Index in SQL?',
    options: [
      'To store historical data',
      'To enforce foreign key constraints',
      'To speed up data retrieval operations',
      'To create triggers automatically'
    ],
    correct: 2,
    explanation: 'Indexes improve query performance by allowing faster lookups, though they add overhead on INSERT/UPDATE.'
  },
  {
    question: 'Which of the following best describes SQL vs NoSQL?',
    options: [
      'SQL databases are schema-less, NoSQL databases are schema-based',
      'SQL is used only for small datasets, NoSQL for large datasets',
      'SQL databases are relational and structured, NoSQL databases are non-relational and flexible',
      'NoSQL is a query language, SQL is a database'
    ],
    correct: 2,
    explanation: 'SQL databases are relational and use structured schemas, while NoSQL databases are non-relational and more flexible for unstructured data.'
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
    question: 'What is the main goal of normalization in databases?',
    options: [
      'To increase redundancy for faster queries',
      'To minimize data redundancy and avoid anomalies',
      'To speed up disk access',
      'To enforce foreign keys only'
    ],
    correct: 1,
    explanation: 'Normalization organizes data to reduce redundancy and prevent update, insert, and delete anomalies.'
  },
  {
    question: 'Which normal form removes repeating groups and ensures atomic attributes?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correct: 0,
    explanation: '1NF requires that all attributes are atomic (no repeating groups or multi-valued attributes).'
  },
  {
    question: 'A relation is in 2NF if:',
    options: [
      'It is in 1NF and has no partial dependency',
      'It is in 1NF and has no transitive dependency',
      'It has no multivalued dependencies',
      'Every non-key attribute is a candidate key'
    ],
    correct: 0,
    explanation: '2NF eliminates partial dependency: no non-prime attribute should depend on part of a candidate key.'
  },
  {
    question: 'Which normal form removes transitive dependencies?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correct: 2,
    explanation: '3NF ensures that non-key attributes do not depend on other non-key attributes (removes transitive dependency).'
  },
  {
    question: 'BCNF (Boyce-Codd Normal Form) is stricter than 3NF because:',
    options: [
      'It requires every determinant to be a candidate key',
      'It removes multivalued dependencies',
      'It eliminates NULL values',
      'It requires indexing on all candidate keys'
    ],
    correct: 0,
    explanation: 'In BCNF, for every functional dependency X → Y, X must be a candidate key.'
  },
  {
    question: 'Which of the following best defines a functional dependency X → Y?',
    options: [
      'X and Y are both candidate keys',
      'For each value of X, there is exactly one value of Y',
      'X determines Y only in some tuples',
      'X is always a foreign key'
    ],
    correct: 1,
    explanation: 'A functional dependency means if two tuples have the same value of X, they must also have the same value of Y.'
  },
  {
    question: 'What is a lossless decomposition in normalization?',
    options: [
      'A decomposition that loses some tuples',
      'A decomposition where join of sub-relations gives back the original relation',
      'A decomposition that removes all functional dependencies',
      'A decomposition that requires foreign keys'
    ],
    correct: 1,
    explanation: 'Lossless decomposition ensures that when sub-relations are joined, no data is lost and the original relation is reconstructed.'
  },
  {
    question: 'What does dependency preservation ensure in decomposition?',
    options: [
      'All original functional dependencies are preserved in decomposed relations',
      'All keys are preserved',
      'All NULL values are removed',
      'All relations remain in 1NF'
    ],
    correct: 0,
    explanation: 'Dependency preservation ensures that functional dependencies can be enforced without needing to join decomposed tables.'
  },
  {
    question: 'Which of the following is a drawback of normalization?',
    options: [
      'Increased data redundancy',
      'Slower write operations',
      'Higher query complexity with multiple joins',
      'Loss of functional dependencies'
    ],
    correct: 2,
    explanation: 'Normalization reduces redundancy but may lead to performance issues since queries often require joining multiple tables.'
  },
  {
    question: 'Which is a benefit of normalization?',
    options: [
      'More redundancy for faster queries',
      'Prevents anomalies and improves data consistency',
      'Increases table size unnecessarily',
      'Removes indexing requirements'
    ],
    correct: 1,
    explanation: 'Normalization avoids anomalies (insertion, update, deletion) and ensures consistent data storage.'
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
    question: 'Which ACID property ensures that either all operations of a transaction are completed or none of them are?',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    correct: 0,
    explanation: 'Atomicity ensures that a transaction is "all or nothing." If one part fails, the whole transaction is rolled back.'
  },
  {
    question: 'In transaction states, after a transaction is completed successfully, it enters which state?',
    options: ['Active', 'Partially Committed', 'Committed', 'Failed'],
    correct: 2,
    explanation: 'Once all changes are permanently saved, the transaction enters the Committed state.'
  },
  {
    question: 'Which property of ACID ensures that the database moves from one valid state to another valid state?',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    correct: 1,
    explanation: 'Consistency ensures that integrity constraints are maintained and the database remains valid after transactions.'
  },
  {
    question: 'What does serializability in transaction scheduling ensure?',
    options: [
      'Transactions execute in parallel without any restrictions',
      'The result of concurrent execution is the same as some serial execution',
      'Each transaction is executed twice for safety',
      'All transactions must wait until the previous one finishes'
    ],
    correct: 1,
    explanation: 'Serializability ensures correctness by guaranteeing that the final state is equivalent to a serial execution of transactions.'
  },
  {
    question: 'Conflict serializability is based on which relation between operations?',
    options: ['Dependency graph of conflicting operations', 'Order of commits', 'Deadlock prevention', 'Rollback operations'],
    correct: 0,
    explanation: 'Conflict serializability uses precedence graphs to ensure no cycles exist between conflicting operations.'
  },
  {
    question: 'Which concurrency issue occurs when one transaction reads uncommitted changes made by another transaction?',
    options: ['Dirty Read', 'Lost Update', 'Phantom Read', 'Non-repeatable Read'],
    correct: 0,
    explanation: 'Dirty Read happens when a transaction reads data that was updated by another transaction but not yet committed.'
  },
  {
    question: 'What is the Lost Update problem in transactions?',
    options: [
      'When two transactions read the same data and update it, but one update is overwritten',
      'When a transaction fails during commit',
      'When a transaction reads uncommitted data',
      'When a transaction gets duplicate phantom rows'
    ],
    correct: 0,
    explanation: 'Lost Update occurs when two transactions overwrite each other’s updates because they are not properly isolated.'
  },
  {
    question: 'Which concurrency problem occurs when the same query in a transaction returns different sets of rows due to inserts by another transaction?',
    options: ['Dirty Read', 'Phantom Read', 'Lost Update', 'Deadlock'],
    correct: 1,
    explanation: 'Phantom Read happens when a transaction sees new rows inserted by another transaction during its execution.'
  },
  {
    question: 'In the Two-Phase Locking (2PL) protocol, which two phases exist?',
    options: [
      'Shared and Exclusive',
      'Growing and Shrinking',
      'Read and Write',
      'Deadlock and Recovery'
    ],
    correct: 1,
    explanation: '2PL has a growing phase (acquiring locks) and a shrinking phase (releasing locks). This ensures conflict serializability.'
  },
  {
    question: 'In timestamp ordering protocol, how is the order of conflicting operations decided?',
    options: [
      'By transaction priority',
      'By system clock timestamps assigned at transaction start',
      'By database administrator manually',
      'By lock duration'
    ],
    correct: 1,
    explanation: 'Timestamp ordering assigns each transaction a timestamp at its start, and conflicts are resolved based on these timestamps.'
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
    question: 'What is the main difference between a primary index and a secondary index?',
    options: [
      'Primary index is built on non-key attributes, secondary index is built on primary key',
      'Primary index is built on ordered data file, secondary index can be built on any attribute',
      'Secondary index is always faster than primary index',
      'Primary index stores actual data, secondary index stores only row IDs'
    ],
    correct: 1,
    explanation: 'A primary index is built on the ordered data file (usually the primary key), while a secondary index can be built on any attribute for faster lookups.'
  },
  {
    question: 'In a clustered index, how are the table records stored?',
    options: [
      'Randomly, regardless of index',
      'In the order of the index key',
      'Only in heap structure',
      'Separated from the actual data'
    ],
    correct: 1,
    explanation: 'A clustered index stores the actual table records in the order of the index key, making range queries efficient.'
  },
  {
    question: 'How does a non-clustered index differ from a clustered index?',
    options: [
      'Non-clustered index dictates the physical order of data',
      'Non-clustered index stores pointers to the actual data instead of reordering rows',
      'Non-clustered index is always faster than clustered index',
      'Clustered index does not support searching'
    ],
    correct: 1,
    explanation: 'Non-clustered indexes store a separate structure with pointers (row IDs) to the actual data, unlike clustered indexes which reorder the data itself.'
  },
  {
    question: 'Which type of index is usually implemented using a B+ Tree?',
    options: ['Primary index', 'Clustered index', 'Secondary index', 'All of the above'],
    correct: 3,
    explanation: 'Most database indexes (primary, clustered, secondary) are implemented using B+ Trees because they support efficient range queries and ordered traversal.'
  },
  {
    question: 'What is the main advantage of B+ Trees over binary search trees for indexing?',
    options: [
      'They allow duplicate keys',
      'They are balanced and minimize disk I/O by storing multiple keys per node',
      'They don’t require rebalancing',
      'They use hashing internally'
    ],
    correct: 1,
    explanation: 'B+ Trees are balanced and store multiple keys per node, which reduces disk I/O and improves query efficiency compared to binary search trees.'
  },
  {
    question: 'Which type of indexing is more suitable for equality searches (e.g., WHERE id = 10)?',
    options: ['B+ Tree indexing', 'Hash indexing', 'Clustered indexing', 'Non-clustered indexing'],
    correct: 1,
    explanation: 'Hash indexing is best for equality searches because it provides constant time lookups, but it is not efficient for range queries.'
  },
  {
    question: 'Which type of indexing is more suitable for range queries (e.g., WHERE salary BETWEEN 3000 AND 7000)?',
    options: ['Hash indexing', 'B+ Tree indexing', 'Non-clustered indexing only', 'Bitmap indexing'],
    correct: 1,
    explanation: 'B+ Tree indexing supports efficient range queries due to its ordered structure, unlike hash indexing which is limited to equality searches.'
  },
  {
    question: 'In B+ Trees, where are the actual data records (or pointers to them) stored?',
    options: [
      'In all internal nodes',
      'Only in the root node',
      'In the leaf nodes',
      'Randomly in any node'
    ],
    correct: 2,
    explanation: 'In B+ Trees, the actual data pointers are stored in the leaf nodes, while internal nodes only store keys for navigation.'
  },
  {
    question: 'Which of the following is TRUE about clustered indexes?',
    options: [
      'There can be multiple clustered indexes per table',
      'Clustered index determines the physical storage order of the rows',
      'Clustered index is always slower than non-clustered index',
      'Clustered index does not support range queries'
    ],
    correct: 1,
    explanation: 'A table can have only one clustered index, and it dictates the physical order of the rows on disk.'
  },
  {
    question: 'Hash indexing is NOT suitable for which type of query?',
    options: [
      'Equality search (WHERE id = 5)',
      'Primary key lookups',
      'Range queries (WHERE id BETWEEN 10 AND 50)',
      'Single-row retrieval'
    ],
    correct: 2,
    explanation: 'Hash indexing does not maintain order, so it cannot efficiently handle range queries, but it is very good for equality searches.'
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
    question: 'Which of the following is TRUE about INNER JOIN?',
    options: [
      'It returns all rows from both tables',
      'It returns only rows with matching values in both tables',
      'It returns rows from left table regardless of match',
      'It returns rows from right table regardless of match'
    ],
    correct: 1,
    explanation: 'INNER JOIN returns only the rows where there is a match between both tables based on the join condition.'
  },
  {
    question: 'Which join returns all rows from the left table and only matching rows from the right table?',
    options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
    correct: 1,
    explanation: 'LEFT JOIN returns all rows from the left table, and NULLs are filled in where no match exists in the right table.'
  },
  {
    question: 'Which join type is best suited for matching sorted tables on the join key?',
    options: ['Nested Loop Join', 'Hash Join', 'Merge Join', 'Cartesian Join'],
    correct: 2,
    explanation: 'Merge Join is most efficient when both inputs are already sorted on the join key.'
  },
  {
    question: 'Which join algorithm is usually the slowest for large, unsorted tables without indexes?',
    options: ['Nested Loop Join', 'Hash Join', 'Merge Join', 'All are equal'],
    correct: 0,
    explanation: 'Nested Loop Join compares each row of one table with all rows of the other, making it inefficient for large, unsorted tables.'
  },
  {
    question: 'Hash Join is generally efficient when:',
    options: [
      'The tables are sorted on the join key',
      'The join condition is equality-based',
      'The tables are very small',
      'The join is based on inequality (<, >)'
    ],
    correct: 1,
    explanation: 'Hash Join is best for equality joins because it partitions the tables into hash buckets based on the join key.'
  },
  {
    question: 'Which query optimization technique moves selection conditions (WHERE filters) as close as possible to the base relations?',
    options: [
      'Join reordering',
      'Selection pushdown',
      'Projection pushdown',
      'Indexing'
    ],
    correct: 1,
    explanation: 'Selection pushdown applies filters early to reduce the number of rows processed in subsequent joins or operations.'
  },
  {
    question: 'Why does join order matter in query optimization?',
    options: [
      'SQL joins are commutative but not associative',
      'Changing join order changes the correctness of the query',
      'Join order affects intermediate result sizes, impacting performance',
      'It only matters in nested loop joins'
    ],
    correct: 2,
    explanation: 'Different join orders can lead to drastically different intermediate result sizes, which can significantly affect query performance.'
  },
  {
    question: 'Which of the following is NOT a query optimization technique?',
    options: [
      'Selection pushdown',
      'Join reordering',
      'Index usage',
      'Using more nested loop joins on purpose'
    ],
    correct: 3,
    explanation: 'Nested loop joins are often avoided in optimization unless indexes make them efficient.'
  },
  {
    question: 'How does indexing help query optimization?',
    options: [
      'It reduces disk I/O by enabling faster lookups',
      'It increases table size',
      'It ensures normalization',
      'It prevents dirty reads'
    ],
    correct: 0,
    explanation: 'Indexes reduce disk I/O and speed up lookups, especially for WHERE clauses and JOIN conditions.'
  },
  {
    question: 'Which join type will return all rows from both tables, filling NULLs where there is no match?',
    options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
    correct: 3,
    explanation: 'FULL OUTER JOIN combines the effects of LEFT JOIN and RIGHT JOIN, returning all rows from both tables.'
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
    question: 'In DBMS storage, what is a page (or block)?',
    options: [
      'The smallest unit of logical database storage',
      'The largest file stored in DBMS',
      'A query execution plan',
      'A physical schema of the database'
    ],
    correct: 0,
    explanation: 'A page (or block) is the smallest fixed-size unit of data transfer between disk and main memory in DBMS.'
  },
  {
    question: 'What is the role of buffer management in DBMS?',
    options: [
      'To handle concurrency control',
      'To manage in-memory copies of disk pages',
      'To parse SQL queries',
      'To manage user authentication'
    ],
    correct: 1,
    explanation: 'Buffer management keeps frequently used pages in memory and decides when to replace them, minimizing disk I/O.'
  },
  {
    question: 'Which of the following is TRUE about heap file organization?',
    options: [
      'Records are stored without any order',
      'Records are stored sorted by key',
      'Records are stored using a hash function',
      'Records cannot be inserted after file creation'
    ],
    correct: 0,
    explanation: 'In heap files, records are stored in arbitrary order, making insertion fast but searching slower.'
  },
  {
    question: 'Which file organization provides efficient equality search if data is sorted?',
    options: [
      'Heap file',
      'Sorted file',
      'Hashed file',
      'Sequential file'
    ],
    correct: 1,
    explanation: 'Sorted files enable binary search on key values, making equality and range searches efficient.'
  },
  {
    question: 'Hashing in DBMS is best suited for:',
    options: [
      'Range queries',
      'Equality searches',
      'Sorting queries',
      'Sequential scans'
    ],
    correct: 1,
    explanation: 'Hashing provides fast equality searches by mapping keys to buckets, but it is not efficient for range queries.'
  },
  {
    question: 'What is sequential file organization?',
    options: [
      'Records are stored in no particular order',
      'Records are stored in sorted order of a key field',
      'Records are stored using hashing',
      'Records are stored in memory only'
    ],
    correct: 1,
    explanation: 'In sequential file organization, records are physically stored in sorted order of a key field, supporting efficient sequential access.'
  },
  {
    question: 'Which of the following is a disadvantage of heap files?',
    options: [
      'Slow searches due to lack of order',
      'High insertion time',
      'No support for updates',
      'They cannot grow beyond a fixed size'
    ],
    correct: 0,
    explanation: 'Heap files allow fast insertion but searching requires scanning all records since they are unordered.'
  },
  {
    question: 'What is the typical size of a DBMS block/page?',
    options: [
      'A few bytes',
      '1–8 KB',
      '100–500 MB',
      'It must match the database size'
    ],
    correct: 1,
    explanation: 'Database blocks/pages are usually 1–8 KB in size, matching the underlying OS block size.'
  },
  {
    question: 'Which file organization is best for range queries?',
    options: [
      'Heap file',
      'Sorted file',
      'Hashed file',
      'None of these'
    ],
    correct: 1,
    explanation: 'Sorted files support efficient range queries since records are stored in order.'
  },
  {
    question: 'In buffer management, replacement policies (like LRU) are used to:',
    options: [
      'Decide which query to run next',
      'Decide which page to evict from memory',
      'Decide which file to load from disk',
      'Decide which user to disconnect'
    ],
    correct: 1,
    explanation: 'Replacement policies such as LRU (Least Recently Used) help choose which page to evict from the buffer when space is needed.'
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
    question: 'Which of the following best describes a Key-Value database?',
    options: [
      'Stores data as documents in JSON/XML format',
      'Stores data as rows and columns in tables',
      'Stores data as simple key-value pairs',
      'Stores data as nodes and edges with relationships'
    ],
    correct: 2,
    explanation: 'Key-Value databases (like Redis, DynamoDB) store data as simple key-value pairs, making them fast for lookups.'
  },
  {
    question: 'Which NoSQL type is most suitable for semi-structured data like JSON?',
    options: [
      'Key-Value Store',
      'Document Store',
      'Columnar Store',
      'Graph Database'
    ],
    correct: 1,
    explanation: 'Document stores (e.g., MongoDB, CouchDB) are designed for semi-structured JSON/XML documents.'
  },
  {
    question: 'Which type of NoSQL DB organizes data into columns and is best for analytical queries?',
    options: [
      'Document Store',
      'Key-Value Store',
      'Columnar Store',
      'Graph Database'
    ],
    correct: 2,
    explanation: 'Columnar databases (e.g., Cassandra, HBase) are optimized for analytical workloads by grouping data by columns instead of rows.'
  },
  {
    question: 'Graph databases are best suited for:',
    options: [
      'E-commerce transaction logs',
      'Storing and querying relationships, like social networks',
      'Real-time caching',
      'Logging events in time-series format'
    ],
    correct: 1,
    explanation: 'Graph databases (e.g., Neo4j) excel at handling relationships, making them ideal for social networks, recommendation engines, etc.'
  },
  {
    question: 'Which NoSQL type would you choose for caching user sessions?',
    options: [
      'Key-Value Store',
      'Document Store',
      'Columnar Store',
      'Graph Database'
    ],
    correct: 0,
    explanation: 'Key-Value stores like Redis are ideal for fast session management and caching.'
  },
  {
    question: 'In which scenario is NoSQL generally preferred over SQL?',
    options: [
      'When strict ACID transactions are required',
      'When data is highly structured with fixed schema',
      'When dealing with big data, scalability, and flexible schema',
      'When designing financial transaction systems'
    ],
    correct: 2,
    explanation: 'NoSQL is preferred when working with large, unstructured/semi-structured data requiring scalability and flexible schema.'
  },
  {
    question: 'Which NoSQL type would be best for recommendation engines and fraud detection?',
    options: [
      'Document Store',
      'Graph Database',
      'Columnar Store',
      'Key-Value Store'
    ],
    correct: 1,
    explanation: 'Graph databases are excellent for traversing relationships, making them ideal for recommendations and fraud detection.'
  },
  {
    question: 'Cassandra and HBase are examples of:',
    options: [
      'Document Databases',
      'Key-Value Stores',
      'Columnar Databases',
      'Graph Databases'
    ],
    correct: 2,
    explanation: 'Cassandra and HBase are distributed column-oriented NoSQL databases.'
  },
  {
    question: 'MongoDB is an example of:',
    options: [
      'Key-Value Store',
      'Document Store',
      'Columnar Store',
      'Graph Database'
    ],
    correct: 1,
    explanation: 'MongoDB is a document-oriented database that stores data in BSON (JSON-like) format.'
  },
  {
    question: 'Which of the following is NOT a typical advantage of NoSQL over SQL?',
    options: [
      'Flexible schema',
      'Horizontal scalability',
      'Strict relational joins',
      'Handling semi-structured data'
    ],
    correct: 2,
    explanation: 'Strict relational joins are a feature of SQL, not NoSQL, which usually avoids complex joins for scalability.'
  }
]
  }
];