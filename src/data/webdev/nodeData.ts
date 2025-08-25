export const nodeData = {
  url: "https://youtu.be/Oe421EPjeBE",
  title: "Node.js Fundamentals",
  subjectInfo: {
    title: "Node.js",
    description: "Learn the fundamentals of Node.js, a JavaScript runtime built on Chrome's V8 JavaScript engine.",
    color: "from-green-500 to-emerald-600"
  },
  videos: [
    {
      id: "1",
      title: "Node.js Crash Course",
      url: "https://youtu.be/Oe421EPjeBE",
      duration: "8:16:48",
      watched: false
    }
  ],
  quizzes: {
    "1": [
      {
        question: "What is Node.js primarily used for?",
        options: [
          "Client-side scripting",
          "Server-side JavaScript runtime",
          "Database management",
          "Styling web pages"
        ],
        correct: 1
      },
      {
        question: "Which Node.js module is used to handle HTTP requests?",
        options: [
          "http",
          "fs",
          "url",
          "path"
        ],
        correct: 0
      },
      {
        question: "What does the method fs.readFile() do in Node.js?",
        options: [
          "Reads content of a file asynchronously",
          "Writes data to a file",
          "Deletes a file",
          "Creates a new file"
        ],
        correct: 0
      },
      {
        question: "Which command is used to install Express.js in a Node.js project?",
        options: [
          "npm install express",
          "node install express",
          "npm add express",
          "node add express"
        ],
        correct: 0
      },
      {
        question: "In Express.js, what is middleware used for?",
        options: [
          "Routing and URL mapping",
          "Request and response processing",
          "Adding functionality to requests",
          "All of the above"
        ],
        correct: 3
      },
      {
        question: "What is the purpose of the next() function in Express middleware?",
        options: [
          "To skip current middleware",
          "To call the next middleware function",
          "To end the request",
          "To send response"
        ],
        correct: 1
      },
      {
        question: "How do you start a server listening on port 3000 in Express?",
        options: [
          "app.listen(3000)",
          "app.run(3000)",
          "server.listen(3000)",
          "start(3000)"
        ],
        correct: 0
      },
      {
        question: "How can you send a JSON response in Express?",
        options: [
          "res.json()",
          "res.sendJson()",
          "res.send()",
          "res.jsonify()"
        ],
        correct: 0
      },
      {
        question: "Which Express middleware is used to parse incoming JSON payloads?",
        options: [
          "express.urlencoded()",
          "express.json()",
          "express.bodyParser()",
          "express.static()"
        ],
        correct: 1
      },
      {
        question: "How do you serve static files like images in Express?",
        options: [
          "app.static()",
          "express.static()",
          "app.useStatic()",
          "express.static"
        ],
        correct: 1
      },
      {
        question: "What is the use of app.use() in Express?",
        options: [
          "To define middleware",
          "To define routes",
          "To start the server",
          "To import libraries"
        ],
        correct: 0
      },
      {
        question: "Which method do you use to redirect a request in Express?",
        options: [
          "res.redirect()",
          "res.sendRedirect()",
          "res.go()",
          "redirect()"
        ],
        correct: 0
      },
      {
        question: "What is the default template engine used by Express?",
        options: [
          "EJS",
          "Pug",
          "Handlebars",
          "No default engine"
        ],
        correct: 3
      },
      {
        question: "Which command initializes a new Node.js project?",
        options: [
          "npm init",
          "npm start",
          "node init",
          "npm new"
        ],
        correct: 0
      },
      {
        question: "What does the fs module provide in Node.js?",
        options: [
          "File system utilities",
          "Network utilities",
          "Database connectors",
          "HTTP utilities"
        ],
        correct: 0
      },
      {
        question: "How do you handle errors in Express?",
        options: [
          "Using error-handling middleware",
          "Try-catch blocks everywhere",
          "Using app.handleError()",
          "Using next() with error"
        ],
        correct: 0
      },
      {
        question: "What is the tile module in Node.js used for?",
        options: [
          "Not a valid Node.js module",
          "Database management",
          "HTTP utilities",
          "File streaming"
        ],
        correct: 0
      },
      {
        question: "How do you import modules in Node.js?",
        options: [
          "import",
          "require",
          "include",
          "using"
        ],
        correct: 1
      },
      {
        question: "What is the advantage of using asynchronous functions in Node.js?",
        options: [
          "Non-blocking I/O",
          "Simpler coding",
          "More memory usage",
          "Blocking execution"
        ],
        correct: 0
      },
      {
        question: "What does app.use(express.static('public')) do?",
        options: [
          "Serves files in the public directory",
          "Blocks access to the public directory",
          "Uploads files to public",
          "Deletes files in public"
        ],
        correct: 0
      }
    ]
  },
  projectIdeas: []
};
