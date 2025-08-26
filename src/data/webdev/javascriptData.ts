export const javascriptData = {
  url: "https://youtu.be/ajdRvxDWH4w",
  title: "JavaScript Quiz: Variables and Datatypes",
  subjectInfo: {
    title: "JavaScript",
    description: "Learn JavaScript programming from basics to advanced concepts.",
    color: "from-yellow-400 to-orange-500"
  },
  videos: [
    {
      id: "1",
      title: "1. Variables and Datatypes",
      url: "https://youtu.be/ajdRvxDWH4w",
      duration: "1:21:11",
      watched: false
    },
    {
      id: "2",
      title: "2. Operators and Conditional Statements",
      url: "https://youtu.be/Zg4-uSjxosE",
      duration: "1:16:47",
      watched: false
    },
    {
      id: "3",
      title: "3. Loops and Strings",
      url: "https://youtu.be/UmRtFFSDSFo",
      duration: "1:21:09",
      watched: false
    },
    {
      id: "4",
      title: "4. Arrays",
      url: "https://youtu.be/gFWhbjzowrM",
      duration: "1:00:26",
      watched: false
    },
    {
      id: "5",
      title: "5. Functions and Methods",
      url: "https://youtu.be/P0XMXqDGttU",
      duration: "1:09:10",
      watched: false
    },
    {
      id: "6",
      title: "6. DOM Document Object Model",
      url: "https://youtu.be/7zcXPCt8Ck0",
      duration: "1:22:31",
      watched: false
    },
    {
      id: "7",
      title: "7. DOM(Part 2)",
      url: "https://youtu.be/fXAGTOZ25H8",
      duration: "27:56",
      watched: false
    },
    {
      id: "8",
      title: "8. Events",
      url: "https://youtu.be/_i-uLJAh79U",
      duration: "33:12",
      watched: false
    },
    {
      id: "9",
      title: "9. Classes and Objects",
      url: "https://youtu.be/N-O4w6PynGY",
      duration: "1:00:43",
      watched: false
    },
    {
      id: "10",
      title: "10. Callbacks Promises and Async Await",
      url: "https://youtu.be/d3jXofmQm44",
      duration: "1:23:55",
      watched: false
    },
    {
      id: "11",
      title: "11. Fetch API",
      url: "https://youtu.be/CyGodpqcid4",
      duration: "1:17:15",
      watched: false
    }
  ],
  quizzes: {
    "1": [
      {
        question: "Which keyword is used to declare a variable that cannot be reassigned?",
        options: ["var", "let", "const", "static"],
        correct: 2,
        explanation: "The 'const' keyword creates a constant variable that cannot be reassigned after declaration. 'let' and 'var' allow reassignment."
      },
      {
        question: "Which of the following is a primitive data type in JavaScript?",
        options: ["Array", "Object", "Symbol", "Function"],
        correct: 2,
        explanation: "Symbol is a primitive data type in JavaScript. Arrays, Objects, and Functions are non-primitive (reference) types."
      },
      {
        question: "What will be the value of a variable that is declared but not initialized?",
        options: ["0", "null", "undefined", "false"],
        correct: 2,
        explanation: "Variables that are declared but not initialized have the value 'undefined' in JavaScript. This is the default value for uninitialized variables."
      },
      {
        question: "Which operator is used to determine the data type of a variable in JavaScript?",
        options: ["typeof", "typeOf()", "dataType()", "isType"],
        correct: 0,
        explanation: "The 'typeof' operator returns a string indicating the type of a variable or expression. It's used to check data types at runtime."
      },
      {
        question: "Which of the following is the correct way to declare a variable in JavaScript?",
        options: ["var name", "var = name", "let name", "variable name"],
        correct: 2,
        explanation: "Both 'var name' and 'let name' are correct ways to declare variables. 'let' is the modern ES6 way, while 'var' is the traditional method."
      },
      {
        question: "What is the output of the following code?\n\nlet x = \"Hello\";\nlet y = 5;\nconsole.log(x + y);",
        options: ["Hello5", "5Hello", "NaN", "Hello"],
        correct: 0,
        explanation: "When concatenating a string with a number using +, JavaScript converts the number to a string and concatenates them, resulting in 'Hello5'."
      },
      {
        question: "Which variable names are correct according to JavaScript?",
        options: ["let 1name;", "let #name;", "let _name;", "let $_name;"],
        correct: 2
      },
      {
        question: "What is the type of value stored in an array in JavaScript?",
        options: ["Only strings", "Only numbers", "Only objects", "Any type (mixed data types allowed)"],
        correct: 3
      },
      {
        question: "What is the type of null in JavaScript?",
        options: ["null", "object", "undefined", "string"],
        correct: 1
      },
      {
        question: "How do you interpolate a variable into a string using template literals?",
        options: ["\"My name is \" + name", "\"My name is ${name}\"", "`My name is ${name}`", "'My name is ' + name"],
        correct: 2
      }
    ],
    "2": [
      {
        question: "Which of the following is the strict equality operator in JavaScript (checks value and type)?",
        options: ["==", "=", "===", "!="],
        correct: 2
      },
      {
        question: "What will be the result of 5 % 2 in JavaScript?",
        options: ["0", "1", "2", "2.5"],
        correct: 1
      },
      {
        question: "Which operator is used for logical AND?",
        options: ["&", "&&", "|", "||"],
        correct: 1
      },
      {
        question: "Which of the following is NOT a comparison operator in JavaScript?",
        options: ["!=", "<=", "=>", "==="],
        correct: 2
      },
      {
        question: "What is the result of the following code?\n\nlet a = 4;\nlet b = 3;\nlet result = a > b ? 'Yes' : 'No';\nconsole.log(result);",
        options: ["true", "false", "Yes", "No"],
        correct: 2
      },
      {
        question: "How will you check if variable x is either greater than 10 or less than 5 in JavaScript?",
        options: ["if (x > 10 && x < 5)", "if (x > 10 or x < 5)", "if (x > 10 || x < 5)", "if (x > 10 &&& x < 5)"],
        correct: 2
      },
      {
        question: "Which of the following descriptions about the ternary operator is correct?",
        options: ["It’s another name for ==", "It returns one of two values based on a condition", "It’s only used for addition", "It compares just the data type"],
        correct: 1
      },
      {
        question: "What is the output of the following?\n\nlet y = 3;\nif(y == '3') { console.log('equal'); } else { console.log('not equal'); }",
        options: ["equal", "not equal", "undefined", "error"],
        correct: 0
      },
      {
        question: "What does the ‘!’ operator do in a conditional statement?",
        options: ["Assigns a value", "Returns true", "Negates a boolean value", "Adds two numbers"],
        correct: 2
      },
      {
        question: "What will be the output?\n\nlet flag = false;\nif(!flag) { console.log('Go'); } else { console.log('Stop'); }",
        options: ["Go", "Stop", "true", "false"],
        correct: 0
      }
    ],
    "3": [
      // Loops
      {
        question: "Which of the following is NOT a type of loop in JavaScript?",
        options: ["for", "while", "repeat", "do...while"],
        correct: 2
      },
      {
        question: "Which loop is guaranteed to execute its block at least once, regardless of the condition?",
        options: ["for", "while", "do...while", "foreach"],
        correct: 2
      },
      {
        question: "How many times will \"Hello\" be printed by this code?\n\nlet count = 0;\nwhile (count < 3) {\n  console.log(\"Hello\");\n  count++;\n}",
        options: ["1", "2", "3", "0"],
        correct: 2
      },
      {
        question: "What is the output of the following JavaScript code?\n\nlet arr = [1, 2, 3];\nfor (let i = 0; i < arr.length; i++) {\n  console.log(arr[i]);\n}",
        options: ["1 2 3", "0 1 2", "3 2 1", ""],
        correct: 0
      },
      {
        question: "Which loop would you use to iterate over the properties of an object?",
        options: ["for", "for...of", "for...in", "do...while"],
        correct: 2
      },
      // Strings
      {
        question: "What is the result of the following code?\n\nlet str = \"JavaScript\";\nconsole.log(str.length);",
        options: ["JavaScript", "10", "11", "10"],
        correct: 1
      },
      {
        question: "How do you convert all letters of a string to uppercase in JavaScript?",
        options: ["str.upper()", "str.touppercase()", "str.toUpperCase()", "toUppercase(str)"],
        correct: 2
      },
      {
        question: "Which method is used to extract a part of a string?",
        options: ["slice()", "substr()", "substring()", "All of the above"],
        correct: 3
      },
      {
        question: "What does str.indexOf(\"a\") return if 'str' is \"JavaScript\"?",
        options: ["0", "1", "-1", "2"],
        correct: 1
      },
      {
        question: "Which is the correct way to concatenate two strings a and b?",
        options: ["a && b", "a.concat(b)", "a + b", "Both b and c"],
        correct: 3
      }
    ],
    "4": [
      {
        question: "How do you declare an array in JavaScript?",
        options: ["let arr = ();", "let arr = [];", "let arr = {};", "let arr = <>;"],
        correct: 1
      },
      {
        question: "What does the push() method do?",
        options: ["Removes the last element", "Adds an element at the end", "Removes the first element", "Adds an element at the beginning"],
        correct: 1
      },
      {
        question: "What is the output?\n\nlet fruits = ['apple', 'banana', 'cherry'];\nconsole.log(fruits[1]);",
        options: ["apple", "banana", "cherry", "undefined"],
        correct: 1
      },
      {
        question: "Which method removes the last element from an array and returns it?",
        options: ["removeLast()", "pop()", "shift()", "slice()"],
        correct: 1
      },
      {
        question: "How do you check the length of an array arr?",
        options: ["arr.count()", "len(arr)", "arr.size", "arr.length"],
        correct: 3
      },
      {
        question: "Which of these methods joins all elements of an array into a single string?",
        options: ["toString()", "join()", "concat()", "Both a and b"],
        correct: 3
      },
      {
        question: "What will Array.isArray(['a', 'b', 'c']) return?",
        options: ["true", "false", "'array'", "undefined"],
        correct: 0
      },
      {
        question: "What does the map() method return?",
        options: ["A new array", "A single value", "A string", "Nothing"],
        correct: 0
      },
      {
        question: "What method would you use to remove the first element from an array?",
        options: ["shift()", "pop()", "unshift()", "slice()"],
        correct: 0
      },
      {
        question: "Which technique is used to loop through each element in an array?",
        options: ["forEach()", "for...in", "map()", "All of the above"],
        correct: 3
      }
    ],
    "5": [
      {
        question: "How do you define a standard function in JavaScript?",
        options: [
          "function: myFunc() {}",
          "def myFunc() {}",
          "function myFunc() {}",
          "create function myFunc() {}"
        ],
        correct: 2
      },
      {
        question: "How do you call a function named greet?",
        options: [
          "greet[]",
          "call greet()",
          "greet()",
          "call function greet"
        ],
        correct: 2
      },
      {
        question: "Which keyword is used to return a value from a function?",
        options: [
          "stop",
          "end",
          "return",
          "output"
        ],
        correct: 2
      },
      {
        question: "What is a method in JavaScript?",
        options: [
          "Any standalone function",
          "A function associated with an object",
          "A variable declared inside a function",
          "An array function"
        ],
        correct: 1
      },
      {
        question: "Which of the following is a valid function expression in JavaScript?",
        options: [
          "let sum = function(a, b) { return a + b; };",
          "function = sum(a, b) { return a + b; }",
          "let sum(a, b) = { return a + b; };",
          "func sum(a, b) { return a + b; };"
        ],
        correct: 0
      },
      {
        question: "What will the following code output?\n\nfunction test(x) { return typeof x; }\nconsole.log(test(function(){}));",
        options: [
          "object",
          "function",
          "undefined",
          "string"
        ],
        correct: 1
      },
      {
        question: "How can you immediately invoke an anonymous function in JavaScript?",
        options: [
          "function(){}();",
          "(function() {})();",
          "invoke(function(){});",
          "run function(){};"
        ],
        correct: 1
      },
      {
        question: "Which method executes a provided function once for each array element?",
        options: [
          "map()",
          "reduce()",
          "forEach()",
          "slice()"
        ],
        correct: 2
      },
      {
        question: "What is a callback function in JavaScript?",
        options: [
          "A function called inside another function as an argument",
          "A function that returns another function",
          "A method of an object",
          "A built-in function"
        ],
        correct: 0
      },
      {
        question: "Which method is used to schedule a function to run after a specified delay?",
        options: [
          "delay()",
          "setInterval()",
          "setTimeout()",
          "timeout()"
        ],
        correct: 2
      }
    ],
    "6": [
      {
        question: "Which method is used to select an element by its ID?",
        options: ["getElementByClass()", "getElementById()", "querySelectorAll()", "getById()"],
        correct: 1
      },
      {
        question: "What does document.querySelectorAll() return?",
        options: ["An array of elements", "A single element", "A NodeList", "Undefined"],
        correct: 2
      },
      {
        question: "How do you change the inner text of an element in the DOM?",
        options: ["element.innerText = \"New Text\";", "element.textContent = \"New Text\";", "element.innerHTML = \"New Text\";", "All of the above"],
        correct: 3
      },
      {
        question: "What is the purpose of document.createElement('button')?",
        options: ["Selects the first button", "Creates a new button element", "Removes a button element", "Edits an existing button"],
        correct: 1
      },
      {
        question: "Which command appends a new element to the document body?",
        options: ["document.body.appendChild(element);", "document.insert(element);", "window.appendChild(element);", "document.body.add(element);"],
        correct: 0
      },
      {
        question: "How can you remove an element from the DOM?",
        options: ["element.remove();", "element.delete();", "element.destroy();", "element.clear();"],
        correct: 0
      },
      {
        question: "Which event is triggered when the DOM is fully loaded?",
        options: ["onload", "DOMContentLoaded", "load", "domComplete"],
        correct: 1
      },
      {
        question: "How do you access an HTML element with the id 'myElement' using JavaScript?",
        options: ["document.querySelector(\"#myElement\")", "document.getElementById(\"myElement\")", "Both a and b", "document.getElementsByName(\"myElement\")"],
        correct: 2
      },
      {
        question: "Which method is used to set an attribute on a DOM element?",
        options: ["element.getAttribute()", "element.createAttribute()", "element.setAttribute()", "element.makeAttribute()"],
        correct: 2
      },
      {
        question: "What does window.alert() do?",
        options: ["Logs a message to the console", "Shows a confirmation box", "Displays an alert box with a message", "Refreshes the browser"],
        correct: 2
      }
    ],
    "7": [
      {
        question: "What does element.cloneNode(true) do?",
        options: ["Clones the element and its children", "Clones only the element without children", "Moves the element", "Deletes the element"],
        correct: 0
      },
      {
        question: "Given a reference to a <div id=\"box\"></div>, which removes the element from the DOM but leaves its variable reference?",
        options: ["box.delete();", "box.parentNode.removeChild(box);", "box.destroy();", "box.innerHTML = \"\";"],
        correct: 1
      },
      {
        question: "What will element.matches('.className') return?",
        options: ["The first matching element", "true if the element matches the selector", "All matching elements", "The tag name of the element"],
        correct: 1
      },
      {
        question: "How can you efficiently listen for clicks on many dynamically generated <li> elements inside a single <ul>?",
        options: ["Add a click listener to every <li>", "Add one click listener to the <ul> and use event delegation", "Only set listeners after generating all elements", "Use setInterval inside each <li>"],
        correct: 1
      },
      {
        question: "What does document.documentElement refer to?",
        options: ["<body> element", "The root <html> element", "The document’s <head>", "The first script tag"],
        correct: 1
      },
      {
        question: "Which property or method accesses custom data-* attributes in JavaScript?",
        options: ["element.dataset", "element.data", "element.getData()", "element.dataAttribute"],
        correct: 0
      },
      {
        question: "Which method observes changes to the DOM tree (like node additions/removals)?",
        options: ["DOMObserver", "NodeList.watch()", "MutationObserver", "TreeWalker"],
        correct: 2
      },
      {
        question: "How can you get the computed CSS value of an element’s “margin-top”?",
        options: ["element.computedStyle.marginTop", "getComputedStyle(element).marginTop", "element.style.marginTop", "element.currentStyle.marginTop"],
        correct: 1
      },
      {
        question: "What does element.insertAdjacentHTML('beforeend', '<span>text</span>') do?",
        options: ["Replaces the element with a span", "Inserts the span after the element", "Inserts the span inside the element before the ending tag", "Does nothing"],
        correct: 2
      },
      {
        question: "Which method allows you to move DOM nodes from one parent to another?",
        options: ["copyChild()", "appendChild()", "replaceChild()", "transferNode()"],
        correct: 1
      }
    ],
    "8": [
      {
        question: "What does the addEventListener() method’s third parameter control?",
        options: ["Event type", "Event phase (capture or bubble)", "Event target", "Event default action"],
        correct: 1
      },
      {
        question: "What is event delegation in JavaScript?",
        options: ["Adding multiple event listeners to child elements", "Using a single event listener on a parent to handle events on its children", "Removing all event listeners at once", "Delaying event execution"],
        correct: 1
      },
      {
        question: "Which method prevents the default action associated with an event?",
        options: ["stopDefault()", "preventDefault()", "cancel()", "stopEvent()"],
        correct: 1
      },
      {
        question: "What does event.stopPropagation() do?",
        options: ["Prevents the default action", "Stops the event from bubbling up or down the DOM hierarchy", "Cancels the event", "Pauses the event"],
        correct: 1
      },
      {
        question: "What’s the difference between event.target and event.currentTarget?",
        options: ["No difference", "event.target is where the event listener is attached; event.currentTarget is the element that triggered the event", "event.target is the element that triggered the event; event.currentTarget is the element where handler is attached", "Both refer to the event handler"],
        correct: 2
      },
      {
        question: "Which property determines the type of the event triggered?",
        options: ["event.name", "event.type", "event.trigger", "event.category"],
        correct: 1
      },
      {
        question: "Which event will fire when you hold/press down a keyboard key?",
        options: ["keypress", "keydown", "keyup", "keyhold"],
        correct: 1
      },
      {
        question: "How would you schedule code to execute once, after a 2-second delay in response to an event?",
        options: ["setTimeout(callback, 2000)", "wait(2000, callback)", "setDelay(callback, 2000)", "setInterval(callback, 2000)"],
        correct: 0
      },
      {
        question: "What is the result of this code?\n\ndocument.addEventListener(\"click\", () => console.log(\"Document clicked\"));\ndocument.body.addEventListener(\"click\", () => console.log(\"Body clicked\"));\n// User clicks the body",
        options: ["Document clicked", "Body clicked", "Body clicked, Document clicked", "Document clicked, Body clicked"],
        correct: 2
      },
      {
        question: "Why would you use throttling/debouncing for event handlers like scroll or resize?",
        options: ["To avoid memory leaks", "To limit the frequency of function execution and improve performance", "To block events entirely", "To trigger default actions only"],
        correct: 1
      }
    ],
    "9": [
      {
        question: "What is a class in JavaScript?",
        options: ["A built-in object for arrays", "A blueprint for creating objects", "A method for object sorting", "Only for functional inheritance"],
        correct: 1
      },
      {
        question: "Which method in a JavaScript class is used to initialize new instances?",
        options: ["init()", "start()", "constructor()", "setup()"],
        correct: 2
      },
      {
        question: "How do you create an instance of a class named Car?",
        options: ["Car()", "create Car()", "new Car()", "Car.new()"],
        correct: 2
      },
      {
        question: "Which keyword allows one class to inherit from another?",
        options: ["inherit", "extend", "subclass", "extends"],
        correct: 3
      },
      {
        question: "What is the purpose of the super() keyword in a constructor?",
        options: ["Create a static method", "Call parent class’ constructor", "Destroy an instance", "Export a class"],
        correct: 1
      },
      {
        question: "Which is a valid way to define an object in JavaScript?",
        options: ["let obj = Object[];", "let obj = {};", "let obj = create Object;", "let obj = []{};"],
        correct: 1
      },
      {
        question: "How do you access a property named color in an object named car?",
        options: ["car->color", "car.color", "car[\"color\"]", "Both b and c"],
        correct: 3
      },
      {
        question: "Which method merges the properties of two objects?",
        options: ["Object.merge()", "Object.assign()", "Object.add()", "Object.combine()"],
        correct: 1
      },
      {
        question: "What will Object.freeze(obj) do?",
        options: ["Prevent new properties", "Make the object immutable", "Prevent existing properties from being changed", "All of the above"],
        correct: 3
      },
      {
        question: "How do you define a method inside a class in JavaScript?",
        options: ["function methodName() {}", "methodName() {}", "method: function() {}", "define methodName() {}"],
        correct: 1
      }
    ],
    "10": [
      {
        question: "What is a callback in JavaScript?",
        options: ["A synchronous function", "A function passed as an argument to another function to be executed later", "A function returned from another function", "A built-in looping method"],
        correct: 1
      },
      {
        question: "Which of the following is a problem commonly associated with callbacks?",
        options: ["Synchronous execution", "Callback hell (deeply nested code)", "Automatic error handling", "Always slower code"],
        correct: 1
      },
      {
        question: "What is the primary purpose of a Promise in JavaScript?",
        options: ["To execute code synchronously", "To provide a cleaner way to handle asynchronous operations and results", "To replace loops", "To create objects"],
        correct: 1
      },
      {
        question: "Which method handles a fulfilled promise?",
        options: ["handle()", "then()", "catch()", "finally()"],
        correct: 1
      },
      {
        question: "How do you handle errors in promises?",
        options: [".fail()", ".then()", ".catch()", ".error()"],
        correct: 2
      },
      {
        question: "If an async function returns a value, what does it actually return?",
        options: ["The value immediately", "A rejected promise", "A promise that resolves to that value", "An array"],
        correct: 2
      },
      {
        question: "What is the purpose of the await keyword?",
        options: ["Delays code execution indefinitely", "Pauses execution of an async function until a promise resolves", "Only works outside async functions", "Cancels a promise"],
        correct: 1
      },
      {
        question: "Which structure is commonly used for error handling with async/await?",
        options: ["try...catch", "if...else", "promise.catch()", "do...while"],
        correct: 0
      },
      {
        question: "What happens if you forget “await” when calling a promise in an async function?",
        options: ["You get a syntax error", "The promise is not executed", "The function returns a pending promise, not the resolved value", "Nothing happens"],
        correct: 2
      },
      {
        question: "Which of the following allows you to run multiple promises in parallel and wait for all of them to resolve?",
        options: ["Promise.parallel()", "Promise.all()", "Promise.race()", "Promise.chain()"],
        correct: 1
      }
    ],
    "11": [
      {
        question: "What does the fetch() function return?",
        options: ["The direct response data", "A Promise", "A callback", "An XMLHttpRequest object"],
        correct: 1
      },
      {
        question: "How do you access the status code from a fetch response?",
        options: ["response.status()", "response.getStatus()", "response.status", "res === 200"],
        correct: 2
      },
      {
        question: "How do you convert a fetch response to JSON?",
        options: ["response.json()", "response.text()", "JSON.parse(response)", "response.toJSON()"],
        correct: 0
      },
      {
        question: "Which status code indicates a successful HTTP GET request in fetch?",
        options: ["404", "200", "301", "500"],
        correct: 1
      },
      {
        question: "How do you pass request options like method or headers in fetch?",
        options: ["As third argument", "As the init object (second parameter)", "As a query parameter", "In window.fetchOptions"],
        correct: 1
      },
      {
        question: "Which method would you use to handle network errors with fetch?",
        options: [".fail()", ".catch()", ".error()", ".reject()"],
        correct: 1
      },
      {
        question: "How would you make a POST request with fetch?",
        options: ["fetch(url, { method: 'POST' })", "fetch.post(url)", "fetch(url, { type: 'POST' })", "fetch(url).post()"],
        correct: 0
      },
      {
        question: "Which of the following is NOT a valid response method on the fetch Response object?",
        options: [".json()", ".blob()", ".text()", ".file()"],
        correct: 3
      },
      {
        question: "What is the purpose of query parameters in a fetch URL?",
        options: ["To filter the server response", "To speed up response", "To cache the response", "For browser compatibility"],
        correct: 0
      },
      {
        question: "How do you handle both success and error cases with fetch?",
        options: ["Use two then() statements", "Use then() and catch()", "Only use try...catch", "Use finally() only"],
        correct: 1
      }
    ]
  },
  projectIdeas: [
    {
      title: "Interactive Quiz App",
      description: `Build a quiz application where users can answer multiple-choice questions and see their scores at the end. Store questions as an array of objects, display each question dynamically, use event listeners for user selection, and show results using DOM manipulation.

Key Concepts: Arrays, objects, functions, DOM manipulation, events (click), conditionals, loops, classes (for Question/Quiz), and optional localStorage for saving scores.`,
      topics: [
        "Arrays", "objects", "functions", "DOM manipulation", "events (click)", "conditionals", "loops", "classes (for Question/Quiz)", "localStorage (optional)"
      ]
    },
    {
      title: "To-Do List with Data Persistence",
      description: `Create a to-do app that lets users add, edit, delete, and check off tasks. Persist data in localStorage so tasks remain after page reload. Use array methods to manage tasks and update the UI dynamically.

Key Concepts: Arrays, objects, functions/methods, DOM manipulation, events, conditionals, callbacks (for event handlers), localStorage.`,
      topics: [
        "Arrays", "objects", "functions/methods", "DOM manipulation", "events", "conditionals", "callbacks (for event handlers)", "localStorage"
      ]
    },
    {
      title: "Weather Dashboard Using Fetch API",
      description: `Make a weather dashboard where users enter a city and fetch live weather data using a public weather API. Display temperature, humidity, and weather summary dynamically. Handle loading states and errors gracefully.

Key Concepts: Fetch API, Promises, async/await, DOM manipulation, events (form submit), JSON, error handling.`,
      topics: [
        "Fetch API", "Promises", "async/await", "DOM manipulation", "events (form submit)", "JSON", "error handling"
      ]
    },
    {
      title: "Image Gallery with Modal Viewer",
      description: `Build an image gallery that shows a grid of pictures sourced from an array. Clicking any thumbnail opens a modal with the larger image and details. Implement next/prev navigation in the modal and keyboard event handling.

Key Concepts: Arrays, DOM manipulation, events (click/keyboard), functions, CSS classes manipulation, callback patterns.`,
      topics: [
        "Arrays", "DOM manipulation", "events (click/keyboard)", "functions", "CSS classes manipulation", "callback patterns"
      ]
    },
    {
      title: "Real-Time Chat Box (Frontend Only)",
      description: `Design a real-time chat UI where messages appear instantly when you send them. Let users enter their names, display avatars, and use an array to store messages. Use classes to create Message and ChatBox objects and strings for message formatting.

Key Concepts: Classes, objects, strings, arrays, DOM inputs/outputs, events, functions.`,
      topics: [
        "Classes", "objects", "strings", "arrays", "DOM inputs/outputs", "events", "functions"
      ]
    },
    {
      title: "Expense Tracker with Category Filters",
      description: `Allow users to add expenses with amount, date, and category. Show total expenses, filter by category, and delete entries. Store data in localStorage for persistence.

Key Concepts: Arrays, objects, filter/map/reduce array methods, DOM, events, functions, conditional statements.`,
      topics: [
        "Arrays", "objects", "filter/map/reduce array methods", "DOM", "events", "functions", "conditional statements"
      ]
    },
    {
      title: "Async Await User List (using JSONPlaceholder or Random User API)",
      description: `Fetch a list of users from a public API asynchronously and display them in a styled table. Allow filtering/searching users by name or email and display details in a modal.

Key Concepts: Fetch API, Promises, async/await, DOM manipulation, events, error handling, string/array methods.`,
      topics: [
        "Fetch API", "Promises", "async/await", "DOM manipulation", "events", "error handling", "string/array methods"
      ]
    },
    {
      title: "Custom Form Validator",
      description: `Create a sign-up form that requires fields like username, email, and password. Use custom functions and regex to validate input (e.g., email format, password strength) instantly and before submission. Display error messages dynamically near each field.

Key Concepts: Strings, regex, conditionals, events (input/submit), functions, DOM manipulation, classes (optional for form fields).`,
      topics: [
        "Strings", "regex", "conditionals", "events (input/submit)", "functions", "DOM manipulation", "classes (optional for form fields)"
      ]
    },
    {
      title: "Memory Card Game",
      description: `Create a simple memory matching card game: cards are displayed face down, the user can flip two at a time, and if they match, they remain face up. Keep track of moves and elapsed time. Shuffle cards randomly on each game start.

Key Concepts: Arrays (shuffling, state), objects, DOM, events, loops, conditional logic, functions, setTimeout.`,
      topics: [
        "Arrays (shuffling, state)", "objects", "DOM", "events", "loops", "conditional logic", "functions", "setTimeout"
      ]
    },
    {
      title: "Blog Posts App with Async CRUD (using Fake API)",
      description: `Implement a mini-blog where users can view, add, edit, and delete blog posts using fetch for network requests to a fake API (like JSONPlaceholder). Display posts, support searching, and use modals/forms for editing.

Key Concepts: Fetch API, Promises, async/await, CRUD operations, array methods, DOM, events, callbacks, error handling.`,
      topics: [
        "Fetch API", "Promises", "async/await", "CRUD operations", "array methods", "DOM", "events", "callbacks", "error handling"
      ]
    }
  ]
}; 