import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../services/api_service.dart';
import '../models/harvest_model.dart';
import 'harvest_detail_screen.dart';

class SearchHarvestsScreen extends StatefulWidget {
	const SearchHarvestsScreen({super.key});

	@override
	State<SearchHarvestsScreen> createState() => _SearchHarvestsScreenState();
}

class _SearchHarvestsScreenState extends State<SearchHarvestsScreen> {
	final TextEditingController _searchController = TextEditingController();
	List<Harvest> harvests = [];
	bool isLoading = false;
	String? selectedState;
	double? minPrice;
	double? maxPrice;

	final List<String> states = [
		'Lagos', 'Kano', 'Kaduna', 'Rivers', 'Oyo', 'Enugu', 'Delta', 'Abuja'
	];

	@override
	void initState() {
		super.initState();
		_searchHarvests();
	}

	void _searchHarvests() async {
		setState(() => isLoading = true);
		try {
			final results = await ApiService().searchHarvests(
				cropType: _searchController.text.isEmpty ? null : _searchController.text,
				state: selectedState,
				minPrice: minPrice,
				maxPrice: maxPrice,
			);
			setState(() {
				harvests = results.map((h) => Harvest.fromJson(h)).toList();
				isLoading = false;
			});
		} catch (e) {
			setState(() => isLoading = false);
		}
	}

	void _showFilterDialog() {
		showModalBottomSheet(
			context: context,
			builder: (context) {
				return Container(
					padding: EdgeInsets.all(16.w),
					child: Column(
						mainAxisSize: MainAxisSize.min,
						children: [
							Text('Filter', style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.bold)),
							SizedBox(height: 16.h),
							DropdownButtonFormField<String>(
								value: selectedState,
								decoration: InputDecoration(
									labelText: 'State',
									border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.r)),
								),
								items: states.map((state) {
									return DropdownMenuItem(value: state, child: Text(state));
								}).toList(),
								onChanged: (value) => setState(() => selectedState = value),
							),
							SizedBox(height: 16.h),
							Row(
								children: [
									Expanded(
										child: TextFormField(
											keyboardType: TextInputType.number,
											decoration: InputDecoration(
												labelText: 'Min Price',
												prefixText: '₦',
												border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.r)),
											),
											onChanged: (v) => minPrice = double.tryParse(v),
										),
									),
									SizedBox(width: 16.w),
									Expanded(
										child: TextFormField(
											keyboardType: TextInputType.number,
											decoration: InputDecoration(
												labelText: 'Max Price',
												prefixText: '₦',
												border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.r)),
											),
											onChanged: (v) => maxPrice = double.tryParse(v),
										),
									),
								],
							),
							SizedBox(height: 24.h),
							SizedBox(
								width: double.infinity,
								child: ElevatedButton(
									onPressed: () {
										Navigator.pop(context);
										_searchHarvests();
									},
									child: const Text('Apply Filters'),
								),
							),
						],
					),
				);
			},
		);
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			appBar: AppBar(
				title: TextField(
					controller: _searchController,
					decoration: InputDecoration(
						hintText: 'Search crops...',
						border: InputBorder.none,
						hintStyle: TextStyle(color: Colors.white70),
					),
					style: TextStyle(color: Colors.white),
					onSubmitted: (_) => _searchHarvests(),
				),
				backgroundColor: const Color(0xFF2E7D32),
				actions: [
					IconButton(
						icon: const Icon(Icons.filter_list),
						onPressed: _showFilterDialog,
					),
				],
			),
			body: isLoading
					? const Center(child: CircularProgressIndicator())
					: harvests.isEmpty
							? Center(
									child: Column(
										mainAxisAlignment: MainAxisAlignment.center,
										children: [
											Icon(Icons.search_off, size: 80.w, color: Colors.grey[300]),
											SizedBox(height: 16.h),
											Text(
												'No harvests found',
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
										return GestureDetector(
											onTap: () => Navigator.push(
												context,
												MaterialPageRoute(
													builder: (_) => HarvestDetailScreen(harvest: harvest),
												),
											),
											child: Card(
												margin: EdgeInsets.only(bottom: 16.h),
												shape: RoundedRectangleBorder(
													borderRadius: BorderRadius.circular(16.r),
												),
												child: Row(
													children: [
														// Image
														ClipRRect(
															borderRadius: BorderRadius.horizontal(left: Radius.circular(16.r)),
															child: harvest.images.isNotEmpty
																	? Image.network(
																			harvest.images.first,
																			width: 120.w,
																			height: 120.h,
																			fit: BoxFit.cover,
																		)
																	: Container(
																			width: 120.w,
																			height: 120.h,
																			color: Colors.grey[200],
																			child: Icon(Icons.image, color: Colors.grey),
																		),
														),
                            
														// Details
														Expanded(
															child: Padding(
																padding: EdgeInsets.all(12.w),
																child: Column(
																	crossAxisAlignment: CrossAxisAlignment.start,
																	children: [
																		Text(
																			harvest.cropType.toUpperCase(),
																			style: TextStyle(
																				fontWeight: FontWeight.bold,
																				fontSize: 16.sp,
																			),
																		),
																		SizedBox(height: 4.h),
																		Text(
																			'${harvest.quantity} ${harvest.unit} • ${harvest.quality}',
																			style: TextStyle(
																				color: Colors.grey[600],
																				fontSize: 12.sp,
																			),
																		),
																		SizedBox(height: 8.h),
																		Text(
																			'₦${harvest.pricePerUnit.toStringAsFixed(0)} / ${harvest.unit}',
																			style: TextStyle(
																				fontWeight: FontWeight.bold,
																				fontSize: 18.sp,
																				color: const Color(0xFF2E7D32),
																			),
																		),
																		SizedBox(height: 4.h),
																		Row(
																			children: [
																				Icon(Icons.location_on, size: 14.w, color: Colors.grey),
																				SizedBox(width: 4.w),
																				Text(
																					harvest.location['state'] ?? 'Unknown',
																					style: TextStyle(
																						color: Colors.grey[600],
																						fontSize: 12.sp,
																					),
																				),
																			],
																		),
																	],
																),
															),
														),
													],
												),
											),
										);
									},
								),
		);
	}
}
