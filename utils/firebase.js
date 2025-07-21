// Mocking Firebase OTP - Replace with Firebase Admin SDK integration
exports.sendOTPViaFirebase = async (mobile) => {
  console.log(`OTP sent to ${mobile}`);
};

exports.verifyOTPViaFirebase = async (mobile, otp) => {
  return otp === '123456'; // mock verification
};
