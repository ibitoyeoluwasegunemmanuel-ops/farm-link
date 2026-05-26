import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'post_harvest_screen.dart';
import 'my_harvests_screen.dart';
import '../shared/profile_screen.dart';
import '../services/api_service.dart';

class FarmerDashboard extends StatefulWidget {
	const FarmerDashboard({super.key});

	@override
	State<FarmerDashboard> createState() => _FarmerDashboardState();
}

class _FarmerDashboardState extends State<FarmerDashboard> {
	int _currentIndex = 0;
	Map<String, dynamic>? stats;
	bool isLoading = true;

	@override
	void initState() {
		super.initState();
		_loadStats();
	}

	void _loadStats() async {
		try {
			final data = await ApiService().getFarmerDashboard();
			setState(() {
				stats = data;
				isLoading = false;
			});
		} catch (e) {
			setState(() => isLoading = false);
		}
	}

	@override
	Widget build(BuildContext context) {
		final screens = [
			_buildHomeScreen(),
			const MyHarvestsScreen(),
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
					BottomNavigationBarItem(icon: Icon(Icons.agriculture), label: 'My Harvests'),
					BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
				],
			),
			floatingActionButton: _currentIndex == 0
					? FloatingActionButton.extended(
							onPressed: () => Navigator.push(
								context,
								MaterialPageRoute(builder: (_) => const PostHarvestScreen()),
							),
							backgroundColor: const Color(0xFF2E7D32),
							icon: const Icon(Icons.add),
							label: const Text('Post Harvest'),
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
						Text(
							'Farmer Dashboard',
							style: TextStyle(
								fontSize: 24.sp,
								fontWeight: FontWeight.bold,
								color: const Color(0xFF2E7D32),
							),
						),
						SizedBox(height: 20.h),
						if (isLoading)
							const Center(child: CircularProgressIndicator())
						else
							_buildStatsGrid(),
						SizedBox(height: 30.h),
						Text(
							'Quick Actions',
							style: TextStyle(
								fontSize: 18.sp,
								fontWeight: FontWeight.w600,
							),
						),
						SizedBox(height: 16.h),
						_buildQuickActions(),
					],
				),
			),
		);
	}

	Widget _buildStatsGrid() {
		return GridView.count(
			shrinkWrap: true,
			physics: const NeverScrollableScrollPhysics(),
			crossAxisCount: 2,
			crossAxisSpacing: 16.w,
			mainAxisSpacing: 16.h,
			children: [
				_buildStatCard(
					'Total Harvests',
					stats?['totalHarvests']?.toString() ?? '0',
					Icons.agriculture,
					Colors.green,
				),
				_buildStatCard(
					'Active Listings',
					stats?['activeHarvests']?.toString() ?? '0',
					Icons.check_circle,
					Colors.orange,
				),
				_buildStatCard(
					'Total Sales',
					'₦${(stats?['totalEarnings'] ?? 0).toStringAsFixed(0)}',
					Icons.attach_money,
					Colors.blue,
				),
				_buildStatCard(
					'Pending',
					stats?['pendingPayments']?.toString() ?? '0',
					Icons.pending,
					Colors.red,
				),
			],
		);
	}

	Widget _buildStatCard(String title, String value, IconData icon, Color color) {
		return Container(
			padding: EdgeInsets.all(16.w),
			decoration: BoxDecoration(
				color: color.withOpacity(0.1),
				borderRadius: BorderRadius.circular(16.r),
				border: Border.all(color: color.withOpacity(0.3)),
			),
			child: Column(
				crossAxisAlignment: CrossAxisAlignment.start,
				children: [
					Icon(icon, color: color, size: 32.w),
					const Spacer(),
					Text(
						value,
						style: TextStyle(
							fontSize: 24.sp,
							fontWeight: FontWeight.bold,
							color: color,
						),
					),
					Text(
						title,
						style: TextStyle(
							fontSize: 12.sp,
							color: Colors.grey[600],
						),
					),
				],
			),
		);
	}

	Widget _buildQuickActions() {
		return Column(
			children: [
				_buildActionTile(
					'Post New Harvest',
					'List your crops for buyers',
					Icons.add_circle,
					() => Navigator.push(
						context,
						MaterialPageRoute(builder: (_) => const PostHarvestScreen()),
					),
				),
				SizedBox(height: 12.h),
				_buildActionTile(
					'View My Harvests',
					'Manage your listings',
					Icons.list,
					() => setState(() => _currentIndex = 1),
				),
				SizedBox(height: 12.h),
				_buildActionTile(
					'Transaction History',
					'View all your sales',
					Icons.history,
					() {},
				),
			],
		);
	}

	Widget _buildActionTile(String title, String subtitle, IconData icon, VoidCallback onTap) {
		return ListTile(
			onTap: onTap,
			leading: Container(
				padding: EdgeInsets.all(12.w),
				decoration: BoxDecoration(
					color: const Color(0xFF2E7D32).withOpacity(0.1),
					borderRadius: BorderRadius.circular(12.r),
				),
				child: Icon(icon, color: const Color(0xFF2E7D32)),
			),
			title: Text(title, style: TextStyle(fontWeight: FontWeight.w600)),
			subtitle: Text(subtitle, style: TextStyle(fontSize: 12.sp)),
			trailing: const Icon(Icons.arrow_forward_ios, size: 16),
		);
	}
}
