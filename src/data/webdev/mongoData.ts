export const mongoData = {
  url: "https://youtu.be/c2M-rlkkT5o",
  title: "MongoDB Fundamentals",
  subjectInfo: {
    title: "MongoDB",
    description: "Learn the fundamentals of MongoDB, a NoSQL database that provides high performance, high availability, and easy scalability.",
    color: "from-green-600 to-green-800"
  },
  videos: [
    {
      id: "1",
      title: "MongoDB Crash Course",
      url: "https://youtu.be/c2M-rlkkT5o",
      duration: "1:00:00",
      watched: false
    }
  ],
  quizzes: {
    "1": [
      {
        question: "What type of database is MongoDB?",
        options: [
          "Relational",
          "Document-Oriented",
          "Graph",
          "Key-Value"
        ],
        correct: 1,
        explanation: "MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like documents."
      },
      {
        question: "In MongoDB, what does the term 'collection' refer to?",
        options: [
          "A group of databases",
          "A single document",
          "A group of documents",
          "A type of index"
        ],
        correct: 2,
        explanation: "In MongoDB, a collection is a grouping of MongoDB documents, similar to a table in relational databases."
      },
      {
        question: "What is the outcome of the command db.createCollection(\"myCollection\")?",
        options: [
          "Creates a new document",
          "Deletes a collection",
          "Creates a new collection",
          "Updates a collection"
        ],
        correct: 2,
        explanation: "The createCollection() method creates a new collection in the current database."
      },
      {
        question: "What is the default port for MongoDB server?",
        options: ["27015", "28017", "27017", "8080"],
        correct: 2,
        explanation: "The default port for MongoDB server is 27017."
      },
      {
        question: "What command is used to insert a document into a collection?",
        options: [
          "db.collection.put()",
          "db.collection.add()",
          "db.collection.insertDocument()",
          "db.collection.insertOne()"
        ],
        correct: 3,
        explanation: "The insertOne() method is used to insert a single document into a collection."
      },
      {
        question: "How does MongoDB scale horizontally for load balancing purposes?",
        options: ["Replication", "Sharding", "Partitioning", "Fragmentation"],
        correct: 1,
        explanation: "MongoDB uses sharding to scale horizontally by partitioning data across multiple servers."
      },
      {
        question: "What is the primary daemon process for MongoDB?",
        options: ["mongod", "mongos", "syspathlog", "logpath"],
        correct: 0,
        explanation: "The primary daemon process for MongoDB is 'mongod' which handles data requests, manages data access, and performs background management operations."
      },
      {
        question: "Which method is used to verify whether MongoDB used index intersection?",
        options: [
          "explain()",
          "intersect()",
          "analyze()",
          "none of the mentioned"
        ],
        correct: 0,
        explanation: "The explain() method provides information on the query plan, including whether index intersection was used."
      },
      {
        question: "What is BSON in MongoDB?",
        options: [
          "Binary JSON",
          "Basic SQL Object Notation",
          "Binary Sequence of Numbers",
          "Big Storage Object Network"
        ],
        correct: 0,
        explanation: "BSON stands for Binary JSON, which is a binary-encoded serialization of JSON-like documents."
      },
      {
        question: "Which of the following sorts documents in ascending order?",
        options: ["sort(1)", "sort(-1)", "find(1)", "find(-1)"],
        correct: 0,
        explanation: "sort(1) sorts documents in ascending order, while sort(-1) sorts in descending order."
      },
      {
        question: "How do you update a document in a MongoDB collection?",
        options: [
          "use updateOne() or updateMany()",
          "modify()",
          "set()",
          "updateDoc()"
        ],
        correct: 0,
        explanation: "MongoDB provides updateOne() to update a single document and updateMany() to update multiple documents."
      },
      {
        question: "Which of the following ensures atomic transactions in MongoDB?",
        options: [
          "Isolation Level",
          "Consistency Parameter",
          "WriteConcern",
          "SecureWrite"
        ],
        correct: 2,
        explanation: "WriteConcern describes the level of acknowledgment requested from MongoDB for write operations."
      },
      {
        question: "What is a 'shard' in the context of MongoDB?",
        options: [
          "An index type",
          "A type of collection used for caching",
          "A copy of the database used for backup",
          "A partition of data in a sharded cluster"
        ],
        correct: 3,
        explanation: "A shard is a single MongoDB instance that holds a subset of the sharded data."
      },
      {
        question: "Which operator is used for joining two collections?",
        options: ["$join", "$lookup", "$match", "$aggregate"],
        correct: 1,
        explanation: "The $lookup operator performs a left outer join to an unsharded collection in the same database."
      },
      {
        question: "Which method removes all documents from a MongoDB collection without dropping it?",
        options: [
          "db.collection.remove({})",
          "db.collection.truncate()",
          "db.collection.drop()",
          "db.collection.deleteAll()"
        ],
        correct: 0,
        explanation: "db.collection.remove({}) removes all documents from a collection without removing the collection itself."
      },
      {
        question: "What is the purpose of MongoDB's replication feature?",
        options: [
          "Data partitioning",
          "Horizontal scaling",
          "High availability and redundancy",
          "Command logging"
        ],
        correct: 2,
        explanation: "Replication provides redundancy and high availability by maintaining multiple copies of data on different database servers."
      },
      {
        question: "Which of the following creates a unique index on a field?",
        options: [
          "db.collection.createIndex({field:1}, {unique:true})",
          "db.collection.index({field:1})",
          "db.collection.addUnique({field:1})",
          "db.collection.uniquify({field:1})"
        ],
        correct: 0,
        explanation: "The createIndex() method with the unique option creates a unique index on the specified field."
      },
      {
        question: "What is the use of the skip() method?",
        options: [
          "Skips documents matching a filter",
          "Skips the first n documents in a query result",
          "Skips errors during insert",
          "Skips whole collections"
        ],
        correct: 1,
        explanation: "The skip() method controls where MongoDB begins returning results, effectively skipping the first n documents."
      },
      {
        question: "How are documents stored in MongoDB collections?",
        options: [
          "As plain text",
          "As BSON documents",
          "As SQL tables",
          "As binary logs"
        ],
        correct: 1,
        explanation: "MongoDB stores documents in BSON format, a binary representation of JSON-like documents."
      },
      {
        question: "Which command provides details about query performance in MongoDB?",
        options: [
          "db.status()",
          "explain()",
          "analysis()",
          "profiler()"
        ],
        correct: 1,
        explanation: "The explain() method provides information on the query execution, including performance statistics."
      }
    ]
  },
  projectIdeas: []
};
