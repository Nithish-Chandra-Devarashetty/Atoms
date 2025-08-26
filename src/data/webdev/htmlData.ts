export const htmlData = {
  url: "https://youtu.be/HcOc7P5BMi4",
  title: "HTML Quiz: Easy to Hard (with Four Options and Answers)",
  subjectInfo: {
    title: "HTML",
    description: "Learn the basics and advanced concepts of HTML, the standard markup language for creating web pages.",
    color: "from-orange-400 to-pink-500"
  },
  videos: [
    {
      id: "1",
      title: "HTML Full Course - Build a Website Tutorial",
      url: "https://youtu.be/HcOc7P5BMi4",
      duration: "2:06:00",
      watched: false
    }
  ],
  quiz: [
    {
      question: "What does HTML stand for?",
      options: [
        "Home Tool Markup Language",
        "Hyperlinks and Text Markup Language",
        "Hyper Text Markup Language",
        "Hyperlinking Textual Marking Language"
      ],
      correct: 2,
      explanation: "HTML stands for Hyper Text Markup Language. It is the standard markup language for creating web pages and web applications."
    },
    {
      question: "Which tag is used to create a hyperlink in HTML?",
      options: [
        "<link>",
        "<href>",
        "<a>",
        "<hyperlink>"
      ],
      correct: 2,
      explanation: "The <a> (anchor) tag is used to create hyperlinks in HTML. The 'href' attribute specifies the destination of the link."
    },
    {
      question: "What attribute is used to define the destination URL in an anchor tag?",
      options: [
        "url",
        "link",
        "href",
        "src"
      ],
      correct: 2,
      explanation: "The 'href' (hypertext reference) attribute specifies the URL of the page the link goes to. It's used with the <a> tag."
    },
    {
      question: "Which tag is used to display an image on a webpage?",
      options: [
        "<img>",
        "<image>",
        "<src>",
        "<pic>"
      ],
      correct: 0,
      explanation: "The <img> tag is used to embed images in HTML documents. It requires the 'src' attribute to specify the image source."
    },
    {
      question: "Which doctype declaration is correct for HTML5?",
      options: [
        "<!DOCTYPE html>",
        "<DOCTYPE HTML5>",
        "<doctype html>",
        "<!HTML5>"
      ],
      correct: 0,
      explanation: "The HTML5 doctype declaration is simply '<!DOCTYPE html>'. It tells the browser that the document is written in HTML5."
    },
    {
      question: "Which tag is used for creating a numbered list?",
      options: [
        "<dl>",
        "<ul>",
        "<ol>",
        "<li>"
      ],
      correct: 2,
      explanation: "The <ol> (ordered list) tag creates numbered lists. <ul> creates unordered lists, <dl> creates description lists, and <li> defines list items."
    },
    {
      question: "How do you insert a line break in HTML?",
      options: [
        "<break>",
        "<lb>",
        "<br>",
        "<line>"
      ],
      correct: 2,
      explanation: "The <br> tag inserts a single line break. It's a self-closing tag that creates a new line without starting a new paragraph."
    },
    {
      question: "What is the purpose of the <head> element in HTML?",
      options: [
        "Contains main content",
        "Displays webpage heading",
        "Contains metadata/info for the document",
        "Only for importing CSS"
      ],
      correct: 2,
      explanation: "The <head> element contains metadata about the document like title, character encoding, CSS links, and JavaScript - information not visible on the page itself."
    },
    {
      question: "Which tag is used to create a table row?",
      options: [
        "<tr>",
        "<td>",
        "<table>",
        "<row>"
      ],
      correct: 0,
      explanation: "The <tr> (table row) tag defines a row in an HTML table. <td> defines table cells, and <table> defines the entire table structure."
    },
    {
      question: "What would be the correct HTML for adding a checkbox?",
      options: [
        '<input type="checkbox">',
        "<checkbox>",
        "<checkbox input>",
        '<input type="check">'
      ],
      correct: 0
    },
    {
      question: "Which semantic HTML tag is used to specify the main content of a page?",
      options: [
        "<main>",
        "<container>",
        "<section>",
        "<content>"
      ],
      correct: 0
    },
    {
      question: "Which attribute is used to provide alternative text for an image?",
      options: [
        "alt",
        "text",
        "title",
        "name"
      ],
      correct: 0
    },
    {
      question: "What is the correct HTML tag for making text bold?",
      options: [
        "<b>",
        "<bold>",
        "<strong>",
        "Both <b> and <strong>"
      ],
      correct: 3
    },
    {
      question: "Which tag defines a dropdown list?",
      options: [
        "<dropdown>",
        "<select>",
        "<option>",
        '<input type="dropdown">'
      ],
      correct: 1
    },
    {
      question: "Which HTML feature ensures accessibility for screen readers and search engines?",
      options: [
        "Using IDs",
        "Semantic tags (e.g., <nav>, <header>, <footer>, <article>)",
        "Only using divs",
        "Inline styles"
      ],
      correct: 1
    }
  ]
};