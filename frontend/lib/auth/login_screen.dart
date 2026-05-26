import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../services/auth_service.dart';
import 'otp_screen.dart';

class LoginScreen extends StatefulWidget {
	const LoginScreen({super.key});

	@override
	State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
	final TextEditingController _phoneController = TextEditingController();
	final AuthService _authService = AuthService();
	bool _isLoading = false;

	void _sendOTP() async {
		String phone = _phoneController.text.trim();
    
		if (phone.isEmpty) {
			_showError('Please enter your phone number');
			return;
		}

		// Format phone number
		if (phone.startsWith('0')) {
			phone = '+234${phone.substring(1)}';
		} else if (!phone.startsWith('+')) {
			phone = '+234$phone';
		}

		setState(() => _isLoading = true);

		try {
			final result = await _authService.sendOTP(phone);
      
			if (result['success']) {
				Navigator.push(
					context,
					MaterialPageRoute(
						builder: (context) => OTPScreen(phoneNumber: phone),
					),
				);
			} else {
				_showError(result['message'] ?? 'Failed to send OTP');
			}
		} catch (e) {
			_showError('Network error. Please try again.');
		} finally {
			setState(() => _isLoading = false);
		}
	}

	void _showError(String message) {
		ScaffoldMessenger.of(context).showSnackBar(
			SnackBar(
				content: Text(message),
				backgroundColor: Colors.red,
				behavior: SnackBarBehavior.floating,
			),
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
								'Welcome to FarmLink',
								style: TextStyle(
									fontSize: 28.sp,
									fontWeight: FontWeight.bold,
									color: const Color(0xFF2E7D32),
								),
							),
							SizedBox(height: 8.h),
							Text(
								'Enter your phone number to get started',
								style: TextStyle(
									fontSize: 16.sp,
									color: Colors.grey[600],
								),
							),
							SizedBox(height: 60.h),
							// Phone Input
							Container(
								decoration: BoxDecoration(
									color: Colors.grey[50],
									borderRadius: BorderRadius.circular(16.r),
									border: Border.all(color: Colors.grey[200]!),
								),
								child: Row(
									children: [
										Container(
											padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
											decoration: BoxDecoration(
												border: Border(
													right: BorderSide(color: Colors.grey[200]!),
												),
											),
											child: Row(
												children: [
													Image.network(
														'https://flagcdn.com/w40/ng.png',
														width: 24.w,
													),
													SizedBox(width: 8.w),
													Text(
														'+234',
														style: TextStyle(
															fontSize: 16.sp,
															fontWeight: FontWeight.w500,
														),
													),
												],
											),
										),
										Expanded(
											child: TextField(
												controller: _phoneController,
												keyboardType: TextInputType.phone,
												style: TextStyle(fontSize: 16.sp),
												decoration: InputDecoration(
													hintText: '801 234 5678',
													hintStyle: TextStyle(color: Colors.grey[400]),
													border: InputBorder.none,
													contentPadding: EdgeInsets.symmetric(horizontal: 16.w),
												),
											),
										),
									],
								),
							),
							SizedBox(height: 24.h),
							// Info text
							Row(
								children: [
									Icon(Icons.info_outline, size: 16.w, color: Colors.grey[500]),
									SizedBox(width: 8.w),
									Expanded(
										child: Text(
											'We will send you a verification code',
											style: TextStyle(
												fontSize: 12.sp,
												color: Colors.grey[500],
											),
										),
									),
								],
							),
							const Spacer(),
							// Continue Button
							SizedBox(
								width: double.infinity,
								child: ElevatedButton(
									onPressed: _isLoading ? null : _sendOTP,
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
													'Continue',
													style: TextStyle(fontSize: 16.sp),
												),
								),
							),
							SizedBox(height: 20.h),
							// Terms
							Center(
								child: Text(
									'By continuing, you agree to our Terms of Service and Privacy Policy',
									textAlign: TextAlign.center,
									style: TextStyle(
										fontSize: 12.sp,
										color: Colors.grey[500],
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
