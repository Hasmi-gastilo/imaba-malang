const Member = require('../models/Member');

/**
 * Generate unique Member ID with format: IMB-MALANG-00001
 */
async function generateMemberId() {
  try {
    // Find the last member ID
    const lastMember = await Member.findOne()
      .sort({ createdAt: -1 })
      .select('memberId');

    let nextNumber = 1;

    if (lastMember && lastMember.memberId) {
      // Extract the number from the last member ID
      const match = lastMember.memberId.match(/IMB-MALANG-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    // Pad with zeros (5 digits)
    const paddedNumber = String(nextNumber).padStart(5, '0');
    
    return `IMB-MALANG-${paddedNumber}`;
  } catch (error) {
    console.error('Error generating member ID:', error);
    throw error;
  }
}

module.exports = generateMemberId;
