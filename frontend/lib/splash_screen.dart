import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'services/auth_service.dart';

class SplashScreen extends StatefulWidget {
	const SplashScreen({super.key});

	@override
	State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> 
		with SingleTickerProviderStateMixin {
  
	late AnimationController _controller;
	late Animation<double> _fadeAnimation;
	late Animation<double> _scaleAnimation;

	@override
	void initState() {
		super.initState();
    
		_controller = AnimationController(
			duration: const Duration(seconds: 2),
			vsync: this,
		);

		_fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
			CurvedAnimation(parent: _controller, curve: Curves.easeIn),
		);

		_scaleAnimation = Tween<double>(begin: 0.5, end: 1.0).animate(
			CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
		);

		_controller.forward();

		// Navigate after 3 seconds
		Timer(const Duration(seconds: 3), () {
			_checkAuth();
		});
	}

	void _checkAuth() async {
		final authService = AuthService();
		final isLoggedIn = await authService.isLoggedIn();
		final userRole = await authService.getUserRole();

		if (isLoggedIn && userRole != null) {
			// Navigate to appropriate dashboard
			switch (userRole) {
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
					Navigator.pushReplacementNamed(context, '/login');
			}
		} else {
			Navigator.pushReplacementNamed(context, '/login');
		}
	}

	@override
	void dispose() {
		_controller.dispose();
		super.dispose();
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			backgroundColor: const Color(0xFF2E7D32),
			body: Center(
				child: AnimatedBuilder(
					animation: _controller,
					builder: (context, child) {
						return FadeTransition(
							opacity: _fadeAnimation,
							child: ScaleTransition(
								scale: _scaleAnimation,
								child: Column(
									mainAxisAlignment: MainAxisAlignment.center,
									children: [
										// Logo Icon
										Container(
											width: 120.w,
											height: 120.w,
											decoration: BoxDecoration(
												color: Colors.white,
												borderRadius: BorderRadius.circular(30.r),
												boxShadow: [
													BoxShadow(
														color: Colors.black.withOpacity(0.2),
														blurRadius: 20,
														offset: const Offset(0, 10),
													),
												],
											),
											child: Icon(
												Icons.agriculture,
												size: 60.w,
												color: const Color(0xFF2E7D32),
											),
										),
										SizedBox(height: 30.h),
										// App Name
										Text(
											'FarmLink',
											style: TextStyle(
												fontSize: 40.sp,
												fontWeight: FontWeight.bold,
												color: Colors.white,
												letterSpacing: 2,
											),
										),
										SizedBox(height: 10.h),
										// Tagline
										Text(
											'Connecting Farms to Markets',
											style: TextStyle(
												fontSize: 16.sp,
												color: Colors.white.withOpacity(0.9),
												letterSpacing: 1,
											),
										),
										SizedBox(height: 60.h),
										// Loading indicator
										CircularProgressIndicator(
											valueColor: AlwaysStoppedAnimation<Color>(
												Colors.white.withOpacity(0.8),
											),
											strokeWidth: 3,
										),
									],
								),
							),
						);
					},
				),
			),
		);
	}
}
