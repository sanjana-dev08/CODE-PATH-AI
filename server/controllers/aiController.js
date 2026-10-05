const stepTitles = ["Understand the problem", "Identify concepts", "Build logic", "Pseudocode", "Flowchart", "Code", "Explain the code"];

const normalizeQuestion = (value = "") => value.replace(/\s+/g, " ").trim();
const safeArray = (value) => Array.isArray(value) ? value : [];

const pickLanguage = (question = "") => {
  const lower = question.toLowerCase();
  if (/javascript|\bjs\b|node\.js/.test(lower)) return "JavaScript";
  if (/\bc\+\+(?!\w)|\bcpp\b/.test(lower)) return "C++";
  if (/\bc\b/.test(lower)) return "C";
  if (/\bsql\b|database|query|join/.test(lower)) return "SQL";
  if (/python|py/.test(lower)) return "Python";
  if (/java/.test(lower)) return "Java";
  return "JavaScript";
};

const explicitLanguage = (question = "") => {
  const lower = question.toLowerCase();
  if (/\bjavascript\b|\bjs\b|node\.js/.test(lower)) return "JavaScript";
  if (/\bc\+\+(?!\w)|\bcpp\b/.test(lower)) return "C++";
  if (/\bc\b/.test(lower)) return "C";
  if (/\bsql\b/.test(lower)) return "SQL";
  if (/\bpython\b/.test(lower)) return "Python";
  if (/\bjava\b/.test(lower)) return "Java";
  return "";
};

const baseSteps = (question, language, explanation, code, why, memoryHook, hints, followUps, lineByLine = []) => ({
  question,
  mode: "guided-fallback",
  language,
  steps: [
    { title: "Understand the problem", body: explanation.understand },
    { title: "Identify concepts", body: explanation.concepts },
    { title: "Build logic", body: explanation.logic },
    { title: "Pseudocode", body: explanation.pseudocode },
    { title: "Flowchart", body: explanation.flowchart },
    { title: "Code", body: code },
    { title: "Explain the code", body: explanation.summary }
  ],
  why,
  memoryHook,
  lineByLine,
  hints,
  followUps,
  answerText: explanation.answerText || "The idea is to understand the goal, test a small example, then write the code only after the logic makes sense."
});

const sampleCode = (kind, language) => {
  const isPython = language === "Python";
  const isJava = language === "Java";
  const isC = language === "C";
  const isCpp = language === "C++";

  if (kind === "comment") {
    const marker = isPython ? "#" : language === "SQL" ? "--" : "//";
    return `${marker} Start small, test the idea, then expand only if needed.`;
  }
  if (kind === "hint") {
    const marker = isPython ? "#" : language === "SQL" ? "--" : "//";
    return `${marker} Identify the input\n${marker} Decide the rule\n${marker} Test a tiny example\n${marker} Write the solution`;
  }
  if (kind === "sum") {
    if (language === "SQL") return "SELECT SUM(value) AS total FROM numbers;";
    if (isPython) return "total = 0\nfor number in [1, 2, 3]:\n    total += number\nprint(total)";
    if (isJava) return "int total = 0;\nfor (int number : new int[] {1, 2, 3}) total += number;\nSystem.out.println(total);";
    if (isC) return "#include <stdio.h>\nint total = 0;\nint numbers[] = {1, 2, 3};\nfor (int i = 0; i < 3; i++) total += numbers[i];\nprintf(\"%d\\n\", total);";
    if (isCpp) return "#include <iostream>\nint total = 0;\nfor (int number : {1, 2, 3}) total += number;\nstd::cout << total << '\\n';";
    return "let total = 0;\nfor (const number of [1, 2, 3]) total += number;\nconsole.log(total);";
  }
  if (kind === "query") return language === "SQL" ? "SELECT name FROM users WHERE active = 1;" : sampleCode("arrays", language);
  if (kind === "add") {
    if (language === "SQL") return "SELECT 2 + 3 AS result;";
    if (isPython) return "def add(a, b):\n    return a + b\n\nprint(add(2, 3))";
    if (isJava) return "static int add(int a, int b) {\n  return a + b;\n}\n\nSystem.out.println(add(2, 3));";
    if (isC) return "#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) { printf(\"%d\\n\", add(2, 3)); }";
    if (isCpp) return "#include <iostream>\nint add(int a, int b) { return a + b; }\nint main() { std::cout << add(2, 3) << '\\n'; }";
    return "function add(a, b) {\n  return a + b;\n}\n\nconsole.log(add(2, 3));";
  }
  if (kind === "recursion") {
    if (language === "SQL") return "WITH RECURSIVE countdown(n) AS (\n  SELECT 3\n  UNION ALL\n  SELECT n - 1 FROM countdown WHERE n > 1\n)\nSELECT n FROM countdown;";
    if (isPython) return "def count_down(n):\n    if n <= 0:\n        return\n    print(n)\n    count_down(n - 1)";
    if (isJava) return "static void countDown(int n) {\n  if (n <= 0) return;\n  System.out.println(n);\n  countDown(n - 1);\n}";
    if (isC) return "#include <stdio.h>\nvoid countDown(int n) {\n  if (n <= 0) return;\n  printf(\"%d\\n\", n);\n  countDown(n - 1);\n}";
    if (isCpp) return "#include <iostream>\nvoid countDown(int n) {\n  if (n <= 0) return;\n  std::cout << n << '\\n';\n  countDown(n - 1);\n}";
    return "function countDown(n) {\n  if (n <= 0) return;\n  console.log(n);\n  countDown(n - 1);\n}";
  }
  if (kind === "arrays") {
    if (language === "SQL") return "SELECT MAX(value) AS largest FROM numbers;";
    if (isPython) return "numbers = [3, 8, 2]\nprint(max(numbers))";
    if (isJava) return "int[] numbers = {3, 8, 2};\nint largest = numbers[0];\nfor (int number : numbers) if (number > largest) largest = number;\nSystem.out.println(largest);";
    if (isC || isCpp) return "int numbers[] = {3, 8, 2};\nint largest = numbers[0];\nfor (int i = 1; i < 3; i++) if (numbers[i] > largest) largest = numbers[i];";
    return "const numbers = [3, 8, 2];\nconsole.log(Math.max(...numbers));";
  }
  if (kind === "oop") {
    if (language === "SQL") return "SELECT 'woof' AS sound;";
    if (isPython) return "class Dog:\n    def bark(self):\n        return 'woof'\n\nprint(Dog().bark())";
    if (isJava) return "class Dog {\n  String bark() { return \"woof\"; }\n}\n\nSystem.out.println(new Dog().bark());";
    if (isC || isCpp) return "struct Dog {\n  const char *(*bark)(void);\n};\nconst char *dogBark(void) { return \"woof\"; }";
    return "class Dog {\n  bark() {\n    return 'woof';\n  }\n}\n\nconsole.log(new Dog().bark());";
  }
  if (kind === "debug") {
    if (language === "SQL") return "SELECT value FROM items WHERE item_index = :index;";
    if (isPython) return "if 0 <= index < len(items):\n    print(items[index])";
    if (isJava) return "if (index >= 0 && index < items.length) {\n  System.out.println(items[index]);\n}";
    if (isC || isCpp) return "if (index >= 0 && index < length) {\n  printf(\"%d\\n\", items[index]);\n}";
    return "if (items.length > 0 && index >= 0 && index < items.length) {\n  console.log(items[index]);\n}";
  }
  if (kind === "value") {
    if (language === "SQL") return "SELECT 42 AS answer;";
    if (isPython) return "answer = 42\nprint(answer)";
    if (isJava) return "int answer = 42;\nSystem.out.println(answer);";
    if (isC) return "#include <stdio.h>\nint answer = 42;\nprintf(\"%d\\n\", answer);";
    if (isCpp) return "#include <iostream>\nint answer = 42;\nstd::cout << answer << '\\n';";
    return "const answer = 42;\nconsole.log(answer);";
  }
  return sampleCode("comment", language);
};

const buildConceptGuide = (question, language) => {
  const lower = question.toLowerCase();
  const topic = /(recursion|recursive)/.test(lower)
    ? "recursion"
    : /(function|method)/.test(lower)
      ? "functions"
      : /(class|object|inheritance|oop)/.test(lower)
        ? "object-oriented programming"
        : /(loop|for|while)/.test(lower)
          ? "loops"
          : /(array|list|vector)/.test(lower)
            ? "arrays"
            : /(sql|join|database|query)/.test(lower)
              ? "SQL and databases"
              : "the core programming idea";

  const explanation = {
    understand: `The question is about ${topic}. The simplest way to understand it is to explain what the problem is trying to do and then show one easy example.`,
    concepts: `The key idea is to separate the main rule from the language syntax. In ${language}, you still need the same logic even if the exact keywords change.`,
    logic: `Think of a tiny example first. For ${topic}, the logic usually follows the same pattern: start with a simple input, check the rule, and then move to the next step or output.`,
    pseudocode: "Start → define the goal → test a small example → apply the rule → return the result",
    flowchart: "Start → small example → identify rule → apply rule → check result → end",
    summary: `The important part is not memorizing a line. The important part is understanding why the code works and how the rule applies to the problem you actually asked.`,
    answerText: `Here is the beginner-friendly idea: ${topic} is a pattern that helps solve a problem by breaking it into smaller, clearer steps.`
  };

  const code = topic === "recursion" ? sampleCode("recursion", language)
    : topic === "functions" ? sampleCode("add", language)
      : topic === "arrays" ? sampleCode("arrays", language)
        : topic === "object-oriented programming" ? sampleCode("oop", language)
          : topic === "SQL and databases" ? sampleCode("query", language)
            : sampleCode("value", language);

  return baseSteps(question, language, explanation, code, "Good teaching starts with the core idea, then the small example, and only then the code or rules that make it work.", "Idea → example → rule → code", ["Start with a tiny example.", "Explain the rule in plain English.", "Check whether the concept matches the user's actual problem."], ["Can you give me a simpler example?", "Can you explain the same idea without code?", "Can you relate this idea to a project you are building?"], code.split("\n").filter(Boolean).slice(0, 3).map((line) => ({ code: line, explanation: "This line is part of the example written in the selected language." })));
};

const buildHintGuide = (question, language) => {
  const explanation = {
    understand: "First, identify what the problem is truly asking you to produce or return. The hint is meant to nudge your thinking without giving the full answer.",
    concepts: "Look for the most important idea: a condition, a loop, a variable, a function, or a data structure. Pick the one that directly matches the problem.",
    logic: "Try the smallest possible example by hand. Write down what happens at each step before writing the real code.",
    pseudocode: "Start with input → apply the rule → check the condition → return or print the result",
    flowchart: "Input → rule check → decision → output",
    summary: "Hints work best when they help the learner see the pattern, not when they fully replace the thinking process.",
    answerText: "A strong hint points to the main idea, not the entire solution. Start with the smallest example, then match the pattern to the rule."
  };

  return baseSteps(question, language, explanation, sampleCode("hint", language), "The goal is to help the learner reason, not to skip the thinking step.", "Clue → example → rule → code", ["What is the input exactly?", "What remains constant over time?", "What changes after each step?"], ["Can you give a stronger hint?", "Can you show the logic without full code?", "Can you explain the same idea with a tiny example?"], []);
};

const buildPseudocodeGuide = (question, language) => {
  const explanation = {
    understand: "Pseudocode is the plain-English version of the algorithm. It helps you plan without getting stuck on the exact syntax of the language.",
    concepts: "The main concepts are usually the input, the condition, the loop or repetition, and the final output.",
    logic: "Write the steps in order, then check whether the result makes sense for a small example.",
    pseudocode: "READ the input\nCHECK the condition\nREPEAT as needed\nRETURN or PRINT the answer",
    flowchart: "Start → input → decision → action → output → end",
    summary: "Pseudocode is not final code; it is the map that makes the final implementation much easier to write correctly.",
    answerText: "Pseudocode helps you turn a problem into a readable plan before you translate it into real code."
  };

  return baseSteps(question, language, explanation, "BEGIN\nREAD input\nIF condition is true THEN\n  do the action\nELSE\n  do the alternate action\nEND IF\nRETURN result\nEND", "The plan is the real key: the code should simply follow the same steps in the target language.", "Plan → rule → result", ["Write the steps in order.", "Separate input from output.", "Check the decision points clearly."], ["Can you convert this to real code?", "Can you make it beginner-friendly?", "Can you add a tiny example?"], []);
};

const buildFlowchartGuide = (question, language) => {
  const explanation = {
    understand: "A flowchart shows the order of decisions and actions in a simple visual form.",
    concepts: "The main pieces are input, condition, action, loop, and final output. These are the same ideas used in many programming problems.",
    logic: "Start at the beginning, decide what must happen first, and then show the next choices or actions until the program reaches an answer.",
    pseudocode: "Start → Read input → Check condition → Do action → Is task done? → Yes: output → No: repeat",
    flowchart: "Start → input → decision → action → output → end",
    summary: "Flowcharts are useful because they show the big picture before the code is written. That makes the logic easier to check and debug.",
    answerText: "A flowchart is a visual explanation of the logic. It helps you understand the sequence before touching the exact syntax."
  };

  return baseSteps(question, language, explanation, "Start\n  |\n  v\nRead input\n  |\n  v\nCheck condition\n /        \\\nYes         No\n  |          |\n  v          v\nDo action   Handle alternative\n  |\n  v\nOutput result\n  |\n  v\nEnd", "The path through the program should be easy to follow, even before the code is written.", "Start → decision → action → output", ["Sketch the flow before coding.", "Mark the decision points.", "Keep the actions in the same order as the problem."], ["Can you turn this into pseudocode?", "Can you explain the flow in plain English?", "Can you add a small example to this flow?"], []);
};

const buildDebugGuide = (question, language) => {
  const lower = question.toLowerCase();
  const cause = /index/.test(lower)
    ? "An index is probably being used before the program has enough data to support it."
    : /undefined|null/.test(lower)
      ? "A variable may be missing a value or may be using the wrong type."
      : /syntax|expected|missing|unexpected/.test(lower)
        ? "The code is likely missing a symbol, a bracket, or a required keyword."
        : /name.*defined|not defined/.test(lower)
          ? "The program is probably referencing a value that was never created or is out of scope."
          : "The code is likely failing because the logic and the actual data are mismatched.";

  const explanation = {
    understand: `The error usually points to the exact place where the code is making an invalid assumption. ${cause}`,
    concepts: "Common beginner debugging ideas are variable values, conditions, array bounds, function parameters, and the order in which code runs.",
    logic: "Read the failing line carefully. Check the current value of each variable, then ask whether the code is making a safe assumption before using it.",
    pseudocode: "READ the failing line\nCHECK the variables\nCOMPARE expected value vs actual value\nFIX the condition or the data\nTEST again",
    flowchart: "Failing line → inspect variables → compare expected vs current → fix → test again",
    summary: "Debugging is about small, careful checks. The program usually works if the condition or value is corrected before the failing line runs.",
    answerText: "Most errors are easier to fix when you trace the program one line at a time and compare what the code thinks is true with what the actual data is doing."
  };

  const code = sampleCode("debug", language);
  return baseSteps(question, language, explanation, code, "The real fix is usually not guesswork. It is checking the exact value, boundary, or assumption that breaks the code.", "Trace → compare → fix → test", ["Read the exact error line.", "Print or inspect the variable values.", "Check the boundary condition before using the value."], ["Can you show the corrected version of this code?", "Can you walk through the failing line?", "Can you explain why this condition prevents the error?"], code.split("\n").filter(Boolean).slice(-2).map((line) => ({ code: line, explanation: "This statement is written in the selected language and demonstrates a safe check." })));
};

const solutionCode = (task, language, strategy = "default") => {
  const isPython = language === "Python";
  const isJava = language === "Java";
  const isC = language === "C";
  const isCpp = language === "C++";

  if (task === "factorial") {
    if (language === "SQL") {
      return strategy === "recursive"
        ? "WITH RECURSIVE factorial(n, result) AS (\n  SELECT :n, 1\n  UNION ALL\n  SELECT n - 1, result * n FROM factorial WHERE n > 1\n)\nSELECT result FROM factorial WHERE n <= 1;"
        : "WITH RECURSIVE factorial(n, result) AS (\n  SELECT 1, 1\n  UNION ALL\n  SELECT n + 1, result * (n + 1) FROM factorial WHERE n < :n\n)\nSELECT result FROM factorial ORDER BY n DESC LIMIT 1;";
    }
    if (strategy === "recursive") {
      if (isPython) return "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)";
      if (isJava) return "static long factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}";
      if (isC) return "#include <stdio.h>\nlong long factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nint main(void) { printf(\"%lld\\n\", factorial(5)); }";
      if (isCpp) return "#include <iostream>\nlong long factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nint main() { std::cout << factorial(5) << '\\n'; }";
      return "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}";
    }
    if (strategy === "while") {
      if (isPython) return "def factorial(n):\n    result = 1\n    while n > 1:\n        result *= n\n        n -= 1\n    return result";
      if (isJava) return "static long factorial(int n) {\n  long result = 1;\n  while (n > 1) {\n    result *= n;\n    n--;\n  }\n  return result;\n}";
      if (isC) return "#include <stdio.h>\nlong long factorial(int n) {\n  long long result = 1;\n  while (n > 1) { result *= n--; }\n  return result;\n}\nint main(void) { printf(\"%lld\\n\", factorial(5)); }";
      if (isCpp) return "#include <iostream>\nlong long factorial(int n) {\n  long long result = 1;\n  while (n > 1) { result *= n--; }\n  return result;\n}\nint main() { std::cout << factorial(5) << '\\n'; }";
      return "function factorial(n) {\n  let result = 1;\n  while (n > 1) {\n    result *= n;\n    n -= 1;\n  }\n  return result;\n}";
    }
    if (isPython) return "def factorial(n):\n    result = 1\n    for value in range(2, n + 1):\n        result *= value\n    return result";
    if (isJava) return "static long factorial(int n) {\n  long result = 1;\n  for (int value = 2; value <= n; value++) {\n    result *= value;\n  }\n  return result;\n}";
    if (isC) return "#include <stdio.h>\nlong long factorial(int n) {\n  long long result = 1;\n  for (int value = 2; value <= n; value++) result *= value;\n  return result;\n}\nint main(void) { printf(\"%lld\\n\", factorial(5)); }";
    if (isCpp) return "#include <iostream>\nlong long factorial(int n) {\n  long long result = 1;\n  for (int value = 2; value <= n; value++) result *= value;\n  return result;\n}\nint main() { std::cout << factorial(5) << '\\n'; }";
    return "function factorial(n) {\n  let result = 1;\n  for (let value = 2; value <= n; value += 1) {\n    result *= value;\n  }\n  return result;\n}";
  }

  if (task === "reverse") {
    if (language === "SQL") return "SELECT REVERSE(text_value) AS reversed_text FROM strings;";
    if (strategy === "twoPointers") {
      if (isPython) return "def reverse_text(text):\n    chars = list(text)\n    left, right = 0, len(chars) - 1\n    while left < right:\n        chars[left], chars[right] = chars[right], chars[left]\n        left += 1\n        right -= 1\n    return ''.join(chars)";
      if (isJava) return "static String reverseText(String text) {\n  char[] chars = text.toCharArray();\n  int left = 0, right = chars.length - 1;\n  while (left < right) {\n    char temp = chars[left];\n    chars[left++] = chars[right];\n    chars[right--] = temp;\n  }\n  return new String(chars);\n}";
      if (isC || isCpp) return "#include <string.h>\nvoid reverseText(const char *text, char *result) {\n  int left = 0;\n  int right = (int)strlen(text) - 1;\n  while (left <= right) result[left++] = text[right--];\n  result[strlen(text)] = '\\0';\n}";
      return "function reverseText(text) {\n  const chars = [...text];\n  let left = 0;\n  let right = chars.length - 1;\n  while (left < right) {\n    [chars[left], chars[right]] = [chars[right], chars[left]];\n    left += 1;\n    right -= 1;\n  }\n  return chars.join('');\n}";
    }
    if (strategy === "builtin") {
      if (isPython) return "def reverse_text(text):\n    return text[::-1]";
      if (isJava) return "static String reverseText(String text) {\n  return new StringBuilder(text).reverse().toString();\n}";
      if (isC || isCpp) return "#include <string.h>\nvoid reverseText(const char *text, char *result) {\n  int length = (int)strlen(text);\n  for (int i = 0; i < length; i++) result[i] = text[length - i - 1];\n  result[length] = '\\0';\n}";
      return "function reverseText(text) {\n  return text.split('').reverse().join('');\n}";
    }
    if (isPython) return "def reverse_text(text):\n    result = ''\n    for char in text:\n        result = char + result\n    return result";
    if (isJava) return "static String reverseText(String text) {\n  String result = \"\";\n  for (int i = text.length() - 1; i >= 0; i--) result += text.charAt(i);\n  return result;\n}";
    if (isC || isCpp) return "#include <string.h>\nvoid reverseText(const char *text, char *result) {\n  int length = (int)strlen(text);\n  for (int i = 0; i < length; i++) result[i] = text[length - i - 1];\n  result[length] = '\\0';\n}";
    return "function reverseText(text) {\n  let result = '';\n  for (const char of text) result = char + result;\n  return result;\n}";
  }

  if (task === "search") {
    if (language === "SQL") return "SELECT id FROM items WHERE value = :target;";
    if (strategy === "linear") {
      if (isPython) return "def find_target(items, target):\n    for index, item in enumerate(items):\n        if item == target:\n            return index\n    return -1";
      if (isJava) return "static int findTarget(int[] items, int target) {\n  for (int i = 0; i < items.length; i++) {\n    if (items[i] == target) return i;\n  }\n  return -1;\n}";
      if (isC || isCpp) return "int findTarget(const int items[], int length, int target) {\n  for (int i = 0; i < length; i++) {\n    if (items[i] == target) return i;\n  }\n  return -1;\n}";
      return "function findTarget(items, target) {\n  for (let i = 0; i < items.length; i += 1) {\n    if (items[i] === target) return i;\n  }\n  return -1;\n}";
    }
    if (isPython) return "def find_target(items, target):\n    left, right = 0, len(items) - 1\n    while left <= right:\n        middle = (left + right) // 2\n        if items[middle] == target:\n            return middle\n        if items[middle] < target:\n            left = middle + 1\n        else:\n            right = middle - 1\n    return -1";
    if (isJava) return "static int findTarget(int[] items, int target) {\n  int left = 0, right = items.length - 1;\n  while (left <= right) {\n    int middle = left + (right - left) / 2;\n    if (items[middle] == target) return middle;\n    if (items[middle] < target) left = middle + 1;\n    else right = middle - 1;\n  }\n  return -1;\n}";
    if (isC || isCpp) return "int findTarget(const int items[], int length, int target) {\n  int left = 0, right = length - 1;\n  while (left <= right) {\n    int middle = left + (right - left) / 2;\n    if (items[middle] == target) return middle;\n    if (items[middle] < target) left = middle + 1;\n    else right = middle - 1;\n  }\n  return -1;\n}";
    return "function findTarget(items, target) {\n  let left = 0, right = items.length - 1;\n  while (left <= right) {\n    const middle = Math.floor(left + (right - left) / 2);\n    if (items[middle] === target) return middle;\n    if (items[middle] < target) left = middle + 1;\n    else right = middle - 1;\n  }\n  return -1;\n}";
  }

  if (task === "sort") {
    if (language === "SQL") return "SELECT value FROM items ORDER BY value ASC;";
    if (strategy === "builtin") {
      if (isPython) return "def sort_numbers(items):\n    return sorted(items)";
      if (isJava) return "static int[] sortNumbers(int[] items) {\n  int[] sorted = items.clone();\n  java.util.Arrays.sort(sorted);\n  return sorted;\n}";
      if (isC || isCpp) return "#include <stdlib.h>\nint compareInts(const void *a, const void *b) {\n  return (*(const int *)a > *(const int *)b) - (*(const int *)a < *(const int *)b);\n}\nvoid sortNumbers(int items[], int length) {\n  qsort(items, length, sizeof(int), compareInts);\n}";
      return "function sortNumbers(items) {\n  return [...items].sort((a, b) => a - b);\n}";
    }
    if (isPython) return "def sort_numbers(items):\n    for i in range(len(items)):\n        smallest = i\n        for j in range(i + 1, len(items)):\n            if items[j] < items[smallest]:\n                smallest = j\n        items[i], items[smallest] = items[smallest], items[i]\n    return items";
    if (isJava) return "static int[] sortNumbers(int[] items) {\n  for (int i = 0; i < items.length; i++) {\n    int smallest = i;\n    for (int j = i + 1; j < items.length; j++) if (items[j] < items[smallest]) smallest = j;\n    int temp = items[i]; items[i] = items[smallest]; items[smallest] = temp;\n  }\n  return items;\n}";
    if (isC || isCpp) return "void sortNumbers(int items[], int length) {\n  for (int i = 0; i < length; i++) {\n    int smallest = i;\n    for (int j = i + 1; j < length; j++) if (items[j] < items[smallest]) smallest = j;\n    int temp = items[i]; items[i] = items[smallest]; items[smallest] = temp;\n  }\n}";
    return "function sortNumbers(items) {\n  for (let i = 0; i < items.length; i += 1) {\n    let smallest = i;\n    for (let j = i + 1; j < items.length; j += 1) {\n      if (items[j] < items[smallest]) smallest = j;\n    }\n    [items[i], items[smallest]] = [items[smallest], items[i]];\n  }\n  return items;\n}";
  }

  if (task === "largest") {
    if (language === "SQL") return "SELECT MAX(value) AS largest FROM numbers;";
    if (isPython) return "def largest_number(numbers):\n    if not numbers:\n        return None\n    largest = numbers[0]\n    for number in numbers:\n        if number > largest:\n            largest = number\n    return largest";
    if (isJava) return "static Integer largestNumber(int[] numbers) {\n  if (numbers.length == 0) return null;\n  int largest = numbers[0];\n  for (int number : numbers) if (number > largest) largest = number;\n  return largest;\n}";
    if (isC || isCpp) return "int largestNumber(const int numbers[], int length) {\n  if (length == 0) return 0;\n  int largest = numbers[0];\n  for (int i = 1; i < length; i++) if (numbers[i] > largest) largest = numbers[i];\n  return largest;\n}";
    return "function largestNumber(numbers) {\n  if (numbers.length === 0) return null;\n  let largest = numbers[0];\n  for (const number of numbers) if (number > largest) largest = number;\n  return largest;\n}";
  }

  if (task === "prime") {
    if (language === "SQL") return "-- Primality testing is better handled in application code than standard SQL.";
    if (isPython) return "def is_prime(number):\n    if number < 2:\n        return False\n    divisor = 2\n    while divisor * divisor <= number:\n        if number % divisor == 0:\n            return False\n        divisor += 1\n    return True";
    if (isJava) return "static boolean isPrime(int number) {\n  if (number < 2) return false;\n  for (int divisor = 2; divisor * divisor <= number; divisor++) {\n    if (number % divisor == 0) return false;\n  }\n  return true;\n}";
    if (isC) return "int isPrime(int number) {\n  if (number < 2) return 0;\n  for (int divisor = 2; divisor * divisor <= number; divisor++) {\n    if (number % divisor == 0) return 0;\n  }\n  return 1;\n}";
    if (isCpp) return "bool isPrime(int number) {\n  if (number < 2) return false;\n  for (int divisor = 2; divisor * divisor <= number; divisor++) {\n    if (number % divisor == 0) return false;\n  }\n  return true;\n}";
    return "function isPrime(number) {\n  if (number < 2) return false;\n  for (let divisor = 2; divisor * divisor <= number; divisor += 1) {\n    if (number % divisor === 0) return false;\n  }\n  return true;\n}";
  }

  if (isPython) return "def solve(input_value):\n    return input_value";
  if (isJava) return "static Object solve(Object input) {\n  return input;\n}";
  if (isC || isCpp) return "int solve(int input) {\n  return input;\n}";
  if (language === "SQL") return "SELECT value FROM items;";
  return "function solve(input) {\n  return input;\n}";
};

const buildCodeGuide = (question, language) => {
  const lower = question.toLowerCase();
  const task = /largest|max|biggest|highest/.test(lower) ? "largest"
    : /reverse/.test(lower) ? "reverse"
      : /factorial/.test(lower) ? "factorial"
        : /prime/.test(lower) ? "prime"
          : /(search|find|target|contains)/.test(lower) ? "search"
            : /(sort|ascending|descending|order)/.test(lower) ? "sort"
              : "unknown";
  const code = solutionCode(task, language, task === "factorial" ? "recursive" : task === "reverse" ? "builtin" : "default");

  const explanation = {
    understand: "The main job is to solve the problem in a small, testable way. The code should match the rule, not just the wording of the question.",
    concepts: "Choose the correct concept: a loop, a condition, a function, a data structure, or a comparison pattern.",
    logic: "Start with a tiny example, check the rule, and then translate that rule into code in a clear order.",
    pseudocode: "READ input → APPLY the rule → CHECK edge cases → RETURN result",
    flowchart: "Start → condition → action → output → end",
    summary: `The code is written in ${language}; each line has a clear job and matches the problem's logic.`,
    answerText: `This ${language} code is a clean start because it follows the idea directly, tests a few conditions, and returns the result after the logic is complete.`
  };

  return baseSteps(question, language, explanation, code, "A readable solution is easier to trust, test, and improve later.", "Input → rule → output", ["Break the problem into steps.", "Start with a small example.", "Check a few edge cases before finalizing."], ["Can you explain the code line by line?", "Can you make this solution simpler for beginners?", "Can you add a couple of edge-case tests?"], code.split("\n").filter(Boolean).map((line) => ({ code: line, explanation: "This line is part of the solution and helps move the program toward the final result." })));
};

const buildApproachOptions = (question, language) => {
  const lower = question.toLowerCase();

  if (/(factorial|fibonacci|recursion|loop)/.test(lower)) {
    return [
      { name: "Beginner loop", description: "Use a simple loop and a running total. This is the easiest way to follow each step in order.", difficulty: "Beginner", complexity: "O(n)" },
      { name: "While loop", description: "Use a while loop with a changing counter. The loop keeps going until the condition is false.", difficulty: "Beginner", complexity: "O(n)" },
      { name: "Recursive version", description: "Break the task into a smaller version of itself. Each call reduces the problem until it reaches a base case.", difficulty: "Intermediate", complexity: "O(n)" }
    ];
  }

  if (/(search|find|target|contains|index)/.test(lower)) {
    return [
      { name: "Linear scan", description: "Check each value one by one until the target is found.", difficulty: "Beginner", complexity: "O(n)" },
      { name: "Binary search", description: "If the data is sorted, cut the search space in half each time.", difficulty: "Intermediate", complexity: "O(log n)" },
      { name: "Hash lookup", description: "Store values in a lookup structure for quick membership checks.", difficulty: "Intermediate", complexity: "O(1) average" }
    ];
  }

  if (/(sort|ascending|descending|order)/.test(lower)) {
    return [
      { name: "Selection sort", description: "Keep picking the next smallest value and place it in the correct spot.", difficulty: "Beginner", complexity: "O(n²)" },
      { name: "Insertion sort", description: "Build the sorted part one value at a time.", difficulty: "Beginner", complexity: "O(n²)" },
      { name: "Built-in or merge sort", description: "Use a more advanced strategy to split and combine sorted sections efficiently.", difficulty: "Intermediate", complexity: "O(n log n)" }
    ];
  }

  if (/(string|text|reverse|palindrome|trim|split|join)/.test(lower)) {
    return [
      { name: "Character loop", description: "Process one character at a time and build the result step by step.", difficulty: "Beginner", complexity: "O(n)" },
      { name: "Two pointers", description: "Compare the first and last character, then move inward toward the middle.", difficulty: "Intermediate", complexity: "O(n)" },
      { name: "Built-in helpers", description: "Use language features that already handle the transformation for you.", difficulty: "Beginner", complexity: "O(n)" }
    ];
  }

  if (/(array|list|sum|average|max|min|count|total)/.test(lower)) {
    return [
      { name: "Accumulator loop", description: "Keep a running value as you move through each item.", difficulty: "Beginner", complexity: "O(n)" },
      { name: "Index-based traversal", description: "Use the position of each item to compare, update, or combine values.", difficulty: "Intermediate", complexity: "O(n)" },
      { name: "Map or reduce strategy", description: "Use a higher-level way to transform or aggregate the data in a compact form.", difficulty: "Intermediate", complexity: "O(n)" }
    ];
  }

  if (/(sql|database|join|where|group by|query)/.test(lower)) {
    return [
      { name: "Simple filter query", description: "Use a WHERE clause to narrow the rows to the ones that matter.", difficulty: "Beginner", complexity: "Depends on indexes and table size" },
      { name: "Join-based query", description: "Connect related tables to pull together the data you need.", difficulty: "Intermediate", complexity: "Depends on join strategy" },
      { name: "Grouped aggregate query", description: "Group the rows and summarize them with counts or totals.", difficulty: "Intermediate", complexity: "Depends on grouping and indexes" }
    ];
  }

  if (/(debug|error|exception|undefined|null|stack|traceback|syntax)/.test(lower)) {
    return [
      { name: "Trace values", description: "Print or log each important variable to see what changes before the failure.", difficulty: "Beginner", complexity: "N/A" },
      { name: "Minimal reproduction", description: "Reduce the problem to the smallest example so the cause becomes clearer.", difficulty: "Beginner", complexity: "N/A" },
      { name: "Boundary check", description: "Test the values at the edge of the logic, such as empty input, zero, and the last index.", difficulty: "Intermediate", complexity: "N/A" }
    ];
  }

  return [
    { name: "Straightforward loop", description: "Solve the problem one step at a time with clear decisions and a running result.", difficulty: "Beginner", complexity: "Depends on the task" },
    { name: "Helper function strategy", description: "Break the task into smaller reusable steps and combine them into a full solution.", difficulty: "Intermediate", complexity: "Depends on the task" },
    { name: "Optimized approach", description: "Use a smarter structure or search strategy when the problem benefits from it.", difficulty: "Intermediate", complexity: "Depends on the task" }
  ];
};

const generateAlternativeCode = (question, language, approachName = "", previousCode = "") => {
  const lower = question.toLowerCase();
  const previous = previousCode.toLowerCase();

  if (/(factorial|!)/.test(lower)) {
    const strategy = /factorial\s*\([^)]*\)\s*\{[\s\S]*factorial\s*\(/.test(previous)
      ? "loop"
      : /while\s*\(|while n/.test(previous)
        ? "recursive"
        : /for\s*\(|for .*:/.test(previous)
          ? "recursive"
          : /recursive/.test(approachName.toLowerCase())
            ? "recursive"
            : /while/.test(approachName.toLowerCase())
              ? "while"
              : "loop";
    return solutionCode("factorial", language, strategy);
  }

  if (/(reverse|string|palindrome)/.test(lower)) {
    const strategy = /\.split\(|stringbuilder|\[::?-?1\]/.test(previous)
      ? "twoPointers"
      : /text\.length\s*-\s*1|for\s+char\s+in\s+text|while\s*\(/.test(previous)
        ? "builtin"
        : "twoPointers";
    return solutionCode("reverse", language, strategy);
  }

  if (/(search|find|target|contains)/.test(lower)) {
    return solutionCode("search", language, /while\s*\(|while left/.test(previous) ? "linear" : "binary");
  }

  if (/(sort|ascending|descending|order)/.test(lower)) {
    return solutionCode("sort", language, /for\s*\(.*for\s*\(/s.test(previous) || /for .*:\n\s+for /.test(previous) ? "builtin" : "selection");
  }

  if (/(largest|max|biggest|highest)/.test(lower)) return solutionCode("largest", language);
  if (/(sql|database|join|where|group)/.test(lower) || language === "SQL") return solutionCode("unknown", "SQL");
  if (/(debug|error|exception|undefined|null|traceback)/.test(lower)) {
    if (language === "Python") return "for value in values:\n    print(value)\n    if value is None:\n        continue";
    if (language === "Java") return "for (Object value : values) {\n  System.out.println(value);\n  if (value == null) continue;\n}";
    if (language === "C" || language === "C++") return "for (int i = 0; i < length; i++) {\n  printf(\"value: %d\\n\", values[i]);\n}";
    return "for (const value of values) {\n  console.log(value);\n  if (value == null) continue;\n}";
  }

  if (language === "Python") return "def solve_problem(data):\n    return [item for item in data if item is not None]";
  if (language === "Java") return "static List<Object> solveProblem(List<Object> data) {\n  List<Object> result = new ArrayList<>();\n  for (Object item : data) if (item != null) result.add(item);\n  return result;\n}";
  if (language === "C" || language === "C++") return "int solveProblem(const int data[], int length, int result[]) {\n  int count = 0;\n  for (int i = 0; i < length; i++) if (data[i] != 0) result[count++] = data[i];\n  return count;\n}";
  if (language === "SQL") return "SELECT value FROM items;";
  return "function solveProblem(data) {\n  return data.filter((item) => item != null);\n}";
};

const buildVariationResponse = (question, language, mode = "Try Another Way", previousCode = "") => {
  const normalized = normalizeQuestion(question);
  const approaches = buildApproachOptions(normalized, language);
  const beginner = approaches[0] || { name: "Simple loop", description: "Process the data in order and keep a running result.", difficulty: "Beginner", complexity: "O(n)" };
  const alt = approaches[1] || { name: "Alternative method", description: "Use a different structure, such as a helper function, pointer technique, or lookup pattern.", difficulty: "Intermediate", complexity: "Depends on the task" };
  const preferred = mode === "Make It Simpler" ? beginner : alt;
  const code = generateAlternativeCode(normalized, language, preferred.name, previousCode);

  const explanation = {
    understand: `The goal stays the same, but the thinking changes. Instead of repeating the original method, we use a different structure to solve the same problem in a new way.`,
    concepts: `The important concept is to choose a different strategy: ${preferred.name} changes the pattern without changing the real goal.`,
    logic: `We keep the same input and output, but approach the logic from a new angle. The new method differs from the original by focusing on ${preferred.description.toLowerCase()}`,
    pseudocode: "START → identify the same goal → choose a new strategy → solve step by step → compare the result",
    flowchart: "Same problem → different strategy → new code path → compare and explain",
    summary: `This ${language} version changes the thinking pattern, not just the variable names. It is easier to understand because it focuses on ${preferred.name.toLowerCase()}.`,
    answerText: `This ${language} version uses ${preferred.name}. It is different from the original because it changes the algorithmic thinking, not just the syntax. ${beginner.name} is usually the easiest for beginners because it is the clearest and least abstract.`
  };

  return {
    question: normalized,
    mode: String(mode).toLowerCase().includes("simpler") ? "make-it-simpler" : String(mode).toLowerCase().includes("different approaches") ? "different-approaches" : "try-another-way",
    language,
    steps: [
      { title: "Understand the problem", body: explanation.understand },
      { title: "Identify concepts", body: explanation.concepts },
      { title: "Build logic", body: explanation.logic },
      { title: "Pseudocode", body: explanation.pseudocode },
      { title: "Flowchart", body: explanation.flowchart },
      { title: "Code", body: code },
      { title: "Explain the code", body: explanation.summary }
    ],
    why: "The new approach is different because it changes the algorithmic pattern. This is not a cosmetic rewrite; it changes how the work is grouped, iterated, or checked.",
    memoryHook: "Same goal → different strategy → clearer thinking",
    lineByLine: [
      { code: code.split("\n")[0], explanation: "This line starts the new strategy and clearly defines how the approach begins." },
      { code: code.split("\n")[1] || "// continue the flow", explanation: "This part carries the core logic of the new method and keeps the state moving." },
      { code: code.split("\n").slice(-1)[0] || "return result;", explanation: "This final line returns the result after the different logic finishes." }
    ].filter((item) => item.code),
    hints: [
      `Why is ${preferred.name} easier to understand than the original approach?`,
      "What is the main difference in the way the work is organized?",
      "What does this version do before returning the final result?"
    ],
    followUps: [
      "Can you show me a second alternative using the same problem?",
      "Which version is easiest for a beginner and why?",
      "Can you apply this approach to a small example?"
    ],
    approaches: approaches.slice(0, 3).map((item, index) => ({
      name: item.name,
      difficulty: item.difficulty,
      complexity: item.complexity,
      description: item.description,
      isPreferred: index === (mode === "Make It Simpler" ? 0 : 1),
      difference: index === 0 ? "Basic way of thinking" : index === 1 ? "Alternative strategy" : "Advanced or optimized version"
    })),
    comparison: `${preferred.name} is the recommended version for this situation because it is ${preferred.difficulty.toLowerCase()} and changes the logic pattern more meaningfully than a variable rename.`,
    answerText: `This version uses ${preferred.name}. It is different from the original because it changes the algorithmic thinking, not just the syntax. ${beginner.name} is usually the easiest for beginners because it is the clearest and least abstract.`
  };
};

const buildDifferentApproachesResponse = (question, language) => {
  const approaches = buildApproachOptions(normalizeQuestion(question), language).slice(0, 3);
  return {
    question: normalizeQuestion(question),
    mode: "show-different-approaches",
    language,
    steps: [
      { title: "Understand the problem", body: "The problem stays the same, but we look at different ways to solve it. The key is not simply rewriting the code; it is changing the thinking pattern." },
      { title: "Identify concepts", body: `The main ideas are ${approaches.map((item) => item.name).join(", ")}. Each one solves the same goal in a different way.` },
      { title: "Build logic", body: "Each approach uses a different structure, such as a loop, pointer pattern, recursion, or data lookup, while preserving the same final result." },
      { title: "Pseudocode", body: "Approach 1 → simple logic → test → result; Approach 2 → alternative structure → compare → result; Approach 3 → optimized or advanced pattern → validate" },
      { title: "Flowchart", body: "Same problem → choose strategy → apply logic → compare results → explain trade-offs" },
      { title: "Code", body: approaches.map((item, index) => `Approach ${index + 1}: ${item.name}\n- ${item.description}\n- Difficulty: ${item.difficulty}\n- Time: ${item.complexity}`).join("\n\n") },
      { title: "Explain the code", body: "The main difference is the way the data is processed, not cosmetics. The beginner-friendly version usually comes first, then the alternative, then the optimized version." }
    ],
    why: "Different approaches help learners understand that many problems can be solved in more than one way, and that some methods are easier for beginners while others are faster or more elegant.",
    memoryHook: "Same problem → different strategy → different trade-offs",
    lineByLine: [],
    hints: ["Compare how each approach organizes the work.", "Look at which one is easiest to reason about.", "Notice how the trade-offs change as the solution becomes more advanced."],
    followUps: ["Which approach is best for a beginner?", "Which one is more efficient?", "Can you explain the same problem with a visual or a tiny example?"],
    approaches: approaches.map((item, index) => ({
      name: item.name,
      difficulty: item.difficulty,
      complexity: item.complexity,
      description: item.description,
      difference: index === 0 ? "Basic and easiest to follow" : index === 1 ? "Alternative strategy" : "Advanced or optimized variation"
    })),
    answerText: "Here are 2–3 genuinely different ways to think about the same problem. The beginner version is usually the clearest, while the advanced version may be faster or more elegant."
  };
};

const buildDynamicFallback = (question, mode = "Explain", language = "JavaScript", previousCode = "") => {
  const normalized = normalizeQuestion(question);
  const lower = normalized.toLowerCase();
  const actionLower = String(mode).trim().toLowerCase();

  if (/try another way|different approach|different way|write it differently|solve this in another way|don't understand this code/.test(lower) || /try another way|make it simpler|show different approaches/.test(actionLower)) {
    if (/make it simpler/.test(actionLower) || /simpler/.test(lower)) return buildVariationResponse(normalized, language, "Make It Simpler", previousCode);
    if (/show different approaches/.test(actionLower) || /different approaches/.test(lower)) return buildDifferentApproachesResponse(normalized, language);
    return buildVariationResponse(normalized, language, "Try Another Way", previousCode);
  }

  if (/hint|stuck/.test(lower) && !/full answer|answer/.test(lower)) return buildHintGuide(normalized, language);
  if (/pseudocode|algorithm/.test(lower)) return buildPseudocodeGuide(normalized, language);
  if (/flowchart|diagram/.test(lower)) return buildFlowchartGuide(normalized, language);
  if (/debug|error|exception|traceback|indexerror|syntaxerror|typeerror|nameerror|undefined|null/.test(lower)) return buildDebugGuide(normalized, language);
  if (/line by line|line-by-line|explain line|line 4/.test(lower)) {
    const lineCode = sampleCode("sum", language);
    const lineGuide = {
      question: normalized,
      mode: "line-by-line",
      language,
      steps: [
        { title: "Understand the problem", body: "We are reading the code one line at a time and explaining what each line is doing in plain English." },
        { title: "Identify concepts", body: "Look for variables, loops, conditions, assignments, and return statements." },
        { title: "Build logic", body: "Trace the value of important variables and connect each line to the next step in the program." },
        { title: "Pseudocode", body: "READ each line → identify its purpose → explain its effect → check the next line" },
        { title: "Flowchart", body: "Line → purpose → effect → next line" },
        { title: "Code", body: lineCode },
        { title: "Explain the code", body: "The loop adds each number one by one, and the total keeps growing until the loop finishes. The final output is the total after all steps." }
      ],
      why: "Line-by-line explanations help learners connect syntax to meaning and prevent blind copy-pasting.",
      memoryHook: "Line → purpose → effect",
      lineByLine: lineCode.split("\n").filter(Boolean).map((code) => ({ code, explanation: "This line performs one step of the example in the selected language." })),
      hints: ["Read top to bottom.", "Ask what each line changes.", "Follow the value of the important variables."],
      followUps: ["Can you explain a specific line in my code?", "Can you show the result after each loop step?", "Can you relate this to a real-world example?"],
      answerText: "Line-by-line explanation works best when you focus on what each line changes and why that matters to the final outcome."
    };
    return lineGuide;
  }
  if (/convert|translation|translate/.test(lower)) {
    return {
      question: normalized,
      mode: "conversion",
      language,
      steps: [
        { title: "Understand the problem", body: "The goal is to preserve the same logic while changing the syntax to the target language." },
        { title: "Identify concepts", body: "Keep the variables, conditions, loops, and output structure the same. Only the syntax should change." },
        { title: "Build logic", body: "Translate the algorithm first, then adjust language-specific rules such as variable declarations and function syntax." },
        { title: "Pseudocode", body: "KEEP the idea → ADJUST the syntax → TEST the result" },
        { title: "Flowchart", body: "Original logic → target-language syntax → validated output" },
        { title: "Code", body: sampleCode("add", language) },
        { title: "Explain the code", body: "This translation keeps the same logic: add two numbers and print the result. Only the syntax is different." }
      ],
      why: "A good translation keeps the algorithm intact and changes only the language-specific details.",
      memoryHook: "Same logic → new syntax",
      lineByLine: [],
      hints: ["Keep the algorithm the same.", "Only adjust the syntax.", "Test with a simple example."],
      followUps: ["Can you translate this exact function?", "Can you explain the language differences?", "Can you test the result with one input?"],
      answerText: "Translation is about preserving the same idea while changing the language-specific way it is written."
    };
  }

  if (/(what is|explain|why do|why does|how does|what does)/.test(lower) || /\b(recursion|functions|variables|inheritance|join|pointer|loop|database|api|class)\b/.test(lower)) {
    return buildConceptGuide(normalized, language);
  }

  if (/write|solve|program|find|sum|largest|reverse|prime|palindrome|factorial|convert/.test(lower)) {
    return buildCodeGuide(normalized, language);
  }

  return {
    question: normalized,
    mode: mode.toLowerCase() === "hint" ? "hint" : "guided-fallback",
    language,
    steps: [
      { title: "Understand the problem", body: `The task is to clarify the goal first: ${normalized}. That means understanding what the program should accept and what result it should produce.` },
      { title: "Identify concepts", body: "Think about the most relevant idea, such as a loop, condition, function, data structure, or database query." },
      { title: "Build logic", body: "Break the problem into small steps and test one tiny example before writing the final answer." },
      { title: "Pseudocode", body: "READ input → APPLY rule → CHECK the result → RETURN output" },
      { title: "Flowchart", body: "Input → decision → action → output" },
      { title: "Code", body: sampleCode("comment", language) },
      { title: "Explain the code", body: "The explanation should focus on why the logic works, rather than only repeating the syntax." }
    ],
    why: "The strongest beginner guidance connects the actual question, the key concept, and the smallest example that proves the idea.",
    memoryHook: "Goal → example → rule → code",
    lineByLine: [],
    hints: ["State the goal in one sentence.", "Take a tiny example.", "Break the problem into smaller steps."],
    followUps: ["Can you give a tiny example?", "Can you explain the concept in simpler words?", "Can you show the same logic in code?"],
    answerText: "The best beginner answer starts by clarifying the goal, then using a simple example, then connecting the idea to the code."
  };
};

const buildWithConfiguredAI = async (question, options = {}) => {
  const response = await fetch(process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
      "Content-Type": "application/json"
    },
    signal: AbortSignal.timeout(20000),
    body: JSON.stringify({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `You are CodePath AI, a patient beginner-friendly programming mentor. Answer the user's actual question in simple English and use their context when relevant. The user selected ${options.language}. Generate code ONLY in the selected language unless the user's question explicitly asks for another language. Do not default to Python or JavaScript. Set the response language to the language used by the code. Explain syntax and concepts with that language in mind. If the mode asks for another way, use previousCode to choose a meaningfully different algorithm or code structure, not a variable rename or formatting change. Return valid JSON with keys: question, mode, language, steps, why, memoryHook, lineByLine, hints, followUps, answerText. steps must contain exactly seven objects with titles: Understand the problem, Identify concepts, Build logic, Pseudocode, Flowchart, Code, Explain the code.`
        },
        { role: "user", content: JSON.stringify({ question, language: options.language, mode: options.mode, previousCode: options.previousCode, conversation: options.conversation }) }
      ]
    })
  });

  if (!response.ok) throw new Error("Tutor provider request failed");

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  const parsed = JSON.parse(content);

  if (!parsed || !Array.isArray(parsed.steps) || parsed.steps.length !== stepTitles.length) {
    throw new Error("Tutor provider response was incomplete");
  }

  const code = parsed.steps.find((step) => step.title === "Code")?.body || "";
  const usesDifferentLanguage = options.language === "Python"
    ? /\bfunction\s+\w+|\bconst\s|\blet\s|console\.log/.test(code)
    : options.language === "JavaScript"
      ? /^\s*def\s+|System\.out\.print|#include\s*</m.test(code)
      : options.language === "Java"
        ? /^\s*def\s+|\bfunction\s+\w+|\bconst\s|\blet\s|console\.log|#include\s*</m.test(code)
        : options.language === "C" || options.language === "C++"
          ? /^\s*def\s+|\bfunction\s+\w+|\bconst\s|\blet\s|console\.log|System\.out\.print|SELECT\s/m.test(code)
          : options.language === "SQL"
            ? !/^\s*(SELECT|WITH|INSERT|UPDATE|DELETE|--)/i.test(code)
            : false;
  if (usesDifferentLanguage) throw new Error("Tutor provider returned code in a different language");

  return {
    question: parsed.question || question,
    mode: parsed.mode || "ai",
    tutorMode: options.mode,
    language: options.language || pickLanguage(question),
    steps: stepTitles.map((title) => parsed.steps.find((step) => step.title === title) || { title, body: "Use the core idea and one small example to understand the solution." }),
    why: parsed.why || "We connect the idea, the example, and the code so the learner understands the logic instead of memorizing it.",
    memoryHook: parsed.memoryHook || "Idea → example → code",
    lineByLine: safeArray(parsed.lineByLine),
    hints: safeArray(parsed.hints).slice(0, 3),
    followUps: safeArray(parsed.followUps).slice(0, 3),
    answerText: parsed.answerText || "Here is a beginner-friendly explanation of the concept and the logic behind it."
  };
};

const tutor = async (req, res) => {
  const question = normalizeQuestion(req.body.question || "");
  const mode = req.body.mode || "Explain";
  const selectedLanguage = req.body.language || pickLanguage(question);
  const language = explicitLanguage(question) || selectedLanguage;
  if (!question) {
    return res.status(400).json({ success: false, message: "Enter a coding question first" });
  }

  try {
    if (process.env.AI_API_KEY) {
      const response = await buildWithConfiguredAI(question, {
        mode,
        language,
        previousCode: req.body.previousCode || "",
        conversation: safeArray(req.body.conversation)
      });
      return res.json({ success: true, message: "Guided explanation ready", data: response });
    }
  } catch (error) {
    console.warn("Configured tutor unavailable; using built-in guidance", error.message);
  }

  return res.json({ success: true, message: "Guided explanation ready", data: buildDynamicFallback(question, mode, language, req.body.previousCode || "") });
};

module.exports = { tutor };
