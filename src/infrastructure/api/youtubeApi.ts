export interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

function parseDurationSecs(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] ?? '0') * 3600) + (parseInt(m[2] ?? '0') * 60) + parseInt(m[3] ?? '0');
}

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export async function getLatestKajianVideos(count = 5): Promise<YoutubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  
  // Jika API key tidak ada, kembalikan video dummy/contoh agar UI tidak kosong
  if (!apiKey || !channelId) {
    return [
      {
        id: 'dummy_1',
        title: 'Contoh Kajian (Mode Testing)',
        thumbnail: 'https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg', // Gambar contoh
        publishedAt: new Date().toISOString(),
        url: 'https://www.youtube.com/',
      }
    ];
  }

  try {
    // Fetch more to account for shorts/short videos that get filtered out
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=20&type=video&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    if (!searchRes.ok) return [];
    const searchData = await searchRes.json();
    const ids: string[] = (searchData.items ?? []).map((i: any) => i.id.videoId);
    if (!ids.length) return [];

    // Get durations to filter out shorts (< 30 min)
    const detailRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${ids.join(',')}&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    if (!detailRes.ok) return [];
    const detailData = await detailRes.json();

    return (detailData.items ?? [])
      .filter((item: any) => parseDurationSecs(item.contentDetails.duration) > 60)
      .slice(0, count)
      .map((item: any) => ({
        id: item.id,
        title: toTitleCase(item.snippet.title),
        thumbnail: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.medium?.url ?? '',
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id}`,
      }));
  } catch {
    return [];
  }
}
