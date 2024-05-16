async function fetchInitialContent () {
    const response = await fetch("https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss");
    const data = await response.json();
    console.log(data);
}

fetchInitialContent();