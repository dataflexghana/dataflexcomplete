const bcrypt = require('bcryptjs');

const password = 'adamantis38_';
const hash = '$2a$10$1qTBkmkCZv7UUZ3r0sW59.oiG3QBWheevIbpNgCpvPlc42hl4S7A2';

bcrypt.compare(password, hash).then(result => {
  console.log('Match:', result); // Should say: true
});
