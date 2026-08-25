const fs = require('fs');
let code = fs.readFileSync('public/js/api.js', 'utf8');

const insertText = `
  // ===================================
  // EVENT APIs
  // ===================================

  async getAllEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(\`/events?\${queryString}\`);
  }

  async getEventById(id) {
    return this.get(\`/events/\${id}\`);
  }

  // ===================================
  // PROGRAM APIs
  // ===================================
  async getAllPrograms() {
    return this.get('/programs');
  }
`;

if (!code.includes('getAllPrograms')) {
  code = code.replace('  async submitAttendance', insertText + '\n  async submitAttendance');
  fs.writeFileSync('public/js/api.js', code);
  console.log('Fixed api.js');
} else {
  console.log('Already fixed.');
}
