module.exports = {
  connections: 100, // Max amount of peers to be connected to.
  uploads: 10, // Number of upload slots.
  path: "/sgoinfre/goinfre/Perso/gphilips/hypertube/torrents", // Where to save the files.
  verify: true, // Verify previously stored data before starting
  // Defaults to true
  dht: true, // Whether or not to use DHT to initialize the swarm.
  // Defaults to true
  tracker: true // Whether or not to use trackers from torrent file or magnet link
  // Defaults to true
  // trackers: [
  //     'udp://tracker.openbittorrent.com:80',
  //     'udp://tracker.ccc.de:80'
  // ],
  // Allows to declare additional custom trackers to use
  // Defaults to empty
  // storage: myStorage()  // Use a custom storage backend rather than the default disk-backed one
};
