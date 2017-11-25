const apikey ='279afcc74fc947589cc5e61c5582669a';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = 'the-times-of-india';



     window.addEventListener('load', async e => {
         updateNews();
         await updateSources();

         sourceSelector.value = defaultSource;

         sourceSelector.addEventListener('change', e => {
             updateNews(e.target.value);
         })
        
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('service worker registered.'))
        .catch(err => 'service worker registration failed.')
    }

async function updateSources() {
    const result = await fetch(`https://newsapi.org/v2/sources?apiKey=${apikey}`);
    const json = await result.json();

    sourceSelector.innerHTML = json.sources.map(src => `<option value="${src.id}">${src.name}</option>`).join('/n');
}

async function updateNews(source = defaultSource) {
    const result = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apikey}`);
    const json = await result.json();

    main.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
    return `
    <div class="article">
        <a href="${article.url}">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" alt="${article.title}">
        <p>${article.description}</p>
        </a>
    </div>
    `;
}