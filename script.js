async function lookupWord() {
  const word = document.getElementById('wordInput').value.trim();
  const lang = document.getElementById('targetLang').value;
  const resultBox = document.getElementById('resultBox');
  resultBox.innerHTML = "Loading...";

  if (!word) {
    resultBox.innerHTML = "<p>Please enter a word.</p>";
    return;
  }

  try {
    // Translate using unofficial Google Translate endpoint
    const translateRes = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(word)}`);
    const translateData = await translateRes.json();
    const translated = translateData[0][0][0];

    // Fetch dictionary info
    const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const dictData = await dictRes.json();

    if (!Array.isArray(dictData)) {
      resultBox.innerHTML = `<p>No dictionary data found for "${word}".</p>`;
      return;
    }

    const entry = dictData[0];
    const phonetic = entry.phonetics?.[0]?.text || "N/A";
    const meanings = entry.meanings || [];

    let output = `
      <h2>🔤 Word: ${word}</h2>
      <p><strong>Phonetic:</strong> ${phonetic}</p>
      <p><strong>Translated:</strong> ${translated}</p>
    `;

    meanings.forEach((meaning, index) => {
      const def = meaning.definitions?.[0]?.definition || "No definition";
      const example = meaning.definitions?.[0]?.example || "";
      const synonyms = meaning.definitions?.[0]?.synonyms || [];
      const antonyms = meaning.definitions?.[0]?.antonyms || [];

      output += `
        <div style="margin-top:15px">
          <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
          <p><strong>Definition:</strong> ${def}</p>
          ${example ? `<p><strong>Example:</strong> ${example}</p>` : ""}
          ${synonyms.length ? `<p><strong>Synonyms:</strong> ${synonyms.join(", ")}</p>` : ""}
          ${antonyms.length ? `<p><strong>Antonyms:</strong> ${antonyms.join(", ")}</p>` : ""}
        </div>
      `;
    });

    resultBox.innerHTML = output;
  } catch (error) {
    resultBox.innerHTML = "<p>Error fetching data. Try again later.</p>";
    console.error(error);
  }
}
