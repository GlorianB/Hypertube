const createOptions = (id) => {
  const options = {
    connections: 100,
    uploads: 10,
    path: process.cwd() + "/Movies/" + id,
    verify: true,
    tracker: true, // Whether or not to use trackers from torrent file or magnet link
    // Defaults to true
    trackers: [
      "udp://tracker.openbittorrent.com:80",
      "udp://tracker.ccc.de:80",
      "udp://tracker.leechers-paradise.org:6969/announce",
      "udp://tracker.pirateparty.gr:6969/announce",
      "udp://tracker.coppersurfer.tk:6969/announce",
      "http://asnet.pw:2710/announce",
      "http://tracker.opentrackr.org:1337/announce",
      "udp://tracker.opentrackr.org:1337/announce",
      "udp://tracker1.xku.tv:6969/announce",
      "udp://tracker1.wasabii.com.tw:6969/announce",
      "udp://tracker.zer0day.to:1337/announce",
      "udp://p4p.arenabg.com:1337/announce",
      "http://tracker.internetwarriors.net:1337/announce",
      "udp://tracker.internetwarriors.net:1337/announce",
      "udp://allesanddro.de:1337/announce",
      "udp://9.rarbg.com:2710/announce",
      "udp://tracker.dler.org:6969/announce",
      "http://mgtracker.org:6969/announce",
      "http://tracker.mg64.net:6881/announce",
      "http://tracker.devil-torrents.pl:80/announce",
      "http://ipv4.tracker.harry.lu:80/announce",
      "http://tracker.electro-torrent.pl:80/announce",
    ],
  };

  return options;
};

module.exports = createOptions;
