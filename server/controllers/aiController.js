const stepTitles = ["Understand the problem", "Identify concepts", "Build logic", "Pseudocode", "Flowchart", "Code", "Explain the code"];

const guides = [
	{
		match: (text) => /reverse|backwards|backward/.test(text) && /string|word|text|characters?/.test(text),
		understand: "Take the input text and return the same characters in the opposite order. For example, \"code\" becomes \"edoc\".",
		concepts: "We need the text and a way to look at its letters from the end back to the start.",
		logic: "For \"cat\", take the letters c-a-t, turn them around to t-a-c, then join them. The same steps work for any word.",
		pseudocode: "Read the text. Turn its letters around. Join the letters into new text. Return it.",
		flowchart: "Start → Read the text → Turn the letters around → Join them → Return the new text → End",
		code: "function reverseString(text) {\n  return Array.from(text).reverse().join(\"\");\n}",
		explanation: "The code makes a copy of the letters, puts them in reverse order, and joins them with nothing between them. The original text stays the same. For \"cat\", it returns \"tac\".",
		lineByLine: [
			{ code: "function reverseString(text) {", explanation: "Defines a reusable function that receives the text to reverse." },
			{ code: "return Array.from(text).reverse().join(\"\");", explanation: "Makes characters, reverses them, joins them with no spaces, and returns the new string." },
			{ code: "}", explanation: "Closes the function body." },
		],
		hints: ["Write the letters in \"cat\" from right to left.", "What should the answer be for an empty word?", "Should there be a space between the reversed letters?"],
		followUps: ["How would you reverse the order of words in a sentence?", "Can you reverse the letters using a loop?", "How should spaces in a sentence be handled?"],
	},
	{
		match: (text) => /largest|maximum|biggest|highest/.test(text) && /array|list|numbers?/.test(text),
		understand: "Return the greatest number in the list. For [3, 8, 2], the answer is 8. Decide what an empty list should mean before reading its first element.",
		concepts: "A list of numbers, checking them one at a time, and remembering the biggest number seen so far.",
		logic: "For [3, 8, 2], start by remembering 3. See 8, so remember 8 instead. See 2, keep 8. Return 8.",
		pseudocode: "If the list is empty, return null. Remember the first number. Check each number. If it is bigger, remember it. Return the biggest number remembered.",
		flowchart: "Start → Is the list empty? → Yes: return null / No: remember first number → Check next number → Keep the bigger one → Return biggest → End",
		code: "function largestNumber(numbers) {\n  if (numbers.length === 0) return null;\n  let largest = numbers[0];\n  for (const number of numbers) {\n    if (number > largest) largest = number;\n  }\n  return largest;\n}",
		explanation: "The first check handles a list with no numbers. Starting with a number from the list also works when every number is negative. We check each number and keep the biggest one seen so far. For [3, 8, 2], the answer is 8.",
		lineByLine: [
			{ code: "function largestNumber(numbers) {", explanation: "Receives the array of numbers." },
			{ code: "if (numbers.length === 0) return null;", explanation: "Defines the result for an empty array before accessing index 0." },
			{ code: "let largest = numbers[0];", explanation: "Uses a real element as the first candidate, including when all values are negative." },
			{ code: "for (const number of numbers) {", explanation: "Visits every value in the array once." },
			{ code: "if (number > largest) largest = number;", explanation: "Replaces the current best only when this value is greater." },
			{ code: "return largest;", explanation: "Returns the best value after the full scan." },
		],
		hints: ["Start with the first element instead of assuming the largest number is 0.", "Trace [3, 8, 2]: what is largest after each comparison?", "Test an empty array and an array containing only negative numbers."],
		followUps: ["What should an empty array return in your program?", "Why is initializing largest to 0 incorrect for some inputs?", "Can you find the smallest number with the same pattern?"],
	},
	{
		match: (text) => /arm\s*strong|armstrong/.test(text),
		understand: "An Armstrong number equals the sum of its digits after each digit is raised to the number of digits. For 153, that is 1³ + 5³ + 3³ = 153, so 153 is an Armstrong number.",
		concepts: "We need to read each digit, raise it to a power, add the results, and compare the total with the original number.",
		logic: "153 has 3 digits. Raise each digit to 3: 1×1×1 = 1, 5×5×5 = 125, and 3×3×3 = 27. Add them: 1 + 125 + 27 = 153. The totals match, so return true.",
		pseudocode: "Turn the number into digits. Count the digits. Start total at 0. Raise each digit to that count and add it to total. Check whether total equals the original number.",
		flowchart: "Start → Read number → Count its digits → Raise each digit to that count → Add the results → Same as original number? → Return yes or no → End",
		code: "function isArmstrong(number) {\n  if (!Number.isInteger(number) || number < 0) return false;\n  const digits = String(number);\n  const power = digits.length;\n  let total = 0;\n  for (const character of digits) {\n    const digit = Number(character);\n    total += digit ** power;\n  }\n  return total === number;\n}",
		explanation: "For 153, the code counts 3 digits, then works out 1³ + 5³ + 3³. The total is 153, which matches the starting number, so the function returns true. For 123, the total is 1³ + 2³ + 3³ = 36, so it returns false.",
		memoryHook: "Count the digits, raise each digit to that count, add them, then compare.",
		lineByLine: [
			{ code: "if (!Number.isInteger(number) || number < 0) return false;", explanation: "Only non-negative whole numbers are checked by this version." },
			{ code: "const digits = String(number);", explanation: "Turns the number into text so the code can look at one digit at a time." },
			{ code: "const power = digits.length;", explanation: "Counts how many digits the number has. For 153, the count is 3." },
			{ code: "let total = 0;", explanation: "Starts a place to add each digit's result." },
			{ code: "for (const character of digits) {", explanation: "Repeats the next steps for every digit." },
			{ code: "const digit = Number(character);", explanation: "Turns the current digit from text back into a number." },
			{ code: "total += digit ** power;", explanation: "Raises this digit to the digit count and adds it to total. The ** symbol means ‘to the power of’." },
			{ code: "return total === number;", explanation: "Returns true if the sum matches the starting number; otherwise returns false." },
		],
		hints: ["Start with 153. How many digits does it have?", "Work out 1³, 5³, and 3³ separately before adding them.", "Try 123 too. Does its digit total match 123?"],
		followUps: ["What should the function return for 0?", "How would you check every Armstrong number from 1 to 1000?", "Why do we count the digits before raising them?"],
	},
	{
		match: (text) => /even|odd/.test(text),
		understand: "Decide whether a whole number is even or odd. Even numbers split into pairs with none left over; odd numbers leave one over.",
		concepts: "Divide by 2 and check what is left over. The % symbol gives us the amount left over.",
		logic: "For 8, dividing into pairs leaves 0, so it is even. For 7, one is left over, so it is odd.",
		pseudocode: "Read the number. Divide it by 2 and check what is left over. If nothing is left, say even. Otherwise, say odd.",
		flowchart: "Start → Read number → Divide into pairs → Anything left over? → Yes: odd / No: even → End",
		code: "function evenOrOdd(n) {\n  return n % 2 === 0 ? \"even\" : \"odd\";\n}",
		explanation: "The % symbol tells us what is left after dividing by 2. The === symbols ask whether that leftover is exactly 0. The question mark chooses ‘even’ when it is 0; otherwise it chooses ‘odd’.",
		lineByLine: [
			{ code: "function evenOrOdd(n) {", explanation: "Receives the number to classify." },
			{ code: "return n % 2 === 0 ? \"even\" : \"odd\";", explanation: "Checks the remainder and returns the corresponding label." },
			{ code: "}", explanation: "Closes the function body." },
		],
		hints: ["Try n = 8 and calculate 8 % 2.", "Now try n = 7. What remainder do you get?", "The check is about the remainder, not whether n / 2 is an integer-looking string."],
		followUps: ["How would you check if a number is divisible by 5?", "What result does JavaScript give for -3 % 2?", "Would you return a label or a boolean for your use case?"],
	},
	{
		match: (text) => /factorial|n!/.test(text),
		understand: "Compute n! by multiplying every whole number from 1 through n. By definition, 0! is 1.",
		concepts: "Repeat multiplication and keep the answer so far in a variable called product.",
		logic: "For 4!, calculate 1 × 2 × 3 × 4. Start product at 1, multiply by each next number, then return the final product.",
		pseudocode: "If n is negative or not a whole number, stop. Set product to 1. Multiply it by each number from 2 through n. Return product.",
		flowchart: "Start → Is n a non-negative whole number? → Set product = 1 → Multiply by next number → More numbers? → Return product → End",
		code: "function factorial(n) {\n  if (!Number.isInteger(n) || n < 0) {\n    throw new RangeError(\"n must be a non-negative integer\");\n  }\n  let product = 1;\n  for (let i = 2; i <= n; i += 1) {\n    product *= i;\n  }\n  return product;\n}",
		explanation: "The first check rejects inputs this function cannot use. Starting product at 1 makes 0! equal 1, which is the math rule. Each pass multiplies in the next number. For 4, the product becomes 1, then 2, then 6, then 24.",
		lineByLine: [
			{ code: "if (!Number.isInteger(n) || n < 0) {", explanation: "Rejects fractional and negative input before calculation." },
			{ code: "throw new RangeError(\"n must be a non-negative integer\");", explanation: "Reports invalid input instead of returning a misleading value." },
			{ code: "let product = 1;", explanation: "Starts the running multiplication; this also gives 0! the correct value of 1." },
			{ code: "for (let i = 2; i <= n; i += 1) {", explanation: "Visits each remaining factor from 2 through n." },
			{ code: "product *= i;", explanation: "Multiplies the running product by the current factor." },
			{ code: "return product;", explanation: "Returns the completed factorial." },
		],
		hints: ["Write out 4! as 1 × 2 × 3 × 4.", "Why does the loop start at 2 when product is already 1?", "Check the special case n = 0."],
		followUps: ["What is the base case for a recursive factorial?", "What happens when n is 171 using JavaScript Number?", "How could BigInt represent a larger result?"],
	},
	{
		match: (text) => /prime/.test(text),
		understand: "A prime number is an integer greater than 1 with no positive divisors other than 1 and itself.",
		concepts: "A prime number has no whole-number divisors except 1 and itself. We test whether smaller numbers divide it evenly.",
		logic: "Numbers below 2 are not prime. Try dividing 13 by 2, 3, and so on. None divide it evenly, so 13 is prime. Stop once a number's square is bigger than n.",
		pseudocode: "If n is less than 2, say no. Try whole-number divisors starting at 2. If one divides evenly, say no. If none do, say yes.",
		flowchart: "Start → Is n less than 2? → Yes: not prime → Try dividing by 2, then 3, and so on → Divides evenly? → Yes: not prime / No more divisors: prime → End",
		code: "function isPrime(n) {\n  if (!Number.isInteger(n) || n < 2) return false;\n  for (let divisor = 2; divisor * divisor <= n; divisor += 1) {\n    if (n % divisor === 0) return false;\n  }\n  return true;\n}",
		explanation: "Numbers smaller than 2 are not prime. If a test number divides n with nothing left over, n is not prime. We only need to test up to the square root: any larger matching factor would already have a smaller partner.",
		lineByLine: [
			{ code: "if (!Number.isInteger(n) || n < 2) return false;", explanation: "Numbers below 2 and non-integers are not prime integers." },
			{ code: "for (let divisor = 2; divisor * divisor <= n; divisor += 1) {", explanation: "Checks possible factors only up to the square root of n." },
			{ code: "if (n % divisor === 0) return false;", explanation: "A zero remainder means a divisor other than 1 and n was found." },
			{ code: "return true;", explanation: "No divisor was found, so n is prime." },
		],
		hints: ["Why can 1 not be prime?", "Try n = 9 and check divisor 3.", "If n = 37, how far do you need to test divisors?"],
		followUps: ["How would you list every prime up to n?", "Why is testing only through √n enough?", "How could you optimize checking many primes at once?"],
	},
	{
		match: (text) => /two sum|pair.*sum|sum.*target/.test(text),
		understand: "Find two different positions whose values add to the target, and return their indexes. For [2, 7, 11] with target 9, return [0, 1].",
		concepts: "A list of numbers, a target total, and a small lookup table that remembers numbers already checked.",
		logic: "For target 9 and number 2, we need 7. Remember 2. When we reach 7, we see that 2 was already checked, so return both positions.",
		pseudocode: "Remember numbers as you visit them. For each number, ask: what number would bring the total to target? If you have seen it, return both positions. Otherwise, remember this number.",
		flowchart: "Start → Remember checked numbers → Read next number → Find the partner needed for target → Seen that partner? → Yes: return both positions / No: remember number → End",
		code: "function twoSum(numbers, target) {\n  const seen = new Map();\n  for (let index = 0; index < numbers.length; index += 1) {\n    const complement = target - numbers[index];\n    if (seen.has(complement)) return [seen.get(complement), index];\n    seen.set(numbers[index], index);\n  }\n  return null;\n}",
		explanation: "The Map remembers each number and where it appeared. Before remembering the current number, the code checks whether its needed partner appeared earlier. That way, it never uses the same position twice. For [2, 7, 11] and target 9, it returns [0, 1].",
		lineByLine: [
			{ code: "const seen = new Map();", explanation: "Stores each earlier value with the index where it appeared." },
			{ code: "for (let index = 0; index < numbers.length; index += 1) {", explanation: "Visits each array position once." },
			{ code: "const complement = target - numbers[index];", explanation: "Calculates the partner value needed to reach target." },
			{ code: "if (seen.has(complement)) return [seen.get(complement), index];", explanation: "If the partner appeared earlier, returns the two indexes." },
			{ code: "seen.set(numbers[index], index);", explanation: "Remembers the current value for later lookups." },
			{ code: "return null;", explanation: "Signals that no matching pair was found." },
		],
		hints: ["For target 9 and current value 7, what complement do you need?", "Store indexes as well as values so you can return the answer positions.", "Look for the complement before storing the current number."],
		followUps: ["What if there are multiple valid pairs?", "Why does the map solution use extra space?", "How would a sorted array change the approach?"],
	},
	{
		match: (text) => /binary search/.test(text),
		understand: "Find the target's index in a sorted array, or return -1 if it is absent.",
		concepts: "A sorted list and repeatedly checking the number in the middle.",
		logic: "The list must be sorted. Check the middle number. If it is too small, look only to its right. If too large, look only to its left. Repeat until found or no numbers remain.",
		pseudocode: "Set low to the first position and high to the last. Check the middle. If it matches, return its position. Keep only the half that could contain the target. If nothing is left, return -1.",
		flowchart: "Start → Check middle number → Found? → Yes: return position / No: keep the possible half → Anything left to check? → Repeat or return -1 → End",
		code: "function binarySearch(numbers, target) {\n  let low = 0;\n  let high = numbers.length - 1;\n  while (low <= high) {\n    const middle = Math.floor((low + high) / 2);\n    if (numbers[middle] === target) return middle;\n    if (numbers[middle] < target) low = middle + 1;\n    else high = middle - 1;\n  }\n  return -1;\n}",
		explanation: "The low and high values mark the part of the list still being checked. Each step lets us ignore half the list. This is much faster than checking every number, but it only works when the list is sorted.",
		lineByLine: [
			{ code: "let low = 0;", explanation: "Sets the first possible index." },
			{ code: "let high = numbers.length - 1;", explanation: "Sets the last valid index." },
			{ code: "while (low <= high) {", explanation: "Continues while at least one candidate index remains." },
			{ code: "const middle = Math.floor((low + high) / 2);", explanation: "Chooses the center of the current search interval." },
			{ code: "if (numbers[middle] === target) return middle;", explanation: "Returns immediately when the target is found." },
			{ code: "if (numbers[middle] < target) low = middle + 1;", explanation: "Discards the lower half because values are sorted." },
			{ code: "else high = middle - 1;", explanation: "Discards the upper half when the middle value is too large." },
			{ code: "return -1;", explanation: "Reports that the target was not present." },
		],
		hints: ["Binary search needs sorted input. Is your array sorted?", "After checking the middle, which half can you safely ignore?", "Test an empty array and a target that is not present."],
		followUps: ["Why does binary search take O(log n) time?", "How would you find the first occurrence of a duplicate?", "What changes for descending order?"],
	},
	{
		match: (text) => /palindrome/.test(text) && /string|word|text|phrase/.test(text),
		understand: "Check whether text reads the same forward and backward. This version ignores letter case and non-letter/non-digit characters.",
		concepts: "Text and two positions: one at the start and one at the end.",
		logic: "Ignore capital letters and punctuation. Compare the first and last letters, then move inward. If every pair matches, the text reads the same both ways.",
		pseudocode: "Make the text lowercase and remove spaces and punctuation. Compare the first and last characters. If they differ, return false. Move inward and keep checking. Return true if all pairs match.",
		flowchart: "Start → Clean the text → Compare first and last letters → Different? → Yes: false / No: move inward → All pairs match? → true → End",
		code: "function isPalindrome(text) {\n  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, \"\");\n  let left = 0;\n  let right = normalized.length - 1;\n  while (left < right) {\n    if (normalized[left] !== normalized[right]) return false;\n    left += 1;\n    right -= 1;\n  }\n  return true;\n}",
		explanation: "The first line makes capital and lowercase letters match and removes spaces and punctuation. The left and right positions check matching letters from the outside in. If they all match, return true. This version checks English letters and numbers.",
		lineByLine: [
			{ code: "const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, \"\");", explanation: "Lowercases the text and removes spaces and punctuation for comparison." },
			{ code: "let left = 0;", explanation: "Starts at the first character." },
			{ code: "let right = normalized.length - 1;", explanation: "Starts at the last character." },
			{ code: "if (normalized[left] !== normalized[right]) return false;", explanation: "Any mismatched pair proves the text is not a palindrome." },
			{ code: "left += 1; right -= 1;", explanation: "Moves both indexes one step toward the center." },
			{ code: "return true;", explanation: "All mirrored pairs matched, so the text is a palindrome." },
		],
		hints: ["Compare the first and last characters first.", "Should spaces and capitalization count for your version?", "Try \"A man, a plan, a canal: Panama\" after normalization."],
		followUps: ["How would the rules change for a numeric palindrome?", "Can you solve it by reversing the normalized string?", "What should empty text return?"],
	},
	{
		match: (text) => /sum|total|add/.test(text) && /array|list|numbers?/.test(text),
		understand: "Add every number in the list and return one total. For [2, 5, 1], the result is 8.",
		concepts: "A list of numbers and a total that grows as we add each one.",
		logic: "Start total at 0. For [2, 5, 1], add 2 to get 2, then 5 to get 7, then 1 to get 8.",
		pseudocode: "Start total at 0. Add each number to total. Return total.",
		flowchart: "Start → Set total to 0 → Add next number → More numbers? → Yes: repeat / No: return total → End",
		code: "function sumNumbers(numbers) {\n  let total = 0;\n  for (const number of numbers) {\n    total += number;\n  }\n  return total;\n}",
		explanation: "Starting at 0 means an empty list correctly has a total of 0. Each turn adds one number to the total. For [2, 5, 1], the function returns 8.",
		lineByLine: [
			{ code: "let total = 0;", explanation: "Creates the running sum and defines the empty-list result." },
			{ code: "for (const number of numbers) {", explanation: "Visits each number once." },
			{ code: "total += number;", explanation: "Adds the current value to the running sum." },
			{ code: "return total;", explanation: "Returns the sum after the loop finishes." },
		],
		hints: ["Use a variable to keep the total so far.", "What should the sum of an empty list be?", "Trace the total after each value in [2, 5, 1]."],
		followUps: ["How would you calculate the average?", "What if the list contains numeric strings?", "How can reduce() express the same logic?"],
	},
	{
		match: (text) => /fibonacci/.test(text),
		understand: "Produce the first n Fibonacci numbers, where each new value is the sum of the previous two. This solution starts with 0, 1.",
		concepts: "A list to hold the answer and two numbers used to work out the next number.",
		logic: "Start with 0 and 1. Add 0 to the answer. Then move forward: the next pair is 1 and 0 + 1. Repeat to get 0, 1, 1, 2, 3, 5.",
		pseudocode: "Start with an empty answer and the numbers 0 and 1. Repeat n times: add the first number to the answer, then move both numbers forward. Return the answer.",
		flowchart: "Start → Set first two numbers → Add next number to answer → Move to the next pair → Repeated n times? → Return answer → End",
		code: "function fibonacci(count) {\n  const sequence = [];\n  let previous = 0;\n  let current = 1;\n  for (let index = 0; index < count; index += 1) {\n    sequence.push(previous);\n    [previous, current] = [current, previous + current];\n  }\n  return sequence;\n}",
		explanation: "The answer starts empty, so asking for 0 numbers returns an empty list. Each repeat adds one number, then updates the pair used to make the next one. Asking for 6 numbers returns [0, 1, 1, 2, 3, 5].",
		lineByLine: [
			{ code: "const sequence = [];", explanation: "Creates the array that will hold the requested terms." },
			{ code: "let previous = 0; let current = 1;", explanation: "Stores the first two values in this Fibonacci convention." },
			{ code: "for (let index = 0; index < count; index += 1) {", explanation: "Repeats once for each term requested." },
			{ code: "sequence.push(previous);", explanation: "Appends the next term to the output." },
			{ code: "[previous, current] = [current, previous + current];", explanation: "Moves the pair forward to the next two terms." },
			{ code: "return sequence;", explanation: "Returns the completed sequence." },
		],
		hints: ["Write down 0, 1, 1, 2, 3 and mark which two values create each new one.", "What should fibonacci(1) return?", "Update both saved values together so neither is lost."],
		followUps: ["How would recursion express the same definition?", "Why is the iterative version more efficient than naive recursion?", "What should a negative count do?"],
	},
	{
		match: (text) => /count.*vowel|vowel.*count/.test(text),
		understand: "Count how many characters in the input are vowels. This version treats a, e, i, o, and u as vowels and ignores case.",
		concepts: "The letters a, e, i, o, and u, and a counter that records how many we find.",
		logic: "For each letter, ask if it is a, e, i, o, or u. Add 1 to the counter when it is. Return the counter at the end.",
		pseudocode: "Set count to 0. Read each letter in lowercase. If it is a, e, i, o, or u, add 1 to count. Return count.",
		flowchart: "Start → Set count to 0 → Read next letter → Is it a vowel? → Yes: add 1 → More letters? → Return count → End",
		code: "function countVowels(text) {\n  const vowels = new Set([\"a\", \"e\", \"i\", \"o\", \"u\"]);\n  let count = 0;\n  for (const character of text.toLowerCase()) {\n    if (vowels.has(character)) count += 1;\n  }\n  return count;\n}",
		explanation: "The list of vowels tells the code which letters to count. Lowercase lets it treat A and a the same way. The counter goes up only when the current letter is a vowel.",
		lineByLine: [
			{ code: "const vowels = new Set([\"a\", \"e\", \"i\", \"o\", \"u\"]);", explanation: "Stores the characters that count as vowels for this definition." },
			{ code: "let count = 0;", explanation: "Starts the running count at zero." },
			{ code: "for (const character of text.toLowerCase()) {", explanation: "Visits every lowercased character in the text." },
			{ code: "if (vowels.has(character)) count += 1;", explanation: "Increases the total only when the current character is a vowel." },
			{ code: "return count;", explanation: "Returns the number of vowels found." },
		],
		hints: ["Decide whether y counts as a vowel for your problem.", "Lowercase once so A and a follow the same rule.", "Try an empty string and a string containing only consonants."],
		followUps: ["How would you count consonants too?", "How can you count each vowel separately?", "Should accented vowels be included?"],
	},
];

const genericGuide = (question) => {
	const text = question.toLowerCase();
	const concepts = [];
	if (/array|list|collection/.test(text)) concepts.push("arrays and indexes");
	if (/string|text|word|character/.test(text)) concepts.push("strings and character processing");
	if (/loop|each|every|count|repeat/.test(text)) concepts.push("iteration and a running state");
	if (/if|whether|condition|compare|greater|less/.test(text)) concepts.push("conditions and comparisons");
	if (/find|search|locate/.test(text)) concepts.push("searching and stopping conditions");
	if (/function|return|output/.test(text)) concepts.push("function inputs and returned values");
	if (!concepts.length) concepts.push("input/output examples, variables, and the smallest useful operation");
	return {
		understand: `You want to: ${question}. To choose the right steps, show one example input and the answer you expect.`,
		concepts: `Your question may need ${concepts.join(", ")}. A small example will show us which ideas are actually needed.`,
		logic: "Choose a small example. Work it out by hand. Write down what changes at each step, then check that you get the expected answer.",
		pseudocode: "Read the input. Check the simplest case. Follow the steps needed to get the answer. Return the answer.",
		flowchart: "Start → Read an example → Check the simplest case → Work through the steps → Return the answer → End",
		code: "I need one sample input and its expected output to choose correct code for this question. Add those two examples and I can make the algorithm specific instead of guessing.",
		explanation: "I need to know what goes into the program and what answer should come out. Without one example of each, I might give you code for the wrong problem. Send an input and its expected answer, and I can finish the code with you.",
		lineByLine: [],
		hints: ["What information does the program start with?", "What answer should it give for one small example?", "What should happen if the input is empty or very small?"],
		followUps: ["Can you show one input and the answer you expect?", "Should the program give back an answer or print it on screen?", "Is there a special case the code must handle?"],
	};
};

const buildFallback = (question) => {
	const normalized = question.toLowerCase();
	const guide = guides.find((candidate) => candidate.match(normalized)) || genericGuide(question);
	return {
		question,
		mode: "guided-fallback",
		steps: [
			{ title: stepTitles[0], body: guide.understand },
			{ title: stepTitles[1], body: guide.concepts },
			{ title: stepTitles[2], body: guide.logic },
			{ title: stepTitles[3], body: guide.pseudocode },
			{ title: stepTitles[4], body: guide.flowchart },
			{ title: stepTitles[5], body: guide.code },
			{ title: stepTitles[6], body: guide.explanation },
		],
		why: "Each step connects the requirement to a testable plan: make the input and result precise, choose the needed concepts, trace a small example, then translate that logic into code.",
		memoryHook: guide.memoryHook || "Remember the sequence: input → small example → logic → code → edge-case check.",
		lineByLine: guide.lineByLine,
		hints: guide.hints,
		followUps: guide.followUps,
	};
};

const buildWithConfiguredAI = async (question) => {
	const response = await fetch(process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.AI_API_KEY}`,
			"Content-Type": "application/json",
		},
		signal: AbortSignal.timeout(20000),
		body: JSON.stringify({
			model: process.env.AI_MODEL || "gpt-4o-mini",
			temperature: 0.2,
			response_format: { type: "json_object" },
			messages: [
				{
					role: "system",
					content: `You are CodePath AI, a patient coding tutor for beginners. Teach the path, not only the answer. Return only a JSON object with keys steps, why, memoryHook, lineByLine, hints, followUps. steps must contain exactly these titles in order: ${stepTitles.join(", ")}. Each step has title and body. Use short sentences and common everyday words. Explain a technical word the first time it appears. Use one small worked example and show how its values change. Give complete, correct JavaScript code when the question has enough detail. Explain every code line in plain English. Avoid unexplained abbreviations and complexity notation. lineByLine is an array of {code, explanation}. memoryHook is one short phrase that helps the learner remember the steps. If details are missing, ask for one example input and expected answer instead of guessing or returning fake code. Include three useful hints and three follow-up questions.`,
				},
				{ role: "user", content: question },
			],
		}),
	});
	if (!response.ok) throw new Error("Tutor provider request failed");
	const result = await response.json();
	const content = result.choices?.[0]?.message?.content;
	const parsed = JSON.parse(content);
	if (!Array.isArray(parsed.steps) || !stepTitles.every((title) => parsed.steps.some((step) => step.title === title))) {
		throw new Error("Tutor provider response was incomplete");
	}
	return {
		question,
		mode: "ai",
		steps: stepTitles.map((title) => parsed.steps.find((step) => step.title === title)),
		why: parsed.why || "We turn the requirement into a plan, then test the plan before relying on the code.",
		memoryHook: parsed.memoryHook || "Remember the sequence: input → example → logic → code → test.",
		lineByLine: Array.isArray(parsed.lineByLine) ? parsed.lineByLine : [],
		hints: Array.isArray(parsed.hints) ? parsed.hints.slice(0, 3) : [],
		followUps: Array.isArray(parsed.followUps) ? parsed.followUps.slice(0, 3) : [],
	};
};

const tutor = async (req, res) => {
	const question = req.body.question?.trim();
	if (!question) return res.status(400).json({ success: false, message: "Enter a coding question first" });

	if (process.env.AI_API_KEY) {
		try {
			const response = await buildWithConfiguredAI(question);
			return res.json({ success: true, message: "Guided explanation ready", data: response });
		} catch {
			console.warn("Configured tutor unavailable; using the local guided fallback");
		}
	}

	return res.json({ success: true, message: "Guided explanation ready", data: buildFallback(question) });
};

module.exports = { tutor };
