import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../services/auth_service.dart';
import 'role_selection_screen.dart';

class OTPScreen extends StatefulWidget {
	final String phoneNumber;
  
	const OTPScreen({super.key, required this.phoneNumber});

	@override
	State<OTPScreen> createState() => _OTPScreenState();
}

class _OTPScreenState extends State<OTPScreen> {
	final List<TextEditingController> _controllers = List.generate(
		6, 
		(index) => TextEditingController(),
	);
	final List<FocusNode> _focusNodes = List.generate(
		6,
		(index) => FocusNode(),
	);
  
	final AuthService _authService = AuthService();
	bool _isLoading = false;
	int _resendTimer = 60;
	bool _canResend = false;

	@override
	void initState() {
		super.initState();
		_startResendTimer();
	}

	void _startResendTimer() {
		Future.delayed(const Duration(seconds: 1), () {
			if (mounted) {
				setState(() {
					if (_resendTimer > 0) {
						_resendTimer--;
						_startResendTimer();
					} else {
						_canResend = true;
					}
				});
			}
		});
	}

	void _verifyOTP() async {
		String otp = _controllers.map((c) => c.text).join();
    
		if (otp.length != 6) {
			_showError('Please enter complete OTP');
			return;
		}

		setState(() => _isLoading = true);

		try {
			final result = await _authService.verifyOTP(widget.phoneNumber, otp);
      
			if (result['success']) {
				if (result['isNewUser'] == true) {
					Navigator.pushReplacement(
						context,
						MaterialPageRoute(
							builder: (context) => const RoleSelectionScreen(),
						),
					);
				} else {
					// Existing user - navigate to dashboard
					final role = result['role'];
					switch (role) {
						case 'farmer':
							Navigator.pushReplacementNamed(context, '/farmer-dashboard');
							break;
						case 'buyer':
							Navigator.pushReplacementNamed(context, '/buyer-dashboard');
							break;
						case 'transporter':
							Navigator.pushReplacementNamed(context, '/transporter-dashboard');
							break;
						default:
							Navigator.pushReplacementNamed(context, '/role-selection');
					}
				}
			} else {
				_showError(result['message'] ?? 'Invalid OTP');
			}
		} catch (e) {
			_showError('Verification failed. Please try again.');
		} finally {
			setState(() => _isLoading = false);
		}
	}

	void _resendOTP() async {
		if (!_canResend) return;
    
		setState(() {
			_resendTimer = 60;
			_canResend = false;
		});
		_startResendTimer();
    
		await _authService.sendOTP(widget.phoneNumber);
		_showSuccess('OTP resent successfully');
	}

	void _showError(String message) {
		ScaffoldMessenger.of(context).showSnackBar(
			SnackBar(content: Text(message), backgroundColor: Colors.red),
		);
	}

	void _showSuccess(String message) {
		ScaffoldMessenger.of(context).showSnackBar(
			SnackBar(content: Text(message), backgroundColor: Colors.green),
		);
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			backgroundColor: Colors.white,
			body: SafeArea(
				child: Padding(
					padding: EdgeInsets.all(24.w),
					child: Column(
						crossAxisAlignment: CrossAxisAlignment.start,
						children: [
							SizedBox(height: 40.h),
							// Back button
							GestureDetector(
								onTap: () => Navigator.pop(context),
								child: Container(
									padding: EdgeInsets.all(8.w),
									decoration: BoxDecoration(
										color: Colors.grey[100],
										borderRadius: BorderRadius.circular(12.r),
									),
									child: const Icon(Icons.arrow_back),
								),
							),
							SizedBox(height: 40.h),
							// Title
							Text(
								'Enter OTP',
								style: TextStyle(
									fontSize: 28.sp,
									fontWeight: FontWeight.bold,
									color: const Color(0xFF2E7D32),
								),
							),
							SizedBox(height: 8.h),
							Text(
								'We sent a code to ${widget.phoneNumber}',
								style: TextStyle(
									fontSize: 16.sp,
									color: Colors.grey[600],
								),
							),
							SizedBox(height: 60.h),
							// OTP Input
							Row(
								mainAxisAlignment: MainAxisAlignment.spaceBetween,
								children: List.generate(6, (index) {
									return Container(
										width: 50.w,
										height: 60.h,
										decoration: BoxDecoration(
											color: Colors.grey[50],
											borderRadius: BorderRadius.circular(12.r),
											border: Border.all(color: Colors.grey[200]!),
										),
										child: TextField(
											controller: _controllers[index],
											focusNode: _focusNodes[index],
											keyboardType: TextInputType.number,
											textAlign: TextAlign.center,
											maxLength: 1,
											style: TextStyle(
												fontSize: 24.sp,
												fontWeight: FontWeight.bold,
											),
											decoration: const InputDecoration(
												counterText: '',
												border: InputBorder.none,
											),
											onChanged: (value) {
												if (value.isNotEmpty && index < 5) {
													_focusNodes[index + 1].requestFocus();
												} else if (value.isEmpty && index > 0) {
													_focusNodes[index - 1].requestFocus();
												}
												if (index == 5 && value.isNotEmpty) {
													_verifyOTP();
												}
											},
										),
									);
								}),
							),
							SizedBox(height: 40.h),
							// Resend
							Center(
								child: GestureDetector(
									onTap: _canResend ? _resendOTP : null,
									child: Text(
										_canResend 
												? 'Resend OTP' 
												: 'Resend OTP in $_resendTimer seconds',
										style: TextStyle(
											fontSize: 14.sp,
											color: _canResend ? const Color(0xFF2E7D32) : Colors.grey[400],
											fontWeight: FontWeight.w600,
										),
									),
								),
							),
							const Spacer(),
							// Verify Button
							SizedBox(
								width: double.infinity,
								child: ElevatedButton(
									onPressed: _isLoading ? null : _verifyOTP,
									child: _isLoading
											? SizedBox(
													height: 20.h,
													width: 20.h,
													child: const CircularProgressIndicator(
														strokeWidth: 2,
														valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
													),
												)
											: Text(
													'Verify',
													style: TextStyle(fontSize: 16.sp),
												),
								),
							),
						],
					),
				),
			),
		);
	}
}
