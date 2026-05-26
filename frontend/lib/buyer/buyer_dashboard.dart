import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'search_harvests_screen.dart';
import '../shared/profile_screen.dart';

class BuyerDashboard extends StatefulWidget {
	const BuyerDashboard({super.key});

	@override
	State<BuyerDashboard> createState() => _BuyerDashboardState();
}

class _BuyerDashboardState extends State<BuyerDashboard> {
	int _currentIndex = 0;

	@override
	Widget build(BuildContext context) {
		final screens = [
			_buildHomeScreen(),
			const SearchHarvestsScreen(),
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
					BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
					BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
				],
			),
		);
	}

	Widget _buildHomeScreen() {
		return SafeArea(
			child: Padding(
				padding: EdgeInsets.all(16.w),
				child: Column(
					crossAxisAlignment: CrossAxisAlignment.start,
					children: [
						Text(
							'Find Fresh Produce',
							style: TextStyle(
								fontSize: 24.sp,
								fontWeight: FontWeight.bold,
								color: const Color(0xFF2E7D32),
							),
						),
						SizedBox(height: 8.h),
						Text(
							'Connect directly with farmers across Nigeria',
							style: TextStyle(
								fontSize: 14.sp,
								color: Colors.grey[600],
							),
						),
						SizedBox(height: 24.h),
            
						// Search Bar
						GestureDetector(
							onTap: () => setState(() => _currentIndex = 1),
							child: Container(
								padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
								decoration: BoxDecoration(
									color: Colors.grey[100],
									borderRadius: BorderRadius.circular(12.r),
									border: Border.all(color: Colors.grey[300]!),
								),
								child: Row(
									children: [
										Icon(Icons.search, color: Colors.grey),
										SizedBox(width: 12.w),
										Text(
											'Search for crops, location...',
											style: TextStyle(color: Colors.grey[600]),
										),
									],
								),
							),
						),
            
						SizedBox(height: 30.h),
						Text(
							'Popular Categories',
							style: TextStyle(
								fontSize: 18.sp,
								fontWeight: FontWeight.w600,
							),
						),
						SizedBox(height: 16.h),
            
						// Categories
						Wrap(
							spacing: 12.w,
							runSpacing: 12.h,
							children: [
								_buildCategoryChip('Palm Oil', Icons.oil_barrel),
								_buildCategoryChip('Cassava', Icons.grass),
								_buildCategoryChip('Maize', Icons.grain),
								_buildCategoryChip('Rice', Icons.rice_bowl),
								_buildCategoryChip('Vegetables', Icons.eco),
								_buildCategoryChip('Fruits', Icons.apple),
							],
						),
            
						SizedBox(height: 30.h),
						Text(
							'Recent Orders',
							style: TextStyle(
								fontSize: 18.sp,
								fontWeight: FontWeight.w600,
							),
						),
						SizedBox(height: 16.h),
            
						// Placeholder for orders
						Center(
							child: Column(
								children: [
									Icon(Icons.shopping_bag, size: 60.w, color: Colors.grey[300]),
									SizedBox(height: 12.h),
									Text(
										'No orders yet',
										style: TextStyle(color: Colors.grey[600]),
									),
									TextButton(
										onPressed: () => setState(() => _currentIndex = 1),
										child: const Text('Start Shopping'),
									),
								],
							),
						),
					],
				),
			),
		);
	}

	Widget _buildCategoryChip(String label, IconData icon) {
		return ActionChip(
			avatar: Icon(icon, size: 18.w),
			label: Text(label),
			onPressed: () {
				// Navigate to search with filter
			},
			backgroundColor: const Color(0xFF2E7D32).withOpacity(0.1),
			side: BorderSide.none,
		);
	}
