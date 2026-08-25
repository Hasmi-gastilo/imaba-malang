const QRCode = require('qrcode');

/**
 * Generate QR Code as Data URL
 * @param {string} data - Data to encode in QR code
 * @returns {Promise<string>} - QR code as data URL
 */
async function generateQRCode(data) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Generate QR Code for Member Verification
 * @param {string} memberId - Member ID
 * @param {string} appUrl - Application URL
 * @returns {Promise<string>} - QR code as data URL
 */
async function generateMemberQRCode(memberId, appUrl) {
  const verificationUrl = `${appUrl}/verifikasi.html?id=${memberId}`;
  return await generateQRCode(verificationUrl);
}

/**
 * Generate QR Code for Event Attendance
 * @param {string} eventId - Event ID
 * @param {string} appUrl - Application URL
 * @returns {Promise<string>} - QR code as data URL
 */
async function generateEventQRCode(eventId, appUrl) {
  const attendanceUrl = `${appUrl}/presensi.html?event=${eventId}`;
  return await generateQRCode(attendanceUrl);
}

module.exports = {
  generateQRCode,
  generateMemberQRCode,
  generateEventQRCode
};
