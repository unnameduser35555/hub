export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://api.github.com/repos/unnameduser35555/hub/contents/?ref=main',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'KoyotaHUB'
        }
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `GitHub API returned ${response.status}`
      });
    }

    const files = await response.json();

    const works = files
      .filter(file =>
        file.type === 'file' &&
        /\.html$/i.test(file.name) &&
        file.name.toLowerCase() !== 'index.html'
      )
      .map(file => ({
        name: file.name,
        url: `/${encodeURIComponent(file.name)}`
      }));

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(works);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to load repository'
    });
  }
}
