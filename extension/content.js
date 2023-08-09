async function loadWordReplacements() {
 try {
 const response = await fetch('https://raw.githubusercontent.com/kottz-git/twistedtext/main/word_replacements.json');
 if (response.ok) {
 const json = await response.json();
 return json;
 } else {
 console.error('Failed to fetch word replacements from GitHub.');
 return null;
 }
 } catch (error) {
 console.error('Error fetching word replacements:', error);
 return null;
 }
}

let wordReplacements = {};

async function initializeWordReplacements() {
 const fetchedReplacements = await loadWordReplacements();
 if (fetchedReplacements) {
 wordReplacements = fetchedReplacements;
 }
}

const cache = new Map();

function cacheOriginalText(node) {
 const originalText = node.textContent;
 cache.set(node, originalText);
}

function mangleWord(word) {
 if (word.length <= 3) return word;

 const letters = word.split("");
 const indexToMangle = getRandomIndex(letters);
 const letter1 = letters[indexToMangle];
 const letter2 = letters[indexToMangle + 1];

 if (letter1 !== undefined && letter2 !== undefined) {
 if (/^[a-zA-Z]$/.test(letter1)) {
 if (letter1 === letter1.toUpperCase()) {
 letters[indexToMangle] = letter2.toUpperCase();
 } else {
 letters[indexToMangle] = letter2.toLowerCase();
 }
 } else {
 letters[indexToMangle] = letter2.toLowerCase();
 }

 if (/^[a-zA-Z]$/.test(letter2)) {
 if (letter2 === letter2.toUpperCase()) {
 letters[indexToMangle + 1] = letter1.toUpperCase();
 } else {
 letters[indexToMangle + 1] = letter1.toLowerCase();
 }
 } else {
 letters[indexToMangle + 1] = letter1.toLowerCase();
 }
 }

 letters.forEach((letter, index) => {
 if (Math.random() < 0.05) {
 switch (letter) {
 case 's':
 letters[index] = 'z';
 break;
 case 'c':
 letters[index] = 'k';
 break;
 case 'e':
 letters[index] = '3';
 break;
 case 'o':
 letters[index] = '0';
 break;
 case 'm':
 letters[index] = 'n';
 break;
 default:
 break;
 }
 }
 });

 return letters.join("");
}

function mangleText(text) {
 const words = text.split(" ");
 const mangledWords = words.map((word) => {
 if (Math.random() < 0.2) {
 return mangleWord(word);
 }
 return word;
 });
 return mangledWords.join(" ");
}

function manipulateTextNode(node) {
	if (node.nodeType === Node.TEXT_NODE) {
		const originalText = cache.get(node);
		if (originalText) {
			const twistedText = mangleText(originalText);
			if (twistedText !== originalText) {
				console.log(`[Content] Twisting text: "${originalText}" -> "${twistedText}"`);
				node.textContent = twistedText;
			}
		} else {
			cacheOriginalText(node);
		}
	}
}

function twistTextNodes(nodeList) {
	nodeList.forEach((node) => {
		if (node.parentElement.offsetHeight > 0) {
			manipulateTextNode(node);
		}
	});
}

function twistPageContent() {
	const visibleTextNodes = [];
	const allNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
	let currentNode;
	while (currentNode = allNodes.nextNode()) {
		if (currentNode.parentElement.offsetHeight > 0) {
			visibleTextNodes.push(currentNode);
		}
	}
	twistTextNodes(visibleTextNodes);

	cache.forEach((originalText, node) => {
		if (Math.random() < 0.1 && node.textContent !== originalText) {
			console.log(`[Content] Restoring text to original: "${node.textContent}" -> "${originalText}"`);
			node.textContent = originalText;
			cache.delete(node);
		}
	});

	visibleTextNodes.forEach((node) => {
		const words = node.textContent.split(/\s+/);
		const mangledWords = words.map((word) => {
			const replacements = wordReplacements[word.toLowerCase()];
			if (replacements && Math.random() < 0.5) {
				const randomReplacement = replacements[getRandomIndex(replacements)];
				return randomReplacement;
			}
			return word;
		});
		node.textContent = mangledWords.join(" ");
	});
}
function getRandomIndex(array) {
	return Math.floor(Math.random() * array.length);
}

window.addEventListener('load', () => {
	initializeWordReplacements();
	twistPageContent();
	setInterval(() => {
		twistPageContent();
	}, Math.floor(Math.random() * 10000) + 2500);
});
