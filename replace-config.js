module.exports = {
  files: '../*.html',
  from: [
    /<span>John Doe<\/span>/g,
    /src="https:\/\/randomuser.me\/api\/portraits\/men\/44.jpg"/g
  ],
  to: [
    '<span>Ekta Sandhu</span>',
    'src="https://randomuser.me/api/portraits/women/33.jpg"'
  ],
  countMatches: true,
}; 