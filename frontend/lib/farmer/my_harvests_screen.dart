import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../services/api_service.dart';
import '../models/harvest_model.dart';

class MyHarvestsScreen extends StatefulWidget {
	const MyHarvestsScreen({super.key});

	@override
	State<MyHarvestsScreen> createState() => _MyHarvestsScreenState();
}

class _MyHarvestsScreenState extends State<MyHarvestsScreen> {
	List<Harvest> harvests = [];
	bool isLoading = true;

	@override
	void initState() {
		super.initState();
		_loadHarvests();
	}

	void _loadHarvests() async {
		try {
			final data = await ApiService().getMyHarvests();
			setState(() {
				harvests = data.map((h) => Harvest.fromJson(h)).toList();
				isLoading = false;
			});
		} catch (e) {
			setState(() => isLoading = false);
		}
	}

	Color _getStatusColor(String status) {
		switch (status) {
			case 'available':
				return Colors.green;
			case 'reserved':
				return Colors.orange;
			case 'sold':
				return Colors.blue;
			default:
				return Colors.grey;
		}
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			appBar: AppBar(
				title: const Text('My Harvests'),
				backgroundColor: const Color(0xFF2E7D32),
			),
			body: isLoading
					? const Center(child: CircularProgressIndicator())
					: harvests.isEmpty
							? Center(
									child: Column(
										mainAxisAlignment: MainAxisAlignment.center,
										children: [
											Icon(Icons.agriculture, size: 80.w, color: Colors.grey[300]),
											SizedBox(height: 16.h),
											Text(
												'No harvests posted yet',
												style: TextStyle(color: Colors.grey[600], fontSize: 16.sp),
											),
										],
									),
								)
							: ListView.builder(
									padding: EdgeInsets.all(16.w),
									itemCount: harvests.length,
									itemBuilder: (context, index) {
										final harvest = harvests[index];
										return Card(
											margin: EdgeInsets.only(bottom: 16.h),
											shape: RoundedRectangleBorder(
												borderRadius: BorderRadius.circular(16.r),
											),
											child: Column(
												crossAxisAlignment: CrossAxisAlignment.start,
												children: [
													// Image
													if (harvest.images.isNotEmpty)
														ClipRRect(
															borderRadius: BorderRadius.vertical(top: Radius.circular(16.r)),
															child: Image.network(
																harvest.images.first,
																height: 180.h,
																width: double.infinity,
																fit: BoxFit.cover,
															),
														),
                          
													Padding(
														padding: EdgeInsets.all(16.w),
														child: Column(
															crossAxisAlignment: CrossAxisAlignment.start,
															children: [
																Row(
																	mainAxisAlignment: MainAxisAlignment.spaceBetween,
																	children: [
																		Text(
																			harvest.cropType.toUpperCase(),
																			style: TextStyle(
																				fontWeight: FontWeight.bold,
																				fontSize: 18.sp,
																			),
																		),
																		Chip(
																			label: Text(harvest.status),
																			backgroundColor: _getStatusColor(harvest.status).withOpacity(0.2),
																			labelStyle: TextStyle(
																				color: _getStatusColor(harvest.status),
																				fontSize: 12.sp,
																			),
																		),
																	],
																),
																SizedBox(height: 8.h),
																Text(
																	'${harvest.quantity} ${harvest.unit} • ${harvest.quality}',
																	style: TextStyle(color: Colors.grey[600]),
																),
																SizedBox(height: 12.h),
																Row(
																	mainAxisAlignment: MainAxisAlignment.spaceBetween,
																	children: [
																		Text(
																			'₦${harvest.pricePerUnit.toStringAsFixed(0)} / ${harvest.unit}',
																			style: TextStyle(
																				fontWeight: FontWeight.bold,
																				fontSize: 20.sp,
																				color: const Color(0xFF2E7D32),
																			),
																		),
																		Text(
																			'Total: ₦${harvest.totalPrice.toStringAsFixed(0)}',
																			style: TextStyle(
																				fontWeight: FontWeight.w600,
																				color: Colors.grey[700],
																			),
																		),
																	],
																),
																SizedBox(height: 12.h),
																Row(
																	children: [
																		Icon(Icons.visibility, size: 16.w, color: Colors.grey),
																		SizedBox(width: 4.w),
																		Text('${harvest.views} views', style: TextStyle(color: Colors.grey)),
																		SizedBox(width: 16.w),
																		Icon(Icons.message, size: 16.w, color: Colors.grey),
																		SizedBox(width: 4.w),
																		Text('${harvest.inquiries} inquiries', style: TextStyle(color: Colors.grey)),
																	],
																),
															],
														),
													),
												],
											),
										);
									},
								),
		);
	}
}
