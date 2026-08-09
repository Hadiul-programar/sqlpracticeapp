import { Question } from '../types';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'কম দামের পণ্য খোঁজা',
    category: 'Basic Filtering',
    question: 'যেসব পণ্যের দাম ৫০০ টাকার কম (price < 500), তাদের নাম (name) দেখাও।',
    table: 'products',
    columns: ['id', 'name', 'price', 'category'],
    data: [
      { id: 1, name: 'Mouse', price: 175, category: 'Electronics' },
      { id: 2, name: 'Headphone', price: 220, category: 'Audio' },
      { id: 3, name: 'Keyboard', price: 250, category: 'Electronics' },
      { id: 4, name: 'Monitor', price: 8000, category: 'Electronics' },
      { id: 5, name: 'USB Cable', price: 120, category: 'Accessories' }
    ],
    answer: 'SELECT name FROM products WHERE price < 500;',
    hint: 'WHERE শর্তে price < 500 লিখুন এবং শুধুমাত্র name কলাম সিলেক্ট করুন।',
    level: 'easy',
    explanation: 'SELECT name নির্দেশ করে কেবল পণ্যের নাম কলাম আসবে। WHERE price < 500 দিয়ে শর্ত আরোপ করা হয়েছে।'
  },
  {
    id: 2,
    title: 'দাম অনুযায়ী পণ্য সাজানো',
    category: 'Sorting',
    question: 'সকল পণ্যের নাম (name) ও দাম (price) দেখাও, দাম কম থেকে বেশি (ছোট থেকে বড়) ক্রমানুসারে সাজিয়ে।',
    table: 'products',
    columns: ['id', 'name', 'price', 'category'],
    data: [
      { id: 1, name: 'Mouse', price: 175, category: 'Electronics' },
      { id: 2, name: 'Headphone', price: 220, category: 'Audio' },
      { id: 3, name: 'Keyboard', price: 250, category: 'Electronics' },
      { id: 4, name: 'Monitor', price: 8000, category: 'Electronics' },
      { id: 5, name: 'USB Cable', price: 120, category: 'Accessories' }
    ],
    answer: 'SELECT name, price FROM products ORDER BY price ASC;',
    hint: 'ক্রমানুসারে সাজানোর জন্য ORDER BY price ASC ব্যবহার করুন।',
    level: 'easy',
    explanation: 'ORDER BY দ্বারা নির্দিষ্ট কলাম অনুসারে ছোট থেকে বড় (ASC) বা বড় থেকে ছোট (DESC) সাজানো হয়।'
  },
  {
    id: 3,
    title: 'নির্দিষ্ট অক্ষরে নাম অনুসন্ধান',
    category: 'Pattern Matching',
    question: 'যেসব পণ্যের নামের (name) মধ্যে "o" অক্ষরটি রয়েছে, তাদের সকল তথ্য (*) বের করো।',
    table: 'products',
    columns: ['id', 'name', 'price', 'category'],
    data: [
      { id: 1, name: 'Mouse', price: 175, category: 'Electronics' },
      { id: 2, name: 'Headphone', price: 220, category: 'Audio' },
      { id: 3, name: 'Keyboard', price: 250, category: 'Electronics' },
      { id: 4, name: 'Monitor', price: 8000, category: 'Electronics' },
      { id: 5, name: 'USB Cable', price: 120, category: 'Accessories' }
    ],
    answer: "SELECT * FROM products WHERE name LIKE '%o%';",
    hint: 'LIKE Operator এবং % ওয়াইল্ডকার্ড ব্যবহার করে অনুসন্ধান করতে হয়। যেমন: LIKE \'%o%\'',
    level: 'medium',
    explanation: '%o% এর অর্থ হলো নামের শুরুতে, মাঝে বা শেষে যেকোনো স্থানে "o" থাকলে সেটি মিলবে।'
  },
  {
    id: 4,
    title: 'পণ্যের গড় মূল্য হিসাব',
    category: 'Aggregation',
    question: 'স্টোরের সকল পণ্যের গড় দাম (Average Price) বের করো।',
    table: 'products',
    columns: ['id', 'name', 'price', 'category'],
    data: [
      { id: 1, name: 'Mouse', price: 175, category: 'Electronics' },
      { id: 2, name: 'Headphone', price: 220, category: 'Audio' },
      { id: 3, name: 'Keyboard', price: 250, category: 'Electronics' },
      { id: 4, name: 'Monitor', price: 8000, category: 'Electronics' },
      { id: 5, name: 'USB Cable', price: 120, category: 'Accessories' }
    ],
    answer: 'SELECT AVG(price) FROM products;',
    hint: 'গড় নির্ণয়ের জন্য AVG(price) অ্যাগ্রিগেট ফাংশনটি লিখুন।',
    level: 'medium',
    explanation: 'AVG() ফাংশন দিয়ে সংখ্যাক কলামের সকল মানের গড় সরাসরি গণনা করা যায়।'
  },
  {
    id: 5,
    title: 'ক্যাটাগরি ভিত্তিক মোট পণ্য গণন',
    category: 'Group By',
    question: 'প্রতিটি ক্যাটাগরিতে (category) কতগুলো করে পণ্য আছে তা বের করো। ফলাফল ক্যাটাগরির নাম ও পণ্যের সংখ্যা (COUNT) সহ দেখাও।',
    table: 'products',
    columns: ['id', 'name', 'price', 'category'],
    data: [
      { id: 1, name: 'Mouse', price: 175, category: 'Electronics' },
      { id: 2, name: 'Headphone', price: 220, category: 'Audio' },
      { id: 3, name: 'Keyboard', price: 250, category: 'Electronics' },
      { id: 4, name: 'Monitor', price: 8000, category: 'Electronics' },
      { id: 5, name: 'USB Cable', price: 120, category: 'Accessories' },
      { id: 6, name: 'Speaker', price: 1500, category: 'Audio' }
    ],
    answer: 'SELECT category, COUNT(*) FROM products GROUP BY category;',
    hint: 'GROUP BY category এর সাথে SELECT-এ category, COUNT(*) যোগ করুন।',
    level: 'hard',
    explanation: 'GROUP BY একই জাতীয় তথ্যকে একটি গ্রুপে আনে এবং COUNT(*) দিয়ে প্রতিটি গ্রুপের মোট আইটেম গুনে দেয়।'
  },
  {
    id: 6,
    title: 'গ্রাহক ও অর্ডার টেবিল জয়েন (INNER JOIN)',
    category: 'Joins',
    question: 'কাস্টমারের নাম (customers.name) এবং তাদের দেওয়া অর্ডারের পরিমাণ (orders.amount) বের করো।',
    table: 'customers',
    columns: ['id', 'name', 'city'],
    data: [
      { id: 1, name: 'Rahim', city: 'Dhaka' },
      { id: 2, name: 'Karim', city: 'Chittagong' },
      { id: 3, name: 'Salma', city: 'Sylhet' }
    ],
    additionalTables: [
      {
        table: 'orders',
        columns: ['id', 'customer_id', 'amount'],
        data: [
          { id: 101, customer_id: 1, amount: 1200 },
          { id: 102, customer_id: 2, amount: 850 },
          { id: 103, customer_id: 1, amount: 450 }
        ]
      }
    ],
    answer: 'SELECT customers.name, orders.amount FROM customers INNER JOIN orders ON customers.id = orders.customer_id;',
    hint: 'INNER JOIN orders ON customers.id = orders.customer_id ব্যবহার করুন।',
    level: 'hard',
    explanation: 'INNER JOIN দিয়ে দুটি টেবিল সাধারণ আইডি (Foreign Key) এর মাধ্যমে যুক্ত করে সম্পর্কিত ডেটা দেখা যায়।'
  },
  {
    id: 7,
    title: 'গড় দামের চেয়ে দামী পণ্য (Subquery)',
    category: 'Subqueries',
    question: 'যেসব পণ্যের দাম সকল পণ্যের গড় দামের চেয়ে বেশি, তাদের নাম ও দাম বের করো।',
    table: 'products',
    columns: ['id', 'name', 'price', 'category'],
    data: [
      { id: 1, name: 'Mouse', price: 175, category: 'Electronics' },
      { id: 2, name: 'Headphone', price: 220, category: 'Audio' },
      { id: 3, name: 'Keyboard', price: 250, category: 'Electronics' },
      { id: 4, name: 'Monitor', price: 8000, category: 'Electronics' },
      { id: 5, name: 'USB Cable', price: 120, category: 'Accessories' }
    ],
    answer: 'SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);',
    hint: 'WHERE price > (SELECT AVG(price) FROM products) দিয়ে সাবকোয়েরি লিখুন।',
    level: 'expert',
    explanation: 'বন্ধনীর ভেতরের সাবকোয়েরিটি প্রথমে পুরো টেবিলের গড় হিসাব করে, তারপর বাহিরের কোয়েরি তার চেয়ে বেশি দামের পণ্য বাছাই করে।'
  },
  {
    id: 8,
    title: 'নতুন শিক্ষার্থী যোগ করা (INSERT)',
    category: 'Data Modification',
    question: 'students টেবিলে নতুন শিক্ষার্থী যোগ করো: name = "Anis", age = 22, department = "CSE"। তারপর সকল শিক্ষার্থীকে দেখতে `SELECT * FROM students;` রান করো।',
    table: 'students',
    columns: ['id', 'name', 'age', 'department'],
    data: [
      { id: 1, name: 'Hasan', age: 20, department: 'EEE' },
      { id: 2, name: 'Tanvir', age: 21, department: 'CSE' }
    ],
    answer: "INSERT INTO students (name, age, department) VALUES ('Anis', 22, 'CSE');",
    hint: "INSERT INTO students (name, age, department) VALUES ('Anis', 22, 'CSE'); লিখুন।",
    level: 'medium',
    explanation: 'INSERT INTO বাক্য দিয়ে ডেটাবেজে নতুন সারি (Row) যুক্ত করা হয়।'
  }
];
