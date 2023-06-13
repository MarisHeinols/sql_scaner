document.getElementById('runButton').addEventListener('click', async () => {

    let queryOptions = { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT };

    chrome.tabs.query(queryOptions, function (tabs) {

        const url = tabs[0].url;
        console.log(JSON.stringify({ url }));

        fetch('http://localhost:5000/run-python', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        })
            .then(response => response.json())
            .then(data => {
                const output = document.getElementById('output');
                const result = JSON.parse(data.result);

                const formsCount = result.formsCount;
                const formsHTML = result.formsHTML;
                const isVulnerable = result.vounrable;

                output.innerHTML = `
                    <p>URL: ${url}</p>
                    <p>Forms Count: <span style="color: #08ceff">${formsCount}</span></p>
                    <p>Forms HTML:</p>
                    ${getFormattedForms(formsHTML)}
                    <p>SQL Injection Vulnerability: <span style="color: ${isVulnerable ? '#ff2660' : '#00ff8c'}">${isVulnerable.toString().toUpperCase()}</span></p>
                `;
            })
            .catch(error => console.log(error));
    });
});

function getFormattedForms(formsHTML) {
    if (!formsHTML) {
      return 'None';
    }
  
    const forms = formsHTML.split('</form>');
    let formattedForms = '';
  
    forms.forEach((form, index) => {
      const formContent = form.trim();
      if (formContent) {
        const formattedCode = Prism.highlight(formContent, Prism.languages.html, 'html');
        const formattedText = formattedCode.replace(/<span class="token/g, '<span style="white-space: pre-wrap;" class="token');
        formattedForms += `
          <div style="background-color: #f6f8fa; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px; overflow-x: auto;">
            <pre><code class="language-html">${formattedText}</code></pre>
          </div>
        `;
      }
    });
  
    return formattedForms;
  }