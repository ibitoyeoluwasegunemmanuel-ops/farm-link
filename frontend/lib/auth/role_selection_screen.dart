import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../services/auth_service.dart';

class RoleSelectionScreen extends StatefulWidget {
	const RoleSelectionScreen({super.key});

	@override
	State<RoleSelectionScreen> createState() => _RoleSelectionScreenState();
}

class _RoleSelectionScreenState extends State<RoleSelectionScreen> {
	final AuthService _authService = AuthService();
	bool _isLoading = false;

	void _selectRole(String role) async {
		setState(() => _isLoading = true);

		try {
			final result = await _authService.setUserRole(role);
      
			if (result['success']) {
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
				}
			}
		} catch (e) {
			ScaffoldMessenger.of(context).showSnackBar(
				const SnackBar(content: Text('Failed to set role. Please try again.')),
			);
		} finally {
			setState(() => _isLoading = false);
		}
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
							Text(
								'I am a...',
								style: TextStyle(
									fontSize: 32.sp,
									fontWeight: FontWeight.bold,
									color: const Color(0xFF2E7D32),
								),
							),
							SizedBox(height: 8.h),
							Text(
								'Select how you want to use FarmLink',
								style: TextStyle(
									fontSize: 16.sp,
									color: Colors.grey[600],
								),
							),
							SizedBox(height: 40.h),
							// Farmer Option
							_buildRoleCard(
								icon: Icons.agriculture,
								title: 'Farmer',
								description: 'I grow crops and want to sell to buyers',
								color: Colors.green,
								onTap: () => _selectRole('farmer'),
							),
							SizedBox(height: 16.h),
							// Buyer Option
							_buildRoleCard(
								icon: Icons.shopping_cart,
								title: 'Buyer',
								description: 'I want to buy farm produce for my business',
								color: Colors.blue,
								onTap: () => _selectRole('buyer'),
							),
							SizedBox(height: 16.h),
							// Transporter Option
							_buildRoleCard(
								icon: Icons.local_shipping,
								title: 'Transporter',
								description: 'I have trucks and want to deliver goods',
								color: Colors.orange,
								onTap: () => _selectRole('transporter'),
							),
							if (_isLoading) ...[
								SizedBox(height: 40.h),
								const Center(child: CircularProgressIndicator()),
							],
						],
					),
				),
			),
		);
	}

	Widget _buildRoleCard({
		required IconData icon,
		required String title,
		required String description,
		required Color color,
		required VoidCallback onTap,
	}) {
		return GestureDetector(
			onTap: _isLoading ? null : onTap,
			child: Container(
				padding: EdgeInsets.all(20.w),
				decoration: BoxDecoration(
					color: color.withOpacity(0.05),
					borderRadius: BorderRadius.circular(16.r),
					border: Border.all(color: color.withOpacity(0.2)),
				),
				child: Row(
					children: [
						Container(
							width: 60.w,
							height: 60.w,
							decoration: BoxDecoration(
								color: color.withOpacity(0.1),
								borderRadius: BorderRadius.circular(12.r),
							),
							child: Icon(
								icon,
								size: 30.w,
								color: color,
							),
						),
						SizedBox(width: 16.w),
						Expanded(
							child: Column(
								crossAxisAlignment: CrossAxisAlignment.start,
								children: [
									Text(
										title,
										style: TextStyle(
											fontSize: 18.sp,
											fontWeight: FontWeight.bold,
											color: Colors.black87,
										),
									),
									SizedBox(height: 4.h),
									Text(
										description,
										style: TextStyle(
											fontSize: 14.sp,
											color: Colors.grey[600],
										),
									),
								],
							),
						),
						Icon(
							Icons.arrow_forward_ios,
							size: 16.w,
							color: color,
						),
					],
				),
			),
		);
	}
}
