document.addEventListener("DOMContentLoaded", function () {
  fetchData("Welcome");

  const btn = document.getElementById("btn");
  const meanings = document.getElementById("meanings");

  btn.addEventListener("click", () => {
    const word = document.getElementById("word").value;
    document.getElementById("word").value = "";
    document.getElementById("inputWord").textContent = word;
    fetchData(word);
  });

  function fetchData(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Word not found");
        }
        return response.json();
      })
      .then((data) => {
        formatData(data);
      })
      .catch((error) => {
        inputWord.textContent =
          "Please enter a valid word or check for spelling.";
        meanings.innerHTML = "";
        audio.style.display = "none";
      });
  }

  function formatData(data) {
    const wordMeaning = data[0].meanings;
    const definition = wordMeaning.map((value, index) => {
      const htmlTemplate = `<h2>${value.partOfSpeech}</h2>`;
      const definitions = value.definitions.slice(0, 3).map((def) => {
        return `<p>${def.definition}</p>`;
      });
      const htmlForSynonyms = value.synonyms.slice(0, 3).map((syn) => {
        return `<p>${syn}</p>`;
      });
      const htmlForAntonyms = value.antonyms.slice(0, 3).map((ant) => {
        return `<p>${ant}</p>`;
      });

      const synonyms = value.synonyms.length > 0 ? `<h3>Synonyms</h3>` : "";
      const antonyms = value.antonyms.length > 0 ? `<h3>Antonyms</h3>` : "";
      return `
        ${htmlTemplate}
        ${definitions.join("")}
        ${synonyms}
        ${htmlForSynonyms.join("")}
        ${antonyms}
        ${htmlForAntonyms.join("")}
      `;
    });

    setAudio(data[0].phonetics);
    meanings.innerHTML = definition.join("");
  }

  function setAudio(phonetics) {
    const audio = document.getElementById("audio");
    const audioUrl = phonetics.find((p) => p.audio)?.audio;

    if (audioUrl) {
      audio.src = audioUrl;
      audio.style.display = "block";
    } else {
      audio.src = "";
      audio.style.display = "none";
    }
  }
});
