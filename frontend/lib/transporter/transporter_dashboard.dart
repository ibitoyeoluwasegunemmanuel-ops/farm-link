import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'register_truck_screen.dart';
import 'available_jobs_screen.dart';
import '../shared/profile_screen.dart';

class TransporterDashboard extends StatefulWidget {
	const TransporterDashboard({super.key});

	@override
	State<TransporterDashboard> createState() => _TransporterDashboardState();
}

class _TransporterDashboardState extends State<TransporterDashboard> {
	int _currentIndex = 0;
	bool _isAvailable = false;

	@override
	Widget build(BuildContext context) {
		final screens = [
			_buildHomeScreen(),
			const AvailableJobsScreen(),
			const ProfileScreen(),
		];

		return Scaffold(
			body: screens[_currentIndex],
			bottomNavigationBar: BottomNavigationBar(
				currentIndex: _currentIndex,
				onTap: (index) => setState(() => _currentIndex = index),
				selectedItemColor: const Color(0xFF2E7D32),
				items: const [
					BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
					BottomNavigationBarItem(icon: Icon(Icons.local_shipping), label: 'Jobs'),
					BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
				],
			),
			floatingActionButton: _currentIndex == 0
					? FloatingActionButton.extended(
							onPressed: () => Navigator.push(
								context,
								MaterialPageRoute(builder: (_) => const RegisterTruckScreen()),
							),
							backgroundColor: const Color(0xFF2E7D32),
							icon: const Icon(Icons.add),
							label: const Text('Add Truck'),
						)
					: null,
		);
	}

	Widget _buildHomeScreen() {
		return SafeArea(
			child: Padding(
				padding: EdgeInsets.all(16.w),
				child: Column(
					crossAxisAlignment: CrossAxisAlignment.start,
					children: [
						Row(
							mainAxisAlignment: MainAxisAlignment.spaceBetween,
							children: [
								Text(
									'Driver Dashboard',
									style: TextStyle(
										fontSize: 24.sp,
										fontWeight: FontWeight.bold,
										color: const Color(0xFF2E7D32),
									),
								),
								Switch(
									value: _isAvailable,
									onChanged: (value) => setState(() => _isAvailable = value),
									activeColor: const Color(0xFF2E7D32),
								),
							],
						),
						Text(
							_isAvailable ? 'You are ONLINE' : 'You are OFFLINE',
							style: TextStyle(
								color: _isAvailable ? Colors.green : Colors.grey,
								fontWeight: FontWeight.w600,
							),
						),
						SizedBox(height: 24.h),
            
						// Stats
						Row(
							children: [
								Expanded(
									child: Column(
										children: [
											Text('Trips', style: TextStyle(fontWeight: FontWeight.w600)),
											SizedBox(height: 8.h),
											Text('0', style: TextStyle(fontSize: 20.sp, color: Colors.grey[700])),
										],
									),
								),
								Expanded(
									child: Column(
										children: [
											Text('Earnings', style: TextStyle(fontWeight: FontWeight.w600)),
											SizedBox(height: 8.h),
											Text('₦0', style: TextStyle(fontSize: 20.sp, color: Colors.grey[700])),
										],
									),
								),
								Expanded(
									child: Column(
										children: [
											Text('Rating', style: TextStyle(fontWeight: FontWeight.w600)),
											SizedBox(height: 8.h),
											Row(
												mainAxisAlignment: MainAxisAlignment.center,
												children: [
													Icon(Icons.star, color: Colors.amber, size: 20.w),
													Text('0.0', style: TextStyle(fontSize: 20.sp, color: Colors.grey[700])),
												],
											),
										],
									),
								),
							],
						),
						SizedBox(height: 32.h),
						Text(
							'Available Jobs',
							style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w600),
						),
						SizedBox(height: 16.h),
						Center(
							child: Column(
								children: [
									Icon(Icons.local_shipping, size: 60.w, color: Colors.grey[300]),
									SizedBox(height: 12.h),
									Text('No jobs available', style: TextStyle(color: Colors.grey[600])),
								],
							),
						),
					],
				),
			),
		);
	}
}
